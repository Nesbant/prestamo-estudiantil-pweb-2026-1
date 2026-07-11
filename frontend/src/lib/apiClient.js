const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');
const TOKEN_KEY = 'campuslend_access_token';

export const getAccessToken = () => sessionStorage.getItem(TOKEN_KEY);

export const saveAccessToken = (token) => {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
};

export const clearSession = () => sessionStorage.removeItem(TOKEN_KEY);

export async function apiRequest(path, options = {}) {
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
