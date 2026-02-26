export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('bc_token');
    }
    return null;
};

export const api = async (endpoint: string, method = 'GET', body: any = null) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const token = getToken();

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, config);
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'Request failed');
        }
        return data;
    } catch (err) {
        throw err;
    }
};
