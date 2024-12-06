import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const cookieString = document.cookie;
        const jwtCookie = cookieString
            .split('; ')
            .find((row) => row.startsWith('jwt='));

        const token = jwtCookie ? jwtCookie.split('=')[1] : null;

        if (!token) {
            router.push('/auth/login'); // Redirigir si no hay token
        } else {
            setIsAuthenticated(true);
        }

        setLoading(false);
    }, [router]);

    return { isAuthenticated, loading };
}
