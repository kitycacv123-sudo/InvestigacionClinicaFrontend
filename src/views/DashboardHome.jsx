import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/http';
import './DashboardHome.css';

function arrayLen(data) {
  if (Array.isArray(data)) return data.length;
  if (data && typeof data === 'object') {
    if (Array.isArray(data.examenes)) return data.examenes.length;
    if (Array.isArray(data.items)) return data.items.length;
    if (Array.isArray(data.data)) return data.data.length;
  }
  return 0;
}

function safeSlice(arr, n) {
  return Array.isArray(arr) ? arr.slice(0, n) : [];
}

const DASH_QUERIES = [
  { id: 'investigaciones', label: 'Investigaciones activas', path: '/api/Investigaciones/Lista', icon: '◆' },
  { id: 'recolecciones', label: 'Recolecciones activas', path: '/api/Recolecciones/Lista', icon: '◇' },
  { id: 'resultados', label: 'Resultados activos', path: '/api/Resultados/Lista', icon: '◎' },
  { id: 'tipoSintomas', label: 'Tipos de síntoma', path: '/api/TipoSintomas/Lista', icon: '✦' },
  { id: 'asignaciones', label: 'Asignaciones recolección–resultado', path: '/api/Recoleccion_Resultados/Lista', icon: '⬡' },
  { id: 'resultadoSintomas', label: 'Resultado ↔ síntoma', path: '/api/Resultado_Sintomas/Lista', icon: '✧' },
  { id: 'pendientes', label: 'Resultados pendientes de asignar', path: '/api/Recoleccion_Resultados/6.PendientesAsignacion', icon: '!' },
  { id: 'sinSintomas', label: 'Resultados sin síntomas', path: '/api/Resultados/5.SinSintomas', icon: '○' },
  { id: 'empleados', label: 'Empleados (RRHH)', path: '/api/RecursosHumanos/ListarEmpleados', icon: '👤' },
  { id: 'pacientes', label: 'Pacientes (externo)', path: '/api/RecursosHumanos/ListarPacientes', icon: '🏥' },
  { id: 'examenes', label: 'Exámenes de laboratorio', path: '/api/OrdenLaboratorio/ListarExamenes', icon: '🧪' },
  { id: 'medicamentos', label: 'Medicamentos (farmacia)', path: '/api/Farmacia/ListarMedicamentos', icon: '💊' },
];

const DASH_DETAIL = [
  { id: 'invCurso', title: 'Investigaciones y recolecciones', path: '/api/Investigaciones/2.InvestigacionesCursoConTotalRecoleccionoes' },
  { id: 'progreso', title: 'Avance reclutado vs obtenido', path: '/api/Recolecciones/4.VerificarReclutadosVsObtenidos' },
  { id: 'sintomaFrecuente', title: 'Síntomas más frecuentes', path: '/api/TipoSintomas/3.SintomaFrecuenteInvestigacion' },
  { id: 'resultadosEsperados', title: 'Resultados esperados por investigación', path: '/api/Resultados/3.ResultadosEsperadosInvestigacion' },
];

const QUICK_LINKS = [
  { to: '/investigaciones', label: 'Investigaciones' },
  { to: '/recolecciones', label: 'Recolecciones' },
  { to: '/resultados', label: 'Resultados' },
  { to: '/recoleccion-resultados', label: 'Recolección resultados' },
  { to: '/tipo-sintomas', label: 'Tipo síntomas' },
  { to: '/resultado-sintomas', label: 'Resultado síntomas' },
  { to: '/orden-laboratorio', label: 'Orden laboratorio' },
  { to: '/farmacia', label: 'Farmacia' },
  { to: '/bioseguridad', label: 'Bioseguridad' },
  { to: '/gestion-documentacion', label: 'Gestión documentación' },
  { to: '/gestion-legal', label: 'Gestión legal' },
  { to: '/recursos-humanos', label: 'Recursos humanos' },
  { to: '/api-docs', label: 'Swagger' },
];

export default function DashboardHome() {
  const [counts, setCounts] = useState({});
  const [errors, setErrors] = useState({});
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshedAt, setRefreshedAt] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErrors({});

    const countResults = await Promise.allSettled(
      DASH_QUERIES.map(async (q) => {
        const data = await apiRequest({ method: 'GET', path: q.path });
        let n = arrayLen(data);
        if (q.id === 'empleados' && Array.isArray(data)) {
          n = data.filter((e) => String(e?.estado ?? e?.Estado ?? '').toLowerCase() === 'activo').length;
        }
        return { id: q.id, n, raw: data };
      })
    );

    const nextCounts = {};
    const nextErr = {};
    countResults.forEach((r, i) => {
      const id = DASH_QUERIES[i].id;
      if (r.status === 'fulfilled') nextCounts[id] = r.value.n;
      else nextErr[id] = r.reason?.message || 'Error';
    });
    setCounts(nextCounts);
    setErrors((e) => ({ ...e, ...nextErr }));

    const detailResults = await Promise.allSettled(
      DASH_DETAIL.map(async (d) => {
        const data = await apiRequest({ method: 'GET', path: d.path });
        return { id: d.id, data };
      })
    );

    const nextDetails = {};
    detailResults.forEach((r, i) => {
      const id = DASH_DETAIL[i].id;
      if (r.status === 'fulfilled') nextDetails[id] = r.value.data;
      else nextErr[`detail_${id}`] = r.reason?.message || 'Error';
    });
    setDetails(nextDetails);
    setErrors((e) => ({ ...e, ...nextErr }));

    setRefreshedAt(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const invCurso = details.invCurso;
  const progreso = details.progreso;
  const sintomaFrecuente = details.sintomaFrecuente;
  const resultadosEsperados = details.resultadosEsperados;

  return (
    <div className="dash">
      <header className="dash-hero">
        <div>
          <h1 className="dash-title">Panel clínico</h1>
          <p className="dash-sub">
            Resumen en vivo desde tu API en Railway y microservicios enlazados.
          </p>
        </div>
        <div className="dash-hero-actions">
          {refreshedAt ? (
            <span className="dash-updated">
              Actualizado: {refreshedAt.toLocaleTimeString()}
            </span>
          ) : null}
          <button type="button" className="dash-refresh" onClick={load} disabled={loading}>
            {loading ? 'Cargando…' : 'Actualizar'}
          </button>
        </div>
      </header>

      <section className="dash-kpis" aria-label="Indicadores">
        {DASH_QUERIES.map((q) => {
          const n = counts[q.id];
          const err = errors[q.id];
          return (
            <article key={q.id} className={`dash-kpi ${err ? 'dash-kpi--err' : ''}`}>
              <div className="dash-kpi-icon" aria-hidden>
                {q.icon}
              </div>
              <div className="dash-kpi-body">
                <div className="dash-kpi-value">
                  {err ? '—' : loading && n === undefined ? '…' : n ?? 0}
                </div>
                <div className="dash-kpi-label">{q.label}</div>
              </div>
            </article>
          );
        })}
      </section>

      <div className="dash-grid-2">
        <section className="dash-panel">
          <h2 className="dash-panel-title">Investigaciones en curso y total de recolecciones</h2>
          {errors.detail_invCurso ? (
            <p className="dash-panel-err">No disponible: {errors.detail_invCurso}</p>
          ) : (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Título</th>
                    <th className="num">Recolecciones</th>
                  </tr>
                </thead>
                <tbody>
                  {safeSlice(invCurso, 8).map((row, i) => (
                    <tr
                      key={
                        row.codigoInvestigacion ??
                        row.CodigoInvestigacion ??
                        row.codigo ??
                        row.Codigo ??
                        i
                      }
                    >
                      <td className="mono">
                        {row.codigoInvestigacion ?? row.CodigoInvestigacion ?? row.codigo ?? row.Codigo ?? '—'}
                      </td>
                      <td>{row.titulo ?? row.Titulo ?? '—'}</td>
                      <td className="num">
                        {row.totalRecolecciones ?? row.TotalRecolecciones ?? row.count ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!Array.isArray(invCurso) || invCurso.length === 0 ? (
                <p className="dash-empty">Sin datos o lista vacía.</p>
              ) : null}
            </div>
          )}
          <Link className="dash-link" to="/investigaciones">
            Ir a Investigaciones →
          </Link>
        </section>

        <section className="dash-panel">
          <h2 className="dash-panel-title">Avance por recolección (% obtenido)</h2>
          {errors.detail_progreso ? (
            <p className="dash-panel-err">No disponible: {errors.detail_progreso}</p>
          ) : (
            <ul className="dash-bars">
              {safeSlice(progreso, 8).map((row, i) => {
                const pct = Number(row.porcentaje ?? row.Porcentaje ?? 0);
                const code =
                  row.codigoRecoleccion ?? row.CodigoRecoleccion ?? row.codigo ?? row.Codigo ?? i;
                const obtenidos = row.totalObtenido ?? row.TotalObtenido ?? row.obtenidos ?? row.Obtenidos;
                const total = row.totalEsperado ?? row.TotalEsperado ?? row.total ?? row.Total;
                return (
                  <li key={code} className="dash-bar-row">
                    <div className="dash-bar-head">
                      <span className="dash-bar-code">{code}</span>
                      <span className="dash-bar-pct">{Number.isFinite(pct) ? `${pct}%` : '—'}</span>
                    </div>
                    <div className="dash-bar-track">
                      <div
                        className="dash-bar-fill"
                        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                      />
                    </div>
                    <div className="dash-bar-meta">
                      Obtenidos {obtenidos ?? '—'} / Total {total ?? '—'}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {!errors.detail_progreso && (!Array.isArray(progreso) || progreso.length === 0) ? (
            <p className="dash-empty">Sin datos de progreso.</p>
          ) : null}
          <Link className="dash-link" to="/recolecciones">
            Ir a Recolecciones →
          </Link>
        </section>
      </div>

      <div className="dash-grid-2">
        <section className="dash-panel">
          <h2 className="dash-panel-title">Síntomas frecuentes (investigación)</h2>
          {errors.detail_sintomaFrecuente ? (
            <p className="dash-panel-err">No disponible: {errors.detail_sintomaFrecuente}</p>
          ) : (
            <ul className="dash-pills">
              {safeSlice(sintomaFrecuente, 10).map((row, i) => (
                <li key={i} className="dash-pill">
                  <span>
                    {row.nombreSintoma ?? row.NombreSintoma ?? row.nombre ?? row.Nombre ?? '—'}
                  </span>
                  <span className="dash-pill-count">
                    {row.frecuencia ?? row.Frecuencia ?? row.cantidad ?? row.Cantidad ?? '—'}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link className="dash-link" to="/tipo-sintomas">
            Ir a Tipo síntomas →
          </Link>
        </section>

        <section className="dash-panel">
          <h2 className="dash-panel-title">Resultados esperados por investigación</h2>
          {errors.detail_resultadosEsperados ? (
            <p className="dash-panel-err">No disponible: {errors.detail_resultadosEsperados}</p>
          ) : (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Título</th>
                    <th className="num">Total esperado</th>
                  </tr>
                </thead>
                <tbody>
                  {safeSlice(resultadosEsperados, 8).map((row, i) => (
                    <tr
                      key={
                        row.codigoInvestigacion ??
                        row.CodigoInvestigacion ??
                        row.codigo ??
                        row.Codigo ??
                        i
                      }
                    >
                      <td className="mono">
                        {row.codigoInvestigacion ?? row.CodigoInvestigacion ?? row.codigo ?? row.Codigo ?? '—'}
                      </td>
                      <td>
                        {row.tituloInvestigacion ?? row.TituloInvestigacion ?? row.titulo ?? row.Titulo ?? '—'}
                      </td>
                      <td className="num">
                        {row.totalResultadosEsperados ?? row.TotalResultadosEsperados ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Link className="dash-link" to="/resultados">
            Ir a Resultados →
          </Link>
        </section>
      </div>

      <section className="dash-quick" aria-label="Accesos rápidos">
        <h2 className="dash-panel-title">Módulos</h2>
        <div className="dash-quick-grid">
          {QUICK_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="dash-quick-card">
              {l.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
