import { Task } from "../../../domain/entities/task.entity";
import { TaskRepository } from "../../../infrastructure/firestore/task.repository";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { v4 as uuidv4 } from "uuid";

export class CreateTaskUseCase {
  constructor(private taskRepo: TaskRepository) {}

  async execute(dto: CreateTaskDTO, userId: string): Promise<Task> {
    const now = new Date();
    const task = new Task({
      id: uuidv4(),
      title: dto.title,
      description: dto.description,
      completed: false,
      createdAt: now,
      updatedAt: now,
      userId,
    });

    await this.taskRepo.create(task);
    return task;
  }
}
