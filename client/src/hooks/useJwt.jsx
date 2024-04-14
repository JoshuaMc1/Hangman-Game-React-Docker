import { useState, useEffect } from "react";

const useJwt = () => {
  const [jwt, setJwt] = useState(null);

  useEffect(() => {
    const storedJwt = localStorage.getItem("jwt");

    if (storedJwt) {
      setJwt(storedJwt);
    }
  }, []);

  const saveJwt = (token) => {
    localStorage.setItem("jwt", token);
    setJwt(token);
  };

  const removeJwt = () => {
    localStorage.removeItem("jwt");
    setJwt(null);
  };

  return { jwt, saveJwt, removeJwt };
};

export default useJwt;
