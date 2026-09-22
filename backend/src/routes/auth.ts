import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../utils/validation';
import * as z from 'zod';
import prisma from '../utils/prisma';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

// Helper to generate tokens
function generateTokens(userId: number) {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
}

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = registerSchema.parse(req.body);

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
      },
    });

    res.status(201).json({
      message: 'User created',
      userId: user.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errors: error.errors,
      });
    }

    console.error('Registration error:', error);

    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    // Store refresh token in DB
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ),
      },
    });

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errors: error.errors,
      });
    }

    console.error('Login error:', error);

    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// POST /auth/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      JWT_REFRESH_SECRET
    ) as { userId: number };

    // Check if token exists in DB and is not expired
    const storedToken = await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
      include: {
        user: true,
      },
    });

    if (
      !storedToken ||
      storedToken.expiresAt < new Date()
    ) {
      return res.sendStatus(401);
    }

    // Generate new tokens
    const {
      accessToken,
      refreshToken: newRefreshToken,
    } = generateTokens(payload.userId);

    // Rotate refresh token
    await prisma.$transaction([
      prisma.refreshToken.delete({
        where: {
          id: storedToken.id,
        },
      }),

      prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: payload.userId,
          expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ),
        },
      }),
    ]);

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.sendStatus(401);
  }
});

// POST /auth/logout
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.sendStatus(204);
  }

  try {
    await prisma.refreshToken.deleteMany({
      where: {
        token: refreshToken,
      },
    });

    res.sendStatus(204);
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export default router;
