import express from "express";

import {
  getCurrentUser,
  login,
  logout,
  register,
  updateAvatar,
} from "../controllers/authControllers.js";
import {
  processAvatar,
  upload,
  verifyToken,
} from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", verifyToken, logout);
authRouter.get("/current", verifyToken, getCurrentUser);
authRouter.patch(
  "/avatars",
  verifyToken,
  upload.single("avatar"),
  processAvatar,
  updateAvatar
);
export { authRouter };
