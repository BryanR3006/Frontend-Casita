import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";

const AgregarCliente = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoCliente = {
      firstName,
      lastName,
      city,
      country,
      phone,
      email,
      fechaNacimiento
    };

    try {
      const response = await fetch("https://localhost:7177/api/Customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoCliente)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al guardar el cliente");
      }

      alert("Cliente agregado correctamente");
      navigate("/clientes");
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al guardar el cliente");
    }
  };

  return (
    <Container className="container-sm">
      <Row className="mb-4">
        <Col>
          <h1>Agregar Cliente</h1>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Apellido</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Teléfono</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="city" className="form-label">Ciudad</label>
              <input
                type="text"
                className="form-control"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="country" className="form-label">País</label>
              <input
                type="text"
                className="form-control"
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento</label>
              <input
                type="date"
                className="form-control"
                id="fechaNacimiento"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Guardar Cliente</button>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default AgregarCliente;
