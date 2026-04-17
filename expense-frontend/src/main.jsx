import React from "react";
import './index.css'
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="530487705514-1tb9gk3q3bq8megndqilmmp8vm52drdr.apps.googleusercontent.com">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);