import { useEffect, useState } from "react";

const usePageRefresh = () => {
  const [refreshConfirmed, setRefreshConfirmed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 116) {
        event.preventDefault();

        const result = window.confirm(
          "¿Estás seguro de que deseas actualizar la página?\nEs posible que los cambios que implementaste no se puedan guardar.",
        );

        if (result) {
          setRefreshConfirmed(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return refreshConfirmed;
};

export default usePageRefresh;
