import React from 'react';
import './JsonCards.css';

function isPlainObject(x) {
  return x !== null && typeof x === 'object' && !Array.isArray(x);
}

function safeStringify(v) {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

function toPairs(item) {
  if (isPlainObject(item)) return Object.entries(item);
  return [['value', item]];
}

export default function JsonCards({ data }) {
  if (data === undefined) return null;

  const list = Array.isArray(data) ? data : [data];

  if (list.length === 0) {
    return (
      <div className="cards-empty">
        <p>No hay datos para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="cards-grid">
      {list.map((item, idx) => (
        <div className="card" key={idx}>
          <div className="card-body">
            {toPairs(item).map(([k, v]) => (
              <div className="card-row" key={k}>
                <div className="card-key">{k}</div>
                <div className="card-val">
                  {isPlainObject(v) || Array.isArray(v) ? (
                    <pre className="card-pre">{safeStringify(v)}</pre>
                  ) : (
                    String(v)
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

