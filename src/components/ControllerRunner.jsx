import React, { useMemo, useState } from 'react';
import { apiRequest, buildUrl } from '../api/http';
import JsonCards from './JsonCards';
import FarmaciaRecetaForm from './FarmaciaRecetaForm';
import OrdenLaboratorioCards from './OrdenLaboratorioCards';
import OrdenCrearForm from './OrdenCrearForm';
import { sanitizeCrearOrdenBody } from '../utils/sanitizeCrearOrdenBody';
import './ControllerRunner.css';

function initFromSchema(schema) {
  if (!schema) return '';
  if (typeof schema === 'string') return schema;
  return JSON.parse(JSON.stringify(schema));
}

function tryParseJson(text) {
  if (text.trim() === '') return undefined;
  return JSON.parse(text);
}

function isObject(x) {
  return x !== null && typeof x === 'object' && !Array.isArray(x);
}

function isLikelyDateKey(key) {
  return /fecha/i.test(String(key || ''));
}

function isLikelyDateValue(value) {
  if (value === null || value === undefined) return false;
  const v = String(value);
  return /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function inputTypeFor(key, value) {
  if (isLikelyDateKey(key) || isLikelyDateValue(value)) return 'date';
  return 'text';
}

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

export default function ControllerRunner({ controller }) {
  const [activeId, setActiveId] = useState(controller.endpoints?.[0]?.id);
  const active = useMemo(
    () => controller.endpoints.find((e) => e.id === activeId) || controller.endpoints[0],
    [controller.endpoints, activeId]
  );

  const [pathParams, setPathParams] = useState({});
  const [query, setQuery] = useState({});
  const [bodyMode, setBodyMode] = useState('form'); // form | json
  const [bodyForm, setBodyForm] = useState(() => initFromSchema(active.bodySchema));
  const [bodyJson, setBodyJson] = useState(() => JSON.stringify(initFromSchema(active.bodySchema), null, 2));
  const [multipartFile, setMultipartFile] = useState(null);
  const [multipartForm, setMultipartForm] = useState(() => initFromSchema(active.formSchema));
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(undefined);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    setPathParams({});
    setQuery({});
    const next = initFromSchema(active.bodySchema);
    const nextBody = active.ui === 'ordenCrear' ? sanitizeCrearOrdenBody(next) : next;
    setBodyForm(nextBody);
    setBodyJson(JSON.stringify(nextBody, null, 2));
    setMultipartFile(null);
    setMultipartForm(initFromSchema(active.formSchema));
    setPacientes([]);
    setMedicos([]);
    setResult(undefined);
    setError(null);
    setBodyMode(active.ui === 'ordenCrear' || active.ui === 'farmaciaReceta' ? 'form' : isObject(next) ? 'form' : 'json');
  }, [active.id, active.ui]);

  React.useEffect(() => {
    let cancelled = false;

    async function loadPacientes() {
      const needsPacientes = (active.pathParams || []).some((p) => p.optionsFrom === 'pacientes');
      if (!needsPacientes) return;

      try {
        const data = await apiRequest({
          method: 'GET',
          path: '/api/RecursosHumanos/ListarPacientes',
        });

        const list = Array.isArray(data) ? data : [];
        const mapped = list
          .map((p) => {
            const ci = pickCi(p);
            if (!ci) return null;
            const nombre = pickNombre(p);
            return {
              ci: String(ci),
              label: nombre ? `${nombre} (${ci})` : String(ci),
            };
          })
          .filter(Boolean);

        if (!cancelled) setPacientes(mapped);
      } catch {
        if (!cancelled) setPacientes([]);
      }
    }

    async function loadMedicos() {
      const needsMedicos = (active.pathParams || []).some((p) => p.optionsFrom === 'medicos');
      if (!needsMedicos) return;

      try {
        const data = await apiRequest({
          method: 'GET',
          path: '/api/RecursosHumanos/ListarEmpleados',
        });

        const list = Array.isArray(data) ? data : [];
        const mapped = list
          .filter((m) => String(m?.estado ?? m?.Estado ?? '').toLowerCase() !== 'inactivo')
          .map((m) => {
            const ci = pickCi(m);
            if (!ci) return null;
            const nombre = pickNombre(m);
            const cargo = m?.cargo ?? m?.Cargo ?? '';
            return {
              ci: String(ci),
              label: cargo ? `${nombre || ci} - ${cargo} (${ci})` : nombre ? `${nombre} (${ci})` : String(ci),
            };
          })
          .filter(Boolean);

        if (!cancelled) setMedicos(mapped);
      } catch {
        if (!cancelled) setMedicos([]);
      }
    }

    loadPacientes();
    loadMedicos();
    return () => {
      cancelled = true;
    };
  }, [active.id, active.pathParams]);

  const resolvedUrl = useMemo(() => {
    try {
      return buildUrl(active.path, { pathParams, query });
    } catch {
      return '';
    }
  }, [active.path, pathParams, query]);

  async function run() {
    setLoading(true);
    setError(null);
    setResult(undefined);
    try {
      let data;
      if (active.multipart) {
        const fd = new FormData();
        if (active.fileParam?.key) {
          if (!multipartFile) throw new Error('Debes seleccionar un archivo.');
          fd.append(active.fileParam.key, multipartFile);
        }
        if (multipartForm && typeof multipartForm === 'object') {
          for (const [k, v] of Object.entries(multipartForm)) {
            if (v === undefined || v === null) continue;
            fd.append(k, String(v));
          }
        }
        data = await apiRequest({
          method: active.method,
          path: active.path,
          pathParams,
          query,
          rawBody: fd,
        });
      } else {
        let body;
        if (active.method !== 'GET' && active.method !== 'DELETE') {
          body = bodyMode === 'json' ? tryParseJson(bodyJson) : bodyForm;

          if (active.ui === 'ordenCrear') {
            body = sanitizeCrearOrdenBody(body);
          }
        }
        data = await apiRequest({
          method: active.method,
          path: active.path,
          pathParams,
          query,
          body,
        });
      }
      setResult(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="runner">
      <div className="runner-header">
        <h1>{controller.title}</h1>
        {controller.description ? <p>{controller.description}</p> : null}
      </div>

      <div className="runner-layout">
        <aside className="runner-aside">
          {controller.endpoints.map((ep) => (
            <button
              key={ep.id}
              className={ep.id === active.id ? 'ep-btn active' : 'ep-btn'}
              onClick={() => setActiveId(ep.id)}
              type="button"
            >
              <span className={`badge method-${ep.method}`}>{ep.method}</span>
              <span className="ep-name">{ep.name}</span>
            </button>
          ))}
        </aside>

        <section className="runner-main">
          <div className="ep-header">
            <div className="ep-title">
              <h2>{active.name}</h2>
              <div className="ep-path">{active.path}</div>
            </div>
            <button className="run-btn" onClick={run} disabled={loading} type="button">
              {loading ? 'Ejecutando...' : 'Ejecutar'}
            </button>
          </div>

          <div className="ep-url">
            <div className="ep-url-label">URL</div>
            <div className="ep-url-value">{resolvedUrl || 'Completa los parámetros para generar la URL'}</div>
          </div>

          {(active.pathParams?.length || 0) > 0 ? (
            <div className="panel">
              <div className="panel-title">Path params</div>
              <div className="form-grid">
                {active.pathParams.map((p) => (
                  <label className="field" key={p.key}>
                    <div className="field-label">{p.label || p.key}</div>
                    {p.optionsFrom === 'pacientes' ? (
                      <select
                        className="input"
                        value={pathParams[p.key] ?? ''}
                        onChange={(e) => setPathParams((s) => ({ ...s, [p.key]: e.target.value }))}
                      >
                        <option value="">Selecciona un paciente...</option>
                        {pacientes.map((opt) => (
                          <option key={opt.ci} value={opt.ci}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : p.optionsFrom === 'medicos' ? (
                      <select
                        className="input"
                        value={pathParams[p.key] ?? ''}
                        onChange={(e) => setPathParams((s) => ({ ...s, [p.key]: e.target.value }))}
                      >
                        <option value="">Selecciona un médico...</option>
                        {medicos.map((opt) => (
                          <option key={opt.ci} value={opt.ci}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className="input"
                        type={inputTypeFor(p.key, pathParams[p.key] ?? '')}
                        value={pathParams[p.key] ?? ''}
                        onChange={(e) => setPathParams((s) => ({ ...s, [p.key]: e.target.value }))}
                        placeholder={p.key}
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          {(active.queryParams?.length || 0) > 0 ? (
            <div className="panel">
              <div className="panel-title">Query params</div>
              <div className="form-grid">
                {active.queryParams.map((p) => (
                  <label className="field" key={p.key}>
                    <div className="field-label">{p.label || p.key}</div>
                    <input
                      className="input"
                      value={query[p.key] ?? ''}
                      onChange={(e) => setQuery((s) => ({ ...s, [p.key]: e.target.value }))}
                      placeholder={p.key}
                    />
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          {active.method !== 'GET' && active.method !== 'DELETE' ? (
            <div className="panel">
              <div className="panel-title panel-title-row">
                <span>Body</span>
                {active.ui !== 'ordenCrear' && active.ui !== 'farmaciaReceta' ? (
                  <div className="segmented">
                    <button
                      type="button"
                      className={bodyMode === 'form' ? 'seg-btn active' : 'seg-btn'}
                      onClick={() => setBodyMode('form')}
                      disabled={!isObject(bodyForm)}
                      title={!isObject(bodyForm) ? 'Este endpoint no tiene body tipo objeto' : undefined}
                    >
                      Form
                    </button>
                    <button
                      type="button"
                      className={bodyMode === 'json' ? 'seg-btn active' : 'seg-btn'}
                      onClick={() => setBodyMode('json')}
                    >
                      JSON
                    </button>
                  </div>
                ) : null}
              </div>

              {active.ui === 'farmaciaReceta' ? (
                <FarmaciaRecetaForm value={bodyForm} onChange={setBodyForm} />
              ) : active.ui === 'ordenCrear' ? (
                <OrdenCrearForm value={bodyForm} onChange={setBodyForm} />
              ) : null}

              {active.multipart ? (
                <div className="multipart">
                  <div className="form-grid">
                    {active.fileParam?.key ? (
                      <label className="field">
                        <div className="field-label">{active.fileParam.label || active.fileParam.key}</div>
                        <input
                          className="input"
                          type="file"
                          onChange={(e) => setMultipartFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    ) : null}

                    {multipartForm && typeof multipartForm === 'object'
                      ? Object.keys(multipartForm).map((k) => (
                          <label className="field" key={k}>
                            <div className="field-label">{k}</div>
                            <input
                              className="input"
                              type={inputTypeFor(k, multipartForm[k])}
                              value={multipartForm[k] ?? ''}
                              onChange={(e) =>
                                setMultipartForm((s) => ({
                                  ...(s || {}),
                                  [k]: e.target.value,
                                }))
                              }
                            />
                          </label>
                        ))
                      : null}
                  </div>
                </div>
              ) : null}

              {!active.multipart ? (
                active.ui === 'farmaciaReceta' || active.ui === 'ordenCrear' ? null : bodyMode === 'form' && isObject(bodyForm) ? (
                  <div className="form-grid">
                    {Object.keys(bodyForm).map((k) => (
                      <label className="field" key={k}>
                        <div className="field-label">{k}</div>
                        <input
                          className="input"
                          type={inputTypeFor(k, bodyForm[k])}
                          value={bodyForm[k] ?? ''}
                          onChange={(e) => setBodyForm((s) => ({ ...s, [k]: e.target.value }))}
                        />
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    className="textarea"
                    value={bodyJson}
                    onChange={(e) => setBodyJson(e.target.value)}
                    spellCheck={false}
                  />
                )
              ) : null}
            </div>
          ) : null}

          {error ? (
            <div className="panel error">
              <div className="panel-title">Error</div>
              <pre className="mono">
                {String(error?.message || error)}
                {'\n'}
                {error?.payload ? JSON.stringify(error.payload, null, 2) : ''}
              </pre>
            </div>
          ) : null}

          {result !== undefined ? (
            <div className="panel">
              <div className="panel-title">Respuesta</div>
              {typeof result === 'string' ? (
                <pre className="mono">{result}</pre>
              ) : active.uiResult === 'ordenExamenes' || active.uiResult === 'ordenPorDoctor' ? (
                <OrdenLaboratorioCards mode={active.uiResult} data={result} />
              ) : (
                <JsonCards data={result} />
              )}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

