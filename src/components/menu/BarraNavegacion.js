import React from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../menu/stylos.css';

import { FaTachometerAlt, FaUsers, FaShoppingCart, FaFileInvoiceDollar, FaBoxOpen, FaTruck, FaUserCircle } from 'react-icons/fa';

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem('user')) || { nombre: 'Admin User' };

  return (
    <div className="sidebar bg-body-tertiar">
      <div className="sidebar-header p-3 border-bottom">
        <h4 className="m-0">BizManager</h4>
      </div>

      <Nav className="flex-column p-3">
        <NavDropdown title={<><FaTachometerAlt className="me-2" />Dashboard</>} className="">
          <NavDropdown.Item as={Link} to="/dashboard">dashboard</NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title={<><FaUsers className="me-2 " />Clientes</>} id="clientes-dropdown" className="text-white">
          <NavDropdown.Item as={Link} to="/clientes/lista  " >Lista de clientes</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/clientes/agregar">Agregar Cliente</NavDropdown.Item>
        </NavDropdown>

        <NavDropdown title={<><FaShoppingCart className="me-2" />Pedidos</>} id="pedidos-dropdown" className="text-white">
          <NavDropdown.Item as={Link} to="/pedidos/nuevo">Nuevo Pedido</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/pedidos/lista">Lista de Pedidos</NavDropdown.Item>
        </NavDropdown>

        <NavDropdown title={<><FaFileInvoiceDollar className="me-2" />Facturación</>} id="facturacion-dropdown" className="">
          <NavDropdown.Item as={Link} to="/facturacion/nuevo">Nueva factura</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/facturacion/lista">Lista de facturas</NavDropdown.Item>
        </NavDropdown>

        <NavDropdown title={<><FaBoxOpen className="me-2" />Productos</>} id="productos-dropdown" className="text-white">
          <NavDropdown.Item as={Link} to="/productos/lista">Inventario</NavDropdown.Item>
        </NavDropdown>

        <NavDropdown title={<><FaTruck className="me-2" />Proveedores</>} id="proveedores-dropdown" className="text-white">
          <NavDropdown.Item as={Link} to="/proveedores/lista">Lista de Proveedores</NavDropdown.Item>
        </NavDropdown>

        <hr className="text-white" />

        <NavDropdown title={<><FaUserCircle className="me-2" />Bienvenido {user.nombre}</>} id="user-dropdown" className="text-white">
          <NavDropdown.Item as={Link} to="/perfil">Perfil</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/logout">Cerrar Sesión</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </div>
  );
};

export default Sidebar;
