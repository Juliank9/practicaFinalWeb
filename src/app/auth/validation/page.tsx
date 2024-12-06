'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';

export default function ValidationPage() {
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) {
            alert('No se encontró un correo asociado. Regístrate nuevamente.');
            router.push('/auth/register');
        } else {
            setEmail(storedEmail);
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('jwt');
        if (!token) {
            alert('No se encontró un token de autenticación. Regístrate nuevamente.');
            router.push('/auth/register');
            return;
        }

        try {
            const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/validation', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({email, code}),
            });

            if (response.ok) {
                alert('¡Cuenta validada exitosamente!');
                router.push('/auth/login'); // Redirige al login después de validar
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Código de validación incorrecto.');
            }
        } catch (err) {
            setError('Hubo un problema al validar el código.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <h1 className="text-2xl font-bold mb-4">Validar Cuenta</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <p>Correo: {email}</p>
                <div>
                    <label className="block text-sm font-medium">Código de Validación</label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300"
                >
                    {loading ? 'Validando...' : 'Validar Cuenta'}
                </button>
            </form>
        </section>
    );
}
