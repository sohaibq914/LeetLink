import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./index.css";
import App from "./components/App";

// Configure axios defaults
axios.defaults.baseURL = "http://localhost:8080";

// Set auth token if it exists
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
