import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert, Spinner, Table } from "react-bootstrap";
import { ordenService, orderItemService, clienteService } from "../../Services/api";

const EliminarOrden = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);
    const [ordenInfo, setOrdenInfo] = useState(null);
    const [clienteInfo, setClienteInfo] = useState(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoadingData(true);
                
                const [ordenRes, itemsRes] = await Promise.all([
                    ordenService.getById(id),
                    ordenService.getOrderItems(id)
                ]);

                const orden = ordenRes.data;
                setOrdenInfo(orden);

                // Cargar información del cliente
                try {
                    const clienteRes = await clienteService.getById(orden.customerId);
                    setClienteInfo(clienteRes.data);
                } catch (error) {
                    console.warn("No se pudo cargar información del cliente");
                }

                // Cargar items de la orden
                setItems(itemsRes.data);

            } catch (error) {
                console.error("Error al cargar orden:", error);
                setError("No se pudo cargar la información de la orden");
            } finally {
                setLoadingData(false);
            }
        };

        cargarDatos();
    }, [id]);

    const handleEliminar = async () => {
        if (!window.confirm('¿ESTÁS ABSOLUTAMENTE SEGURO?\n\nEsta acción eliminará permanentemente la orden y todos sus items. No se puede deshacer.')) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Primero eliminar los items de la orden
            for (const item of items) {
                try {
                    await orderItemService.delete(item.id);
                } catch (error) {
                    console.warn("Error al eliminar item:", error);
                }
            }

            // Luego eliminar la orden principal
            await ordenService.delete(id);
            
            alert("✅ Orden eliminada exitosamente");
            navigate("/ordenes/lista");
        } catch (error) {
            console.error("❌ Error al eliminar:", error);
            
            if (error.response?.status === 404) {
                setError("La orden no existe o ya fue eliminada");
            } else if (error.response?.data) {
                setError(error.response.data.title || "Error al eliminar la orden");
            } else if (error.request) {
                setError("Error de conexión con el servidor");
            } else {
                setError(error.message || "Error desconocido al eliminar la orden");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = () => {
        navigate("/ordenes/lista");
    };

    const calcularTotalOrden = () => {
        return items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
    };

    if (loadingData) {
        return (
            <Container className="container-sm mt-4">
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Cargando información de la orden...</p>
                </div>
            </Container>
        );
    }

    if (error && !ordenInfo) {
        return (
            <Container className="container-sm mt-4">
                <Alert variant="danger">
                    <h5>Error</h5>
                    <p>{error}</p>
                    <Button variant="secondary" onClick={() => navigate("/ordenes/lista")}>
                        Volver a la lista
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="container-sm mt-4">
            <Row className="justify-content-center">
                <Col md={10}>
                    <Card className="border-danger">
                        <Card.Header className="bg-danger text-white">
                            <h4 className="mb-0">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                Eliminar Orden
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
                                    Estás a punto de eliminar permanentemente una orden. Esta acción:
                                </p>
                                <ul className="mb-2">
                                    <li>No se puede deshacer</li>
                                    <li>Eliminará la orden y todos sus items</li>
                                    <li>Afectará los registros de ventas</li>
                                </ul>
                            </Alert>

                            {ordenInfo && (
                                <div className="mb-4">
                                    <h6>Información de la orden a eliminar:</h6>
                                    <div className="border rounded p-3 bg-light mb-3">
                                        <p><strong>Número de Orden:</strong> {ordenInfo.orderNumber}</p>
                                        <p><strong>Fecha:</strong> {new Date(ordenInfo.orderDate).toLocaleDateString()}</p>
                                        <p><strong>Total:</strong> ${ordenInfo.totalAmount?.toFixed(2) || '0.00'}</p>
                                        {clienteInfo && (
                                            <p><strong>Cliente:</strong> {clienteInfo.firstName} {clienteInfo.lastName}</p>
                                        )}
                                    </div>

                                    {items.length > 0 && (
                                        <>
                                            <h6>Items de la orden:</h6>
                                            <Table striped size="sm">
                                                <thead>
                                                    <tr>
                                                                                                                <th>Producto</th>
                                                        <th>Cantidad</th>
                                                        <th>Precio Unitario</th>
                                                        <th>Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {items.map((item) => (
                                                        <tr key={item.id}>
                                                            <td>{item.productName}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>${item.unitPrice.toFixed(2)}</td>
                                                            <td>${(item.unitPrice * item.quantity).toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td colSpan={3} className="text-end"><strong>Total</strong></td>
                                                        <td><strong>${calcularTotalOrden().toFixed(2)}</strong></td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="d-flex justify-content-end">
                                <Button 
                                    variant="danger" 
                                    className="me-2" 
                                    onClick={handleEliminar} 
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner 
                                                as="span" 
                                                animation="border" 
                                                size="sm" 
                                                role="status" 
                                                aria-hidden="true" 
                                                className="me-2"
                                            />
                                            Eliminando...
                                        </>
                                    ) : (
                                        "Eliminar Orden"
                                    )}
                                </Button>
                                <Button variant="secondary" onClick={handleCancelar}>
                                    Cancelar
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EliminarOrden;
