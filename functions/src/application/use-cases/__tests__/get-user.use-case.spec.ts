import { GetUserUseCase } from "../user/get-user.use-case";
import { UserRepository } from "../../../infrastructure/firestore/user.repository";
import { UserDTO } from "../user/dto/user.dto";
import { User } from "../../../domain/entities/user.entity";

describe("GetUserUseCase", () => {
  const mockGetUser = jest.fn();

  const mockUserRepo = {
    getUser: mockGetUser,
  } as unknown as UserRepository;

  const useCase = new GetUserUseCase(mockUserRepo);
  const dto: UserDTO = { email: "test@example.com" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debería devolver un usuario si existe", async () => {
    const user = new User({ id: "123", email: dto.email });
    mockGetUser.mockResolvedValue(user);

    const result = await useCase.execute(dto);

    expect(mockGetUser).toHaveBeenCalledWith(dto.email);
    expect(result).toBeInstanceOf(User);
    expect(result).toMatchObject({ email: dto.email });
  });

  it("debería devolver null si el usuario no existe", async () => {
    mockGetUser.mockResolvedValue(null);

    const result = await useCase.execute(dto);

    expect(result).toBeNull();
  });

  it("debería lanzar error si el DTO es inválido", async () => {
    const invalidDto = { email: "" };

    await expect(useCase.execute(invalidDto)).rejects.toThrow("Datos de usuario inválidos");
    expect(mockGetUser).not.toHaveBeenCalled();
  });
});
