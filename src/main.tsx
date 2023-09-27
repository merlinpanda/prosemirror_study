import React from "react";
import * as buffer from "buffer";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

if (typeof (window as any).Buffer === "undefined") {
  (window as any).Buffer = buffer.Buffer;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
