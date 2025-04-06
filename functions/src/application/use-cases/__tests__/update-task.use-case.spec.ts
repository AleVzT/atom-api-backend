import { UpdateTaskUseCase } from "../task/update-task.use-case";
import { UpdateTaskDTO } from "../task/dto/update-task.dto";
import { Task } from "../../../domain/entities/task.entity";

// Mock del repositorio
const mockGetById = jest.fn();
const mockUpdate = jest.fn();

const mockRepo: any = {
  getById: mockGetById,
  update: mockUpdate,
};

describe("UpdateTaskUseCase", () => {
  const userId = "user123";
  const taskId = "task123";
  const existingTask = new Task({
    id: taskId,
    title: "Original title",
    description: "Original description",
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId,
  });

  beforeEach(() => {
    mockGetById.mockReset();
    mockUpdate.mockReset();
  });

  it("debería actualizar la tarea correctamente", async () => {
    mockGetById.mockResolvedValue(existingTask);

    const dto: UpdateTaskDTO = {
      title: "Nuevo título",
      description: "Nueva descripción",
      completed: true,
    };

    const useCase = new UpdateTaskUseCase(mockRepo);
    const result = await useCase.execute(taskId, dto, userId);

    expect(mockGetById).toHaveBeenCalledWith(taskId);
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(result?.title).toBe(dto.title);
    expect(result?.description).toBe(dto.description);
    expect(result?.completed).toBe(dto.completed);
  });

  it("debería retornar null si la tarea no existe", async () => {
    mockGetById.mockResolvedValue(null);

    const dto: UpdateTaskDTO = { title: "Test" };
    const useCase = new UpdateTaskUseCase(mockRepo);

    const result = await useCase.execute(taskId, dto, userId);
    expect(result).toBeNull();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("debería retornar null si el userId no coincide", async () => {
    const otherUserTask = new Task({ ...existingTask.toJSON(), userId: "otro" });
    mockGetById.mockResolvedValue(otherUserTask);

    const dto: UpdateTaskDTO = { title: "No debería actualizar" };
    const useCase = new UpdateTaskUseCase(mockRepo);

    const result = await useCase.execute(taskId, dto, userId);
    expect(result).toBeNull();
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
