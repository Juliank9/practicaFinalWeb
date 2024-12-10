import {useEffect, useState} from 'react';

export function useAuth() {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    return {isAuthenticated, loading};
}
