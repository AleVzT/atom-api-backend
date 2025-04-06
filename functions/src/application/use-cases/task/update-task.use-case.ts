import { TaskRepository } from "../../../infrastructure/firestore/task.repository";
import { UpdateTaskDTO } from "./dto/update-task.dto";
import { Task } from "../../../domain/entities/task.entity";

export class UpdateTaskUseCase {
  constructor(private taskRepo: TaskRepository) {}

  async execute(id: string, dto: UpdateTaskDTO, userId: string): Promise<Task | null> {
    const task = await this.taskRepo.getById(id);
    if (!task || task.userId !== userId) return null;

    const data = task.toJSON();

    const updatedTask = new Task({
      ...data,
      title: dto.title ?? data.title,
      description: dto.description ?? data.description,
      completed: dto.completed ?? data.completed,
      updatedAt: new Date()
    });

    await this.taskRepo.update(updatedTask);
    return updatedTask;
  }
}
