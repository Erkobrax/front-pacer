import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:9999/api/v1',
});

export const getTokens = (clientId, clientSecret, code) => api.post('auth/get-tokens', {
    client_id: clientId, client_secret: clientSecret, code: code
});

export const refreshTokens = (clientId, clientSecret, refreshToken) => api.post('auth/refresh-token', {
    client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken
});

export default api;
