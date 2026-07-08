import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id
    },
    process.env.REFRESH_SECRET_KEY,
    { expiresIn: "7d" }
  );
};