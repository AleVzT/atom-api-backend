import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/authenticated-request";
import { TaskRepository } from "../../../infrastructure/firestore/task.repository";
import { validateCreateTaskDTO, validateUpdateTaskDTO } from "../../../utils/validators";
import { CreateTaskUseCase } from "../../../application/use-cases/task/create-task.use-case";
import { UpdateTaskUseCase } from "../../../application/use-cases/task/update-task.use-case";
import { DeleteTaskUseCase } from "../../../application/use-cases/task/delete-task.use-case";
import { GetAllTasksUseCase } from "../../../application/use-cases/task/get-all-tasks.use-case";

const taskRepo = new TaskRepository();

export class TaskController {
  constructor(private readonly taskRepo: TaskRepository) {}

  getAllTasks = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "Usuario no autenticado" });
    }
    try {
      const useCase = new GetAllTasksUseCase(this.taskRepo);
      const tasks = await useCase.execute(userId);
      res.status(200).json(tasks.map(task => task.toJSON()));
    } catch (err) {
      res.status(500).json({ message: "Error al obtener tareas", error: err });
    }
  }

  createTask = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "Usuario no autenticado" });
    }
    const dto = {
      ...req.body,
      userId: userId,
    };
    if (!validateCreateTaskDTO(dto)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }
    try {
      const useCase = new CreateTaskUseCase(this.taskRepo);
      const newTask = await useCase.execute(dto, userId);
      res.status(201).json(newTask.toJSON());
    } catch (err) {
      res.status(500).json({ message: "Error al crear tarea", error: err });
    }
  }

  updateTask = async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id;
    const dto = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "Usuario no autenticado" });
    }

    if (!validateUpdateTaskDTO(dto)) {
      return res.status(400).json({ message: "Datos inválidos para actualizar" });
    }
    try {
      const useCase = new UpdateTaskUseCase(this.taskRepo);
      const updated = await useCase.execute(id, dto, userId);

      if (!updated) {
        return res.status(404).json({ message: "Tarea no encontrada" });
      }

      res.status(200).json(updated.toJSON());
    } catch (err) {
      res.status(500).json({ message: "Error al actualizar tarea", error: err });
    }
  }

  deleteTask = async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "Usuario no autenticado" });
    }
    try {
      const useCase = new DeleteTaskUseCase(this.taskRepo);
      const deleted = await useCase.execute(id, userId);
      if (!deleted) {
        return res.status(404).json({ message: "Tarea no encontrada" });
      }

      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Error al eliminar tarea", error: err });
    }
  }
}
