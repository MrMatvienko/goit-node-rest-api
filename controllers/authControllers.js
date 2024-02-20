import { catchAsync } from "../helpers/catchAsync.js";
import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";
import * as jwtService from "../services/jwtService.js";
import { HttpError } from "../helpers/HttpError.js";
import gravatar from "gravatar";
import path from "path";
import Jimp from "jimp";
import jwt from "jsonwebtoken";
import { promises as fsPromises } from "fs";
export const register = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new HttpError(400, "Email and password are required");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new HttpError(409, "Email in use");
  }

  const avatarURL = gravatar.url(email, { s: "200", d: "retro" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    subscription: "starter",
    avatarURL,
  });

  newUser.token = jwtService.signToken(newUser._id);

  await newUser.save();

  res.status(201).json({
    token: newUser.token,
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new HttpError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new HttpError(401, "Email or password is wrong");
  }

  res.status(200).json({
    token: user.token,
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    },
  });
});

export const logout = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(
    _id,
    { token: "" },
    { new: true }
  );

  if (!result) {
    throw new HttpError(404, "User not found");
  }
  res.status(204).end();
};

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("User not found");
    }

    const { email, subscription, avatarURL } = req.user;
    res.status(200).json({
      email,
      subscription,
      avatarURL,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const user = req.user;

    if (!req.file) {
      throw new HttpError(400, "No file uploaded");
    }

    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new HttpError(401, "Not authorized");
    }
    const token = authorizationHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id !== user._id.toString()) {
      throw new HttpError(403, "Access denied");
    }

    const uploadedAvatarPath = req.file.path;
    const imageName = req.file.filename;

    const image = await Jimp.read(uploadedAvatarPath);
    await image.resize(250, 250).writeAsync(uploadedAvatarPath);

    const newAvatarName = `${user._id}-${imageName}`;
    const newAvatarPath = path.join(
      process.cwd(),
      "public",
      "avatars",
      newAvatarName
    );

    await fsPromises.rename(uploadedAvatarPath, newAvatarPath);

    const avatarURL = `/avatars/${newAvatarName}`;

    user.avatarURL = avatarURL;
    await user.save();

    res.status(200).json({ avatarURL });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
