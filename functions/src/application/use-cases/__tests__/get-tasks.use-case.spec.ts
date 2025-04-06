
import { Task } from "../../../domain/entities/task.entity";
import { GetAllTasksUseCase } from "../task/get-all-tasks.use-case";

describe("GetAllTasksUseCase", () => {
  const mockFindByUserId = jest.fn();

  const mockTaskRepository = {
    findByUserId: mockFindByUserId,
  } as any;

  const useCase = new GetAllTasksUseCase(mockTaskRepository);

  const userId = "user-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debería retornar todas las tareas del usuario", async () => {
    const mockTasks: Task[] = [
      new Task({
        id: "1",
        title: "Tarea 1",
        description: "Desc 1",
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
      }),
    ];

    mockFindByUserId.mockResolvedValue(mockTasks);

    const result = await useCase.execute(userId);

    expect(mockFindByUserId).toHaveBeenCalledWith(userId);
    expect(result).toEqual(mockTasks);
  });
});
