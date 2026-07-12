const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const API_URL = `${API_BASE_URL}/notifications`;

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || response.statusText);
  return data.data;
}

export async function getNotifications(token) {
  const response = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
}

export async function markNotificationsRead(token) {
  const response = await fetch(`${API_URL}/read-all`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
}

export async function respondToLoanRequest(notificationId, decision, token) {
  const response = await fetch(`${API_URL}/${notificationId}/respond`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ decision }),
  });
  return handleResponse(response);
}
