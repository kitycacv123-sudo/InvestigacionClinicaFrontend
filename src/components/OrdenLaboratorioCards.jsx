import React from 'react';
import './OrdenLaboratorioCards.css';

function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    if (Array.isArray(data.examenes)) return data.examenes;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.result)) return data.result;
  }
  return [];
}

function Chip({ tone = 'neutral', children }) {
  return <span className={`ol-chip ol-chip-${tone}`}>{children}</span>;
}

export default function OrdenLaboratorioCards({ mode, data }) {
  const list = normalizeList(data);

  if (!list.length) {
    return (
      <div className="ol-empty">
        <p>No hay datos para mostrar.</p>
      </div>
    );
  }

  if (mode === 'ordenExamenes') {
    return (
      <div className="ol-grid">
        {list.map((e, idx) => (
          <div className="ol-card" key={e.examenCodigo ?? idx}>
            <div className="ol-card-top">
              <div className="ol-title">{e.nombre ?? 'Examen'}</div>
              <div className="ol-subtitle">{e.examenCodigo ? `Código: ${e.examenCodigo}` : ''}</div>
            </div>

            {e.descripcion ? <div className="ol-desc">{e.descripcion}</div> : null}

            <div className="ol-chips">
              {typeof e.tiempoProcesamiento !== 'undefined' ? (
                <Chip tone="info">{`⏱ ${e.tiempoProcesamiento} min`}</Chip>
              ) : null}
              {typeof e.requiereAyuno !== 'undefined' ? (
                e.requiereAyuno ? <Chip tone="warn">Requiere ayuno</Chip> : <Chip tone="ok">Sin ayuno</Chip>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ordenPorDoctor
  return (
    <div className="ol-grid">
      {list.map((o, idx) => (
        <div className="ol-card" key={o.ordenLaboratorioCodigo ?? idx}>
          <div className="ol-card-top">
            <div className="ol-title">{o.nombreExamen ?? 'Orden'}</div>
            <div className="ol-subtitle">
              {o.ordenLaboratorioCodigo ? `Orden: ${o.ordenLaboratorioCodigo}` : ''}
            </div>
          </div>

          <div className="ol-chips">
            {o.tipoMuestra ? <Chip tone="neutral">{o.tipoMuestra}</Chip> : null}
            {o.estadoOrdenExamen ? (
              <Chip tone={String(o.estadoOrdenExamen).toLowerCase().includes('pend') ? 'warn' : 'info'}>
                {o.estadoOrdenExamen}
              </Chip>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

