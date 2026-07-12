const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const API_URL = `${API_BASE_URL}/chats`;

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || response.statusText);
  }
  return data.data;
}

function authHeaders(token, extraHeaders = {}) {
  return {
    ...extraHeaders,
    Authorization: `Bearer ${token}`,
  };
}

export async function getChats(token) {
  const response = await fetch(API_URL, {
    headers: authHeaders(token),
  });
  return handleResponse(response);
}

export async function findOrCreateChat(recipientId, token, reference) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: authHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ recipientId, reference }),
  });
  return handleResponse(response);
}

export async function getChatById(chatId, token) {
  const response = await fetch(`${API_URL}/${chatId}`, {
    headers: authHeaders(token),
  });
  return handleResponse(response);
}

export async function sendMessage(chatId, content, token) {
  const response = await fetch(`${API_URL}/${chatId}/messages`, {
    method: 'POST',
    headers: authHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ content }),
  });
  return handleResponse(response);
}
