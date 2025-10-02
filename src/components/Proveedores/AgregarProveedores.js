import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { proveedorService } from "../../Services/api";

const AgregarProveedor = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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
            await proveedorService.create(formData);
            alert("Proveedor creado exitosamente!");
            navigate("/proveedores/lista");
        } catch (error) {
            console.error("Error completo:", error.response?.data);
            
            // ✅ CORREGIDO: Manejo adecuado del error
            if (error.response?.data?.title) {
                setError(error.response.data.title);
            } else if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors)
                    .flat()
                    .join(', ');
                setError(`Errores de validación: ${errorMessages}`);
            } else if (typeof error.response?.data === 'string') {
                setError(error.response.data);
            } else if (error.response?.data) {
                setError("Error al crear el proveedor. Verifique los datos.");
            } else {
                setError(error.message || "Error al crear el proveedor");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="container-sm">
            <Row className="mb-4">
                <Col>
                    <h1>Agregar Proveedor</h1>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger">
                    {/* ✅ Ahora muestra solo el mensaje, no el objeto completo */}
                    {error}
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
                                placeholder="Ingrese el nombre de la empresa"
                                maxLength={40}
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
                                        placeholder="Nombre del contacto"
                                        maxLength={50}
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
                                        placeholder="Cargo del contacto"
                                        maxLength={40}
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
                                        placeholder="Ciudad"
                                        maxLength={40}
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
                                        placeholder="País"
                                        maxLength={40}
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
                                placeholder="(+57) 3144427602"
                                maxLength={30}
                            />
                            <Form.Text className="text-muted">
                                Formato: (+57) 3144427602
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Fax</Form.Label>
                            <Form.Control
                                type="text"
                                name="fax"
                                value={formData.fax}
                                onChange={handleChange}
                                placeholder="Número de fax"
                                maxLength={30}
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
                                placeholder="proveedor@empresa.com"
                                maxLength={100}
                            />
                        </Form.Group>

                        <div className="d-grid gap-2 d-md-flex">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={loading}
                            >
                                {loading ? "Creando..." : "Guardar Proveedor"}
                            </Button>
                            <Button 
                                variant="secondary" 
                                onClick={() => navigate("/proveedores/lista")}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default AgregarProveedor;