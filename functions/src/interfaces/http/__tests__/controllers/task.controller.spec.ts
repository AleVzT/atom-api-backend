import { TaskController } from "../../controllers/task.controller";
import { TaskRepository } from "../../../../infrastructure/firestore/task.repository";
import { CreateTaskUseCase } from "../../../../application/use-cases/task/create-task.use-case";
import { UpdateTaskUseCase } from "../../../../application/use-cases/task/update-task.use-case";
import { DeleteTaskUseCase } from "../../../../application/use-cases/task/delete-task.use-case";
import { GetAllTasksUseCase } from "../../../../application/use-cases/task/get-all-tasks.use-case";
import { validateCreateTaskDTO, validateUpdateTaskDTO } from "../../../../utils/validators";

jest.mock("../../../../infrastructure/firestore/task.repository");
jest.mock("../../../../application/use-cases/task/create-task.use-case");
jest.mock("../../../../application/use-cases/task/update-task.use-case");
jest.mock("../../../../application/use-cases/task/delete-task.use-case");
jest.mock("../../../../application/use-cases/task/get-all-tasks.use-case");
jest.mock("../../../../utils/validators", () => ({
  validateCreateTaskDTO: jest.fn(),
  validateUpdateTaskDTO: jest.fn(),
}));

const mockTask = {
  toJSON: () => ({
    id: "task1",
    title: "Test Task",
    completed: false,
    createdAt: new Date("2025-04-06T17:41:10.000Z"),
  }),
};

const mockReq = (userId?: string, body: any = {}, params: any = {}) => ({
  user: userId ? { id: userId } : undefined,
  body,
  params,
});

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("TaskController", () => {
  let controller: TaskController;

  beforeEach(() => {
    controller = new TaskController(new TaskRepository() as any);
    jest.clearAllMocks();
  });

  describe("getAllTasks", () => {
    it("debería retornar las tareas del usuario", async () => {
      const req = mockReq("user1");
      const res = mockRes();

      (GetAllTasksUseCase as any).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue([mockTask]),
      }));

      await controller.getAllTasks(req as any, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockTask.toJSON()]);
    });

    it("debería retornar 400 si no hay usuario", async () => {
      const req = mockReq(undefined);
      const res = mockRes();

      await controller.getAllTasks(req as any, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Usuario no autenticado" });
    });

    it("debería manejar errores", async () => {
      const req = mockReq("user1");
      const res = mockRes();

      (GetAllTasksUseCase as any).mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue("fail"),
      }));

      await controller.getAllTasks(req as any, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error al obtener tareas", error: "fail" });
    });
  });

  describe("createTask", () => {
    it("debería crear una tarea correctamente", async () => {
      const req = mockReq("user1", { title: "Nueva tarea" });
      const res = mockRes();

      (validateCreateTaskDTO as unknown as jest.Mock).mockReturnValue(true);
      (CreateTaskUseCase as any).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(mockTask),
      }));

      await controller.createTask(req as any, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTask.toJSON());
    });

    it("debería retornar 400 si no hay usuario", async () => {
      const req = mockReq(undefined, {});
      const res = mockRes();

      await controller.createTask(req as any, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Usuario no autenticado" });
    });

    it("debería manejar errores", async () => {
      const req = mockReq("user1", { title: "Nueva tarea" });
      const res = mockRes();

      (validateCreateTaskDTO as unknown as jest.Mock).mockReturnValue(true);
      (CreateTaskUseCase as any).mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue("error"),
      }));

      await controller.createTask(req as any, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error al crear tarea", error: "error" });
    });
  });

  describe("updateTask", () => {
    it("debería actualizar la tarea", async () => {
      const req = mockReq("user1", { title: "Actualizado" }, { id: "task1" });
      const res = mockRes();

      (validateUpdateTaskDTO as unknown as jest.Mock).mockReturnValue(true);
      (UpdateTaskUseCase as any).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(mockTask),
      }));

      await controller.updateTask(req as any, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTask.toJSON());
    });

    it("debería retornar 404 si no se encuentra la tarea", async () => {
      const req = mockReq("user1", { title: "Actualizado" }, { id: "task1" });
      const res = mockRes();

      (validateUpdateTaskDTO as unknown as jest.Mock).mockReturnValue(true);
      (UpdateTaskUseCase as any).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(null),
      }));

      await controller.updateTask(req as any, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Tarea no encontrada" });
    });

    it("debería manejar errores", async () => {
      const req = mockReq("user1", { title: "Actualizado" }, { id: "task1" });
      const res = mockRes();

      (validateUpdateTaskDTO as unknown as jest.Mock).mockReturnValue(true);
      (UpdateTaskUseCase as any).mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue("fail"),
      }));

      await controller.updateTask(req as any, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error al actualizar tarea", error: "fail" });
    });
  });

  describe("deleteTask", () => {
    it("debería eliminar una tarea", async () => {
      const req = mockReq("user1", {}, { id: "task1" });
      const res = mockRes();

      (DeleteTaskUseCase as any).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(true),
      }));

      await controller.deleteTask(req as any, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("debería retornar 404 si no se encuentra la tarea", async () => {
      const req = mockReq("user1", {}, { id: "task1" });
      const res = mockRes();

      (DeleteTaskUseCase as any).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(false),
      }));

      await controller.deleteTask(req as any, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Tarea no encontrada" });
    });

    it("debería manejar errores", async () => {
      const req = mockReq("user1", {}, { id: "task1" });
      const res = mockRes();

      (DeleteTaskUseCase as any).mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue("fail"),
      }));

      await controller.deleteTask(req as any, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error al eliminar tarea", error: "fail" });
    });
  });
});
