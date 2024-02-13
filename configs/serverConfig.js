import dotenv from "dotenv";
dotenv.config();

const serverConfig = {
  mongoUrl: process.env.MONGO_URL ?? "mongodb://localhost:27017",
  port: process.env.PORT ?? 4000,
  environment: process.env.NODE_ENV ?? "development",
  jwtSecret: process.env.JWT_SECRET ?? "super-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES ?? "50m",
};
export { serverConfig };
