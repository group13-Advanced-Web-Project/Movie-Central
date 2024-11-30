import React from "react";
import { createRoot } from "react-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { MoviesProvider } from "./context/MoviesContext";
import "./index.css";
import App from "./App";

const root = createRoot(document.getElementById("root"));

root.render(
  <Auth0Provider
    domain="dev-ceeovj0kndp8rnbf.us.auth0.com"
    clientId="Qc6QVZmgimeV13Y8adloRn9siwrSh3AG"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
    redirect_uri={window.location.origin}
    useRefreshTokens
    cacheLocation="localstorage"
  >
    <MoviesProvider>
      <App />
    </MoviesProvider>
  </Auth0Provider>
);
