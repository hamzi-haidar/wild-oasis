import { useEffect, useRef } from "react";

//listenCapturing is used to stop propagation but insteed we are using e.stopPropagation in the Menus in the onClick event listeners were we also call this function so we are passing it as false
export function useOutsideClick(handler, listenCapturing = false) {
  const ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          handler(e);
        }
      }
      document.addEventListener("click", handleClick, listenCapturing);

      return () =>
        document.removeEventListener("click", handleClick, listenCapturing);
    },
    [handler, listenCapturing]
  );

  return ref;
}
