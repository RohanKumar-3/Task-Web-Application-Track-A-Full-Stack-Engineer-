import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Authorization header is required',
    });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'Invalid authorization header',
    });
  }

  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not configured');

    return res.status(500).json({
      error: 'Server configuration error',
    });
  }

  try {
    const payload = jwt.verify(
      token,
      JWT_SECRET
    ) as { userId: number };

    if (!payload.userId) {
      return res.status(401).json({
        error: 'Invalid token',
      });
    }

    req.userId = payload.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid or expired token',
    });
  }
}
