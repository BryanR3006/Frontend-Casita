import axios from 'axios';

const API_BASE_URL = 'https://lab03webapiordenescompr-b9adhmgrazanbhg9.brazilsouth-01.azurewebsites.net/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
  (config) => {
    console.log('🔄 Making request to:', config.method?.toUpperCase(), config.url);
    console.log('📦 Request data:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.status);
    console.log('📦 Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.response?.statusText);
    console.error('📦 Error data:', error.response?.data);
    
    // ✅ Manejo especial de errores de certificado
    if (error.message.includes('certificate') || error.code === 'CERT_HAS_EXPIRED' || error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
      console.warn('⚠️ Error de certificado. Ejecuta: dotnet dev-certs https --trust');
    }
    
    // ✅ Manejo de errores de CORS
    if (error.response?.status === 0) {
      console.error('🚫 Error de CORS o conexión. Verifica que la API permita requests desde tu origen');
    }
    
    return Promise.reject(error);
  }
);

// ✅ Función para probar la conexión
export const testConnection = async () => {
  try {
    console.log('🧪 Probando conexión con la API...');
    const response = await api.get('/api');
    console.log('✅ Conexión exitosa:', response.status);
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
};

// Servicios
export const clienteService = {
  getAll: () => api.get('/api/customers'),
  getById: (id) => api.get(`/api/customers/${id}`),
  create: (clienteData) => api.post('/api/customers', clienteData),
  update: (id, clienteData) => api.put(`/api/customers/${id}`, clienteData),
  delete: (id) => api.delete(`/api/customers/${id}`, {
    headers: {
      'Accept': '*/*'
    }
  })
};

export const productoService = {
  getAll: () => api.get('/api/products'),
  getById: (id) => api.get(`/api/products/${id}`),
  create: (productoData) => api.post('/api/products', productoData),
  update: (id, productoData) => api.put(`/api/products/${id}`, productoData),
  delete: (id) => api.delete(`/api/products/${id}`, {
    headers: {
      'Accept': '*/*'
    }
  })
};

export const proveedorService = {
  getAll: () => api.get('/api/suppliers'),
  getById: (id) => api.get(`/api/suppliers/${id}`),
  create: (proveedorData) => api.post('/api/suppliers', proveedorData),
  update: (id, proveedorData) => api.put(`/api/suppliers/${id}`, proveedorData),
  delete: (id) => api.delete(`/api/suppliers/${id}`, {
    headers: {
      'Accept': '*/*'
    }
  })
};

// En Services/api.js - Agregar estos servicios
export const ordenService = {
  getAll: () => api.get('/api/Orders'),
  getById: (id) => api.get(`/api/Orders/${id}`),
  create: (ordenData) => api.post('/api/Orders', ordenData),
  update: (id, ordenData) => api.put(`/api/Orders/${id}`, ordenData),
  delete: (id) => api.delete(`/api/Orders/${id}`, {
    headers: {
      'Accept': '*/*'
    }
  }),
  getOrderItems: (orderId) => api.get(`/api/OrderItems/order/${orderId}`),
  createOrderItem: (itemData) => api.post('/api/OrderItems', itemData),
  updateOrderItem: (id, itemData) => api.put(`/api/OrderItems/${id}`, itemData),
  deleteOrderItem: (id) => api.delete(`/api/OrderItems/${id}`)
};

export const orderItemService = {
  getAll: () => api.get('/api/OrderItems'),
  getById: (id) => api.get(`/api/OrderItems/${id}`),
  create: (itemData) => api.post('/api/OrderItems', itemData),
  update: (id, itemData) => api.put(`/api/OrderItems/${id}`, itemData),
  delete: (id) => api.delete(`/api/OrderItems/${id}`)
};

//  Servicio alternativo por si los endpoints son diferentes
export const proveedorServiceAlternativo = {
  getAll: () => api.get('/api/proveedores'),
  getById: (id) => api.get(`/api/proveedores/${id}`),
  create: (proveedorData) => api.post('/api/proveedores', proveedorData),
  update: (id, proveedorData) => api.put(`/api/proveedores/${id}`, proveedorData),
  delete: (id) => api.delete(`/api/proveedores/${id}`, {
    headers: {
      'Accept': '*/*'
    }
  })
};

//  Función para descubrir endpoints automáticamente
export const discoverEndpoints = async () => {
  const testEndpoints = [
    '/api/customers',
    '/customers',
    '/api/clientes',
    '/clientes',
    '/api/orders',
    '/orders',
    '/api',
    '/'
  ];

  console.log('🔍 Probando endpoints...');
  for (const endpoint of testEndpoints) {
    try {
      const response = await api.get(endpoint);
      console.log(`✅ ${endpoint}: ${response.status}`);
      if (response.data) console.log('📊 Data:', response.data);
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.response?.status || error.message}`);
    }
  }
};

export default api;