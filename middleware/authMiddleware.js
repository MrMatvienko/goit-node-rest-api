import jwt from "jsonwebtoken";
import { HttpError } from "../helpers/HttpError.js";
import { User } from "../models/userModel.js";
import Jimp from "jimp";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const { JWT_SECRET } = process.env;
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "tmp"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

export const upload = multer({ storage });

export const processAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new HttpError(400, "No file uploaded");
    }

    const uploadedAvatarPath = req.file.path;
    const imageName = req.file.filename;

    const image = await Jimp.read(uploadedAvatarPath);
    await image.resize(250, 250).writeAsync(uploadedAvatarPath);

    req.avatarPath = uploadedAvatarPath;
    req.imageName = imageName;

    next();
  } catch (error) {
    next(error);
  }
};

export { verifyToken };
