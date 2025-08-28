export const API_URL: string = import.meta.env.VITE_API_URL;

// Optionally, you can assert at runtime in dev to catch missing config
if (!API_URL) {
    // eslint-disable-next-line no-console
    console.warn('[config] Missing VITE_API_URL. Check your .env file.');
}

// Generic GET request returning JSON
async function getJSON<T>(path: string): Promise<T> {
    const res = await fetch(`${API_URL}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<T>;
}

// ---- Barebone API ----
export const api = {
    index() {
        // expecting backend route GET / that returns { message: string }
        return getJSON<{ message: string }>("/");
    },
};