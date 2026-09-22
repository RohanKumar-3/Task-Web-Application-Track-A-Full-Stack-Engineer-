import express from 'express';
import { Prisma } from '@prisma/client';
import { auth } from '../middleware/auth';
import {
  taskSchema,
  taskUpdateSchema,
  taskQuerySchema,
} from '../utils/validation';
import * as z from 'zod';
import prisma from '../utils/prisma';

const router = express.Router();

// All task routes require authentication
router.use(auth);

// GET /tasks?page=1&limit=10&search=...&status=pending
router.get('/', async (req, res) => {
  try {
    const { page, limit, search, status } =
      taskQuerySchema.parse(req.query);

    const skip = (page - 1) * limit;

    const where: Prisma.TaskWhereInput = {
      userId: req.userId,
    };

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (status) {
      where.status = status;
    }

    const [tasks, total] = await prisma.$transaction([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          id: 'desc',
        },
      }),
      prisma.task.count({
        where,
      }),
    ]);

    res.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errors: error.errors,
      });
    }

    console.error('Get tasks error:', error);

    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// GET /tasks/:id
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Invalid ID',
    });
  }

  try {
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!task) {
      return res.status(404).json({
        error: 'Task not found',
      });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);

    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// POST /tasks
router.post('/', async (req, res) => {
  try {
    const { title } = taskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        title,
        userId: req.userId!,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errors: error.errors,
      });
    }

    console.error('Create task error:', error);

    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// PATCH /tasks/:id
router.patch('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Invalid ID',
    });
  }

  try {
    const { title } = taskUpdateSchema.parse(req.body);

    if (title === undefined) {
      return res.status(400).json({
        error: 'No fields to update',
      });
    }

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!task) {
      return res.status(404).json({
        error: 'Task not found',
      });
    }

    const updated = await prisma.task.update({
      where: {
        id,
      },
      data: {
        title,
      },
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errors: error.errors,
      });
    }

    console.error('Update task error:', error);

    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// DELETE /tasks/:id
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Invalid ID',
    });
  }

  try {
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!task) {
      return res.status(404).json({
        error: 'Task not found',
      });
    }

    await prisma.task.delete({
      where: {
        id,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete task error:', error);

    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// PATCH /tasks/:id/toggle
router.patch('/:id/toggle', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Invalid ID',
    });
  }

  try {
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!task) {
      return res.status(404).json({
        error: 'Task not found',
      });
    }

    const updated = await prisma.task.update({
      where: {
        id,
      },
      data: {
        status:
          task.status === 'pending'
            ? 'done'
            : 'pending',
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Toggle task error:', error);

    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export default router;
