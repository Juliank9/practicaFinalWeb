// Placeholder content for src/utils/api.ts
const API_BASE_URL = 'https://bildy-rpmaya.koyeb.app'; // Asegúrate de no incluir una barra al final

import {getToken} from './auth';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`; // Usa la base URL correcta
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(token && {Authorization: `Bearer ${token}`}),
    };

    const config = {
        ...options,
        headers: {...headers, ...options.headers},
    };

    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch API Error:', error);
        throw error;
    }
}

export async function registerUser(data: { email: string; password: string }) {
    return fetchAPI('/api/user/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function validateUser(data: { email: string; code: string }) {
    return fetchAPI('/api/user/validation', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

