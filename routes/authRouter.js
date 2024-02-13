import express from "express";
import {
  getCurrentUser,
  login,
  logout,
  register,
} from "../controllers/authControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", verifyToken, logout);
authRouter.get("/current", verifyToken, getCurrentUser);

export { authRouter };
