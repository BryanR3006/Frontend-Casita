import React, {useState } from 'react';
import {useNavigate } from 'react-router-dom';
import clienteService from '../../Services/api';

const AgregarCliente = ()=>{
const navigate = useNavigate();

    const [cliente, setCliente] = useState({
        firstName: '',
        lastName: '',
        city: '',
        country: '',
        phone: '',
        email: '',
        //birthDate: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await clienteService.crearCliente(cliente);
            navigate('/clientes/lista'); // Redirige a la lista tras crear
        } catch (error) {
            alert('Error al crear cliente');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Crear Nuevo Cliente</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        value={cliente.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Apellido</label>
                    <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        value={cliente.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Ciudad</label>
                    <input
                        type="text"
                        name="city"
                        className="form-control"
                        value={cliente.city}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>País</label>
                    <input
                        type="text"
                        name="country"
                        className="form-control"
                        value={cliente.country}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Teléfono</label>
                    <input
                        type="text"
                        name="phone"
                        className="form-control"
                        value={cliente.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={cliente.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                {/*<div className="form-group">
                    <label>Fecha de nacimiento</label>
                    <input
                        type="date"
                        name="birthDate"
                        className="form-control"
                        value={cliente.birthDate}
                        onChange={handleChange}
                        required
                    />
                </div>*/}
                <button type="submit" className="btn btn-primary mt-3">
                    Guardar Cliente
                </button>
            </form>
        </div>
    );
};
export default AgregarCliente;