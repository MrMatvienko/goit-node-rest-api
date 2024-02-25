import dotenv from "dotenv";
dotenv.config();

const serverConfig = {
  mongoUrl: process.env.MONGO_URL ?? "mongodb://localhost:27017",
  port: process.env.PORT ?? 4000,
  environment: process.env.NODE_ENV ?? "development",
  jwtSecret: process.env.JWT_SECRET ?? "super-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES ?? "50m",
  emailFrom: process.env.EMAIL_FROM ?? "admin@example.com",
  mailtrapHost: process.env.MAILTRAP_HOST ?? "",
  mailtrapPort: process.env.MAILTRAP_PORT ?? 100,
  mailtrapUser: process.env.MAILTRAP_USER ?? "",
  mailtrapPass: process.env.MAILTRAP_PASS ?? "",
};
export { serverConfig };
