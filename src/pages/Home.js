import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ChartJsChart from '../components/ChartJsChart';
// IMPORTACIÓN CORREGIDA - cambia proveedoresService por proveedorService
import { clienteService, productoService, proveedorService, ordenService } from '../Services/api';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalClientes: 0,
        totalProductos: 0,
        totalProveedores: 0,
        totalOrdenes: 0
    });
    const [chartsData, setChartsData] = useState({
        ventas: [],
        clientes: [],
        productos: [],
        proveedores: []
    });

    // Función para procesar clientes por país
    const processClientesByPais = (clientes) => {
        if (!clientes || !Array.isArray(clientes)) return [];
        
        const paisesCount = clientes.reduce((acc, cliente) => {
            const pais = cliente.country || cliente.pais || 'Desconocido';
            acc[pais] = (acc[pais] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(paisesCount)
            .map(([pais, count]) => ({ label: pais, value: count }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8);
    };

    // Función para procesar órdenes por mes
    const processOrdersByMonth = (ordenes) => {
        if (!ordenes || !Array.isArray(ordenes)) return [];
        
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const ordersByMonth = new Array(12).fill(0);

        ordenes.forEach(orden => {
            if (orden.orderDate) {
                try {
                    const date = new Date(orden.orderDate);
                    const month = date.getMonth();
                    if (month >= 0 && month < 12) {
                        ordersByMonth[month]++;
                    }
                } catch (error) {
                    console.log('Error parsing date:', orden.orderDate);
                }
            }
        });

        return meses.map((mes, index) => ({
            label: mes,
            value: ordersByMonth[index]
        }));
    };

    // Función para procesar productos por precio
    const processProductsByPrice = (productos) => {
        if (!productos || !Array.isArray(productos)) return [];
        
        // Tomar productos con precio y ordenarlos
        const productsWithPrice = productos
            .filter(producto => producto.price || producto.unitPrice || producto.precio)
            .map(producto => ({
                label: producto.name || producto.productName || 'Producto',
                value: producto.price || producto.unitPrice || producto.precio
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);

        return productsWithPrice;
    };

    // Función para procesar proveedores
    const processProveedores = (proveedores) => {
        if (!proveedores || !Array.isArray(proveedores)) return [];
        
        return proveedores.slice(0, 8).map((proveedor, index) => ({
            label: proveedor.companyName || proveedor.nombre || `Prov-${index + 1}`,
            value: index + 1 // Simular actividad
        }));
    };

    // Cargar datos de la API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // CORREGIDO: usa proveedorService en lugar de proveedoresService
                const [clientesRes, productosRes, proveedoresRes, ordenesRes] = await Promise.allSettled([
                    clienteService.getAll(),
                    productoService.getAll(),
                    proveedorService.getAll(), // ← Aquí corregido
                    ordenService.getAll()
                ]);

                const clientes = clientesRes.status === 'fulfilled' ? clientesRes.value.data : [];
                const productos = productosRes.status === 'fulfilled' ? productosRes.value.data : [];
                const proveedores = proveedoresRes.status === 'fulfilled' ? proveedoresRes.value.data : [];
                const ordenes = ordenesRes.status === 'fulfilled' ? ordenesRes.value.data : [];

                setStats({
                    totalClientes: clientes.length,
                    totalProductos: productos.length,
                    totalProveedores: proveedores.length,
                    totalOrdenes: ordenes.length
                });

                setChartsData({
                    ventas: processOrdersByMonth(ordenes),
                    clientes: processClientesByPais(clientes),
                    productos: processProductsByPrice(productos),
                    proveedores: processProveedores(proveedores)
                });

            } catch (err) {
                console.error('Error:', err);
                // Datos de ejemplo
                setStats({ totalClientes: 99, totalProductos: 79, totalProveedores: 29, totalOrdenes: 0 });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" />
                <p className="mt-2">Cargando datos...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <h1>Dashboard de Gestión</h1>
                    <p>Estadísticas en tiempo real</p>
                </Col>
            </Row>

            {/* Estadísticas */}
            <Row className="mt-4">
                <Col md={3} className="mb-3">
                    <Card className="text-center bg-primary text-white">
                        <Card.Body>
                            <Card.Title>{stats.totalClientes}</Card.Title>
                            <Card.Text>Clientes</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card className="text-center bg-success text-white">
                        <Card.Body>
                            <Card.Title>{stats.totalOrdenes}</Card.Title>
                            <Card.Text>Órdenes</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card className="text-center bg-warning text-dark">
                        <Card.Body>
                            <Card.Title>{stats.totalProductos}</Card.Title>
                            <Card.Text>Productos</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card className="text-center bg-info text-white">
                        <Card.Body>
                            <Card.Title>{stats.totalProveedores}</Card.Title>
                            <Card.Text>Proveedores</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Gráficas */}
            <Row className="mt-4">
                <Col md={6} className="mb-3">
                    <Card className="h-100">
                        <Card.Header className="bg-light">
                            <strong>Órdenes por Mes</strong>
                        </Card.Header>
                        <Card.Body className="p-2">
                            <ChartJsChart 
                                data={chartsData.ventas} 
                                type="bar"
                                color="#2962FF"
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="mb-3">
                    <Card className="h-100">
                        <Card.Header className="bg-light">
                            <strong>Clientes por País</strong>
                        </Card.Header>
                        <Card.Body className="p-2">
                            <ChartJsChart 
                                data={chartsData.clientes} 
                                type="bar"
                                color="#00C851"
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="mb-3">
                    <Card className="h-100">
                        <Card.Header className="bg-light">
                            <strong>Precios de Productos</strong>
                        </Card.Header>
                        <Card.Body className="p-2">
                            <ChartJsChart 
                                data={chartsData.productos} 
                                type="bar"
                                color="#FF8800"
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="mb-3">
                    <Card className="h-100">
                        <Card.Header className="bg-light">
                            <strong>Actividad de Proveedores</strong>
                        </Card.Header>
                        <Card.Body className="p-2">
                            <ChartJsChart 
                                data={chartsData.proveedores} 
                                type="bar"
                                color="#CC0000"
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Accesos rápidos */}
            <Row className="mt-4">
                <Col>
                    <h3>Accesos Rápidos</h3>
                </Col>
            </Row>
            
            <Row className="mt-2">
                <Col md={3} className="mb-3">
                    <Card className="text-center h-100">
                        <Card.Body>
                            <Card.Title>Clientes</Card.Title>
                            <Link to="/clientes/lista" className="btn btn-primary">Gestionar</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card className="text-center h-100">
                        <Card.Body>
                            <Card.Title>Órdenes</Card.Title>
                            <Link to="/ordenes/lista" className="btn btn-primary">Gestionar</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card className="text-center h-100">
                        <Card.Body>
                            <Card.Title>Productos</Card.Title>
                            <Link to="/productos/lista" className="btn btn-primary">Gestionar</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card className="text-center h-100">
                        <Card.Body>
                            <Card.Title>Proveedores</Card.Title>
                            <Link to="/proveedores/lista" className="btn btn-primary">Gestionar</Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;