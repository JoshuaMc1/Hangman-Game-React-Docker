const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

export const user = async (token) => {
    const response = await fetch(`${BASE_URL}/user/me/`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        }
    });
    const data = await response.json();

    return data;
}

export const getUsersPoints = async () => {
    const response = await fetch(`${BASE_URL}/user/points/`);
    const data = await response.json();

    return data;
}

export const updateUserPoints = async (points, token) => {
    const response = await fetch(`${BASE_URL}/user/points/update/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        body: JSON.stringify({ points }),
    });
    const data = await response.json();

    return data;
}
