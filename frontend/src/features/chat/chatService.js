import { apiRequest } from '../../lib/apiClient';

export const getConversations = async () => {
  const response = await apiRequest('/conversations');
  return response.data || [];
};

export const createConversation = async ({ postId, otherUserId }) => {
  const response = await apiRequest('/conversations', {
    method: 'POST',
    body: JSON.stringify({ postId: String(postId), otherUserId: String(otherUserId) }),
  });
  return response.data;
};

export const getConversationMessages = async (conversationId) => {
  const response = await apiRequest(`/conversations/${conversationId}/messages`);
  return response.data || [];
};

export const sendConversationMessage = async (conversationId, text) => {
  const response = await apiRequest(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
  return response.data;
};
