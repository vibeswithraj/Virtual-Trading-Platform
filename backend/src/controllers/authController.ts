import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: 'Email already in use' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, name });

  const token = signToken(user.id);
  return res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      cashBalance: user.cashBalance,
    },
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken(user.id);
  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      cashBalance: user.cashBalance,
    },
  });
}

export async function me(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.substring('Bearer '.length);
  const secret = process.env.JWT_SECRET || 'dev-secret';
  try {
    const payload = jwt.verify(token, secret) as { userId: string };
    const user = await User.findById(payload.userId).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      cashBalance: user.cashBalance,
    });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function signToken(userId: string): string {
  const secret = process.env.JWT_SECRET || 'dev-secret';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
}
