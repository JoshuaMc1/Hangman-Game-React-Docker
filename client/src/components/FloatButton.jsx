import PropTypes from "prop-types";
import { IoPlayCircleSharp, IoPauseCircleSharp } from "react-icons/io5";

const FloatButton = ({ play, setPlay }) => {
  return (
    <div className="fixed right-5 top-5">
      <button className="btn btn-circle" onClick={() => setPlay(!play)}>
        {play ? (
          <IoPauseCircleSharp size={30} color="white" />
        ) : (
          <IoPlayCircleSharp size={30} color="white" />
        )}
      </button>
    </div>
  );
};

FloatButton.propTypes = {
  play: PropTypes.bool,
  setPlay: PropTypes.func,
};

export default FloatButton;
