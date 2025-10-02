import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Container, Row, Col, Form, Alert, Spinner, Pagination } from "react-bootstrap";
import { proveedorService } from "../../Services/api";

const ListaProveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [proveedoresPorPagina] = useState(10);

    useEffect(() => {
        cargarProveedores();
    }, []);

    const cargarProveedores = async () => {
        try {
            setLoading(true);
            const response = await proveedorService.getAll();
            setProveedores(response.data);
            setError(null);
        } catch (error) {
            setError("Error al cargar los proveedores");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const buscarProveedor = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await proveedorService.getAll();
            const proveedoresFiltrados = response.data.filter(proveedor =>
                proveedor.companyName.toLowerCase().includes(filtro.toLowerCase()) ||
                proveedor.email.toLowerCase().includes(filtro.toLowerCase())
            );
            setProveedores(proveedoresFiltrados);
            setError(null);
        } catch (error) {
            setError("Error al buscar los proveedores");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const eliminarProveedor = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este proveedor?")) {
            try {
                await proveedorService.delete(id);
                setProveedores(proveedores.filter(proveedor => proveedor.id !== id));
                setError(null);
                alert("Proveedor eliminado correctamente");
            } catch (error) {
                const errorMessage = error.response?.data || "Error al eliminar el proveedor";
                setError(errorMessage);
                console.error(error);
            }
        }
    }

    // Calcular páginas
    const indexOfLastProveedor = paginaActual * proveedoresPorPagina;
    const indexOfFirstProveedor = indexOfLastProveedor - proveedoresPorPagina;
    const proveedoresActuales = proveedores.slice(indexOfFirstProveedor, indexOfLastProveedor);
    const totalPaginas = Math.ceil(proveedores.length / proveedoresPorPagina);

    const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);

    if (loading) return (
        <Container className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Cargando proveedores...</p>
        </Container>
    );

    return (
        <Container className="container-sm">
            <Row className="mb-4">
                <Col>
                    <h2>Lista de Proveedores</h2>
                </Col>
                <Col className="text-end">
                    <Button as={Link} to="/proveedores/agregar" variant="primary">
                        Crear Proveedor
                    </Button>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={buscarProveedor} className="mb-4">
                <Row>
                    <Col md={8}>
                        <Form.Control
                            type="text"
                            placeholder="Buscar por nombre de empresa o email"
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
                        <Button variant="outline-secondary" className="w-100" onClick={cargarProveedores}>
                            Limpiar
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Empresa</th>
                        <th>Contacto</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Ciudad</th>
                        <th>País</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {proveedoresActuales.map((proveedor) => (
                        <tr key={proveedor.id}>
                            <td>{proveedor.id}</td>
                            <td>{proveedor.companyName}</td>
                            <td>
                                {proveedor.contactName && (
                                    <>
                                        {proveedor.contactName}
                                        {proveedor.contactTitle && ` (${proveedor.contactTitle})`}
                                    </>
                                )}
                            </td>
                            <td>{proveedor.email}</td>
                            <td>{proveedor.phone}</td>
                            <td>{proveedor.city || "N/A"}</td>
                            <td>{proveedor.country || "N/A"}</td>
                            <td>
                                <Button 
                                    as={Link} 
                                    to={`/proveedores/editar/${proveedor.id}`} 
                                    variant="warning" 
                                    size="sm" 
                                    className="me-2"
                                >
                                    Editar
                                </Button>
                                <Button 
                                    variant="danger" 
                                    size="sm" 
                                    onClick={() => eliminarProveedor(proveedor.id)}
                                >
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Paginación */}
            {proveedores.length > 0 && (
                <div className="d-flex justify-content-center">
                    <Pagination>
                        <Pagination.First onClick={() => cambiarPagina(1)} disabled={paginaActual === 1} />
                        <Pagination.Prev onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1} />
                        
                        {[...Array(totalPaginas)].map((_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === paginaActual}
                                onClick={() => cambiarPagina(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        
                        <Pagination.Next onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} />
                        <Pagination.Last onClick={() => cambiarPagina(totalPaginas)} disabled={paginaActual === totalPaginas} />
                    </Pagination>
                </div>
            )}

            {proveedores.length === 0 && !loading && (
                <Alert variant="info" className="text-center">
                    No se encontraron proveedores
                </Alert>
            )}
        </Container>
    );
}

export default ListaProveedores;