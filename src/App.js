// App.js
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import BarraNavegacion from './components/menu/BarraNavegacion';
import ListarCliente from './components/clientes/ListaCliente';
import AgregarCliente from './components/clientes/AgregarCliente';
import EditarCliente from './components/clientes/EditarCliente';
import DashboardEmbed from './components/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <BarraNavegacion />
      
      <Routes>
        <Route path="/clientes/lista" element={<ListarCliente />} />
        <Route path="/clientes/agregar" element={<AgregarCliente />} />
        <Route path="/clientes/editar/:id" element={<EditarCliente />} />

        <Route  path="/dashboard"  element={<DashboardEmbed/> } 
        />
      </Routes>
    </Router>
  );
}

export default App;
