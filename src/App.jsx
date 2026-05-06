import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import './App.css';

// Import Views
import Bioseguridad from './views/Bioseguridad';
import Farmacia from './views/Farmacia';
import GestionDocumentacion from './views/GestionDocumentacion';
import GestionLegal from './views/GestionLegal';
import Investigaciones from './views/Investigaciones';
import OrdenLaboratorio from './views/OrdenLaboratorio';
import RecoleccionResultados from './views/RecoleccionResultados';
import Recolecciones from './views/Recolecciones';
import RecursosHumanos from './views/RecursosHumanos';
import ResultadoSintomas from './views/ResultadoSintomas';
import Resultados from './views/Resultados';
import TipoSintomas from './views/TipoSintomas';
import SwaggerDocs from './views/SwaggerDocs';

function DashboardHome() {
  return (
    <div className='view-container'>
      <div className='view-header'>
        <h1>Dashboard</h1>
        <p>Welcome to Clinica Admin Dashboard. Select an option from the sidebar.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/api-docs" element={<SwaggerDocs />} />
            <Route path="/bioseguridad" element={<Bioseguridad />} />
            <Route path="/farmacia" element={<Farmacia />} />
            <Route path="/gestion-documentacion" element={<GestionDocumentacion />} />
            <Route path="/gestion-legal" element={<GestionLegal />} />
            <Route path="/investigaciones" element={<Investigaciones />} />
            <Route path="/orden-laboratorio" element={<OrdenLaboratorio />} />
            <Route path="/recoleccion-resultados" element={<RecoleccionResultados />} />
            <Route path="/recolecciones" element={<Recolecciones />} />
            <Route path="/recursos-humanos" element={<RecursosHumanos />} />
            <Route path="/resultado-sintomas" element={<ResultadoSintomas />} />
            <Route path="/resultados" element={<Resultados />} />
            <Route path="/tipo-sintomas" element={<TipoSintomas />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
