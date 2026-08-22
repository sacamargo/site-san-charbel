/**
 * Extrae la URL de un Google Form desde un iframe HTML o una URL directa.
 * Solo acepta https://docs.google.com/forms/...
 */
export function parseGoogleFormEmbed(input: string): string | null {
	const raw = input.trim();
	if (!raw) return null;

	const srcMatch = raw.match(/src=["']([^"']+)["']/i);
	const candidate = (srcMatch?.[1] ?? raw).trim();

	let url: URL;
	try {
		url = new URL(candidate);
	} catch {
		return null;
	}

	if (url.protocol !== 'https:') return null;
	if (url.hostname !== 'docs.google.com') return null;
	if (!url.pathname.includes('/forms/')) return null;

	return url.toString();
}
