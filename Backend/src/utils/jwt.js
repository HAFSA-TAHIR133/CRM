import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const accessSecret = process.env.JWT_SECRET_KEY || "secret";
const refreshSecret = process.env.REFRESH_SECRET_KEY || process.env.JWT_REFRESH_KEY || "refresh";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    accessSecret,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id
    },
    refreshSecret,
    { expiresIn: "7d" }
  );
};