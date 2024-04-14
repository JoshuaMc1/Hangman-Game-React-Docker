import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Index, { action as indexAction } from "./pages/Index";
import Error from "./pages/Error";
import Dashboard, { action as dashboardAction } from "./pages/Dashboard";
import useJwt from "./hooks/useJwt";
import Game from "./pages/Game";
import Page404 from "./pages/Page404";
import { useState } from "react";

function App() {
  const { removeJwt } = useJwt();
  const [difficulty, setDifficulty] = useState(null);
  const [message, setMessage] = useState("");
  const [playWinSong, setPlayWinSong] = useState(false);
  const [playLoseSong, setPlayLoseSong] = useState(false);

  const logout = () => {
    removeJwt();

    setMessage("Sesión finalizada correctamente.");
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout
          setDifficulty={setDifficulty}
          difficulty={difficulty}
          message={message}
          setMessage={setMessage}
        />
      ),
      children: [
        {
          index: true,
          element: <Index />,
          action: indexAction,
          errorElement: <Error />,
        },
        {
          path: "/dashboard",
          element: (
            <Dashboard
              logout={logout}
              setPlayLoseSongFinish={setPlayLoseSong}
              setPlayWinSongFinish={setPlayWinSong}
              playLoseSongFinish={playLoseSong}
              playWinSongFinish={playWinSong}
            />
          ),
          errorElement: <Error />,
          action: dashboardAction,
        },
        {
          path: "/game/:username",
          element: (
            <Game
              setPlayWinSongFinish={setPlayWinSong}
              setPlayLoseSongFinish={setPlayLoseSong}
            />
          ),
          errorElement: <Error />,
        },
        {
          path: "*",
          element: <Page404 />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
