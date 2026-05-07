const DEFAULT_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://investigacionclinica-production.up.railway.app';

function joinUrl(baseUrl, path) {
  const b = String(baseUrl || '').replace(/\/+$/, '');
  const p = String(path || '').replace(/^\/+/, '');
  return `${b}/${p}`;
}

export function buildUrl(path, { pathParams = {}, query = {} } = {}) {
  let resolved = String(path);
  for (const [k, v] of Object.entries(pathParams)) {
    resolved = resolved.replaceAll(`{${k}}`, encodeURIComponent(String(v ?? '')));
  }

  const url = new URL(joinUrl(DEFAULT_BASE_URL, resolved));
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === '') continue;
    url.searchParams.set(k, String(v));
  }
  return url.toString();
}

export async function apiRequest({
  method,
  path,
  pathParams,
  query,
  body,
  rawBody,
  headers,
} = {}) {
  const url = buildUrl(path, { pathParams, query });

  const hasRawBody = rawBody !== undefined;
  const hasJsonBody = body !== undefined;

  const init = {
    method: method || 'GET',
    headers: {
      ...(hasJsonBody && !hasRawBody ? { 'Content-Type': 'application/json' } : null),
      ...(headers || {}),
    },
    body: hasRawBody ? rawBody : hasJsonBody ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(url, init);
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  let payload = isJson ? await res.json().catch(() => null) : await res.text();
  if (!isJson && typeof payload === 'string') {
    const t = payload.trim();
    if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) {
      try {
        payload = JSON.parse(t);
      } catch {
        // keep as string
      }
    }
  }

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} ${res.statusText}`);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return payload;
}

