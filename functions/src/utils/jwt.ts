import jwt from "jsonwebtoken";
import { User } from "../domain/entities/user.entity";

const JWT_SECRET = process.env.JWT_SECRET || "4eafe93ce105253227da06bed4d3dedff25b6e22723dc6e0a7b80c3ffad6c559";

export const signToken = (user: User): string => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "24h",
  });
};

export const verifyToken = (token: string): { id: string; email: string } => {
  return jwt.verify(token, JWT_SECRET) as { id: string; email: string };
};

