import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BarraNavegacion from './components/menu/BarraNavegacion';
import Home from './pages/Home';
import ListaClientes from './components/clientes/ListaClientes';
import AgregarCliente from './components/clientes/AgregarCliente';
import EditarCliente from './components/clientes/EditarCliente';
import EliminarCliente from './components/clientes/EliminarCliente'; 
import ListaOrdenes from './components/Ordenes/ListaOrdenes';        
import AgregarOrden from './components/Ordenes/AgregarOrden';
import EditarOrden from './components/Ordenes/EditarOrden';
import EliminarOrden from './components/Ordenes/EliminarOrden'; 
import ListaProductos from './components/Productos/ListaProductos';     
import AgregarProducto from './components/Productos/AgregarProducto';
import EditarProducto from './components/Productos/EditarProducto';
import EliminarProducto from './components/Productos/EliminarProducto'; 
import ListaProveedores from './components/Proveedores/ListaProveedores';
import AgregarProveedor from './components/Proveedores/AgregarProveedores';
import EditarProveedor from './components/Proveedores/EditarProveedor';
import EliminarProveedor from './components/Proveedores/EliminarProveedor'; 
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <Router>
            <div className="App">
                <div className="app-container">
                    <BarraNavegacion />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            
                            {/* Clientes -> /api/Customers */}
                            <Route path="/clientes/lista" element={<ListaClientes />} />
                            <Route path="/clientes/agregar" element={<AgregarCliente />} />
                            <Route path="/clientes/editar/:id" element={<EditarCliente />} />
                            <Route path="/clientes/eliminar/:id" element={<EliminarCliente />} /> 
                            
                            {/* Órdenes -> /api/Orders */}
                            <Route path="/ordenes/lista" element={<ListaOrdenes />} />
                            <Route path="/ordenes/agregar" element={<AgregarOrden />} />
                            <Route path="/ordenes/editar/:id" element={<EditarOrden />} />
                            <Route path="/ordenes/eliminar/:id" element={<EliminarOrden />} /> 
                            
                            {/* Productos -> /api/Products */}
                            <Route path="/productos/lista" element={<ListaProductos />} />
                            <Route path="/productos/agregar" element={<AgregarProducto />} />
                            <Route path="/productos/editar/:id" element={<EditarProducto />} />
                            <Route path="/productos/eliminar/:id" element={<EliminarProducto />} /> 
                            
                            {/* Proveedores -> /api/Suppliers */}
                            <Route path="/proveedores/lista" element={<ListaProveedores />} />
                            <Route path="/proveedores/agregar" element={<AgregarProveedor />} />
                            <Route path="/proveedores/editar/:id" element={<EditarProveedor />} />
                            <Route path="/proveedores/eliminar/:id" element={<EliminarProveedor />} /> 
                            
                            {/* Ruta 404 */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}

export default App;