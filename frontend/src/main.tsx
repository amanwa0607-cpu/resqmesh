import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.tsx";


createRoot(
  document.getElementById("root")!
).render(
  <StrictMode>
    <App />
  </StrictMode>
);


/* =========================================
   RESQMESH OFFLINE MODE
========================================= */

if ("serviceWorker" in navigator) {
  window.addEventListener(
    "load",
    () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          console.log(
            "ResQMesh offline mode ready"
          );
        })
        .catch((error) => {
          console.error(
            "ResQMesh service worker failed:",
            error
          );
        });
    }
  );
}