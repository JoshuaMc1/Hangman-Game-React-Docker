import PropTypes from "prop-types";

const Alert = ({
  type = "info",
  message = "Error",
  showAction = false,
  action,
}) => {
  switch (type) {
    case "info":
      return (
        <div role="alert" className={`alert alert-info mb-2 flex`}>
          <div className="flex w-full flex-row items-center justify-between gap-2">
            <span className="font-semibold">{message}</span>
            {showAction && (
              <button className="btn-base-100 btn btn-sm" onClick={action}>
                Cerrar
              </button>
            )}
          </div>
        </div>
      );
    case "error":
      return (
        <div role="alert" className={`alert alert-error mb-2 flex`}>
          <div className="flex w-full flex-row items-center justify-between gap-2">
            <span className="font-semibold">{message}</span>
            {showAction && (
              <button className="btn-base-100 btn btn-sm" onClick={action}>
                Cerrar
              </button>
            )}
          </div>
        </div>
      );
    case "success":
      return (
        <div role="alert" className={`alert alert-success mb-2 flex`}>
          <div className="flex w-full flex-row items-center justify-between gap-2">
            <span className="font-semibold">{message}</span>
            {showAction && (
              <button className="btn-base-100 btn btn-sm" onClick={action}>
                Cerrar
              </button>
            )}
          </div>
        </div>
      );
    case "warning":
      return (
        <div role="alert" className={`alert alert-warning mb-2 flex`}>
          <div className="flex w-full flex-row items-center justify-between gap-2">
            <span className="font-semibold">{message}</span>
            {showAction && (
              <button className="btn-base-100 btn btn-sm" onClick={action}>
                Cerrar
              </button>
            )}
          </div>
        </div>
      );
    default:
      return (
        <div role="alert" className={`alert alert-info mb-2 flex`}>
          <div className="flex w-full flex-row items-center justify-between gap-2">
            <span className="font-semibold">{message}</span>
            {showAction && (
              <button className="btn-base-100 btn btn-sm" onClick={action}>
                Cerrar
              </button>
            )}
          </div>
        </div>
      );
  }
};

Alert.propTypes = {
  type: PropTypes.string,
  message: PropTypes.string,
  action: PropTypes.func,
  showAction: PropTypes.bool,
};

export default Alert;
