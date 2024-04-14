/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import logo from "../assets/img/logo.png";
import {
  Form,
  useActionData,
  Navigate,
  useOutletContext,
} from "react-router-dom";
import Alert from "../components/Alert.jsx";
import { login, register } from "../services/auth";
import useJwt from "../hooks/useJwt";

export async function action({ request }) {
  let formData = await request.formData();
  let { _action, username, password } = Object.fromEntries(formData);

  switch (_action) {
    case "login": {
      if (!username) {
        return {
          status: false,
          message: "El usuario es requerido.",
        };
      }

      if (!password) {
        return {
          status: false,
          message: "La contraseña es requerida.",
        };
      }

      const loginResponse = await login(username, password);

      if (loginResponse.success) {
        return {
          status: true,
          message: loginResponse.message,
          token: loginResponse.token,
          redirect: true,
        };
      }

      return {
        status: false,
        message: loginResponse.message,
      };
    }

    case "register": {
      if (!username) {
        return {
          status: false,
          message: "El usuario es requerido.",
        };
      }

      if (!password) {
        return {
          status: false,
          message: "La contraseña es requerida.",
        };
      }

      if (password.length < 8) {
        return {
          status: false,
          message: "La contraseña debe tener al menos 8 caracteres.",
        };
      }

      const registerResponse = await register(username, password);

      if (registerResponse.success) {
        return {
          status: true,
          message: registerResponse.message,
        };
      }

      return {
        status: false,
        message: registerResponse.message,
      };
    }

    default:
      return {
        status: false,
        message: "Acción inválida.",
      };
  }
}
const Index = () => {
  const errors = useActionData();
  const [showError, setShowError] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [errorType, setErrorType] = useState("");
  const [goToDashboard, setGoToDashboard] = useState(false);
  const { jwt, saveJwt } = useJwt();
  const { message, setMessage } = useOutletContext();

  useEffect(() => {
    if (errors) {
      setShowError(true);
      setErrorType(errors.status ? "info" : "error");

      if (errors?.redirect) {
        setGoToDashboard(true);
        saveJwt(errors.token);
      }
    } else {
      setShowError(false);
      setErrorType("");
    }
  }, [errors, saveJwt, setShowError, setErrorType]);

  useEffect(() => {
    if (jwt) {
      setGoToDashboard(true);
    }
  }, [jwt]);

  useEffect(() => {
    if (message) {
      setShowMessage(true);
    }
  }, [message, setShowMessage]);

  const handleClose = () => {
    setShowMessage(false);
    setMessage("");
  };

  return (
    <div className="card bg-base-300 shadow-xl">
      <div className="card-body">
        {goToDashboard && <Navigate to="/dashboard" />}

        {showError && <Alert type={errorType} message={errors.message} />}

        {showMessage && (
          <Alert
            type="info"
            message={message}
            action={handleClose}
            showAction={true}
          />
        )}

        <div className="flex justify-center">
          <div className="avatar">
            <div className="w-32 rounded-full bg-secondary-content p-2">
              <img src={logo} alt="logo" />
            </div>
          </div>
        </div>
        <h2 className="mb-8 text-center text-3xl font-bold">
          Juego del Ahorcado
        </h2>
        <div className="flex items-center justify-center">
          <div role="tablist" className="tabs tabs-lifted">
            <input
              type="radio"
              name="tabOne"
              role="tab"
              className="tab"
              aria-label="Iniciar sesión"
              defaultChecked
            />
            <div
              role="tabpanel"
              className="tab-content rounded-box border-base-100 p-6"
            >
              <Form method="POST" className="flex flex-col gap-4" noValidate>
                <input type="hidden" name="_action" defaultValue="login" />
                <div className="form-control">
                  <label htmlFor="lUsername" className="label">
                    <span className="label-text">Nombre de usuario</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered input-primary"
                    placeholder="JuanPerez"
                    name="username"
                    id="lUsername"
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="lPassword" className="label">
                    <span className="label-text">Contraseña</span>
                  </label>
                  <input
                    type="password"
                    className="input input-bordered input-primary"
                    placeholder="********"
                    name="password"
                    id="lPassword"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-outline btn-accent w-full"
                >
                  Iniciar Sesión
                </button>
              </Form>
            </div>
            <input
              type="radio"
              name="tabOne"
              role="tab"
              className="tab"
              aria-label="Regístrate"
            />
            <div
              role="tabpanel"
              className="tab-content rounded-box border-base-100 p-6"
            >
              <Form method="POST" className="flex flex-col gap-4" noValidate>
                <input type="hidden" name="_action" defaultValue="register" />
                <div className="form-control">
                  <label htmlFor="rUsername" className="label">
                    <span className="label-text">Nombre de usuario</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered input-primary"
                    name="username"
                    placeholder="JuanPerez"
                    id="rUsername"
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="rPassword" className="label">
                    <span className="label-text">Contraseña</span>
                  </label>
                  <input
                    type="password"
                    className="input input-bordered input-primary"
                    name="password"
                    placeholder="********"
                    id="rPassword"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-outline btn-accent w-full"
                >
                  Registrarse
                </button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
