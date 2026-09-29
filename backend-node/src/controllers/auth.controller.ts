import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { prisma } from '../lib/prisma';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip;

      const result = await AuthService.login(email, password, userAgent, ipAddress);

      // Set session cookie
      res.cookie('sessionId', result.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      // Set refresh token cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(200).json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      if (error.message === 'Invalid credentials' || error.message === 'User is inactive') {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  static async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken, sessionId } = req.cookies;
      if (!refreshToken || !sessionId) {
        res.status(401).json({ error: 'Refresh token and session ID required' });
        return;
      }

      const result = await AuthService.refresh(refreshToken, sessionId);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({ accessToken: result.accessToken });
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.cookies;
      if (sessionId) {
        await AuthService.logout(sessionId);
      }
      res.clearCookie('sessionId');
      res.clearCookie('refreshToken');
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async me(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const primaryRole = user.roles[0]?.role;
      const permissions = primaryRole?.permissions.map((rp: any) => rp.permission.name) || [];

      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: primaryRole?.name || 'USER',
        permissions,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
