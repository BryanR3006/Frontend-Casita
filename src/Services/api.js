const Api_Base_URL = "https://localhost:7177"; // Cambia esto a la URL de tu API
export const customers = {
  getClientes: async () => {
    const response = await fetch(`${Api_Base_URL}/api/Customers`);
    if (!response.ok) {
      throw new Error("Error al obtener los clientes");

    }
    return await response.json();  //TRAER DATOS
  }
};

