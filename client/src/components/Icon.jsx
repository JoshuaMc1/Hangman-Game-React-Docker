import {
  FaCircleInfo,
  FaCircleExclamation,
  FaCircleCheck,
} from "react-icons/fa6";
import { FaTimesCircle } from "react-icons/fa";

const Icon = ({ icon, size = 24 }) => {
  const icons = {
    info: <FaCircleInfo size={size} />,
    error: <FaTimesCircle size={size} />,
    success: <FaCircleCheck size={size} />,
    warning: <FaCircleExclamation size={size} />,
  };

  return icons[icon];
};

export default Icon;
