import React from "react";
import { createRoot } from "react-dom/client"; 
import { Auth0Provider } from "@auth0/auth0-react";
import { MoviesProvider } from "./context/MoviesContext";
import "./index.css";
import App from "./App";

// Fetch Auth0 credentials from environment variables
const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

const root = createRoot(document.getElementById("root"));
console.log("Domain:", domain);
console.log("Client ID:", clientId);


root.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    // authorizationParams={{
    //   redirect_uri: window.location.origin,
    // }}
    useRefreshTokens
    cacheLocation="localstorage"
  >
    <MoviesProvider>
      <App />
    </MoviesProvider>
  </Auth0Provider>
);
