'use client';

import '../../../styles/globals.css';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}),
            });

            if (response.ok) {
                const result = await response.json();

                // Guardar token en localStorage y cookies
                localStorage.setItem('jwt', result.token);
                document.cookie = `jwt=${result.token}; path=/; SameSite=Strict`;

                router.push('/dashboard'); // Redirige al dashboard
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Credenciales incorrectas.');
            }
        } catch (err) {
            setError('Hubo un problema al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
                onSubmit={handleSubmit}
            >

                <h2 className="text-3xl font-bold text-center mb-6">Inicia Sesión</h2>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}


                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Escribe tu correo"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Escribe tu contraseña"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300"
                >
                    {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    ¿No tienes cuenta?{' '}
                    <button
                        type="button"
                        onClick={() => router.push('/auth/register')}
                        className="text-blue-500 font-semibold hover:underline"
                    >
                        Regístrate aquí
                    </button>
                </p>
            </form>
        </div>
    );
}
