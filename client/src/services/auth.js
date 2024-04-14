const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

const login = async (username, password) => {
    const response = await fetch(`${BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    return data;
};

const register = async (username, password) => {
    const response = await fetch(`${BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    return data;
};

export { login, register };
