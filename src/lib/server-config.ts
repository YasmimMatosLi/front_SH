// src/lib/server-config.ts  (nome importante: server- só roda no server)

export const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000/api';

if (!API_BASE_URL) {
    throw new Error('API_BASE_URL não está definida no ambiente');
}