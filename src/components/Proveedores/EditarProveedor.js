import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { proveedorService } from "../../Services/api";

const EditarProveedor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        contactTitle: '',
        city: '',
        country: '',
        phone: '',
        fax: '',
        email: ''
    });

    useEffect(() => {
        const cargarProveedor = async () => {
            try {
                setLoadingData(true);
                const response = await proveedorService.getById(id);
                const proveedor = response.data;
                
                setFormData({
                    companyName: proveedor.companyName || '',
                    contactName: proveedor.contactName || '',
                    contactTitle: proveedor.contactTitle || '',
                    city: proveedor.city || '',
                    country: proveedor.country || '',
                    phone: proveedor.phone || '',
                    fax: proveedor.fax || '',
                    email: proveedor.email || ''
                });
            } catch (error) {
                console.error("Error al cargar proveedor:", error);
                setError("Error al cargar los datos del proveedor");
            } finally {
                setLoadingData(false);
            }
        };

        cargarProveedor();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // ✅ CORRECCIÓN: Incluir el id en el payload
            const payload = {
                ...formData,
                id: parseInt(id) // ← ESTA ES LA LÍNEA CLAVE QUE FALTABA
            };
            
            console.log('📤 Enviando datos:', JSON.stringify(payload, null, 2));
            
            await proveedorService.update(id, payload);
            alert("Proveedor actualizado exitosamente!");
            navigate("/proveedores/lista");
        } catch (error) {
            console.error("❌ Error completo:", error);
            console.error("📊 Response data:", error.response?.data);
            console.error("🔢 Status code:", error.response?.status);
            
            if (error.response?.data) {
                if (error.response.data.errors) {
                    const errors = error.response.data.errors;
                    let errorMessage = "Errores de validación:\n\n";
                    
                    const fieldNames = {
                        'companyName': 'Nombre de la Empresa',
                        'contactName': 'Nombre de Contacto',
                        'contactTitle': 'Cargo del Contacto', 
                        'phone': 'Teléfono',
                        'email': 'Email',
                        'city': 'Ciudad',
                        'country': 'País',
                        'fax': 'Fax'
                    };
                    
                    for (const [field, messages] of Object.entries(errors)) {
                        const fieldName = fieldNames[field] || field;
                        errorMessage += `• ${fieldName}: ${messages.join(', ')}\n`;
                    }
                    
                    setError(errorMessage);
                } 
                else if (typeof error.response.data === 'string') {
                    setError(error.response.data);
                }
                else if (error.response.data.title) {
                    setError(error.response.data.title);
                }
                else {
                    setError(JSON.stringify(error.response.data, null, 2));
                }
            } 
            else if (error.request) {
                setError("Error de conexión con el servidor");
            }
            else {
                setError(error.message || "Error desconocido al actualizar el proveedor");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) return <div>Cargando datos del proveedor...</div>;

    return (
        <Container className="container-sm">
            <Row className="mb-4">
                <Col>
                    <h1>Editar Proveedor</h1>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger">
                    <div style={{ whiteSpace: 'pre-line', fontFamily: 'monospace', fontSize: '14px' }}>
                        {error}
                    </div>
                </Alert>
            )}

            <Row>
                <Col md={8}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre de la Empresa *</Form.Label>
                            <Form.Control
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                                isInvalid={error && error.includes('Nombre de la Empresa')}
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre de Contacto</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contactName"
                                        value={formData.contactName}
                                        onChange={handleChange}
                                        isInvalid={error && error.includes('Nombre de Contacto')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cargo del Contacto</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contactTitle"
                                        value={formData.contactTitle}
                                        onChange={handleChange}
                                        isInvalid={error && error.includes('Cargo del Contacto')}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ciudad</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        isInvalid={error && error.includes('Ciudad')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>País</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        isInvalid={error && error.includes('País')}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono *</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                isInvalid={error && error.includes('Teléfono')}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Fax</Form.Label>
                            <Form.Control
                                type="text"
                                name="fax"
                                value={formData.fax}
                                onChange={handleChange}
                                isInvalid={error && error.includes('Fax')}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email *</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                isInvalid={error && error.includes('Email')}
                            />
                        </Form.Group>

                        <div className="d-grid gap-2 d-md-flex">
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? "Actualizando..." : "Actualizar Proveedor"}
                            </Button>
                            <Button variant="secondary" onClick={() => navigate("/proveedores/lista")}>
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default EditarProveedor;