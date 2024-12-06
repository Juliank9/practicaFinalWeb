'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function RegisterPage() {
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
            const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}),
            });

            if (response.ok) {
                const result = await response.json();

                // Guardar token en cookies
                document.cookie = `jwt=${result.token}; path=/; secure; SameSite=Strict`;

                alert('¡Inicio de sesión exitoso!');
                router.push('/dashboard'); // Redirige al dashboard
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Ocurrió un problema con el registro.');
            }
        } catch (err) {
            setError('Hubo un problema al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <h1 className="text-2xl font-bold mb-4">Registrarse</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Correo Electrónico</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300"
                >
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>
        </section>
    );
}
