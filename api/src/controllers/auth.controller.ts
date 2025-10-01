import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name, phone, role, companyName, skills } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = Math.random().toString(36).substr(2, 9);
    
    // Prepare additional data based on role
    const additionalData: any = {};
    if (role === 'employer' && companyName) {
      additionalData.companyName = companyName;
    }
    if (role === 'employee' && skills) {
      additionalData.skills = skills;
    }
    
    const user = await User.create({
      id: userId,
      email,
      password: hashedPassword,
      name,
      phone: phone || null,
      role: role || 'employee',
      ...additionalData,
    });

    const token = jwt.sign(
      { 
        id: String(user.id), 
        email: user.email, 
        role: user.role 
      }, 
      JWT_SECRET as jwt.Secret,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyName: user.companyName,
        skills: user.skills,
      },
    });
  } catch (e) {
    console.error('Register error:', e);
    res.status(500).json({ message: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' });
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', { id: user.id, email: user.email, hasPassword: !!user.password });
    
    if (!user.password) {
      console.error('User has no password stored');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: String(user.id), 
        email: user.email, 
        role: user.role 
      }, 
      JWT_SECRET as jwt.Secret,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyName: user.companyName,
        skills: user.skills,
      },
    });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ message: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' });
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      companyName: user.companyName,
      skills: user.skills,
    });
  } catch (e) {
    next(e);
  }
}
