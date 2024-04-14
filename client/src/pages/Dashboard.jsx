/* eslint-disable react-refresh/only-export-components */
import { Suspense, useEffect, useRef, useState } from "react";
import logo from "../assets/img/logo.png";
import {
  Form,
  Navigate,
  useActionData,
  useOutletContext,
} from "react-router-dom";
import PropTypes from "prop-types";
import useJwt from "../hooks/useJwt";
import { user, getUsersPoints } from "../services/user";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import { create } from "../services/word";
import ReactHowler from "react-howler";
import winSongFinish from "../assets/audio/winsong-finish.mp3";
import loseSongFinish from "../assets/audio/losesong-finish.mp3";

export async function action({ request }) {
  let formData = await request.formData();
  let { word, difficulty, time, clue } = Object.fromEntries(formData);

  if (!word) {
    return {
      status: false,
      message: "El campo de palabra es requerido.",
    };
  }

  if (word.length < 3) {
    return {
      status: false,
      message: "La palabra debe tener al menos 3 caracteres.",
    };
  }

  if (word.length > 250) {
    return {
      status: false,
      message: "La palabra debe tener menos de 250 caracteres.",
    };
  }

  if (!difficulty) {
    return {
      status: false,
      message: "El campo de dificultad es requerido.",
    };
  }

  if (!time) {
    return {
      status: false,
      message: "El campo de tiempo es requerido.",
    };
  }

  if (time < 0) {
    return {
      status: false,
      message: "El tiempo no puede ser negativo.",
    };
  }

  if (!clue) {
    return {
      status: false,
      message: "El campo de pistas es requerido.",
    };
  }

  if (clue.length < 3) {
    return {
      status: false,
      message: "Las pistas deben tener al menos 3 caracteres.",
    };
  }

  const response = await create(word, difficulty, time, clue);

  return response;
}

const Dashboard = ({
  logout,
  playLoseSongFinish,
  playWinSongFinish,
  setPlayLoseSongFinish,
  setPlayWinSongFinish,
}) => {
  const [goToLogin, setGoToLogin] = useState(false);
  const [goToGame, setGoToGame] = useState(false);
  const [userData, setUserData] = useState(null);
  const [points, setPoints] = useState([]);
  const [showError, setShowError] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState("");
  const [errorType, setErrorType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const { jwt } = useJwt();
  const { setDifficulty } = useOutletContext();
  const { message, setMessage } = useOutletContext();
  const modalRef = useRef(null);
  const response = useActionData();

  useEffect(() => {
    if (!localStorage.getItem("jwt")) {
      setGoToLogin(true);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (jwt) {
        const userData = await user(jwt);

        if (userData) {
          setUserData(userData.data);
        }
      }
    };

    fetchData();
  }, [jwt, setUserData]);

  useEffect(() => {
    const fetchData = async () => {
      const points = await getUsersPoints();
      if (points) {
        setPoints(points.data);
      }
    };

    fetchData();
  }, [setPoints]);

  useEffect(() => {
    if (message) {
      setShowMessage(true);
    }
  }, [message]);

  useEffect(() => {
    if (response) {
      setResponseMessage(response.message);
      setResponseType(response.success ? "success" : "error");
      setShowResponse(true);
    }
  }, [response]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData(e.target);

    if (data.get("difficulty") && data.get("difficulty").length > 0) {
      setDifficulty(data.get("difficulty"));
      setGoToGame(true);
    } else {
      setShowError(true);
      setErrorType("error");
      setErrorMessage("Debes seleccionar una dificultad.");
    }
  };

  const handleClose = () => {
    setShowError(false);
    setShowMessage(false);
    setErrorMessage("");
    setMessage("");
  };

  const handleCloseResponse = () => {
    setShowResponse(false);
    setResponseMessage("");
    setResponseType("");
  };

  const onOpenModal = () => {
    modalRef.current.showModal();
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {playWinSongFinish && (
          <ReactHowler
            src={winSongFinish}
            playing={playWinSongFinish}
            loop={false}
            volume={0.7}
            onEnd={() => setPlayWinSongFinish(false)}
          />
        )}

        {playLoseSongFinish && (
          <ReactHowler
            src={loseSongFinish}
            playing={playLoseSongFinish}
            loop={false}
            volume={0.7}
            onEnd={() => setPlayLoseSongFinish(false)}
          />
        )}

        {goToLogin && <Navigate to="/" />}

        {goToGame && <Navigate to={`/game/${userData?.username}`} />}

        <div className="card bg-base-200 shadow-xl md:col-span-2">
          <div className="card-body">
            <div className="flex justify-center">
              <div className="avatar">
                <div className="w-16 rounded-full bg-secondary-content p-2">
                  <img src={logo} alt="logo" />
                </div>
              </div>
            </div>
            <h2 className="text-center text-3xl font-bold">
              Juego del Ahorcado
            </h2>
          </div>
        </div>
        <div className="relative md:col-span-2">
          {showMessage && (
            <Alert
              type="success"
              message={message}
              action={handleClose}
              showAction={true}
            />
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="text-center text-2xl font-bold">Cuenta</h3>
              <div className="flex flex-row justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <p className="font-semibold">Nombre de usuario</p>
                  <kbd className="kbd kbd-md">{userData?.username}</kbd>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-semibold">Puntuación</p>
                  <kbd className="kbd kbd-md">{userData?.points}</kbd>
                </div>
              </div>
              <div className="mt-6 flex flex-col justify-center gap-2">
                <button
                  className="btn btn-outline btn-primary w-full"
                  onClick={onOpenModal}
                >
                  Agregar nueva palabra
                </button>
                <button
                  className="btn btn-outline btn-accent w-full"
                  onClick={() => {
                    logout();
                    setGoToLogin(true);
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              {showError && (
                <Alert
                  type={errorType}
                  message={errorMessage}
                  action={handleClose}
                  showAction={true}
                />
              )}

              <h3 className="text-center text-2xl font-bold">Jugar</h3>
              <form
                className="flex flex-col gap-4"
                method="POST"
                onSubmit={handleSubmit}
              >
                <div className="form-control">
                  <label className="label" htmlFor="difficulty">
                    <span className="label-text">Dificultad</span>
                  </label>
                  <select
                    id="difficulty"
                    className="select select-bordered select-primary"
                    name="difficulty"
                    defaultValue={""}
                  >
                    <option value={""}>Seleccione la dificultad</option>
                    <option value={"easy"}>Fácil</option>
                    <option value={"medium"}>Medio</option>
                    <option value={"hard"}>Difícil</option>
                  </select>
                </div>
                <div className="form-control flex justify-center">
                  <button type="submit" className="btn btn-outline btn-accent">
                    Empezar Juego
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="text-3xl font-bold">Tabla de puntuaciones</h3>
            <div className="h-[400px] overflow-x-auto">
              <table className="table table-zebra">
                <thead className="sticky top-0">
                  <tr>
                    <th>Nombre</th>
                    <th>Puntuación</th>
                  </tr>
                </thead>
                <tbody>
                  <Suspense
                    fallback={
                      <tr className="hover">
                        <th colSpan="2" className="text-center">
                          <Loader />
                        </th>
                      </tr>
                    }
                  >
                    {points.map((point) => (
                      <tr key={point.id} className="hover">
                        <td>{point.username}</td>
                        <td>{point.points}</td>
                      </tr>
                    ))}
                  </Suspense>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <dialog id="md1" className="modal" ref={modalRef}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Crear nueva palabra</h3>
          <div className="py-4">
            {showResponse && (
              <Alert
                type={responseType}
                message={responseMessage}
                action={handleCloseResponse}
                showAction={true}
              />
            )}
            <Form method="POST" noValidate>
              <div className="form-control">
                <label className="label" htmlFor="word">
                  <span className="label-text">Palabra</span>
                </label>
                <input
                  className="input input-bordered input-primary"
                  id="word"
                  name="word"
                  type="text"
                  placeholder="Casa"
                />
              </div>
              <div className="form-control">
                <label className="label" htmlFor="clue">
                  <span className="label-text">Pista</span>
                </label>
                <textarea
                  className="textarea textarea-bordered textarea-primary"
                  name="clue"
                  id="clue"
                  placeholder="Lugar donde vives"
                  rows="3"
                ></textarea>
              </div>
              <div className="form-control">
                <label className="label" htmlFor="difficulty">
                  <span className="label-text">Dificultad</span>
                </label>
                <select
                  id="difficulty"
                  className="select select-bordered select-primary"
                  name="difficulty"
                  defaultValue={""}
                >
                  <option value={""}>Seleccione la dificultad</option>
                  <option value={"easy"}>Fácil</option>
                  <option value={"medium"}>Medio</option>
                  <option value={"hard"}>Difícil</option>
                </select>
              </div>
              <div className="form-control">
                <label htmlFor="time" className="label">
                  <span className="label-text">Tiempo</span>
                </label>
                <input
                  type="number"
                  id="time"
                  name="time"
                  className="input input-bordered input-primary"
                  placeholder="400"
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary w-full" type="submit">
                  Crear
                </button>
              </div>
            </Form>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Cancelar</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

Dashboard.propTypes = {
  logout: PropTypes.func.isRequired,
  setPlayLoseSongFinish: PropTypes.func.isRequired,
  setPlayWinSongFinish: PropTypes.func.isRequired,
  playLoseSongFinish: PropTypes.bool.isRequired,
  playWinSongFinish: PropTypes.bool.isRequired,
};

export default Dashboard;
