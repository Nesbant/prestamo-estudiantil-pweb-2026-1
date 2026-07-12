const API_URL = 'http://localhost:4000/api/posts';

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    throw new Error(error);
  }
  return data.data;
}

export async function getPosts(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_URL}?${query}`);
  return handleResponse(response);
}

export async function getPostById(id) {
  const response = await fetch(`${API_URL}/${id}`);
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
