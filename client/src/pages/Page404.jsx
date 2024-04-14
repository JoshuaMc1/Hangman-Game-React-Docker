import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";

const Page404 = () => {
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
          <h1 className="text-5xl font-bold">
            Oops! - <span className="text-error">404</span>
          </h1>
          <p className="text-center text-xl">Página no encontrada</p>
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

export default Page404;
