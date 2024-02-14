import { catchAsync } from "../helpers/catchAsync.js";
import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";
import * as jwtService from "../services/jwtService.js";
import { HttpError } from "../helpers/HttpError.js";

export const register = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new HttpError(400, "Email and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new HttpError(409, "Email in use");
  }

  // Хешування паролю
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    subscription: "starter",
  });

  newUser.token = jwtService.signToken(newUser._id);

  await newUser.save();

  res.status(201).json({
    token: newUser.token,
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
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

    const { email, subscription } = req.user;
    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
