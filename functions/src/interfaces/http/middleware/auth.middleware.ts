import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/authenticated-request";
import { verifyToken } from "../../../utils/jwt";


export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    res.status(401).json({ message: "Acceso denegado, token no proporcionado" });
    return;
  }

  try {
    const user = verifyToken(token);
    req.user = { id: user.id, email: user.email };
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado", error });
  }
};



