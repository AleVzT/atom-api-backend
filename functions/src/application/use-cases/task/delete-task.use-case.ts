import { TaskRepository } from "../../../infrastructure/firestore/task.repository";

export class DeleteTaskUseCase {
  constructor(private taskRepo: TaskRepository) {}
  
  async execute(id: string, userId: string): Promise<boolean> {
    const task = await this.taskRepo.getById(id);
    if (!task || task.userId !== userId) return false;

    await this.taskRepo.delete(id);
    return true;
  }
}
