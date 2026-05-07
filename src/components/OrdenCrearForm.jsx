import React from 'react';
import { apiRequest } from '../api/http';
import { sanitizeCrearOrdenBody } from '../utils/sanitizeCrearOrdenBody';

function pickCi(obj) {
  if (!obj || typeof obj !== 'object') return null;
  return (
    obj.ci ??
    obj.Ci ??
    obj.CI ??
    obj.documento ??
    obj.Documento ??
    obj.dni ??
    obj.Dni ??
    null
  );
}

function pickNombre(obj) {
  if (!obj || typeof obj !== 'object') return '';
  return (
    obj.nombreCompleto ??
    obj.NombreCompleto ??
    obj.nombre ??
    obj.Nombre ??
    obj.fullName ??
    obj.FullName ??
    ''
  );
}

export default function OrdenCrearForm({ value, onChange }) {
  const orden = sanitizeCrearOrdenBody(value);

  const [pacientes, setPacientes] = React.useState([]);
  const [medicos, setMedicos] = React.useState([]);
  const [loadingPac, setLoadingPac] = React.useState(false);
  const [loadingMed, setLoadingMed] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    async function loadPacientes() {
      setLoadingPac(true);
      try {
        const data = await apiRequest({ method: 'GET', path: '/api/RecursosHumanos/ListarPacientes' });
        const list = Array.isArray(data) ? data : [];
        const mapped = list
          .map((p) => {
            const ci = pickCi(p);
            if (!ci) return null;
            const nombre = pickNombre(p);
            return { value: String(ci), label: nombre ? `${nombre} (${ci})` : String(ci) };
          })
          .filter(Boolean);
        if (!cancelled) setPacientes(mapped);
      } catch {
        if (!cancelled) setPacientes([]);
      } finally {
        if (!cancelled) setLoadingPac(false);
      }
    }

    async function loadMedicos() {
      setLoadingMed(true);
      try {
        const data = await apiRequest({ method: 'GET', path: '/api/RecursosHumanos/ListarEmpleados' });
        const list = Array.isArray(data) ? data : [];
        const mapped = list
          .filter((m) => String(m?.estado ?? m?.Estado ?? '').toLowerCase() !== 'inactivo')
          .map((m) => {
            const ci = pickCi(m);
            if (!ci) return null;
            const nombre = pickNombre(m);
            const cargo = m?.cargo ?? m?.Cargo ?? '';
            return {
              value: String(ci),
              label: cargo ? `${nombre || ci} - ${cargo} (${ci})` : nombre ? `${nombre} (${ci})` : String(ci),
            };
          })
          .filter(Boolean);
        if (!cancelled) setMedicos(mapped);
      } catch {
        if (!cancelled) setMedicos([]);
      } finally {
        if (!cancelled) setLoadingMed(false);
      }
    }

    loadPacientes();
    loadMedicos();
    return () => {
      cancelled = true;
    };
  }, []);

  function patch(partial) {
    onChange?.(sanitizeCrearOrdenBody({ ...orden, ...partial }));
  }

  return (
    <div className="form-grid">
      <label className="field">
        <div className="field-label">code</div>
        <input
          className="input"
          value={orden.code ?? ''}
          onChange={(e) => patch({ code: e.target.value })}
          placeholder="O-1"
        />
      </label>

      <label className="field">
        <div className="field-label">PacienteCodigo (CI)</div>
        <select
          className="input"
          value={orden.PacienteCodigo ?? ''}
          onChange={(e) => patch({ PacienteCodigo: e.target.value })}
        >
          <option value="">{loadingPac ? 'Cargando pacientes...' : 'Selecciona un paciente...'}</option>
          {pacientes.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <div className="field-label">MedicoCodigo (CI)</div>
        <select
          className="input"
          value={orden.MedicoCodigo ?? ''}
          onChange={(e) => patch({ MedicoCodigo: e.target.value })}
        >
          <option value="">{loadingMed ? 'Cargando médicos...' : 'Selecciona un médico...'}</option>
          {medicos.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <div className="field-label">FechaOrden</div>
        <input
          className="input"
          type="date"
          value={orden.FechaOrden ?? ''}
          onChange={(e) => patch({ FechaOrden: e.target.value })}
        />
      </label>

      <label className="field">
        <div className="field-label">TipoAtencion</div>
        <input
          className="input"
          value={orden.TipoAtencion ?? ''}
          onChange={(e) => patch({ TipoAtencion: e.target.value })}
        />
      </label>

      <label className="field" style={{ gridColumn: '1 / -1' }}>
        <div className="field-label">Observaciones</div>
        <input
          className="input"
          value={orden.Observaciones ?? ''}
          onChange={(e) => patch({ Observaciones: e.target.value })}
        />
      </label>
    </div>
  );
}

