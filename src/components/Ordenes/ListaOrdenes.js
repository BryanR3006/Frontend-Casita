import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Table, Button, Container, Row, Col, Form, Alert, Spinner, Pagination } from "react-bootstrap";
import { ordenService } from "../../Services/api";

const ListaOrdenes = () => {
    const [ordenes, setOrdenes] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [ordenesPorPagina] = useState(10);

    const cargarOrdenes = async () => {
        try {
            setLoading(true);
            const response = await ordenService.getAll();
            setOrdenes(response.data || []);
            setError(null);
        } catch (error) {
            setError("Error al cargar las órdenes");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const buscarOrden = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await ordenService.getAll();
            const ordenesFiltradas = (response.data || []).filter(orden =>
                (orden.cliente && orden.cliente.toLowerCase().includes(filtro.toLowerCase())) ||
                (orden.id && orden.id.toString().includes(filtro.toLowerCase()))
            );
            setOrdenes(ordenesFiltradas);
            setError(null);
        } catch (error) {
            setError("Error al buscar las órdenes");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const eliminarOrden = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta orden?")) {
            try {
                await ordenService.delete(id);
                setOrdenes(ordenes.filter(orden => orden.id !== id));
                setError(null);
                alert("Orden eliminada correctamente");
            } catch (error) {
                const errorMessage = error.response?.data || "Error al eliminar la orden";
                setError(errorMessage);
                console.error(error);
            }
        }
    }

    // Calcular páginas
    const indexOfLastOrden = paginaActual * ordenesPorPagina;
    const indexOfFirstOrden = indexOfLastOrden - ordenesPorPagina;
    const ordenesActuales = ordenes.slice(indexOfFirstOrden, indexOfLastOrden);
    const totalPaginas = Math.ceil(ordenes.length / ordenesPorPagina);

    // Cambiar página
    const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);

    if (loading) return (
        <Container className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Cargando órdenes...</p>
        </Container>
    );

    return (
        <Container className="container-sm">
            <Row className="mb-4">
                <Col>
                    <h2>Lista de Órdenes</h2>
                </Col>
                <Col className="text-end">
                    <Button as={Link} to="/ordenes/crear" variant="primary" className="me-2">
                        Crear Orden
                    </Button>
                    <Button variant="success" onClick={cargarOrdenes}>
                        Cargar Órdenes
                    </Button>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={buscarOrden} className="mb-4">
                <Row>
                    <Col md={8}>
                        <Form.Control
                            type="text"
                            placeholder="Buscar por ID o cliente"
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        />
                    </Col>
                    <Col md={2}>
                        <Button type="submit" variant="outline-primary" className="w-100">
                            Buscar
                        </Button>
                    </Col>
                    <Col md={2}>
                        <Button variant="outline-secondary" className="w-100" onClick={cargarOrdenes}>
                            Limpiar
                        </Button>
                    </Col>
                </Row>
            </Form>

            {ordenes.length === 0 ? (
                <div className="text-center py-5">
                    <Alert variant="info">
                        <h4>No hay órdenes registradas</h4>
                        <p>Presiona el botón "Cargar Órdenes" para buscar órdenes existentes o crea una nueva orden.</p>
                        <Button variant="primary" onClick={cargarOrdenes} className="me-2">
                            Cargar Órdenes
                        </Button>
                        <Button as={Link} to="/ordenes/crear" variant="success">
                            Crear Primera Orden
                        </Button>
                    </Alert>
                </div>
            ) : (
                <>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Cliente</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordenesActuales.map((orden) => (
                                <tr key={orden.id}>
                                    <td>{orden.id}</td>
                                    <td>{orden.cliente || "Sin cliente"}</td>
                                    <td>{orden.fecha ? new Date(orden.fecha).toLocaleDateString() : "Sin fecha"}</td>
                                    <td>${orden.total ? orden.total.toFixed(2) : "0.00"}</td>
                                    <td>
                                        <span className={
                                            orden.estado === "Completada" ? "badge bg-success" :
                                            orden.estado === "Pendiente" ? "badge bg-warning" :
                                            orden.estado === "Cancelada" ? "badge bg-danger" : "badge bg-secondary"
                                        }>
                                            {orden.estado || "Pendiente"}
                                        </span>
                                    </td>
                                    <td>
                                        <Button 
                                            as={Link} 
                                            to={`/ordenes/detalle/${orden.id}`} 
                                            variant="info" 
                                            size="sm" 
                                            className="me-2"
                                        >
                                            Ver
                                        </Button>
                                        <Button 
                                            as={Link} 
                                            to={`/ordenes/editar/${orden.id}`} 
                                            variant="warning" 
                                            size="sm" 
                                            className="me-2"
                                        >
                                            Editar
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm" 
                                            onClick={() => eliminarOrden(orden.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Paginación */}
                    {ordenes.length > ordenesPorPagina && (
                        <div className="d-flex justify-content-center">
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
                </>
            )}
        </Container>
    );
}

export default ListaOrdenes;