import { catchAsync } from "../helpers/catchAsync.js";
import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";
import * as jwtService from "../services/jwtService.js";
import { HttpError } from "../helpers/HttpError.js";

export const register = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Перевірка чи введено обов'язкові поля
  if (!email || !password) {
    throw new HttpError(400, "Email and password are required");
  }

  // Перевірка чи користувач з таким email вже існує
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new HttpError(409, "Email in use");
  }

  // Хешування паролю
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створення нового користувача без токену
  const newUser = await User.create({
    email,
    password: hashedPassword,
    subscription: "starter", // По замовчуванню
  });

  // Генерація токену після створення користувача
  newUser.token = jwtService.signToken(newUser._id);

  // Збереження користувача з токеном
  await newUser.save();

  // Повернення успішної відповіді
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

  // Перевірка чи введено обов'язкові поля
  if (!email || !password) {
    throw new HttpError(400, "Email and password are required");
  }

  // Пошук користувача за email
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new HttpError(401, "Email or password is wrong");
  }

  // Перевірка паролю
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new HttpError(401, "Email or password is wrong");
  }

  // Генерація токена
  const token = jwtService.signToken(user._id);

  // Відправлення успішної відповіді
  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

export const logout = async (req, res) => {
  try {
    // Отримати токен з заголовка Authorization
    const token = req.headers.authorization;

    // Перевірити, чи токен існує
    if (!token) {
      throw new HttpError(401, "Not authorized");
    }

    // Розшифрувати та перевірити токен
    const decoded = jwt.verify(token.split(" ")[1], serverConfig.jwtSecret);

    // Отримати id користувача з токена
    const userId = decoded.id;

    // Знайти користувача за _id
    const user = await User.findById(userId);

    // Перевірити, чи користувач існує
    if (!user) {
      throw new HttpError(401, "Not authorized");
    }

    // Знищити токен користувача
    user.token = null;
    await user.save();

    // Успішна відповідь
    res.status(204).end();
  } catch (error) {
    // В разі помилки повернути помилку Unauthorized
    throw new HttpError(401, "Not authorized");
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    // Отримати токен з заголовка Authorization
    const token = req.headers.authorization;

    // Перевірити, чи токен існує
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Розшифрувати та перевірити токен
    const decoded = jwt.verify(token.split(" ")[1], serverConfig.jwtSecret);

    // Отримати id користувача з токена
    const userId = decoded.id;

    // Знайти користувача за _id
    const user = await User.findById(userId);

    // Перевірити, чи користувач існує
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Повернути дані користувача у відповіді
    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    // В разі помилки повернути помилку Unauthorized
    return res.status(401).json({ message: "Not authorized" });
  }
};
