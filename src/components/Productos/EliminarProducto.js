import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from "react-bootstrap";
import { productoService, proveedorService } from "../../Services/api";

const EliminarProducto = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);
    const [productoInfo, setProductoInfo] = useState(null);
    const [proveedorInfo, setProveedorInfo] = useState(null);

    // Cargar información del producto y proveedor
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoadingData(true);
                
                // Cargar producto
                const productoResponse = await productoService.getById(id);
                const producto = productoResponse.data;
                setProductoInfo(producto);
                
                // Cargar información del proveedor si existe
                if (producto.supplierId) {
                    try {
                        const proveedorResponse = await proveedorService.getById(producto.supplierId);
                        setProveedorInfo(proveedorResponse.data);
                    } catch (error) {
                        console.warn("No se pudo cargar información del proveedor:", error);
                    }
                }
                
            } catch (error) {
                console.error("Error al cargar producto:", error);
                setError("No se pudo cargar la información del producto");
            } finally {
                setLoadingData(false);
            }
        };

        cargarDatos();
    }, [id]);

    const handleEliminar = async () => {
        if (!window.confirm('¿ESTÁS ABSOLUTAMENTE SEGURO?\n\nEsta acción no se puede deshacer. El producto será eliminado permanentemente.')) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await productoService.delete(id);
            alert("✅ Producto eliminado exitosamente");
            navigate("/productos/lista");
        } catch (error) {
            console.error("❌ Error al eliminar:", error);
            
            if (error.response?.status === 404) {
                setError("El producto no existe o ya fue eliminado");
            } else if (error.response?.data) {
                setError(error.response.data.title || "Error al eliminar el producto");
            } else if (error.request) {
                setError("Error de conexión con el servidor");
            } else {
                setError(error.message || "Error desconocido al eliminar el producto");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = () => {
        navigate("/productos/lista");
    };

    if (loadingData) {
        return (
            <Container className="container-sm mt-4">
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Cargando información del producto...</p>
                </div>
            </Container>
        );
    }

    if (error && !productoInfo) {
        return (
            <Container className="container-sm mt-4">
                <Alert variant="danger">
                    <h5>Error</h5>
                    <p>{error}</p>
                    <Button variant="secondary" onClick={() => navigate("/productos/lista")}>
                        Volver a la lista
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="container-sm mt-4">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="border-danger">
                        <Card.Header className="bg-danger text-white">
                            <h4 className="mb-0">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                Eliminar Producto
                            </h4>
                        </Card.Header>
                        
                        <Card.Body>
                            {error && (
                                <Alert variant="danger" className="mb-3">
                                    <i className="bi bi-x-circle me-2"></i>
                                    {error}
                                </Alert>
                            )}

                            <Alert variant="warning" className="mb-4">
                                <h5 className="alert-heading">
                                    <i className="bi bi-exclamation-octagon me-2"></i>
                                    ¡ADVERTENCIA!
                                </h5>
                                <p className="mb-2">
                                    Estás a punto de eliminar permanentemente un producto. Esta acción:
                                </p>
                                <ul className="mb-2">
                                    <li>No se puede deshacer</li>
                                    <li>Eliminará todos los datos del producto</li>
                                    <li>Puede afectar órdenes y registros relacionados</li>
                                </ul>
                            </Alert>

                            {productoInfo ? (
                                <div className="mb-4">
                                    <h6>Información del producto a eliminar:</h6>
                                    <div className="border rounded p-3 bg-light">
                                        <p><strong>Nombre:</strong> {productoInfo.productName}</p>
                                        <p><strong>Precio:</strong> ${parseFloat(productoInfo.unitPrice || 0).toFixed(2)}</p>
                                        <p><strong>Embalaje:</strong> {productoInfo.package || 'No especificado'}</p>
                                        
                                        {proveedorInfo && (
                                            <p><strong>Proveedor:</strong> {proveedorInfo.companyName}</p>
                                        )}
                                        
                                        <p>
                                            <strong>Estado:</strong>{" "}
                                            <Badge 
                                                bg={productoInfo.isDiscontinued ? "secondary" : "success"}
                                            >
                                                {productoInfo.isDiscontinued ? "Descontinuado" : "Activo"}
                                            </Badge>
                                        </p>
                                        
                                        {productoInfo.supplierId && !proveedorInfo && (
                                            <p><strong>ID Proveedor:</strong> {productoInfo.supplierId}</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center mb-4">
                                    <Spinner animation="border" variant="secondary" />
                                    <p className="mt-2">Cargando información del producto...</p>
                                </div>
                            )}

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={handleCancelar}
                                    disabled={loading}
                                >
                                    <i className="bi bi-x-circle me-2"></i>
                                    Cancelar
                                </Button>
                                
                                <Button 
                                    variant="danger" 
                                    onClick={handleEliminar}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Eliminando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-trash me-2"></i>
                                            Sí, Eliminar Permanentemente
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EliminarProducto;