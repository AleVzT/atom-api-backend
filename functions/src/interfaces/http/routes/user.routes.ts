import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserRepository } from "../../../infrastructure/firestore/user.repository";
import { asyncHandler } from "../../../utils/asyncHandler";

const router = Router();

const userRepo = new UserRepository();
const userController = new UserController(userRepo);


/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Usuario autenticado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 token:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 */
router.post("/login", asyncHandler(userController.loginUser ));

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Email inválido o usuario ya registrado
 */
router.post("/", asyncHandler(userController.createUser));

export default router;