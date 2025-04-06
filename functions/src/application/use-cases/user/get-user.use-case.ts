import { UserRepository } from "../../../infrastructure/firestore/user.repository";
import { validateCreateUserDTO } from "../../../utils/validators";
import { UserDTO } from "./dto/user.dto";

export class GetUserUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(dto: UserDTO) {
    if (!validateCreateUserDTO(dto)) {
      throw new Error("Datos de usuario inválidos");
    }
    const { email } = dto;
    return this.userRepo.getUser(email);
  }
}
