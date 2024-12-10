// Placeholder content for src/utils/auth.ts
export async function loginUser(data: { email: string; password: string }) {
    const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error en las credenciales');
    }

    const result = await response.json();
    localStorage.setItem('jwt', result.token); // Guarda el token en localStorage
    return result;
}


export function getToken() {
    return localStorage.getItem('jwt');
}

export function logoutUser() {
    localStorage.removeItem('jwt');
}
