import { UserDTO } from "./dto/user.dto";
import { db } from "../../../infrastructure/firebase";
import { User } from "../../../domain/entities/user.entity";
import { UserRepository } from "../../../infrastructure/firestore/user.repository";
import { validateCreateUserDTO } from "../../../utils/validators";

const USERS_COLLECTION = "users";

export class CreateUserUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(dto: UserDTO): Promise<User> {
    if (!validateCreateUserDTO(dto)) {
      throw new Error("Datos de usuario inválidos");
    }
    const { email } = dto;
    const existingUser =  await this.userRepo.getUser(email);

    if (existingUser) {
      throw new Error("El email ya está registrado");
    }

    const userRef = await db.collection(USERS_COLLECTION).add({
      email: email,
    });
  
    const userId = userRef.id;
  
    const user = new User({
      id: userId,
      email: email,
    });
    await this.userRepo.create(user);
    
    return user;
  }
}
