import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { productoService, proveedorService } from "../../Services/api";

const AgregarProducto = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [proveedores, setProveedores] = useState([]);
    
    const [formData, setFormData] = useState({
        productName: '',
        supplierId: '',
        unitPrice: '',
        package: '',
        isDiscontinued: false
    });

    useEffect(() => {
        cargarProveedores();
    }, []);

    const cargarProveedores = async () => {
        try {
            const response = await proveedorService.getAll();
            setProveedores(response.data);
        } catch (error) {
            console.error("Error al cargar proveedores:", error);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const dataToSend = {
                ...formData,
                supplierId: parseInt(formData.supplierId),
                unitPrice: parseFloat(formData.unitPrice)
            };
            
            await productoService.create(dataToSend);
            alert("Producto creado exitosamente!");
            navigate("/productos/lista");
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
            } else {
                setError(error.message || "Error al crear el producto");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="container-sm">
            <Row className="mb-4">
                <Col>
                    <h1>Agregar Producto</h1>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger">
                    {/* ✅ Ahora muestra solo el mensaje, no el objeto */}
                    {error}
                </Alert>
            )}

            <Row>
                <Col md={8}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre del Producto *</Form.Label>
                            <Form.Control
                                type="text"
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                required
                                placeholder="Ingrese el nombre del producto"
                                maxLength={50}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Proveedor *</Form.Label>
                            <Form.Select
                                name="supplierId"
                                value={formData.supplierId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione un proveedor</option>
                                {proveedores.map(proveedor => (
                                    <option key={proveedor.id} value={proveedor.id}>
                                        {proveedor.companyName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Precio Unitario *</Form.Label>
                            <Form.Control
                                type="number"
                                name="unitPrice"
                                value={formData.unitPrice}
                                onChange={handleChange}
                                required
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Paquete/Embalaje</Form.Label>
                            <Form.Control
                                type="text"
                                name="package"
                                value={formData.package}
                                onChange={handleChange}
                                placeholder="Descripción del empaque"
                                maxLength={30}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                name="isDiscontinued"
                                label="Producto descontinuado"
                                checked={formData.isDiscontinued}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <div className="d-grid gap-2 d-md-flex">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={loading}
                            >
                                {loading ? "Creando..." : "Guardar Producto"}
                            </Button>
                            <Button 
                                variant="secondary" 
                                onClick={() => navigate("/productos/lista")}
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

export default AgregarProducto;