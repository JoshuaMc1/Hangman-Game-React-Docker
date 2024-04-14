import { Link, Navigate, useOutletContext, useParams } from "react-router-dom";
import {
  difficultyOptions,
  livesOptions,
  imagesOptions,
  showClueOptions,
  pointsMultiplier,
} from "../utils/config";
import { useCallback, useEffect, useState } from "react";
import Loader from "../components/Loader";
import { getRandom } from "../services/word";
import { updateUserPoints } from "../services/user";
import useJwt from "../hooks/useJwt";
import usePageRefresh from "../hooks/usePageRefresh";
import ReactHowler from "react-howler";
import winsong from "../assets/audio/winsong.mp3";
import losesong from "../assets/audio/losesong.mp3";
import PropTypes from "prop-types";

const Game = ({ setPlayWinSongFinish, setPlayLoseSongFinish }) => {
  const { username } = useParams();
  const { difficulty, setDifficulty, setMessage } = useOutletContext();
  const [points, setPoints] = useState(0);
  const [lives, setLives] = useState(null);
  const [time, setTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [word, setWord] = useState(null);
  const [goToDashboard, setGoToDashboard] = useState(false);
  const [images, setImages] = useState([]);
  const [heart, setHeart] = useState("");
  const [showClue, setShowClue] = useState(false);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const { jwt } = useJwt();
  const refreshConfirmed = usePageRefresh();
  const [playLoseSong, setPlayLoseSong] = useState(false);
  const [playWinSong, setPlayWinSong] = useState(false);

  const reset = useCallback(() => {
    setPoints(0);

    if (setDifficulty) {
      setDifficulty(null);
    }
  }, [setDifficulty]);

  const handleClick = useCallback(() => {
    reset();

    setMessage("El juego se finalizo correctamente. No sumaste puntos.");
  }, [setMessage, reset]);

  const loseLife = () => {
    setLives((prevLives) => prevLives - 1);
    setPlayLoseSong(true);
  };

  const addPoints = () => {
    setPoints((prevPoints) => prevPoints + pointsMultiplier[difficulty]);
    setPlayWinSong(true);
  };

  const winGame = useCallback(async () => {
    reset();

    const updatePoints = async () => {
      if (points > 0) {
        return await updateUserPoints(points, jwt);
      }

      return null;
    };

    await updatePoints();

    setMessage("Ganaste. Sumaste " + points + " puntos.");

    setPlayWinSongFinish(true);

    setGoToDashboard(true);
  }, [setGoToDashboard, reset, setMessage, points, jwt, setPlayWinSongFinish]);

  const endGame = useCallback(() => {
    reset();

    setMessage(
      "Perdiste. No tenes suficientes vidas o el tiempo ha terminado.",
    );

    setPlayLoseSongFinish(true);

    setGoToDashboard(true);
  }, [setGoToDashboard, reset, setMessage, setPlayLoseSongFinish]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(time - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  useEffect(() => {
    if (lives !== null) {
      setHeart("❤️".repeat(lives));

      setShowClue(showClueOptions[difficulty] >= lives ? true : false);
    }
  }, [lives, difficulty]);

  useEffect(() => {
    const fetchData = async () => {
      const getWord = async () => {
        const word = await getRandom(difficulty);

        if (word) {
          setWord(word.data);
        }
      };

      await getWord();
    };

    if (difficulty) {
      setLives(livesOptions[difficulty]);
      setPoints(0);

      setImages(imagesOptions[difficulty]);
      fetchData();
    }
  }, [difficulty]);

  useEffect(() => {
    if (word) {
      setTime(word.time);

      setLoading(false);
    }
  }, [word]);

  useEffect(() => {
    if (lives !== null) {
      if (lives === 0) {
        endGame();
      }

      if (time !== null && time === 0) {
        endGame();
      }
    }
  }, [lives, endGame, time]);

  const handleLetterGuess = (letter) => {
    if (!guessedLetters.includes(letter)) {
      setGuessedLetters([...guessedLetters, letter]);

      word.word.includes(letter) ? addPoints() : loseLife();
    }
  };

  useEffect(() => {
    if (word) {
      const wordGuessed = word.word
        .split("")
        .every((char) => guessedLetters.includes(char));

      if (wordGuessed) {
        winGame();
      }
    }
  }, [guessedLetters, word, winGame]);

  useEffect(() => {
    if (refreshConfirmed) {
      setMessage(
        "El juego se finalizo debido a que la página se actualizo. No sumaste ni restaste puntos.",
      );

      reset();

      setGoToDashboard(true);
    }
  }, [refreshConfirmed, setMessage, setGoToDashboard, reset]);

  return (
    <>
      {loading ? (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <Loader />
          </div>
        </div>
      ) : (
        <div className="animate__animated animate__fadeIn grid grid-cols-1 gap-4 p-2 lg:grid-cols-5">
          {goToDashboard && <Navigate to="/dashboard" replace={true} />}

          {playLoseSong && (
            <ReactHowler
              src={losesong}
              playing={playLoseSong}
              loop={false}
              volume={0.4}
              onEnd={() => setPlayLoseSong(false)}
            />
          )}

          {playWinSong && (
            <ReactHowler
              src={winsong}
              playing={playWinSong}
              loop={false}
              volume={0.4}
              onEnd={() => setPlayWinSong(false)}
            />
          )}

          <div className="lg:col-span-5">
            <div className="card w-full bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <h2 className="text-center text-3xl font-bold">
                    Juego del Ahorcado
                  </h2>
                  <Link
                    to="/dashboard"
                    type="button"
                    className="btn btn-accent"
                    onClick={handleClick}
                  >
                    Finalizar Juego
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-200 shadow-xl lg:col-span-2">
            <div className="card-body">
              <div className="flex h-full flex-col items-center justify-center gap-6">
                <div className="flex justify-center">
                  <img src={images[lives]} alt="Imagen del ahorcado" />
                </div>
                <div
                  className="flex flex-col items-center justify-center gap-4"
                  id="word"
                >
                  <div className="mt-6 flex gap-2">
                    {word.word.split("").map((letter, index) => (
                      <div
                        key={index}
                        className="w-10 border-b-2 border-primary text-center text-3xl font-bold"
                      >
                        {guessedLetters.includes(letter) ? letter : ""}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4 lg:col-span-2 lg:flex-col">
            {showClue && (
              <div className="animate__animated animate__fadeIn card h-[300px] bg-base-200 shadow-xl">
                <div className="card-body">
                  <h3 className="text-2xl font-bold">Pistas</h3>
                  <div className="flex flex-col gap-2" id="hints">
                    {word.clue}
                  </div>
                </div>
              </div>
            )}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="flex flex-wrap justify-center gap-2 md:flex-row">
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("Q")}
                    >
                      Q
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("W")}
                    >
                      W
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("E")}
                    >
                      E
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("R")}
                    >
                      R
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("T")}
                    >
                      T
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("Y")}
                    >
                      Y
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("U")}
                    >
                      U
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("I")}
                    >
                      I
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("O")}
                    >
                      O
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("P")}
                    >
                      P
                    </button>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 md:flex-row">
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("A")}
                    >
                      A
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("S")}
                    >
                      S
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("D")}
                    >
                      D
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("F")}
                    >
                      F
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("G")}
                    >
                      G
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("H")}
                    >
                      H
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("J")}
                    >
                      J
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("K")}
                    >
                      K
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("L")}
                    >
                      L
                    </button>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 md:flex-row">
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("Z")}
                    >
                      Z
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("X")}
                    >
                      X
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("C")}
                    >
                      C
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("V")}
                    >
                      V
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("B")}
                    >
                      B
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("N")}
                    >
                      N
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("Ñ")}
                    >
                      Ñ
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleLetterGuess("M")}
                    >
                      M
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center justify-center gap-4">
              <div className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md bg-secondary p-2 text-white shadow-xl transition-colors duration-300 ease-in-out hover:bg-secondary/80">
                <p className="font-semibold">Nombre del jugador</p>
                <span className="text-lg font-bold">{username}</span>
              </div>
              <div className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md bg-secondary p-2 text-white shadow-xl transition-colors duration-300 ease-in-out hover:bg-secondary/80">
                <p className="font-semibold">Dificultad del juego</p>
                <span className="text-lg font-bold">
                  {difficultyOptions[difficulty] ?? "Dificultad desconocida"}
                </span>
              </div>
              <div className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md bg-secondary p-2 text-white shadow-xl transition-colors duration-300 ease-in-out hover:bg-secondary/80">
                <p className="font-semibold">Puntuación</p>
                <span className="text-lg font-bold">{points}</span>
              </div>
              <div className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md bg-secondary p-2 text-white shadow-xl transition-colors duration-300 ease-in-out hover:bg-secondary/80">
                <p className="font-semibold">Vidas restantes</p>
                <span className="text-lg font-bold">{heart}</span>
              </div>
              <div className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md bg-secondary p-2 text-white shadow-xl transition-colors duration-300 ease-in-out hover:bg-secondary/80">
                <p className="font-semibold">Tiempo restante</p>
                <span className="text-lg font-bold">{time}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

Game.propTypes = {
  setPlayLoseSongFinish: PropTypes.func.isRequired,
  setPlayWinSongFinish: PropTypes.func.isRequired,
};

export default Game;
