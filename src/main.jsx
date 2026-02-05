import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { DataProvider } from "./context/DataContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>
)
