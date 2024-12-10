'use client';

import '../../../styles/globals.css';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function ValidationPage() {
    const [code, setCode] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const email = localStorage.getItem('email'); // Recuperar el email guardado
            const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/validation', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, code}),
            });

            if (response.ok) {
                alert('¡Cuenta validada exitosamente!');
                router.push('/auth/login'); // Redirige al login
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Código inválido.'}`);
            }
        } catch (err) {
            console.error('Error al validar la cuenta:', err);
            alert('Hubo un problema al validar la cuenta.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-4">Validar Cuenta</h2>

                <div className="mb-4">
                    <label className="block mb-1">Código de Validación</label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Ingresa tu código"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Validar Cuenta
                </button>
            </form>
        </div>
    );
}