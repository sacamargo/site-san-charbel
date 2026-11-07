/**
 * Motor híbrido de persistencia local y serverless (`.astro/local-cms-store.json`
 * en desarrollo local, `/tmp/san-charbel-cms-store.json` + memoria en Vercel).
 *
 * Permite que todos los módulos del Dashboard (`/admin/*`) y las secciones
 * públicas funcionen al 100% de inmediato (lectura, creación, edición,
 * eliminación y subida de imágenes/archivos) tanto en local como en Vercel,
 * incluso antes de ejecutar la migración SQL en Supabase.
 */
import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { archivosIniciales } from '@/data/archivos';
import { celebraciones } from '@/data/celebraciones';
import { comerciosIniciales } from '@/data/comercios';
import { horarios } from '@/data/horarios';
import { parroquia } from '@/data/parroquia';
import { promocionesIniciales } from '@/data/promociones';
import { servicios } from '@/data/servicios';
import type { SupabaseClient } from '@supabase/supabase-js';

type Row = Record<string, any>;

interface StoreData {
  site_settings: Row[];
  events: Row[];
  hero_slides: Row[];
  parish_promotions: Row[];
  community_businesses: Row[];
  parish_files: Row[];
  parish_services: Row[];
  mass_schedules: Row[];
  gallery_moments: Row[];
  service_requests: Row[];
  profiles: Row[];
  _localModifiedTables: string[];
}

const isVercel = Boolean(typeof process !== 'undefined' && process.env?.VERCEL);
const STORE_FILE = isVercel
  ? join(tmpdir(), 'san-charbel-cms-store.json')
  : join(process.cwd(), '.astro', 'local-cms-store.json');
const UPLOADS_ROOT = isVercel
  ? join(tmpdir(), 'san-charbel-uploads')
  : join(process.cwd(), 'public', 'uploads');

function buildInitialStore(): StoreData {
  const now = new Date().toISOString();

  return {
    _localModifiedTables: [],
    profiles: [
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        role: 'admin',
        created_at: now,
      },
    ],
    site_settings: [
      {
        id: 'default',
        nombre: parroquia.nombre,
        tagline: parroquia.tagline,
        hero_eyebrow: 'Bienvenido a',
        hero_titulo: parroquia.nombre,
        hero_subtitulo:
          'Somos una comunidad que ora, celebra y sirve con amor, bajo la intercesión de San Chárbel Makhlouf.',
        santo_titulo: 'San Chárbel, ruega por nosotros',
        santo_texto:
          'San Chárbel Makhlouf, santo libanés del siglo XIX, ejemplo de oración, humildad y entrega a Dios. Su vida sigue inspirando a miles de fieles en el mundo.',
        footer_cita:
          '«Que el Señor de los Milagros y San Chárbel guíen y bendigan a nuestra comunidad.»',
        direccion: parroquia.direccion,
        barrio: parroquia.barrio,
        ciudad: parroquia.ciudad,
        departamento: parroquia.departamento,
        telefono_fijo: parroquia.telefonoFijo,
        telefono_movil: parroquia.telefonoMovil,
        email: parroquia.email,
        notification_gmail: 'parroquiasancharbelbaq@gmail.com',
        gmail_webhook_url: null,
        whatsapp: 'https://wa.me/573176584562',
        facebook: parroquia.facebook,
        instagram: parroquia.instagram,
        youtube: parroquia.youtube,
        services_form_url: null,
        mapa_lat: parroquia.mapa.lat,
        mapa_lng: parroquia.mapa.lng,
        mapa_zoom: parroquia.mapa.zoom,
        mapa_ficha: parroquia.mapa.ficha,
        updated_at: now,
      },
    ],
    events: celebraciones.map((c) => ({
      id: c.id,
      slug: c.slug,
      titulo: c.titulo,
      resumen: c.resumen,
      contenido: c.contenido || c.resumen,
      fecha_inicio: c.fecha_inicio,
      fecha_fin: c.fecha_fin,
      hora: c.hora,
      lugar: c.lugar,
      dirigido_a: c.dirigido_a,
      categoria: c.categoria,
      cita: c.cita,
      cita_referencia: c.cita_referencia,
      flyer_url: c.imagen?.src ?? c.imagen_url ?? null,
      orden: c.orden,
      publicado: c.publicado,
      created_at: now,
      updated_at: now,
    })),
    hero_slides: [
      {
        id: 'slide-1',
        eyebrow: 'Bienvenidos a nuestra casa',
        titulo: 'Parroquia San Chárbel',
        subtitulo:
          'Una comunidad que ora, celebra y sirve con amor en Villa Carolina, Barranquilla.',
        cta_texto: 'Conoce nuestros horarios',
        cta_url: '/servicios#horarios',
        cta_secundario_texto: 'Enviar una petición',
        cta_secundario_url: '/peticiones',
        imagen_url: null,
        orden: 1,
        activo: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'slide-2',
        eyebrow: 'Devoción a nuestro santo patrono',
        titulo: 'Misa mensual de sanación a San Chárbel',
        subtitulo:
          'Cada día 22 del mes nos reunimos para presentar nuestras intenciones de salud, familia y agradecimiento con bendición del aceite de San Chárbel.',
        cta_texto: 'Anotar intención para el día 22',
        cta_url: '/peticiones?servicio=intencion-misa',
        cta_secundario_texto: 'Ver calendario parroquial',
        cta_secundario_url: '/agenda',
        imagen_url: null,
        orden: 2,
        activo: true,
        created_at: now,
        updated_at: now,
      },
    ],
    parish_promotions: promocionesIniciales.map((p) => ({
      ...p,
      created_at: now,
      updated_at: now,
    })),
    community_businesses: comerciosIniciales.map((b) => ({
      ...b,
      created_at: now,
      updated_at: now,
    })),
    parish_files: archivosIniciales.map((f) => ({
      ...f,
      descargas: 0,
      created_at: now,
      updated_at: now,
    })),
    parish_services: servicios.map((s) => ({
      id: `srv-${s.slug}`,
      slug: s.slug,
      nombre: s.nombre,
      descripcion_corta: s.descripcion,
      descripcion_larga: s.descripcionLarga ?? s.descripcion,
      icono: s.icono,
      horario_atencion: s.horarioAtencion ?? null,
      requisitos: s.requisitos ?? [],
      pasos: s.pasos ?? [],
      google_form_url: s.googleFormUrl ?? null,
      cta_texto: s.ctaTexto ?? 'Solicitar este servicio',
      cta_url: `/peticiones?servicio=${s.slug}`,
      orden: s.orden,
      activo: s.activo,
      created_at: now,
      updated_at: now,
    })),
    mass_schedules: horarios.map((h) => ({
      id: h.id,
      tipo: h.tipo,
      dia: h.dia,
      dias: h.dias,
      orden: h.orden,
      horas: h.horas,
      nota: h.nota,
      activo: h.activo,
      created_at: now,
      updated_at: now,
    })),
    gallery_moments: [
      {
        id: 'momento-1',
        caption: 'Celebración eucarística dominical en el templo parroquial',
        image_url: '/favicon.png',
        orientation: 'landscape',
        sort_order: 1,
        published: false,
        created_at: now,
        updated_at: now,
      },
    ],
    service_requests: [
      {
        id: 'req-demo-1',
        servicio_slug: 'bautismo',
        servicio_nombre: 'Bautismo',
        tipo_peticion: 'Inscripción a sacramento',
        nombre_solicitante: 'María Fernanda Gómez',
        email: 'mfgomez.baq@gmail.com',
        telefono: '300 412 8890',
        fecha_preferida: '2026-11-22',
        mensaje:
          'Buenas tardes, quisiéramos inscribir a nuestro bebé Santiago para el bautismo en el mes de noviembre y conocer las fechas de la charla prebautismal.',
        consentimiento: true,
        estado: 'nueva',
        notas_admin: null,
        notificado_gmail: false,
        notificado_en: null,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'req-demo-2',
        servicio_slug: 'intencion-misa',
        servicio_nombre: 'Intención de Misa / Oración',
        tipo_peticion: 'Intención de Misa / Oración',
        nombre_solicitante: 'Carlos Alberto Haddad',
        email: 'carlos.haddad@gmail.com',
        telefono: '315 789 3341',
        fecha_preferida: '2026-11-15',
        mensaje:
          'Por la salud y pronta recuperación de mi madre Elena Makhlouf de Haddad en la misa dominical de las 11:00 a.m.',
        consentimiento: true,
        estado: 'en_proceso',
        notas_admin: 'Intención anotada para la misa de 11:00 a.m.',
        notificado_gmail: true,
        notificado_en: now,
        created_at: now,
        updated_at: now,
      },
    ],
  };
}

let memoryStore: StoreData | null = null;

function loadStore(): StoreData {
  if (memoryStore) return memoryStore;
  try {
    if (existsSync(STORE_FILE)) {
      const raw = readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as StoreData;
      const defaults = buildInitialStore();
      memoryStore = {
        ...defaults,
        ...parsed,
        _localModifiedTables: parsed._localModifiedTables ?? [],
      };
      return memoryStore;
    }
  } catch {
    // Reconstruir desde semillas
  }

  memoryStore = buildInitialStore();
  saveStore(memoryStore);
  return memoryStore;
}

function saveStore(store: StoreData): void {
  memoryStore = store;
  try {
    mkdirSync(dirname(STORE_FILE), { recursive: true });
    writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch {
    // En entornos serverless se mantiene también en memoryStore
  }
}

function getTableRows(store: StoreData, table: string): Row[] {
  const key = table as keyof StoreData;
  if (!Array.isArray(store[key])) {
    (store as unknown as Record<string, Row[]>)[table] = [];
  }
  return (store as unknown as Record<string, Row[]>)[table]!;
}

function markTableModified(store: StoreData, table: string): void {
  if (!store._localModifiedTables.includes(table)) {
    store._localModifiedTables.push(table);
  }
}

export function isTableLocallyModified(table: string): boolean {
  const store = loadStore();
  return store._localModifiedTables.includes(table);
}

type FilterFn = (row: Row) => boolean;

class HybridQueryBuilder {
  private table: string;
  private operation: 'select' | 'insert' | 'update' | 'upsert' | 'delete' = 'select';
  private selectOptions?: { count?: 'exact'; head?: boolean };
  private payload: any = null;
  private upsertOptions?: { onConflict?: string };
  private filters: FilterFn[] = [];
  private orderSpecs: { column: string; ascending: boolean }[] = [];
  private limitCount: number | null = null;
  private singleMode: 'none' | 'single' | 'maybeSingle' = 'none';
  private remoteBuilder: any = null;

  constructor(table: string, remoteClient: SupabaseClient | null) {
    this.table = table;
    if (remoteClient) {
      try {
        this.remoteBuilder = remoteClient.from(table);
      } catch {
        this.remoteBuilder = null;
      }
    }
  }

  select(columns = '*', options?: { count?: 'exact'; head?: boolean }) {
    if (this.operation === 'select') {
      this.selectOptions = options;
    }
    if (this.remoteBuilder && typeof this.remoteBuilder.select === 'function') {
      try {
        this.remoteBuilder = this.remoteBuilder.select(columns, options);
      } catch {
        this.remoteBuilder = null;
      }
    }
    return this;
  }

  insert(values: Row | Row[]) {
    this.operation = 'insert';
    this.payload = values;
    if (this.remoteBuilder && typeof this.remoteBuilder.insert === 'function') {
      try {
        this.remoteBuilder = this.remoteBuilder.insert(values);
      } catch {
        this.remoteBuilder = null;
      }
    }
    return this;
  }

  update(values: Row) {
    this.operation = 'update';
    this.payload = values;
    if (this.remoteBuilder && typeof this.remoteBuilder.update === 'function') {
      try {
        this.remoteBuilder = this.remoteBuilder.update(values);
      } catch {
        this.remoteBuilder = null;
      }
    }
    return this;
  }

  upsert(values: Row | Row[], options?: { onConflict?: string }) {
    this.operation = 'upsert';
    this.payload = values;
    this.upsertOptions = options;
    if (this.remoteBuilder && typeof this.remoteBuilder.upsert === 'function') {
      try {
        this.remoteBuilder = this.remoteBuilder.upsert(values, options);
      } catch {
        this.remoteBuilder = null;
      }
    }
    return this;
  }

  delete() {
    this.operation = 'delete';
    if (this.remoteBuilder && typeof this.remoteBuilder.delete === 'function') {
      try {
        this.remoteBuilder = this.remoteBuilder.delete();
      } catch {
        this.remoteBuilder = null;
      }
    }
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push((row) => String(row[column] ?? '') === String(value ?? ''));
    if (this.remoteBuilder && typeof this.remoteBuilder.eq === 'function') {
      try {
        this.remoteBuilder = this.remoteBuilder.eq(column, value);
      } catch {
        this.remoteBuilder = null;
      }
    }
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push((row) => String(row[column] ?? '') !== String(value ?? ''));
    if (this.remoteBuilder && typeof this.remoteBuilder.neq === 'function') {
      try {
        this.remoteBuilder = this.remoteBuilder.neq(column, value);
      } catch {
        this.remoteBuilder = null;
      }
    }
    return this;
  }

  gte(column: string, value: any) {
    this.filters.push((row) => {
      const rv = row[column];
      return rv !== null && rv !== undefined && String(rv) >= String(value);
    });
    if (this.remoteBuilder && typeof this.remoteBuilder.gte === 'function') {
      try {
        this.remoteBuilder = this.remoteBuilder.gte(column, value);
      } catch {
        this.remoteBuilder = null;
      }
    }
    return this;
  }

  lte(column: string, value: any) {
    this.filters.push((row) => {
      const rv = row[column];
      return rv !== null && rv !== undefined && String(rv) <= String(value);
    });
    if (this.remoteBuilder && typeof this.remoteBuilder.lte === 'function') {
      try {
        this.remoteBuilder = this.remoteBuilder.lte(column, value);
      } catch {
        this.remoteBuilder = null;
      }
    }
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderSpecs.push({ column, ascending: options?.ascending ?? true });
    if (this.remoteBuilder && typeof this.remoteBuilder.order === 'function') {
      try {
        this.remoteBuilder = this.remoteBuilder.order(column, options);
      } catch {
        this.remoteBuilder = null;
      }
    }
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    if (this.remoteBuilder && typeof this.remoteBuilder.limit === 'function') {
      try {
        this.remoteBuilder = this.remoteBuilder.limit(count);
      } catch {
        this.remoteBuilder = null;
      }
    }
    return this;
  }

  single() {
    this.singleMode = 'single';
    if (this.remoteBuilder && typeof this.remoteBuilder.single === 'function') {
      try {
        this.remoteBuilder = this.remoteBuilder.single();
      } catch {
        this.remoteBuilder = null;
      }
    }
    return this;
  }

  maybeSingle() {
    this.singleMode = 'maybeSingle';
    if (this.remoteBuilder && typeof this.remoteBuilder.maybeSingle === 'function') {
      try {
        this.remoteBuilder = this.remoteBuilder.maybeSingle();
      } catch {
        this.remoteBuilder = null;
      }
    }
    return this;
  }

  private executeLocal(): { data: any; error: null; count?: number } {
    const store = loadStore();
    const rows = getTableRows(store, this.table);
    const now = new Date().toISOString();

    if (this.operation === 'select') {
      let result = rows.filter((r) => this.filters.every((fn) => fn(r)));

      if (this.orderSpecs.length > 0) {
        result = [...result].sort((a, b) => {
          for (const spec of this.orderSpecs) {
            const va = a[spec.column];
            const vb = b[spec.column];
            if (va === vb) continue;
            if (va === null || va === undefined) return 1;
            if (vb === null || vb === undefined) return -1;
            const cmp = va < vb ? -1 : 1;
            return spec.ascending ? cmp : -cmp;
          }
          return 0;
        });
      }

      const totalCount = result.length;
      if (this.limitCount !== null) {
        result = result.slice(0, this.limitCount);
      }

      if (this.selectOptions?.head) {
        return { data: null, count: totalCount, error: null };
      }

      if (this.singleMode === 'single' || this.singleMode === 'maybeSingle') {
        return { data: result[0] ?? null, error: null };
      }

      return {
        data: result,
        count: this.selectOptions?.count ? totalCount : undefined,
        error: null,
      };
    }

    if (this.operation === 'insert') {
      const items = Array.isArray(this.payload) ? this.payload : [this.payload];
      const inserted = items.map((item) => ({
        id: item.id ?? randomUUID(),
        ...(this.table === 'service_requests' ? { estado: 'nueva', notas_admin: null } : {}),
        ...item,
        created_at: item.created_at ?? now,
        updated_at: now,
      }));
      rows.push(...inserted);
      markTableModified(store, this.table);
      saveStore(store);
      const data =
        this.singleMode !== 'none' ? (inserted[0] ?? null) : inserted;
      return { data, error: null };
    }

    if (this.operation === 'update') {
      const updated: Row[] = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]!;
        if (this.filters.every((fn) => fn(row))) {
          const next = { ...row, ...this.payload, updated_at: now };
          rows[i] = next;
          updated.push(next);
        }
      }
      markTableModified(store, this.table);
      saveStore(store);
      const data =
        this.singleMode !== 'none' ? (updated[0] ?? null) : updated;
      return { data, error: null };
    }

    if (this.operation === 'upsert') {
      const conflictKey =
        this.upsertOptions?.onConflict ??
        (this.table === 'profiles' ? 'user_id' : 'id');
      const items = Array.isArray(this.payload) ? this.payload : [this.payload];
      const upserted: Row[] = [];

      for (const item of items) {
        const matchVal = item[conflictKey];
        const idx =
          matchVal !== undefined
            ? rows.findIndex((r) => String(r[conflictKey]) === String(matchVal))
            : -1;
        if (idx >= 0) {
          const next = { ...rows[idx], ...item, updated_at: now };
          rows[idx] = next;
          upserted.push(next);
        } else {
          const next = {
            ...(conflictKey === 'id' ? { id: item.id ?? randomUUID() } : {}),
            ...item,
            created_at: item.created_at ?? now,
            updated_at: now,
          };
          rows.push(next);
          upserted.push(next);
        }
      }

      markTableModified(store, this.table);
      saveStore(store);
      return { data: upserted, error: null };
    }

    if (this.operation === 'delete') {
      const remaining = rows.filter((r) => !this.filters.every((fn) => fn(r)));
      (store as unknown as Record<string, Row[]>)[this.table] = remaining;
      markTableModified(store, this.table);
      saveStore(store);
      return { data: null, error: null };
    }

    return { data: null, error: null };
  }

  async execute(): Promise<{ data: any; error: any; count?: number }> {
    const locallyModified = isTableLocallyModified(this.table);

    if (!this.remoteBuilder || (this.operation === 'select' && locallyModified)) {
      return this.executeLocal();
    }

    try {
      const remoteResult = await this.remoteBuilder;
      if (remoteResult?.error) {
        return this.executeLocal();
      }

      if (
        this.operation === 'select' &&
        Array.isArray(remoteResult?.data) &&
        remoteResult.data.length === 0 &&
        this.filters.length === 0
      ) {
        const localRes = this.executeLocal();
        if (Array.isArray(localRes.data) && localRes.data.length > 0) {
          return localRes;
        }
      }

      if (
        this.operation === 'select' &&
        this.selectOptions?.head &&
        (remoteResult?.count === 0 || remoteResult?.count === null)
      ) {
        const localRes = this.executeLocal();
        if ((localRes.count ?? 0) > 0) {
          return localRes;
        }
      }

      if (this.operation !== 'select') {
        this.executeLocal();
      }

      return remoteResult;
    } catch {
      return this.executeLocal();
    }
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

function wrapStorageBucket(bucket: string, remoteBucket: any) {
  return {
    async upload(
      path: string,
      body: Uint8Array | ArrayBuffer | Buffer,
      options?: { contentType?: string; upsert?: boolean },
    ) {
      if (remoteBucket && typeof remoteBucket.upload === 'function') {
        try {
          const res = await remoteBucket.upload(path, body, options);
          if (!res?.error) return res;
        } catch {
          // Caer a almacenamiento local
        }
      }

      try {
        const safePath = path.replace(/\.\./g, '').replace(/^\/+/, '');
        const fullPath = join(UPLOADS_ROOT, bucket, safePath);
        mkdirSync(dirname(fullPath), { recursive: true });
        const bytes =
          body instanceof Uint8Array
            ? body
            : new Uint8Array(body as ArrayBuffer);
        writeFileSync(fullPath, bytes);
        return { data: { path: `/uploads/${bucket}/${safePath}` }, error: null };
      } catch (err) {
        return {
          data: null,
          error: { message: err instanceof Error ? err.message : 'Error al guardar archivo' },
        };
      }
    },

    getPublicUrl(path: string) {
      const safePath = path.replace(/\.\./g, '').replace(/^\/+/, '');
      const localFile = join(UPLOADS_ROOT, bucket, safePath);
      if (existsSync(localFile) || path.startsWith('/uploads/')) {
        const publicUrl = path.startsWith('/uploads/')
          ? path
          : `/uploads/${bucket}/${safePath}`;
        return { data: { publicUrl } };
      }

      if (remoteBucket && typeof remoteBucket.getPublicUrl === 'function') {
        return remoteBucket.getPublicUrl(path);
      }

      return { data: { publicUrl: `/uploads/${bucket}/${safePath}` } };
    },

    async remove(paths: string[]) {
      if (remoteBucket && typeof remoteBucket.remove === 'function') {
        try {
          await remoteBucket.remove(paths);
        } catch {
          // Continuar con limpieza local
        }
      }
      for (const p of paths) {
        try {
          const safePath = p.replace(/\.\./g, '').replace(/^\/+/, '');
          const localFile = join(UPLOADS_ROOT, bucket, safePath);
          if (existsSync(localFile)) unlinkSync(localFile);
        } catch {
          // Ignorar
        }
      }
      return { data: paths, error: null };
    },
  };
}

export function wrapWithHybridFallback(client: SupabaseClient | null): SupabaseClient {
  const target = (client ?? {}) as SupabaseClient;

  return new Proxy(target, {
    get(obj, prop, receiver) {
      if (prop === 'from') {
        return (table: string) => new HybridQueryBuilder(table, client);
      }
      if (prop === 'storage') {
        const remoteStorage = client?.storage;
        return {
          from: (bucket: string) =>
            wrapStorageBucket(
              bucket,
              remoteStorage ? remoteStorage.from(bucket) : null,
            ),
        };
      }
      const value = Reflect.get(obj, prop, receiver);
      return typeof value === 'function' ? value.bind(obj) : value;
    },
  });
}
