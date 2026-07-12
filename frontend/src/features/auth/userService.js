const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const API_URL = `${API_BASE_URL}/auth`;

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    // Propagamos el mensaje y el código de error del backend
    const error = new Error(
      data.message || 'Ocurrió un error en la solicitud.',
    );
    error.code = data.code;
    throw error;
  }
  // El backend devuelve el objeto de respuesta en una propiedad 'data'
  return data.data;
}

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
}

export async function getProfile(token) {
  const response = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
}

export async function updateUser(profileData, token) {
  const response = await fetch(`${API_URL}/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  return handleResponse(response);
}

export async function getInstitutions() {
  const response = await fetch(`${API_BASE_URL}/institutions`);
  return handleResponse(response);
}
