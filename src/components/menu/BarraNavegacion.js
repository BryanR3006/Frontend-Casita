import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BarraNavegacion = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Navbar bg="primary" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Servicion
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>

            <NavDropdown title="Clientes" id="clientes-dropdown">
              <NavDropdown.Item as={Link} to="/clientes/lista">
                Lista de clientes
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/clientes/agregar">
                Agregar Cliente
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/clientes/editar">
                editar rCliente
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Pedidos" id="pedidos-dropdown">
              <NavDropdown.Item as={Link} to="/pedidos/nuevo">
                Nuevo Pedido
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/pedidos/lista">
                Lista de Pedidos
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Facturación" id="facturacion-dropdown">
              <NavDropdown.Item as={Link} to="/facturacion/nuevo">
                Nueva factura
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/facturacion/lista">
                Lista de facturas
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Productos" id="productos-dropdown">
              <NavDropdown.Item as={Link} to="/productos/lista">
                Inventario
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Proveedores" id="proveedores-dropdown">
              <NavDropdown.Item as={Link} to="/proveedores/lista">
                Lista de Proveedores
              </NavDropdown.Item>

            </NavDropdown>

            <NavDropdown title="dashboard" id="dashboard">
              <NavDropdown.Item as={Link} to="/dashboard">
                dashboard
              </NavDropdown.Item>

            </NavDropdown>

          </Nav>

          <Nav>
            <NavDropdown title={`Bienvenido, ${user?.nombre}`} id="user-dropdown">
              <NavDropdown.Item as={Link} to="/perfil">
                Perfil
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/logout">
                Cerrar Sesión
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default BarraNavegacion;
