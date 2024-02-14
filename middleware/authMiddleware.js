import jwt from "jsonwebtoken";
import { HttpError } from "../helpers/HttpError.js";
import { serverConfig } from "../configs/serverConfig.js";
import { User } from "../models/userModel.js";

const { JWT_SECRET } = process.env;
console.log(JWT_SECRET);

const verifyToken = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(new HttpError(401, "Not authorized"));
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || user.token !== token || !user.token) {
      next(new HttpError(401, "Not authorized"));
    }
    req.user = user;
    next();
  } catch {
    next(new HttpError(401, "Not authorized"));
  }
};

export { verifyToken };
