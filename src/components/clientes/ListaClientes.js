import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Container, Row, Col, Form, Alert, Spinner, Pagination, Card } from "react-bootstrap";
import { clienteService } from "../../Services/api";
import { FaPlus, FaSearch, FaSync, FaEdit, FaTrash } from "react-icons/fa";

const ListarCliente = () => {
    const [clientes, setClientes] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [clientesPorPagina] = useState(10);

    useEffect(() => {
        cargarClientes();
    }, []);

    const cargarClientes = async () => {
        try {
            setLoading(true);
            const response = await clienteService.getAll();
            setClientes(response.data || response);
            setError(null);
        } catch (error) {
            setError("Error al cargar los clientes");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }

    const buscarCliente = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await clienteService.getAll();
            const datos = response.data || response;
            const clientesFiltrados = datos.filter(cliente =>
                (cliente.firstName && cliente.firstName.toLowerCase().includes(filtro.toLowerCase())) ||
                (cliente.email && cliente.email.toLowerCase().includes(filtro.toLowerCase())) ||
                (cliente.lastName && cliente.lastName.toLowerCase().includes(filtro.toLowerCase()))
            );
            setClientes(clientesFiltrados);
            setError(null);
        } catch (error) {
            setError("Error al buscar los clientes");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }

    const eliminarCliente = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
            try {
                await clienteService.delete(id);
                setClientes(clientes.filter(cliente => cliente.id !== id));
                setError(null);
                alert("Cliente eliminado correctamente");
            } catch (error) {
                const errorMessage = error.response?.data || "Error al eliminar el cliente";
                setError(errorMessage);
                console.error("Error:", error);
            }
        }
    }

    const limpiarBusqueda = () => {
        setFiltro('');
        cargarClientes();
    }

    // Calcular páginas
    const indexOfLastCliente = paginaActual * clientesPorPagina;
    const indexOfFirstCliente = indexOfLastCliente - clientesPorPagina;
    const clientesActuales = clientes.slice(indexOfFirstCliente, indexOfLastCliente);
    const totalPaginas = Math.ceil(clientes.length / clientesPorPagina);

    const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);

    if (loading) return (
        <Container className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Cargando clientes...</p>
        </Container>
    );

    return (
        <Container fluid className="p-4">
            {/* Header */}
            <Row className="mb-4">
                <Col>
                    <h2 className="text-dark">Lista de Clientes</h2>
                    <p className="text-muted">Gestiona todos los clientes del sistema</p>
                </Col>
                <Col className="text-end">
                    <Button as={Link} to="/clientes/agregar" variant="primary" className="me-2">
                        <FaPlus className="me-2" />
                        Crear Cliente
                    </Button>
                    <Button variant="outline-secondary" onClick={cargarClientes}>
                        <FaSync />
                    </Button>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* Card de Búsqueda */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Form onSubmit={buscarCliente}>
                        <Row className="align-items-end">
                            <Col md={6}>
                                <Form.Label className="fw-semibold">Buscar cliente</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar por nombre, apellido o correo..."
                                    value={filtro}
                                    onChange={(e) => setFiltro(e.target.value)}
                                />
                            </Col>
                            <Col md={2}>
                                <Button type="submit" variant="primary" className="w-100">
                                    <FaSearch className="me-2" />
                                    Buscar
                                </Button>
                            </Col>
                            <Col md={2}>
                                <Button variant="outline-secondary" className="w-100" onClick={limpiarBusqueda}>
                                    Limpiar
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Tabla de Clientes */}
            <Card className="shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table striped bordered hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th>Ciudad</th>
                                    <th>País</th>
                                    <th width="150">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientesActuales.map((cliente) => (
                                    <tr key={cliente.id}>
                                        <td className="fw-semibold">#{cliente.id}</td>
                                        <td>{cliente.firstName || "N/A"}</td>
                                        <td>{cliente.lastName || "N/A"}</td>
                                        <td>
                                            {cliente.email ? (
                                                <a href={`mailto:${cliente.email}`} className="text-decoration-none">
                                                    {cliente.email}
                                                </a>
                                            ) : "N/A"}
                                        </td>
                                        <td>{cliente.phone || "N/A"}</td>
                                        <td>{cliente.city || "N/A"}</td>
                                        <td>{cliente.country || "N/A"}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Button 
                                                    as={Link} 
                                                    to={`/clientes/editar/${cliente.id}`} 
                                                    variant="outline-warning" 
                                                    size="sm"
                                                    title="Editar cliente"
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => eliminarCliente(cliente.id)}
                                                    title="Eliminar cliente"
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    {clientes.length === 0 && !loading && (
                        <div className="text-center py-5">
                            <Alert variant="info" className="mx-3">
                                No se encontraron clientes
                            </Alert>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Paginación */}
            {clientes.length > 0 && totalPaginas > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <div className="text-muted">
                        Mostrando {indexOfFirstCliente + 1} - {Math.min(indexOfLastCliente, clientes.length)} de {clientes.length} clientes
                    </div>
                    <Pagination>
                        <Pagination.First 
                            onClick={() => cambiarPagina(1)} 
                            disabled={paginaActual === 1} 
                        />
                        <Pagination.Prev 
                            onClick={() => cambiarPagina(paginaActual - 1)} 
                            disabled={paginaActual === 1} 
                        />
                        
                        {[...Array(totalPaginas)].map((_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === paginaActual}
                                onClick={() => cambiarPagina(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        
                        <Pagination.Next 
                            onClick={() => cambiarPagina(paginaActual + 1)} 
                            disabled={paginaActual === totalPaginas} 
                        />
                        <Pagination.Last 
                            onClick={() => cambiarPagina(totalPaginas)} 
                            disabled={paginaActual === totalPaginas} 
                        />
                    </Pagination>
                </div>
            )}
        </Container>
    );
}

export default ListarCliente;