import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert, Spinner } from "react-bootstrap";
import { clienteService } from "../../Services/api";

const EliminarCliente = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clienteInfo, setClienteInfo] = useState(null);

    // Cargar información del cliente para confirmación
    React.useEffect(() => {
        const cargarCliente = async () => {
            try {
                const response = await clienteService.getById(id);
                setClienteInfo(response.data);
            } catch (error) {
                console.error("Error al cargar cliente:", error);
                setError("No se pudo cargar la información del cliente");
            }
        };

        cargarCliente();
    }, [id]);

    const handleEliminar = async () => {
        if (!window.confirm('¿ESTÁS ABSOLUTAMENTE SEGURO?\n\nEsta acción no se puede deshacer. El cliente será eliminado permanentemente.')) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await clienteService.delete(id);
            alert("✅ Cliente eliminado exitosamente");
            navigate("/clientes/lista");
        } catch (error) {
            console.error("❌ Error al eliminar:", error);
            
            if (error.response?.status === 404) {
                setError("El cliente no existe o ya fue eliminado");
            } else if (error.response?.data) {
                setError(error.response.data.title || "Error al eliminar el cliente");
            } else if (error.request) {
                setError("Error de conexión con el servidor");
            } else {
                setError(error.message || "Error desconocido al eliminar el cliente");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = () => {
        navigate("/clientes/lista");
    };

    if (error && !clienteInfo) {
        return (
            <Container className="container-sm mt-4">
                <Alert variant="danger">
                    <h5>Error</h5>
                    <p>{error}</p>
                    <Button variant="secondary" onClick={() => navigate("/clientes/lista")}>
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
                                Eliminar Cliente
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
                                    Estás a punto de eliminar permanentemente un cliente. Esta acción:
                                </p>
                                <ul className="mb-2">
                                    <li>No se puede deshacer</li>
                                    <li>Eliminará todos los datos del cliente</li>
                                    <li>Puede afectar órdenes relacionadas</li>
                                </ul>
                            </Alert>

                            {clienteInfo ? (
                                <div className="mb-4">
                                    <h6>Información del cliente a eliminar:</h6>
                                    <div className="border rounded p-3 bg-light">
                                        <p><strong>Nombre:</strong> {clienteInfo.firstName} {clienteInfo.lastName}</p>
                                        <p><strong>Email:</strong> {clienteInfo.email}</p>
                                        <p><strong>Teléfono:</strong> {clienteInfo.phone}</p>
                                        <p><strong>Ubicación:</strong> {clienteInfo.city}, {clienteInfo.country}</p>
                                        {clienteInfo.dateOfBirth && (
                                            <p><strong>Fecha Nac.:</strong> {new Date(clienteInfo.dateOfBirth).toLocaleDateString()}</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center mb-4">
                                    <Spinner animation="border" variant="secondary" />
                                    <p className="mt-2">Cargando información del cliente...</p>
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

export default EliminarCliente;