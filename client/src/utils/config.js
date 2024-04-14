const difficultyOptions = {
    easy: "Fácil",
    medium: "Medio",
    hard: "Difícil"
};

const pointsMultiplier = {
    easy: 1,
    medium: 2,
    hard: 3
};

const livesOptions = {
    easy: 6,
    medium: 4,
    hard: 2
};

const imagesOptions = {
    easy: {
        0: "/images/hangman6.png",
        1: "/images/hangman5.png",
        2: "/images/hangman4.png",
        3: "/images/hangman3.png",
        4: "/images/hangman2.png",
        5: "/images/hangman1.png",
        6: "/images/hangman0.png",
    },
    medium: {
        0: "/images/hangman5.png",
        1: "/images/hangman4.png",
        2: "/images/hangman3.png",
        3: "/images/hangman2.png",
        4: "/images/hangman0.png",
    },
    hard: {
        0: "/images/hangman5.png",
        1: "/images/hangman1.png",
        2: "/images/hangman0.png",
    }
}

const showClueOptions = {
    easy: 3,
    medium: 2,
    hard: 1
}

const removeAccents = (word) => {
    const accentsMap = {
        'á': 'a',
        'é': 'e',
        'í': 'i',
        'ó': 'o',
        'ú': 'u',
        'Á': 'A',
        'É': 'E',
        'Í': 'I',
        'Ó': 'O',
        'Ú': 'U'
    };

    return word.replace(/[áéíóúÁÉÍÓÚ]/g, (match) => accentsMap[match] || match);
};

export { difficultyOptions, pointsMultiplier, livesOptions, imagesOptions, showClueOptions, removeAccents };
