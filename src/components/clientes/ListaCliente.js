import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Container, Row, Col, Form, Alert, Spinner } from "react-bootstrap";
import clienteService from '../../Services/api';


const ListarCliente = () => {
    const [clientes, setClientes] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarClientes();
    }, []);

const cargarClientes = async () => {
    try {
        setLoading(true);
        console.log("Llamando API...");
        const data = await clienteService.getClientes();
            console.log("Datos recibidos:", data);
        setClientes(data);

        setError(null);
    } catch (error) {
        setError("Error al cargar los clientes");
        console.error(error);
    } finally {
        setLoading(false);
    }
};


    const buscarCliente = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            // const data = await clienteService.buscarClientes(filtro);
            // setClientes(data);
            setError(null);
        } catch (error) {
            setError("Error al buscar los clientes");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const eliminarCliente = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
            try {
                // await clienteService.eliminarCliente(id);
                setClientes(clientes.filter(cliente => cliente.id !== id));
                setError(null);
            } catch (error) {
                setError("Error al eliminar el cliente");
                console.error(error);
            }
        }
    };

    if (loading) return <Spinner animation="border" variant="primary" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container className="container-sm">
            <Row className="mb-4">
                <Col>
                    <h2>Lista de clientes</h2>
                </Col>
                <Col className="text-end">
                    <Button as={Link} to="/clientes/agregar" variant="primary">Crear Cliente</Button>
                </Col>
            </Row>

            <Form onSubmit={buscarCliente} className="mb-4">
                <Row>
                    <Col md={10}>
                        <Form.Control
                            type="text"
                            placeholder="Buscar por nombre o correo"
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        />
                    </Col>
                    <Col md={2}>
                        <Button type="submit" variant="outline-primary" className="w-100 mb-2">Buscar</Button>
                        <Button variant="outline-secondary" className="w-100" onClick={cargarClientes}>Limpiar</Button>
                    </Col>
                </Row>
            </Form>

            <Table striped bordered hover responsive className="mt-4">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente) => (
                        <tr key={cliente.id}>
                            <td>{cliente.firstName} {cliente.lastName}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.phone}</td>
                            <td>{cliente.city} {cliente.country}</td>
                            <td>
                                <Button
                                as={Link}
                                to={`/clientes/editar/${cliente.id}`}
                                variant="warning"
                                size="sm"
                                className="me-2"
                                >
                                Editar
                                </Button>
                                <Button variant="danger"  size="sm" onClick={() => eliminarCliente(cliente.id)} >
                                Eliminar
                                </Button>
                            </td>
                        </tr>

                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ListarCliente;
