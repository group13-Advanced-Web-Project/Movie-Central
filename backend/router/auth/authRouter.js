import { Router } from "express";
import pkg from "express-openid-connect";
const { auth, requiresAuth } = pkg;

const router = Router();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: "a long, randomly-generated string stored in env",
  baseURL: "http://localhost:3001",
  clientID: "NJd7JS9dCAuy2o2ue1NeszQyHFPSIDjK",
  issuerBaseURL: "https://dev-7kpfcjqno5sf8r2r.eu.auth0.com",
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
router.use(auth(config));

// req.isAuthenticated is provided from the auth router
router.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

router.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

export default router;
