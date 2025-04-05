import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { prisma } from '../index';

const router = express.Router();

// Apply authentication middleware to all task routes
router.use(authenticate);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for the logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *       401:
 *         description: Unauthorized
 */
router.get('/', async (req: any, res: any) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: req.user!.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error while fetching tasks' });
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a specific task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task details
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/:id',
  [
    param('id').isInt().withMessage('Task ID must be an integer'),
  ],
  async (req: any, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const taskId = parseInt(req.params.id);
      
      const task = await prisma.task.findFirst({
        where: {
          id: taskId,
          userId: req.user!.id,
        },
      });

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.status(200).json(task);
    } catch (error) {
      console.error('Get task error:', error);
      res.status(500).json({ message: 'Server error while fetching task' });
    }
  }
);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
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
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, COMPLETED]
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional(),
    body('status').isIn(['TODO', 'IN_PROGRESS', 'COMPLETED']).withMessage('Status must be TODO, IN_PROGRESS, or COMPLETED'),
  ],
  async (req: any, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, status } = req.body;

      const task = await prisma.task.create({
        data: {
          title,
          description: description || '',
          status: status || 'TODO',
          userId: req.user!.id,
        },
      });

      res.status(201).json(task);
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ message: 'Server error while creating task' });
    }
  }
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, COMPLETED]
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Task ID must be an integer'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional(),
    body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'COMPLETED']).withMessage('Status must be TODO, IN_PROGRESS, or COMPLETED'),
  ],
  async (req: any, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const taskId = parseInt(req.params.id);
      const { title, description, status } = req.body;

      // Check if task exists and belongs to user
      const existingTask = await prisma.task.findFirst({
        where: {
          id: taskId,
          userId: req.user!.id,
        },
      });

      if (!existingTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Update task
      const updatedTask = await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(status !== undefined && { status }),
        },
      });

      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ message: 'Server error while updating task' });
    }
  }
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/:id',
  [
    param('id').isInt().withMessage('Task ID must be an integer'),
  ],
  async (req: any, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const taskId = parseInt(req.params.id);

      // Check if task exists and belongs to user
      const existingTask = await prisma.task.findFirst({
        where: {
          id: taskId,
          userId: req.user!.id,
        },
      });

      if (!existingTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Delete task
      await prisma.task.delete({
        where: {
          id: taskId,
        },
      });

      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({ message: 'Server error while deleting task' });
    }
  }
);

export default router;
