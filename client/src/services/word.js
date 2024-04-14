const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

export const getRandom = async (difficulty = 'easy') => {
    const response = await fetch(`${BASE_URL}/word/${difficulty}/random/`);

    const data = await response.json();

    return data;
}

export const getAll = async () => {
    const response = await fetch(`${BASE_URL}/words`);
    const data = await response.json();

    return data;
}

export const create = async (word, difficulty, time, clue) => {
    const response = await fetch(`${BASE_URL}/word/create/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word, difficulty, time, clue }),
    });
    const data = await response.json();

    return data;
}
