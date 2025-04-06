import { DeleteTaskUseCase } from "../task/delete-task.use-case";
import { Task } from "../../../domain/entities/task.entity";

describe("DeleteTaskUseCase", () => {
  const mockDelete = jest.fn();
  const mockGetById = jest.fn();

  const mockRepo: any = {
    getById: mockGetById,
    delete: mockDelete,
  };

  const useCase = new DeleteTaskUseCase(mockRepo);

  const userId = "user-123";
  const taskId = "task-456";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debería eliminar una tarea si pertenece al usuario", async () => {
    const task = new Task({
      id: taskId,
      title: "Tarea 1",
      description: "Desc",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
    });

    mockGetById.mockResolvedValue(task);

    const result = await useCase.execute(taskId, userId);

    expect(mockDelete).toHaveBeenCalledWith(taskId);
    expect(result).toBe(true);
  });

  it("debería devolver false si la tarea no existe", async () => {
    mockGetById.mockResolvedValue(null);

    const result = await useCase.execute(taskId, userId);

    expect(mockDelete).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it("debería devolver false si la tarea no pertenece al usuario", async () => {
    const otherUserTask = new Task({
      id: taskId,
      title: "Tarea ajena",
      description: "Desc",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "otro-user",
    });

    mockGetById.mockResolvedValue(otherUserTask);

    const result = await useCase.execute(taskId, userId);

    expect(mockDelete).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
