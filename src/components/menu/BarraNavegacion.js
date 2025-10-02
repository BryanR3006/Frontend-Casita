import React from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './stylos.css';
import { FaUsers, FaShoppingCart, FaBoxOpen, FaTruck, FaChartBar, FaUserCircle, FaHome } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')) || { nombre: 'Admin User' };

  // Función para verificar si la ruta está activa
  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar bg-light border-end">
      <div className="sidebar-header p-3 border-bottom bg-white">
        <h4 className="m-0 text-dark">BizManager</h4>
      </div>

      <Nav className="flex-column p-3">
        {/* Inicio - Home.js */}
        <Nav.Link 
          as={Link} 
          to="/" 
          className={`mb-2 ${isActive('/') ? 'active-nav' : ''}`}
        >
          <FaHome className="me-2" />
          Inicio
        </Nav.Link>

        {/* CLIENTES Dropdown */}
        <NavDropdown 
          title={<><FaUsers className="me-2" />Clientes</>} 
          id="clientes-dropdown"
          className={`mb-2 ${location.pathname.includes('/clientes') ? 'active-nav' : ''}`}
        >
          <NavDropdown.Item 
            as={Link} 
            to="/clientes/lista"
            className={isActive('/clientes/lista') ? 'active-dropdown' : ''}
          >
            Lista Clientes
          </NavDropdown.Item>
          <NavDropdown.Item 
            as={Link} 
            to="/clientes/agregar"
            className={isActive('/clientes/agregar') ? 'active-dropdown' : ''}
          >
            Agregar Cliente
          </NavDropdown.Item>
        </NavDropdown>

        {/* ORDENES Dropdown */}
        <NavDropdown 
          title={<><FaShoppingCart className="me-2" />Ordenes</>} 
          id="ordenes-dropdown"
          className={`mb-2 ${location.pathname.includes('/ordenes') ? 'active-nav' : ''}`}
        >
          <NavDropdown.Item 
            as={Link} 
            to="/ordenes/lista"
            className={isActive('/ordenes/lista') ? 'active-dropdown' : ''}
          >
            Lista de Ordenes
          </NavDropdown.Item>
          <NavDropdown.Item 
            as={Link} 
            to="/ordenes/agregar"
            className={isActive('/ordenes/agregar') ? 'active-dropdown' : ''}
          >
            Nueva Orden
          </NavDropdown.Item>
        </NavDropdown>

        {/* PRODUCTOS Dropdown */}
        <NavDropdown 
          title={<><FaBoxOpen className="me-2" />Productos</>} 
          id="productos-dropdown"
          className={`mb-2 ${location.pathname.includes('/productos') ? 'active-nav' : ''}`}
        >
          <NavDropdown.Item 
            as={Link} 
            to="/productos/lista"
            className={isActive('/productos/lista') ? 'active-dropdown' : ''}
          >
            Lista Productos
          </NavDropdown.Item>
          <NavDropdown.Item 
            as={Link} 
            to="/productos/agregar"
            className={isActive('/productos/agregar') ? 'active-dropdown' : ''}
          >
            Agregar Productos
          </NavDropdown.Item>
        </NavDropdown>

        {/* PROVEEDORES Dropdown */}
        <NavDropdown 
          title={<><FaTruck className="me-2" />Proveedores</>} 
          id="proveedores-dropdown"
          className={`mb-2 ${location.pathname.includes('/proveedores') ? 'active-nav' : ''}`}
        >
          <NavDropdown.Item 
            as={Link} 
            to="/proveedores/lista"
            className={isActive('/proveedores/lista') ? 'active-dropdown' : ''}
          >
            Lista Proveedores
          </NavDropdown.Item>
          <NavDropdown.Item 
            as={Link} 
            to="/proveedores/agregar"
            className={isActive('/proveedores/agregar') ? 'active-dropdown' : ''}
          >
            Agregar Proveedor
          </NavDropdown.Item>
        </NavDropdown>

        {/* REPORTES Dropdown */}
        <NavDropdown 
          title={<><FaChartBar className="me-2" />Reportes</>} 
          id="reportes-dropdown"
          className={`mb-2 ${location.pathname.includes('/reportes') ? 'active-nav' : ''}`}
        >
          <NavDropdown.Item 
            as={Link} 
            to="/reportes/ventas"
            className={isActive('/reportes/ventas') ? 'active-dropdown' : ''}
          >
            Reporte de Ventas
          </NavDropdown.Item>
          <NavDropdown.Item 
            as={Link} 
            to="/reportes/inventario"
            className={isActive('/reportes/inventario') ? 'active-dropdown' : ''}
          >
            Reporte de Inventario
          </NavDropdown.Item>
        </NavDropdown>

        <hr className="my-3" />

        {/* Usuario */}
        <NavDropdown 
          title={<><FaUserCircle className="me-2" />{user.nombre}</>} 
          id="user-dropdown"
          className="user-dropdown"
        >
          <NavDropdown.Item as={Link} to="/perfil">Perfil</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/logout">Cerrar Sesión</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </div>
  );
};

export default Sidebar;