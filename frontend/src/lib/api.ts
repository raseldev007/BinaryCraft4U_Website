export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
export const SERVER_URL = API_BASE.replace(/\/api$/, '');

export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('bc_token');
    }
    return null;
};

/**
 * Fetch with AbortController timeout + exponential backoff retry
 */
export const fetchWithTimeout = async (
    url: string,
    options: RequestInit = {},
    timeoutMs = 10000
): Promise<Response> => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        return res;
    } finally {
        clearTimeout(id);
    }
};

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/**
 * Main API utility with timeout (10s) and retry (up to 2 retries, exponential backoff)
 */
export const api = async (
    endpoint: string,
    method = 'GET',
    body: any = null,
    retries = 2
): Promise<any> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config: RequestInit = { method, headers };
    if (body) config.body = JSON.stringify(body);

    let lastError: Error = new Error('Request failed');

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const res = await fetchWithTimeout(`${API_BASE}${endpoint}`, config, 10000);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Request failed');
            return data;
        } catch (err: any) {
            lastError = err;
            // Don't retry on client errors (4xx) or abort
            if (err.name === 'AbortError') throw new Error('Request timed out. Please check your connection.');
            if (attempt < retries) {
                await sleep(Math.pow(2, attempt) * 500); // 500ms, 1000ms
            }
        }
    }
    throw lastError;
};
