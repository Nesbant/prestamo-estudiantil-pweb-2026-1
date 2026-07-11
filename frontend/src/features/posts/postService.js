import { apiRequest } from '../../lib/apiClient';

export const getBackendPosts = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim()) {
      params.set(key, String(value).trim());
    }
  });

  const query = params.toString();
  const response = await apiRequest(`/posts${query ? `?${query}` : ''}`);
  return response.data || [];
};

const normalizeSearchValue = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase();

export const findBackendPostForChat = async (post) => {
  const candidates = await getBackendPosts();
  const normalizedTitle = normalizeSearchValue(post.title);
  const normalizedAuthorName = normalizeSearchValue(post.authorName);

  return (
    candidates.find(
      (candidate) =>
        normalizeSearchValue(candidate.title) === normalizedTitle &&
        normalizeSearchValue(candidate.authorName) === normalizedAuthorName,
    ) ||
    candidates.find(
      (candidate) => normalizeSearchValue(candidate.title) === normalizedTitle,
    ) ||
    candidates.find(
      (candidate) =>
        normalizeSearchValue(candidate.title).includes(normalizedTitle) ||
        normalizedTitle.includes(normalizeSearchValue(candidate.title)),
    ) ||
    null
  );
};
