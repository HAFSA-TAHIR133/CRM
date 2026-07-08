import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT || 8000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET_KEY || "secret",
  jwtRefreshSecret:process.env.JWT_REFRESH_KEY || "refresh",
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || "postgres",
  },
};