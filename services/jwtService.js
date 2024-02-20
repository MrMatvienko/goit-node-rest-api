import jwt from "jsonwebtoken";
import { HttpError } from "../helpers/HttpError.js";
import { serverConfig } from "../configs/serverConfig.js";

const signToken = (id) =>
  jwt.sign({ id }, serverConfig.jwtSecret, {
    expiresIn: serverConfig.jwtExpiresIn,
  });

const checkToken = (token) => {
  if (!token) throw new HttpError(401, "Not logged in..");

  try {
    const { id } = jwt.verify(token, serverConfig.jwtSecret);

    return id;
  } catch (err) {
    throw new HttpError(401, "Not logged in..");
  }
};

export { checkToken, signToken };
