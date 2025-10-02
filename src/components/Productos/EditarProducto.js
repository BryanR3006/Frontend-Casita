import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { productoService, proveedorService } from "../../Services/api";

const EditarProducto = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
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
        const cargarDatos = async () => {
            try {
                setLoadingData(true);
                
                // Cargar proveedores
                const proveedoresResponse = await proveedorService.getAll();
                setProveedores(proveedoresResponse.data);
                
                // Cargar producto
                const productoResponse = await productoService.getById(id);
                const producto = productoResponse.data;
                
                setFormData({
                    productName: producto.productName || '',
                    supplierId: producto.supplierId || '',
                    unitPrice: producto.unitPrice || '',
                    package: producto.package || '',
                    isDiscontinued: producto.isDiscontinued || false
                });
            } catch (error) {
                console.error("Error al cargar datos:", error);
                setError("Error al cargar los datos");
            } finally {
                setLoadingData(false);
            }
        };

        cargarDatos();
    }, [id]); 

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
            // ✅ CORRECCIÓN: Incluir el id en el payload
            const dataToSend = {
                ...formData,
                id: parseInt(id), // ← ESTA ES LA LÍNEA CLAVE QUE FALTABA
                supplierId: parseInt(formData.supplierId),
                unitPrice: parseFloat(formData.unitPrice)
            };
            
            console.log('📤 Enviando datos:', JSON.stringify(dataToSend, null, 2));
            
            await productoService.update(id, dataToSend);
            alert("Producto actualizado exitosamente!");
            navigate("/productos/lista");
        } catch (error) {
            console.error("❌ Error completo:", error);
            console.error("📊 Response data:", error.response?.data);
            console.error("🔢 Status code:", error.response?.status);
            
            if (error.response?.data) {
                if (error.response.data.errors) {
                    const errors = error.response.data.errors;
                    let errorMessage = "Errores de validación:\n\n";
                    
                    const fieldNames = {
                        'productName': 'Nombre del Producto',
                        'supplierId': 'Proveedor', 
                        'unitPrice': 'Precio Unitario',
                        'package': 'Paquete/Embalaje'
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
                setError(error.message || "Error desconocido al actualizar el producto");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) return <div>Cargando datos...</div>;

    return (
        <Container className="container-sm">
            <Row className="mb-4">
                <Col>
                    <h1>Editar Producto</h1>
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
                            <Form.Label>Nombre del Producto *</Form.Label>
                            <Form.Control
                                type="text"
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                required
                                isInvalid={error && error.includes('Nombre del Producto')}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Proveedor *</Form.Label>
                            <Form.Select
                                name="supplierId"
                                value={formData.supplierId}
                                onChange={handleChange}
                                required
                                isInvalid={error && error.includes('Proveedor')}
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
                                step="0.01"
                                min="0"
                                isInvalid={error && error.includes('Precio Unitario')}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Paquete/Embalaje</Form.Label>
                            <Form.Control
                                type="text"
                                name="package"
                                value={formData.package}
                                onChange={handleChange}
                                isInvalid={error && error.includes('Paquete/Embalaje')}
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
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? "Actualizando..." : "Actualizar Producto"}
                            </Button>
                            <Button variant="secondary" onClick={() => navigate("/productos/lista")}>
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default EditarProducto;