const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');
const TOKEN_KEY = 'campuslend_access_token';

export const getAccessToken = () => sessionStorage.getItem(TOKEN_KEY);

const saveAccessToken = (token) => {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
};

const clearSession = () => sessionStorage.removeItem(TOKEN_KEY);

async function apiRequest(path, options = {}) {
  const token = getAccessToken();
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.');
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && token) clearSession();
    const error = new Error(payload.message || 'Ocurrió un error al procesar la solicitud.');
    error.status = response.status;
    error.code = payload.code;
    throw error;
  }
  return payload;
}

export const registerUser = async (userData) => {
  try {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return { ok: true, message: response.message };
  } catch (error) {
    return { ok: false, message: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    saveAccessToken(response.data.accessToken);
    return { ok: true, user: response.data.user };
  } catch (error) {
    return { ok: false, message: error.message };
  }
};

export const getCurrentUser = async () => {
  if (!getAccessToken()) return null;
  try {
    const response = await apiRequest('/auth/me');
    return response.data;
  } catch {
    clearSession();
    return null;
  }
};

export const updateCurrentUser = async (updatedData) => {
  const response = await apiRequest('/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(updatedData),
  });
  saveAccessToken(response.data.accessToken);
  return response.data.user;
};

export const logoutUser = async () => clearSession();
