import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Spinner, Alert } from 'react-bootstrap';
import clienteService from '../../Services/api';

const EditarCliente = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarCliente = async () => {
            try {
                const data = await clienteService.getClientePorId(id);
                setCliente(data);
            } catch (err) {
                setError('Error al cargar el cliente');
            } finally {
                setLoading(false);
            }
        };
        cargarCliente();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente({ ...cliente, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await clienteService.actualizarCliente(id, cliente);
            navigate('/clientes/lista'); // Redirige a la lista
        } catch (err) {
            if (err.response && err.response.data) {
                // Captura el mensaje de la API
                alert(err.response.data); 
            } else {
                alert('Error al actualizar el cliente');
            }
        }
    };

    if (loading) return <Spinner animation='border' variant='primary' />;
    if (error) return <Alert variant='danger'>{error}</Alert>;
    if (!cliente) return null;

    return (
        <Container>
            <h2>Editar Cliente</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3'>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        name="firstName"
                        value={cliente.firstName}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                        type="text"
                        name="lastName"
                        value={cliente.lastName}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={cliente.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label>Ciudad</Form.Label>
                    <Form.Control
                        type="text"
                        name="city"
                        value={cliente.city}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label>País</Form.Label>
                    <Form.Control
                        type="text"
                        name="country"
                        value={cliente.country}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone"
                        value={cliente.phone}
                        onChange={handleChange}
                    />
                </Form.Group>

                {/*<Form.Group className='mb-3'>
                    <Form.Label>Fecha de Nacimiento</Form.Label>
                    <Form.Control
                        type="date"
                        name="birthDate"
                        value={cliente.birthDate?.substring(0, 10)}
                        onChange={handleChange}
                    />
                </Form.Group>*/}

                <Button type="submit" variant="primary">Guardar Cambios</Button>
                <Button variant="secondary" className="ms-2" onClick={() => navigate('/clientes')}>Cancelar</Button>
            </Form>
        </Container>
    );
};

export default EditarCliente;

