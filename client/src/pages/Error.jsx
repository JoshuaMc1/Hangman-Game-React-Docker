import { Link, useRouteError } from "react-router-dom";
import logo from "../assets/img/logo.png";

const Error = () => {
  const error = useRouteError();

  console.log(error);

  return (
    <>
      <div className="card bg-base-300 shadow-xl">
        <div className="card-body items-center gap-6 text-center">
          <div className="flex justify-center">
            <div className="avatar">
              <div className="w-32 rounded-full bg-secondary-content p-2">
                <img src={logo} alt="logo" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold">¡Vaya!</h1>
          <p className="text-center text-xl">
            Lo sentimos, al parecer a ocurrido un error. Vuelve a intentarlo mas
            tarde.
          </p>

          <p className="text-center text-lg text-error">
            {error.statusText || error.message}
          </p>
          <div className="card-actions justify-end">
            <Link to="/" className="btn btn-primary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Error;
