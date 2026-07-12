const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const API_URL = `${API_BASE_URL}/posts`;

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    throw new Error(error);
  }
  return data.data;
}

function authHeaders(token, extraHeaders = {}) {
  return token
    ? { ...extraHeaders, Authorization: `Bearer ${token}` }
    : extraHeaders;
}

export async function getPosts(filters = {}, token) {
  const query = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_URL}?${query}`, {
    headers: authHeaders(token),
  });
  return handleResponse(response);
}

export async function getMyPosts(token) {
  const response = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
}

export async function getPostById(id, token) {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: authHeaders(token),
  });
  return handleResponse(response);
}

export async function createPost(postData, token) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });
  return handleResponse(response);
}

export async function updatePost(id, postData, token) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });
  return handleResponse(response);
}

export async function deletePost(id, token) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json();
    const error = (data && data.message) || response.statusText;
    throw new Error(error);
  }
  return { success: true };
}

export async function toggleFavorite(id, token) {
  const response = await fetch(`${API_URL}/${id}/favorite`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
}
