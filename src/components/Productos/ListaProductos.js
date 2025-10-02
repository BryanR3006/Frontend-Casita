import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Container, Row, Col, Form, Alert, Spinner, Pagination, Badge } from "react-bootstrap";
import { productoService } from "../../Services/api";

const ListaProductos = () => {
    const [productos, setProductos] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [productosPorPagina] = useState(10);

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            setLoading(true);
            const response = await productoService.getAll();
            setProductos(response.data);
            setError(null);
        } catch (error) {
            setError("Error al cargar los productos");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const buscarProducto = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await productoService.getAll();
            const productosFiltrados = response.data.filter(producto =>
                producto.productName.toLowerCase().includes(filtro.toLowerCase())
            );
            setProductos(productosFiltrados);
            setError(null);
        } catch (error) {
            setError("Error al buscar los productos");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const eliminarProducto = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
            try {
                await productoService.delete(id);
                setProductos(productos.filter(producto => producto.id !== id));
                setError(null);
                alert("Producto eliminado correctamente");
            } catch (error) {
                const errorMessage = error.response?.data || "Error al eliminar el producto";
                setError(errorMessage);
                console.error(error);
            }
        }
    }

    // Calcular páginas
    const indexOfLastProducto = paginaActual * productosPorPagina;
    const indexOfFirstProducto = indexOfLastProducto - productosPorPagina;
    const productosActuales = productos.slice(indexOfFirstProducto, indexOfLastProducto);
    const totalPaginas = Math.ceil(productos.length / productosPorPagina);

    const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);

    if (loading) return (
        <Container className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Cargando productos...</p>
        </Container>
    );

    return (
        <Container className="container-sm">
            <Row className="mb-4">
                <Col>
                    <h2>Lista de Productos</h2>
                </Col>
                <Col className="text-end">
                    <Button as={Link} to="/productos/agregar" variant="primary">
                        Crear Producto
                    </Button>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={buscarProducto} className="mb-4">
                <Row>
                    <Col md={8}>
                        <Form.Control
                            type="text"
                            placeholder="Buscar por nombre de producto"
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
                        <Button variant="outline-secondary" className="w-100" onClick={cargarProductos}>
                            Limpiar
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Proveedor</th>
                        <th>Precio</th>
                        <th>Paquete</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productosActuales.map((producto) => (
                        <tr key={producto.id}>
                            <td>{producto.id}</td>
                            <td>{producto.productName}</td>
                            <td>{producto.supplier?.companyName || "N/A"}</td>
                            <td>${producto.unitPrice?.toFixed(2) || "0.00"}</td>
                            <td>{producto.package || "N/A"}</td>
                            <td>
                                <Badge bg={producto.isDiscontinued ? "danger" : "success"}>
                                    {producto.isDiscontinued ? "Descontinuado" : "Activo"}
                                </Badge>
                            </td>
                            <td>
                                <Button 
                                    as={Link} 
                                    to={`/productos/editar/${producto.id}`} 
                                    variant="warning" 
                                    size="sm" 
                                    className="me-2"
                                >
                                    Editar
                                </Button>
                                <Button 
                                    variant="danger" 
                                    size="sm" 
                                    onClick={() => eliminarProducto(producto.id)}
                                >
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Paginación */}
            {productos.length > 0 && (
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

            {productos.length === 0 && !loading && (
                <Alert variant="info" className="text-center">
                    No se encontraron productos
                </Alert>
            )}
        </Container>
    );
}

export default ListaProductos;