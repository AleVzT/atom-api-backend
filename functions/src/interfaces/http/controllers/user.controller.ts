import { Response } from "express";
import { AuthenticatedRequest } from "../types/authenticated-request"; 
import { UserRepository } from "../../../infrastructure/firestore/user.repository";
import { CreateUserUseCase } from "../../../application/use-cases/user/create-user.use-case";
import { GetUserUseCase } from "../../../application/use-cases/user/get-user.use-case";
import { signToken } from "../../../utils/jwt";

export class UserController {
  constructor(private userRepo: UserRepository) {}

  loginUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { email } = req.body;
    
    if (!email || typeof email !== "string") {
      res.status(400).json({ message: "Email requerido" });
      return;
    }

    try {
      
      const useCase = new GetUserUseCase(this.userRepo);
      const user = await useCase.execute({ email });

      if (!user) {
        res.status(404).json({ message: "Usuario no registrado" });
        return;
      }

      const token = signToken(user);
      res.status(201).json({ user: { ...user }, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al buscar usuariox", error: err });
    }
  };

  createUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { email } = req.body;
    try {
    
      const useCase = new CreateUserUseCase(this.userRepo);
      const user = await useCase.execute({ email });

      const token = signToken(user);
      res.status(201).json({ user: { ...user }, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al crear usuario", error: err });
    }
  };
}

