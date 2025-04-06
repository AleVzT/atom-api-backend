import { TaskRepository } from "../../../infrastructure/firestore/task.repository";
import { Task } from "../../../domain/entities/task.entity";

export class GetAllTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(userId: string): Promise<Task[]> {
    return this.taskRepository.findByUserId(userId);
  }
}