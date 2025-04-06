
import { TaskRepository } from "../../../infrastructure/firestore/task.repository";
import { Task } from "../../../domain/entities/task.entity";
import { CreateTaskUseCase } from "../task/create-task.use-case";
import { CreateTaskDTO } from "../task/dto/create-task.dto";

jest.mock("uuid", () => ({
  v4: () => "mocked-uuid",
}));

describe("CreateTaskUseCase", () => {
  const mockCreate = jest.fn();
  const mockRepo = { create: mockCreate } as unknown as TaskRepository;

  const useCase = new CreateTaskUseCase(mockRepo);

  const dto: CreateTaskDTO = {
    title: "Test task",
    description: "Description",
  };

  const userId = "user-123";

  beforeEach(() => {
    mockCreate.mockClear();
  });

  it("debería crear una tarea correctamente", async () => {
    const result = await useCase.execute(dto, userId);

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith(expect.any(Task));

    expect(result).toBeInstanceOf(Task);
    expect(result).toMatchObject({
      id: "mocked-uuid",
      title: dto.title,
      description: dto.description,
      completed: false,
      userId,
    });
  });
});
