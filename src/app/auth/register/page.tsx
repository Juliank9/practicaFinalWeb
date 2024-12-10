'use client';

import '../../../styles/globals.css';
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

                // Guardar el email en localStorage para usarlo en la página de validación
                localStorage.setItem('email', email);

                alert('¡Registro exitoso! Ahora valida tu cuenta.');
                router.push('/auth/validation'); // Redirige a la página de validación
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Hubo un problema con el registro.');
            }
        } catch (err) {
            setError('Error al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-4">Registrarse</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block mb-1">Correo Electrónico</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Escribe tu correo"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Escribe tu contraseña"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>
        </div>
    );
}