import React from 'react';
import './Views.css';

const SwaggerDocs = () => {
  return (
    <div className="view-container" style={{ height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column' }}>
      <div className="view-header" style={{ marginBottom: '1rem' }}>
        <h1>Investigación Clínica</h1>
        <p>Explore and test the backend endpoints directly from the frontend.</p>
      </div>
      <div style={{ flex: 1, backgroundColor: '#0f172a', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <iframe 
          src="https://investigacionclinica-production.up.railway.app/swagger/index.html" 
          title="Swagger UI"
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none', 
            display: 'block',
            filter: 'invert(92%) hue-rotate(210deg) brightness(105%) contrast(95%)'
          }}
        />
      </div>
    </div>
  );
};

export default SwaggerDocs;
