import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { TaskRepository } from "../../../infrastructure/firestore/task.repository";
import { asyncHandler } from "../../../utils/asyncHandler";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

const taskRepo = new TaskRepository();

const taskController = new TaskController(taskRepo);

  /**
   * @swagger
   * /tasks:
   *   get:
   *     summary: Obtener todas las tareas del usuario autenticado
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de tareas del usuario
   */
  router.get("/", authenticate, asyncHandler(async (req, res) => {
      await taskController.getAllTasks(req, res);
  }));

  /**
   * @swagger
   * /tasks:
   *   post:
   *     summary: Crear una nueva tarea
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *     responses:
   *       201:
   *         description: Tarea creada correctamente
   */
  router.post("/", authenticate, asyncHandler(async (req, res) => {
    await taskController.createTask(req, res);
  }));
    
  /**
   * @swagger
   * /tasks/{id}:
   *   put:
   *     summary: Actualizar una tarea existente
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID de la tarea
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               completed:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Tarea actualizada correctamente
   *       404:
   *         description: Tarea no encontrada
   */
  router.put("/:id", authenticate, asyncHandler(async (req, res) => {
    await taskController.updateTask(req, res);
  }));
  
  /**
   * @swagger
   * /tasks/{id}:
   *   delete:
   *     summary: Eliminar una tarea
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID de la tarea
   *     responses:
   *       204:
   *         description: Tarea eliminada correctamente
   *       404:
   *         description: Tarea no encontrada
   */
  router.delete("/:id", authenticate, asyncHandler(async (req, res) => {
    await taskController.deleteTask(req, res);
  }));
  
  export default router;
