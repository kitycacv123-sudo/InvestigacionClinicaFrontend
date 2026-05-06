import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const controllers = [
  { path: '/api-docs', name: 'API Swagger' },
  { path: '/bioseguridad', name: 'Bioseguridad' },
  { path: '/farmacia', name: 'Farmacia' },
  { path: '/gestion-documentacion', name: 'Gestión Documentación' },
  { path: '/gestion-legal', name: 'Gestión Legal' },
  { path: '/investigaciones', name: 'Investigaciones' },
  { path: '/orden-laboratorio', name: 'Orden Laboratorio' },
  { path: '/recoleccion-resultados', name: 'Recolección Resultados' },
  { path: '/recolecciones', name: 'Recolecciones' },
  { path: '/recursos-humanos', name: 'Recursos Humanos' },
  { path: '/resultado-sintomas', name: 'Resultado Síntomas' },
  { path: '/resultados', name: 'Resultados' },
  { path: '/tipo-sintomas', name: 'Tipo Síntomas' }
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2><span>Clinica</span>Admin</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')} end>
          Dashboard (Inicio)
        </NavLink>
        {controllers.map((ctrl) => (
          <NavLink
            key={ctrl.path}
            to={ctrl.path}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            {ctrl.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
