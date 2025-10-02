import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert, Card, Table } from "react-bootstrap";
import { ordenService, orderItemService, clienteService, productoService } from "../../Services/api";

const EditarOrden = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);

    const [ordenData, setOrdenData] = useState({
        orderNumber: "",
        orderDate: "",
        customerId: "",
        totalAmount: 0
    });

    const [items, setItems] = useState([]);
    const [currentItem, setCurrentItem] = useState({
        productId: "",
        quantity: 1,
        unitPrice: 0
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoadingData(true);
                
                const [clientesRes, productosRes, ordenRes, itemsRes] = await Promise.all([
                    clienteService.getAll(),
                    productoService.getAll(),
                    ordenService.getById(id),
                    ordenService.getOrderItems(id)
                ]);

                setClientes(clientesRes.data);
                setProductos(productosRes.data);
                
                const orden = ordenRes.data;
                setOrdenData({
                    orderNumber: orden.orderNumber,
                    orderDate: orden.orderDate.split('T')[0],
                    customerId: orden.customerId,
                    totalAmount: orden.totalAmount
                });

                // Cargar items de la orden
                const itemsData = itemsRes.data.map(item => ({
                    id: item.id,
                    productId: item.productId,
                    productName: item.product?.productName || 'Producto no disponible',
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    total: item.unitPrice * item.quantity
                }));

                setItems(itemsData);

            } catch (error) {
                console.error("Error al cargar datos:", error);
                setError("Error al cargar la información de la orden");
            } finally {
                setLoadingData(false);
            }
        };

        cargarDatos();
    }, [id]);

    const handleOrdenChange = (e) => {
        setOrdenData({
            ...ordenData,
            [e.target.name]: e.target.value
        });
    };

    const handleItemChange = (e) => {
        const { name, value } = e.target;
        setCurrentItem({
            ...currentItem,
            [name]: name === 'quantity' ? parseInt(value) : value
        });

        if (name === 'productId') {
            const producto = productos.find(p => p.id === parseInt(value));
            if (producto) {
                setCurrentItem(prev => ({
                    ...prev,
                    unitPrice: producto.unitPrice,
                    productId: value
                }));
            }
        }
    };

    const agregarItem = () => {
        if (!currentItem.productId || currentItem.quantity <= 0) {
            setError("Selecciona un producto y cantidad válida");
            return;
        }

        const producto = productos.find(p => p.id === parseInt(currentItem.productId));
        const total = currentItem.unitPrice * currentItem.quantity;

        const nuevoItem = {
            productId: parseInt(currentItem.productId),
            productName: producto.productName,
            quantity: currentItem.quantity,
            unitPrice: currentItem.unitPrice,
            total: total
        };

        setItems([...items, nuevoItem]);
        
        setOrdenData(prev => ({
            ...prev,
            totalAmount: prev.totalAmount + total
        }));

        setCurrentItem({
            productId: "",
            quantity: 1,
            unitPrice: 0
        });
    };

    const removerItem = (index) => {
        const item = items[index];
        setItems(items.filter((_, i) => i !== index));
        setOrdenData(prev => ({
            ...prev,
            totalAmount: prev.totalAmount - item.total
        }));
    };

    const calcularIVA = () => {
        return ordenData.totalAmount * 0.16;
    };

    const calcularTotal = () => {
        return ordenData.totalAmount + calcularIVA();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (items.length === 0) {
            setError("Debe agregar al menos un producto a la orden");
            setLoading(false);
            return;
        }

        try {
            // 1. Actualizar la orden principal
            await ordenService.update(id, {
                orderNumber: ordenData.orderNumber,
                orderDate: ordenData.orderDate,
                customerId: parseInt(ordenData.customerId),
                totalAmount: calcularTotal()
            });

            // 2. Actualizar items (primero eliminar todos y luego crear nuevos)
            // Esto es una simplificación - en una app real deberías manejar updates individuales
            for (const item of items) {
                if (item.id) {
                    await orderItemService.update(item.id, {
                        quantity: item.quantity,
                        unitPrice: item.unitPrice
                    });
                } else {
                    await orderItemService.create({
                        orderId: parseInt(id),
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice
                    });
                }
            }

            alert("✅ Orden actualizada exitosamente");
            navigate("/ordenes/lista");
        } catch (error) {
            console.error("❌ Error al actualizar orden:", error);
            setError(error.response?.data?.title || "Error al actualizar la orden");
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <Container className="container-sm mt-4">
                <div className="text-center">
                    <Alert variant="info">Cargando información de la orden...</Alert>
                </div>
            </Container>
        );
    }

    return (
        <Container className="container-fluid">
            <Row className="mb-4">
                <Col>
                    <h1>Editar Orden #{ordenData.orderNumber}</h1>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Card className="mb-4">
                            <Card.Header>Información de la Orden</Card.Header>
                            <Card.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label>Número de Orden</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="orderNumber"
                                        value={ordenData.orderNumber}
                                        onChange={handleOrdenChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="orderDate"
                                        value={ordenData.orderDate}
                                        onChange={handleOrdenChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Cliente</Form.Label>
                                    <Form.Select
                                        name="customerId"
                                        value={ordenData.customerId}
                                        onChange={handleOrdenChange}
                                        required
                                    >
                                        <option value="">Seleccionar cliente</option>
                                        {clientes.map(cliente => (
                                            <option key={cliente.id} value={cliente.id}>
                                                {cliente.firstName} {cliente.lastName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="mb-4">
                            <Card.Header>Agregar Productos</Card.Header>
                            <Card.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label>Producto</Form.Label>
                                    <Form.Select
                                        name="productId"
                                        value={currentItem.productId}
                                        onChange={handleItemChange}
                                    >
                                        <option value="">Seleccionar producto</option>
                                        {productos.map(producto => (
                                            <option key={producto.id} value={producto.id}>
                                                {producto.productName} - ${producto.unitPrice}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Cantidad</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="quantity"
                                                value={currentItem.quantity}
                                                onChange={handleItemChange}
                                                min="1"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Precio Unitario</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="unitPrice"
                                                value={currentItem.unitPrice}
                                                onChange={handleItemChange}
                                                step="0.01"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button 
                                    variant="primary" 
                                    onClick={agregarItem}
                                    disabled={!currentItem.productId}
                                >
                                    Agregar Producto
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {items.length > 0 && (
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">Detalle de la Orden</h5>
                        </Card.Header>
                        <Card.Body>
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio Unitario</th>
                                        <th>Total</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.productName}</td>
                                            <td>{item.quantity}</td>
                                            <td>${item.unitPrice.toFixed(2)}</td>
                                            <td>${item.total.toFixed(2)}</td>
                                            <td>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => removerItem(index)}
                                                >
                                                    ✕
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
                                        <td><strong>${ordenData.totalAmount.toFixed(2)}</strong></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3" className="text-end">IVA (16%):</td>
                                        <td>${calcularIVA().toFixed(2)}</td>
                                        <td></td>
                                    </tr>
                                    <tr className="table-primary">
                                        <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                                        <td><strong>${calcularTotal().toFixed(2)}</strong></td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </Table>
                        </Card.Body>
                    </Card>
                )}

                <div className="d-grid gap-2 d-md-flex">
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? "Actualizando..." : "Actualizar Orden"}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate("/ordenes/lista")}>
                        Cancelar
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default EditarOrden;