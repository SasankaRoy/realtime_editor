import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import { App } from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // ***in React.StrictMode  useEffect render's twice in 'development' but not in 'production'.
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
