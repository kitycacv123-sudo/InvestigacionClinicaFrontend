import React from 'react';
import ControllerRunner from '../components/ControllerRunner';
import { CONTROLLERS } from '../api/controllers';

export default function ControllerView({ controllerKey }) {
  const controller = CONTROLLERS[controllerKey];
  if (!controller) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Controller no configurado</h1>
        <p>No existe configuración para: {String(controllerKey)}</p>
      </div>
    );
  }

  return <ControllerRunner controller={controller} />;
}

