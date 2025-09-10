export const API_URL = import.meta.env.VITE_API_URL as string;


//write export api
export const api = {
    index: () => fetch(`${API_URL}/`).then((res) => res.json()),
};
