import { CreateTaskDTO } from "../application/use-cases/task/dto/create-task.dto";
import { UpdateTaskDTO } from "../application/use-cases/task/dto/update-task.dto";
import { UserDTO } from "../application/use-cases/user/dto/user.dto";

export function validateCreateTaskDTO(dto: any): dto is CreateTaskDTO {
  return (
    typeof dto.title === "string" &&
    (dto.description === undefined || typeof dto.description === "string")
  );
}

export function validateUpdateTaskDTO(dto: any): dto is UpdateTaskDTO {
  return (
    (dto.title === undefined || typeof dto.title === "string") &&
    (dto.description === undefined || typeof dto.description === "string") &&
    (dto.completed === undefined || typeof dto.completed === "boolean")
  );
}

export function validateCreateUserDTO(dto: UserDTO): boolean {
  if (!dto || typeof dto.email !== "string") return false;

  const email = dto.email.trim();
  if (email.length === 0) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
