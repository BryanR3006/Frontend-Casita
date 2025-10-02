import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert, Spinner } from "react-bootstrap";
import { proveedorService } from "../../Services/api";

const EliminarProveedor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);
    const [proveedorInfo, setProveedorInfo] = useState(null);
    const [tieneProductos] = useState(false); // ✅ Corregido: removido setTieneProductos no utilizado

    // Cargar información del proveedor
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoadingData(true);
                
                // Cargar proveedor
                const proveedorResponse = await proveedorService.getById(id);
                const proveedor = proveedorResponse.data;
                setProveedorInfo(proveedor);
                
            } catch (error) {
                console.error("Error al cargar proveedor:", error);
                setError("No se pudo cargar la información del proveedor");
            } finally {
                setLoadingData(false);
            }
        };

        cargarDatos();
    }, [id]);

    const handleEliminar = async () => {
        let mensajeAdvertencia = '¿ESTÁS ABSOLUTAMENTE SEGURO?\n\nEsta acción no se puede deshacer. El proveedor será eliminado permanentemente.';
        
        if (tieneProductos) {
            mensajeAdvertencia += '\n\n⚠️ ADVERTENCIA: Este proveedor tiene productos asociados. La eliminación podría afectar esos productos.';
        }

        if (!window.confirm(mensajeAdvertencia)) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await proveedorService.delete(id);
            alert("✅ Proveedor eliminado exitosamente");
            navigate("/proveedores/lista");
        } catch (error) {
            console.error("❌ Error al eliminar:", error);
            
            if (error.response?.status === 404) {
                setError("El proveedor no existe o ya fue eliminado");
            } else if (error.response?.status === 409) {
                setError("No se puede eliminar el proveedor porque tiene productos asociados");
            } else if (error.response?.data) {
                setError(error.response.data.title || "Error al eliminar el proveedor");
            } else if (error.request) {
                setError("Error de conexión con el servidor");
            } else {
                setError(error.message || "Error desconocido al eliminar el proveedor");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = () => {
        navigate("/proveedores/lista");
    };

    if (loadingData) {
        return (
            <Container className="container-sm mt-4">
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Cargando información del proveedor...</p>
                </div>
            </Container>
        );
    }

    if (error && !proveedorInfo) {
        return (
            <Container className="container-sm mt-4">
                <Alert variant="danger">
                    <h5>Error</h5>
                    <p>{error}</p>
                    <Button variant="secondary" onClick={() => navigate("/proveedores/lista")}>
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
                                Eliminar Proveedor
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
                                    ¡ADVERTENCIA CRÍTICA!
                                </h5>
                                <p className="mb-2">
                                    Estás a punto de eliminar permanentemente un proveedor. Esta acción:
                                </p>
                                <ul className="mb-2">
                                    <li>No se puede deshacer</li>
                                    <li>Eliminará todos los datos del proveedor</li>
                                    <li>Puede afectar productos y órdenes relacionadas</li>
                                    {tieneProductos && (
                                        <li className="text-danger">
                                            <strong>Tiene productos asociados - ¡EXTREMA PRECAUCIÓN!</strong>
                                        </li>
                                    )}
                                </ul>
                            </Alert>

                            {proveedorInfo ? (
                                <div className="mb-4">
                                    <h6>Información del proveedor a eliminar:</h6>
                                    <div className="border rounded p-3 bg-light">
                                        <p><strong>Empresa:</strong> {proveedorInfo.companyName}</p>
                                        <p><strong>Contacto:</strong> {proveedorInfo.contactName || 'No especificado'}</p>
                                        <p><strong>Cargo:</strong> {proveedorInfo.contactTitle || 'No especificado'}</p>
                                        <p><strong>Email:</strong> {proveedorInfo.email || 'No especificado'}</p>
                                        <p><strong>Teléfono:</strong> {proveedorInfo.phone || 'No especificado'}</p>
                                        <p><strong>Ubicación:</strong> {proveedorInfo.city || 'N/A'}, {proveedorInfo.country || 'N/A'}</p>
                                        <p><strong>Fax:</strong> {proveedorInfo.fax || 'No especificado'}</p>
                                        
                                        {tieneProductos && (
                                            <Alert variant="danger" className="mt-3 mb-0">
                                                <i className="bi bi-exclamation-triangle me-2"></i>
                                                <strong>Este proveedor tiene productos asociados</strong>
                                            </Alert>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center mb-4">
                                    <Spinner animation="border" variant="secondary" />
                                    <p className="mt-2">Cargando información del proveedor...</p>
                                </div>
                            )}

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={handleCancelar}
                                    disabled={loading}
                                    className="me-2"
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
                        
                        {tieneProductos && (
                            <Card.Footer className="bg-warning text-dark">
                                <small>
                                    <i className="bi bi-info-circle me-2"></i>
                                    <strong>Advertencia:</strong> La eliminación de este proveedor puede afectar productos existentes en el sistema.
                                </small>
                            </Card.Footer>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EliminarProveedor;