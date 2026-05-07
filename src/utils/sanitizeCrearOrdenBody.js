/**
 * Body exacto para POST /api/OrdenLaboratorio/CrearOrden (sin propiedades extra).
 */
export function sanitizeCrearOrdenBody(src) {
  const o = src && typeof src === 'object' && !Array.isArray(src) ? src : {};
  const fecha = String(o.FechaOrden ?? '').trim();
  return {
    code: String(o.code ?? o.Code ?? ''),
    PacienteCodigo: String(o.PacienteCodigo ?? ''),
    MedicoCodigo: String(o.MedicoCodigo ?? ''),
    FechaOrden: fecha || '2026-01-01',
    TipoAtencion: String(o.TipoAtencion ?? ''),
    Observaciones: String(o.Observaciones ?? ''),
  };
}
