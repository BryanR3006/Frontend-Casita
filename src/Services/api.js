const API_BASE_URL = 'https://lab03webapiordenescompr-b9adhmgrazanbhg9.brazilsouth-01.azurewebsites.net/api/Customers';

const clienteService = {
    getClientes: async () => {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error('Error al obtener clientes');
        }
        return await response.json();
    },

    buscarCliente: async (filtro) => {
        const response = await fetch(`${API_BASE_URL}?search=${filtro}`);
        if (!response.ok) {
            throw new Error('Error al buscar cliente');
        }
        return await response.json();
    },

    actualizarCliente: async (id, cliente) => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar cliente');
        }
    },
    crearCliente: async (cliente) => {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });

        if (!response.ok) {
            throw new Error('Error al crear cliente');
        }

        return await response.json();
    },

    eliminarCliente: async (id) => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error('Error al eliminar cliente');
        }
    },

    // 🔍 NUEVO MÉTODO
    getClientePorId: async (id) => {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener cliente por ID');
        }
        return await response.json();
    }
};

export default clienteService;
