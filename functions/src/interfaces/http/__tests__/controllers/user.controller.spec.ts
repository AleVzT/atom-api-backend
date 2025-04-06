import { UserController } from "../../controllers/user.controller";
import { Request, Response } from "express";
import { UserRepository } from "../../../../infrastructure/firestore/user.repository";
import { CreateUserUseCase } from "../../../../application/use-cases/user/create-user.use-case";
import { GetUserUseCase } from "../../../../application/use-cases/user/get-user.use-case";
import * as jwtUtils from "../../../../utils/jwt";

jest.mock("../../../../application/use-cases/user/create-user.use-case");
jest.mock("../../../../application/use-cases/user/get-user.use-case");
jest.mock("../../../../utils/jwt");

describe("UserController", () => {
  let mockRepo: jest.Mocked<UserRepository>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;
  let controller: UserController;

  beforeEach(() => {
    mockRepo = {} as any;
    controller = new UserController(mockRepo);

    json = jest.fn();
    status = jest.fn(() => ({ json })) as any;
    res = { status } as unknown as Response;

    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("debería crear un usuario y devolver token", async () => {
      const req = { body: { email: "test@example.com" } } as any;

      const mockUser = { id: "123", email: "test@example.com" };
      const mockToken = "token123";

      (CreateUserUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(mockUser),
      }));
      (jwtUtils.signToken as jest.Mock).mockReturnValue(mockToken);

      await controller.createUser(req, res as Response);

      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith({ user: mockUser, token: mockToken });
    });

    it("debería manejar errores", async () => {
      const req = { body: { email: "test@example.com" } } as any;

      (CreateUserUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new Error("fail")),
      }));

      await controller.createUser(req, res as Response);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({
        message: "Error al crear usuario",
        error: expect.any(Error),
      });
    });
  });

  describe("loginUser", () => {
    it("debería devolver usuario y token si existe", async () => {
      const req = { body: { email: "test@example.com" } } as any;

      const mockUser = { id: "123", email: "test@example.com" };
      const mockToken = "token123";

      (GetUserUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(mockUser),
      }));
      (jwtUtils.signToken as jest.Mock).mockReturnValue(mockToken);

      await controller.loginUser(req, res as Response);

      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith({ user: mockUser, token: mockToken });
    });

    it("debería devolver 404 si no existe el usuario", async () => {
      const req = { body: { email: "noexiste@example.com" } } as any;

      (GetUserUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(null),
      }));

      await controller.loginUser(req, res as Response);

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: "Usuario no registrado" });
    });

    it("debería devolver 400 si no se manda email", async () => {
      const req = { body: {} } as any;

      await controller.loginUser(req, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: "Email requerido" });
    });

    it("debería manejar errores del use case", async () => {
      const req = { body: { email: "error@example.com" } } as any;

      (GetUserUseCase as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new Error("DB down")),
      }));

      await controller.loginUser(req, res as Response);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({
        message: "Error al buscar usuariox",
        error: expect.any(Error),
      });
    });
  });
});
