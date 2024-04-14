import { Outlet } from "react-router-dom";
import WaveAnimation from "./WaveAnimation";
import PropTypes from "prop-types";
import ReactHowler from "react-howler";
import bgsong from "../assets/audio/bgsong2.mp3";
import FloatButton from "./FloatButton";
import { useState } from "react";

const Layout = ({ setDifficulty, difficulty, message, setMessage }) => {
  const [play, setPlay] = useState(true);

  return (
    <>
      <ReactHowler src={bgsong} playing={play} loop={true} volume={0.3} />
      <WaveAnimation />
      <main className="container flex min-h-screen items-center justify-center gap-6 py-3">
        <FloatButton play={play} setPlay={setPlay} />
        <Outlet context={{ setDifficulty, difficulty, message, setMessage }} />
      </main>
    </>
  );
};

Layout.propTypes = {
  setDifficulty: PropTypes.func,
  difficulty: PropTypes.string,
  message: PropTypes.string,
  setMessage: PropTypes.func,
};

export default Layout;
