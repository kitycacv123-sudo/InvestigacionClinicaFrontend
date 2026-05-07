import React from 'react';
import { apiRequest } from '../api/http';
import './FarmaciaRecetaForm.css';

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

function pickCodigo(obj) {
  if (!obj || typeof obj !== 'object') return null;
  return (
    obj.codigo ??
    obj.Codigo ??
    obj.code ??
    obj.Code ??
    obj.medicamentoCodigo ??
    obj.MedicamentoCodigo ??
    null
  );
}

function pickLabel(obj) {
  if (!obj || typeof obj !== 'object') return '';
  return (
    obj.nombreGenerico ??
    obj.NombreGenerico ??
    obj.generico ??
    obj.Generico ??
    obj.nombre ??
    obj.Nombre ??
    obj.descripcion ??
    obj.Descripcion ??
    obj.nombreMedicamento ??
    obj.NombreMedicamento ??
    ''
  );
}

function createEmptyDetalle() {
  return {
    medicamentoCodigo: '',
    cantidadSolicitada: 0,
    posologia: {
      dosis: 0,
      unidadAbreviatura: '',
      viaAdministracion: '',
      frecuencia: '',
      frecuenciaValor: 0,
      duracion: '',
      indicacionesAdicionales: '',
    },
  };
}

export default function FarmaciaRecetaForm({ value, onChange }) {
  const receta = value || { pacienteCodigo: '', medicoCodigo: '', detalles: [createEmptyDetalle()] };
  const detalles = Array.isArray(receta.detalles) ? receta.detalles : [];

  const [pacientes, setPacientes] = React.useState([]);
  const [medicos, setMedicos] = React.useState([]);
  const [medicamentos, setMedicamentos] = React.useState([]);
  const [loadingPac, setLoadingPac] = React.useState(false);
  const [loadingMedicos, setLoadingMedicos] = React.useState(false);
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

    async function loadMedicamentos() {
      setLoadingMed(true);
      try {
        const data = await apiRequest({ method: 'GET', path: '/api/Farmacia/ListarMedicamentos' });
        const list = Array.isArray(data) ? data : [];
        const mapped = list
          .map((m) => {
            const codigo = pickCodigo(m);
            if (!codigo) return null;
            const label = pickLabel(m);
            return { value: String(codigo), label: label ? `${label} (${codigo})` : String(codigo) };
          })
          .filter(Boolean);
        if (!cancelled) setMedicamentos(mapped);
      } catch {
        if (!cancelled) setMedicamentos([]);
      } finally {
        if (!cancelled) setLoadingMed(false);
      }
    }

    async function loadMedicos() {
      setLoadingMedicos(true);
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
        if (!cancelled) setLoadingMedicos(false);
      }
    }

    loadPacientes();
    loadMedicos();
    loadMedicamentos();
    return () => {
      cancelled = true;
    };
  }, []);

  function patch(next) {
    onChange?.(next);
  }

  function patchDetalle(idx, nextDetalle) {
    const nextDetalles = detalles.map((d, i) => (i === idx ? nextDetalle : d));
    patch({ ...receta, detalles: nextDetalles });
  }

  function removeDetalle(idx) {
    const nextDetalles = detalles.filter((_, i) => i !== idx);
    patch({ ...receta, detalles: nextDetalles.length ? nextDetalles : [createEmptyDetalle()] });
  }

  function addDetalle() {
    patch({ ...receta, detalles: [...detalles, createEmptyDetalle()] });
  }

  return (
    <div className="farm-receta">
      <div className="form-grid">
        <label className="field">
          <div className="field-label">pacienteCodigo (CI)</div>
          <select
            className="input"
            value={receta.pacienteCodigo ?? ''}
            onChange={(e) => patch({ ...receta, pacienteCodigo: e.target.value })}
          >
            <option value="">
              {loadingPac ? 'Cargando pacientes...' : 'Selecciona un paciente...'}
            </option>
            {pacientes.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <div className="field-label">medicoCodigo (CI)</div>
          <select
            className="input"
            value={receta.medicoCodigo ?? ''}
            onChange={(e) => patch({ ...receta, medicoCodigo: e.target.value })}
          >
            <option value="">
              {loadingMedicos ? 'Cargando médicos...' : 'Selecciona un médico...'}
            </option>
            {medicos.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="detalles-header">
        <div className="detalles-title">detalles</div>
        <button type="button" className="mini-btn" onClick={addDetalle}>
          + Agregar detalle
        </button>
      </div>

      <div className="detalles-list">
        {detalles.map((d, idx) => (
          <div className="detalle-card" key={idx}>
            <div className="detalle-top">
              <div className="detalle-label">Detalle #{idx + 1}</div>
              <button type="button" className="mini-btn danger" onClick={() => removeDetalle(idx)}>
                Quitar
              </button>
            </div>

            <div className="form-grid">
              <label className="field">
                <div className="field-label">medicamentoCodigo</div>
                <select
                  className="input"
                  value={d.medicamentoCodigo ?? ''}
                  onChange={(e) => patchDetalle(idx, { ...d, medicamentoCodigo: e.target.value })}
                >
                  <option value="">
                    {loadingMed ? 'Cargando medicamentos...' : 'Selecciona un medicamento...'}
                  </option>
                  {medicamentos.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <div className="field-label">cantidadSolicitada</div>
                <input
                  className="input"
                  type="number"
                  value={d.cantidadSolicitada ?? 0}
                  onChange={(e) =>
                    patchDetalle(idx, { ...d, cantidadSolicitada: Number(e.target.value) })
                  }
                />
              </label>
            </div>

            <div className="posologia-title">posologia</div>
            <div className="form-grid">
              <label className="field">
                <div className="field-label">dosis</div>
                <input
                  className="input"
                  type="number"
                  value={d.posologia?.dosis ?? 0}
                  onChange={(e) =>
                    patchDetalle(idx, {
                      ...d,
                      posologia: { ...(d.posologia || {}), dosis: Number(e.target.value) },
                    })
                  }
                />
              </label>

              <label className="field">
                <div className="field-label">unidadAbreviatura</div>
                <input
                  className="input"
                  value={d.posologia?.unidadAbreviatura ?? ''}
                  onChange={(e) =>
                    patchDetalle(idx, {
                      ...d,
                      posologia: { ...(d.posologia || {}), unidadAbreviatura: e.target.value },
                    })
                  }
                />
              </label>

              <label className="field">
                <div className="field-label">viaAdministracion</div>
                <input
                  className="input"
                  value={d.posologia?.viaAdministracion ?? ''}
                  onChange={(e) =>
                    patchDetalle(idx, {
                      ...d,
                      posologia: { ...(d.posologia || {}), viaAdministracion: e.target.value },
                    })
                  }
                />
              </label>

              <label className="field">
                <div className="field-label">frecuencia</div>
                <input
                  className="input"
                  value={d.posologia?.frecuencia ?? ''}
                  onChange={(e) =>
                    patchDetalle(idx, {
                      ...d,
                      posologia: { ...(d.posologia || {}), frecuencia: e.target.value },
                    })
                  }
                />
              </label>

              <label className="field">
                <div className="field-label">frecuenciaValor</div>
                <input
                  className="input"
                  type="number"
                  value={d.posologia?.frecuenciaValor ?? 0}
                  onChange={(e) =>
                    patchDetalle(idx, {
                      ...d,
                      posologia: { ...(d.posologia || {}), frecuenciaValor: Number(e.target.value) },
                    })
                  }
                />
              </label>

              <label className="field">
                <div className="field-label">duracion</div>
                <input
                  className="input"
                  value={d.posologia?.duracion ?? ''}
                  onChange={(e) =>
                    patchDetalle(idx, {
                      ...d,
                      posologia: { ...(d.posologia || {}), duracion: e.target.value },
                    })
                  }
                />
              </label>

              <label className="field" style={{ gridColumn: '1 / -1' }}>
                <div className="field-label">indicacionesAdicionales</div>
                <input
                  className="input"
                  value={d.posologia?.indicacionesAdicionales ?? ''}
                  onChange={(e) =>
                    patchDetalle(idx, {
                      ...d,
                      posologia: {
                        ...(d.posologia || {}),
                        indicacionesAdicionales: e.target.value,
                      },
                    })
                  }
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

