// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import BarraNavegacion from './components/menu/BarraNavegacion';
import ListarCliente from './components/clientes/ListaCliente';
import AgregarCliente from './components/clientes/AgregarCliente';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <BarraNavegacion />
      
      <Routes>
        <Route path="/" element={<Dashboard />} />


        <Route path="/clientes/lista"element={<ListarCliente />} />
        <Route path="/clientes/agregar"element={<AgregarCliente />} />
      </Routes>
    </Router>
  );
}

export default App;
