"""
Genera public/favicon.ico y public/favicon.png a partir del retrato de
San Chárbel.

    python3 scripts/make-favicon.py <retrato.png>

La imagen de origen llega con el tablero de transparencia "pegado" en los
píxeles, no como PNG con canal alfa. Aquí se reconstruye el alfa:

  C = a*F + (1-a)*B

donde B es el tablero ideal (dos grises alternos, 50x50 casillas). El alfa se
estima por casilla comparándola con sus vecinas: en fondo puro la diferencia
es el contraste completo del tablero, y sobre la figura opaca es casi cero.
"""

import sys

from PIL import Image, ImageFilter

DESTINO_ICO = "public/favicon.ico"
DESTINO_PNG = "public/favicon.png"
PREVIEW = "scripts/favicon-preview.png"

CASILLAS = 50  # el tablero son 50x50 casillas
TAMANOS_ICO = [16, 32, 48, 64, 128, 256]


def medir_tablero(rgb, w, h, s):
    """Los dos grises del tablero, medidos en el borde (siempre es fondo)."""
    oscuros, claros = [], []
    for by in range(CASILLAS):
        for bx in range(CASILLAS):
            if not (bx < 2 or by < 2 or bx >= CASILLAS - 2 or by >= CASILLAS - 2):
                continue
            x = int((bx + 0.5) * s)
            y = int((by + 0.5) * s)
            v = sum(rgb[x, y]) / 3
            (oscuros if (bx + by) % 2 == 0 else claros).append(v)
    oscuros.sort()
    claros.sort()
    return oscuros[len(oscuros) // 2], claros[len(claros) // 2]


def medias_por_bloque(rgb, s):
    """Media de cada casilla, ignorando 3px de borde para evitar el degradado."""
    medias = []
    for by in range(CASILLAS):
        fila = []
        for bx in range(CASILLAS):
            x0, x1 = int(bx * s) + 3, int((bx + 1) * s) - 3
            y0, y1 = int(by * s) + 3, int((by + 1) * s) - 3
            total = n = 0
            for y in range(y0, y1, 2):
                for x in range(x0, x1, 2):
                    p = rgb[x, y]
                    total += p[0] + p[1] + p[2]
                    n += 3
            fila.append(total / n)
        medias.append(fila)
    return medias


def alfa_por_bloque(medias, contraste):
    """1 - (contraste local / contraste del tablero), por casilla."""
    alfa = []
    for by in range(CASILLAS):
        fila = []
        for bx in range(CASILLAS):
            vecinos = [
                medias[by + dy][bx + dx]
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))
                if 0 <= bx + dx < CASILLAS and 0 <= by + dy < CASILLAS
            ]
            amplitud = sum(abs(medias[by][bx] - v) for v in vecinos) / len(vecinos)
            a = 1.0 - amplitud / contraste
            fila.append(max(0.0, min(1.0, a)))
        alfa.append(fila)
    return alfa


def main():
    if len(sys.argv) != 2:
        sys.exit("uso: python3 scripts/make-favicon.py <retrato.png>")

    origen = Image.open(sys.argv[1]).convert("RGB")
    w, h = origen.size
    s = w / CASILLAS
    rgb = origen.load()

    oscuro, claro = medir_tablero(rgb, w, h, s)
    contraste = claro - oscuro
    print(f"tablero: oscuro={oscuro:.1f} claro={claro:.1f} contraste={contraste:.1f}")

    alfa_bloques = alfa_por_bloque(medias_por_bloque(rgb, s), contraste)

    # El alfa se calcula por casilla; se sube a resolución completa con
    # interpolación suave y un desenfoque corto para que el halo no escalone.
    mapa = Image.new("L", (CASILLAS, CASILLAS))
    mapa.putdata([int(round(a * 255)) for fila in alfa_bloques for a in fila])
    alfa = mapa.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(s / 2))

    # Estira el alfa. El corte bajo va alto a propósito: el halo del original
    # es semitransparente y a 16px solo aporta una neblina gris que ensucia el
    # icono, así que se descarta y queda únicamente la figura.
    alfa = alfa.point(lambda v: 0 if v < 150 else (255 if v > 225 else int((v - 150) * 255 / 75)))
    apx = alfa.load()

    # Desmezcla: recupera el color original de la figura quitando el tablero.
    salida = Image.new("RGBA", (w, h))
    spx = salida.load()
    for y in range(h):
        for x in range(w):
            a = apx[x, y]
            if a == 0:
                spx[x, y] = (0, 0, 0, 0)
                continue
            fondo = oscuro if (int(x / s) + int(y / s)) % 2 == 0 else claro
            af = a / 255
            r, g, b = rgb[x, y]
            desmezcla = tuple(
                max(0, min(255, int(round((c - (1 - af) * fondo) / af)))) for c in (r, g, b)
            )
            spx[x, y] = (*desmezcla, a)

    caja = salida.split()[3].point(lambda v: 255 if v > 120 else 0).getbbox()
    print("recorte de la figura:", caja)
    figura = salida.crop(caja)

    # Cuadrado con un margen del 6% para que el icono no toque los bordes.
    lado = int(max(figura.size) * 1.06)
    lienzo = Image.new("RGBA", (lado, lado), (0, 0, 0, 0))
    lienzo.paste(
        figura, ((lado - figura.width) // 2, (lado - figura.height) // 2)
    )

    # Reducir con alfa premultiplicado: si no, los píxeles transparentes
    # arrastran color y aparece un halo sucio en los tamaños pequeños.
    def reducir(img, lado_destino):
        r, g, b, a = img.split()
        pre = Image.merge(
            "RGB",
            [Image.eval(canal, lambda v: v).point(lambda v: v) for canal in (r, g, b)],
        )
        pre = Image.composite(pre, Image.new("RGB", img.size, (0, 0, 0)), a)
        pre = pre.resize((lado_destino, lado_destino), Image.LANCZOS)
        a_r = a.resize((lado_destino, lado_destino), Image.LANCZOS)
        ppx, apx2 = pre.load(), a_r.load()
        fuera = Image.new("RGBA", (lado_destino, lado_destino))
        fpx = fuera.load()
        for y in range(lado_destino):
            for x in range(lado_destino):
                av = apx2[x, y]
                if av == 0:
                    fpx[x, y] = (0, 0, 0, 0)
                else:
                    pr, pg, pb = ppx[x, y]
                    k = 255 / av
                    fpx[x, y] = (
                        min(255, int(pr * k)),
                        min(255, int(pg * k)),
                        min(255, int(pb * k)),
                        av,
                    )
        return fuera

    capas = [reducir(lienzo, t) for t in TAMANOS_ICO]
    capas[-1].save(DESTINO_PNG)
    capas[-1].save(DESTINO_ICO, format="ICO", sizes=[(t, t) for t in TAMANOS_ICO])

    # Tira de comprobación: cada tamaño real, ampliado sin suavizado, sobre
    # damero claro y oscuro. Es la única forma de ver si a 16px se lee.
    muestras = [c for c, t in zip(capas, TAMANOS_ICO) if t <= 64]
    escala = 128
    tira = Image.new("RGBA", (escala * len(muestras), escala * 2), (255, 255, 255, 255))
    for i, muestra in enumerate(muestras):
        tira.paste(muestra.resize((escala, escala), Image.NEAREST), (i * escala, 0))
    fondo_oscuro = Image.new("RGBA", (escala * len(muestras), escala), (30, 30, 26, 255))
    tira.paste(fondo_oscuro, (0, escala))
    for i, muestra in enumerate(muestras):
        ampliada = muestra.resize((escala, escala), Image.NEAREST)
        tira.paste(ampliada, (i * escala, escala), ampliada)
    tira.save(PREVIEW)
    print("escrito:", DESTINO_ICO, DESTINO_PNG, PREVIEW)


if __name__ == "__main__":
    main()
