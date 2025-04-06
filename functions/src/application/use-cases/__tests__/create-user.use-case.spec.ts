import { CreateUserUseCase } from "../user/create-user.use-case";
import { UserRepository } from "../../../infrastructure/firestore/user.repository";
import { UserDTO } from "../user/dto/user.dto";
import { User } from "../../../domain/entities/user.entity";

// Mock manual de Firestore
jest.mock("../../../infrastructure/firebase", () => ({
  db: {
    collection: jest.fn().mockReturnThis(),
    add: jest.fn().mockResolvedValue({ id: "mock-user-id" }),
  },
}));

describe("CreateUserUseCase", () => {
  const mockCreate = jest.fn();
  const mockGetUser = jest.fn();

  const mockUserRepo = {
    create: mockCreate,
    getUser: mockGetUser,
  } as unknown as UserRepository;

  const useCase = new CreateUserUseCase(mockUserRepo);

  const dto: UserDTO = { email: "test@example.com" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debería crear un nuevo usuario si no existe", async () => {
    mockGetUser.mockResolvedValue(null);

    const result = await useCase.execute(dto);

    expect(mockGetUser).toHaveBeenCalledWith(dto.email);
    expect(mockCreate).toHaveBeenCalled();
    expect(result).toBeInstanceOf(User);
    expect(result).toMatchObject({
      id: "mock-user-id",
      email: dto.email,
    });
  });

  it("debería lanzar error si el email ya está registrado", async () => {
    mockGetUser.mockResolvedValue(new User({ id: "123", email: dto.email }));

    await expect(useCase.execute(dto)).rejects.toThrow("El email ya está registrado");
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("debería lanzar error si el DTO es inválido", async () => {
    mockGetUser.mockResolvedValue(null);
  
    await expect(useCase.execute({ email: "" })).rejects.toThrow("Datos de usuario inválidos");
  });
});
