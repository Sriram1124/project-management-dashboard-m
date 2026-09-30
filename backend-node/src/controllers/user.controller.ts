import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class UserController {
  /**
   * List users belonging to the authenticated user's organization.
   * Scoped strictly to req.fullUser.organization_id.
   * Returns only safe fields: id, name, email.
   */
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const fullUser = (req as any).fullUser;

      if (!fullUser || !fullUser.organization_id) {
        res.status(400).json({ error: 'User does not belong to any organization' });
        return;
      }

      const users = await prisma.user.findMany({
        where: {
          organization_id: fullUser.organization_id,
          is_active: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      res.status(200).json({ users });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || 'Failed to list organization users' });
    }
  }
}
