import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';

export class NotificationController {
  /**
   * Manager sends notification to organization users
   */
  static async create(req: Request, res: Response) {
    try {
      const { title, message, type, recipient_ids } = req.body;
      const organizationId = (req as any).fullUser?.organization_id;
      const senderId = (req as any).fullUser?.id || (req as any).user?.id;

      const result = await NotificationService.createNotification({
        organizationId,
        senderId,
        title,
        message,
        type,
        recipientIds: recipient_ids,
      });

      res.status(201).json(result);
    } catch (err: any) {
      const status = err.statusCode || 500;
      res.status(status).json({ error: err.message || 'Failed to create notification' });
    }
  }

  /**
   * List notifications received by the authenticated user
   */
  static async list(req: Request, res: Response) {
    try {
      const userId = (req as any).fullUser?.id || (req as any).user?.id;
      const notifications = await NotificationService.listNotifications(userId);
      res.status(200).json({ notifications });
    } catch (err: any) {
      const status = err.statusCode || 500;
      res.status(status).json({ error: err.message || 'Failed to list notifications' });
    }
  }

  /**
   * Get unread notifications count for authenticated user
   */
  static async unreadCount(req: Request, res: Response) {
    try {
      const userId = (req as any).fullUser?.id || (req as any).user?.id;
      const result = await NotificationService.getUnreadCount(userId);
      res.status(200).json(result);
    } catch (err: any) {
      const status = err.statusCode || 500;
      res.status(status).json({ error: err.message || 'Failed to get unread count' });
    }
  }

  /**
   * Mark a notification as read
   */
  static async markRead(req: Request, res: Response) {
    try {
      const userId = (req as any).fullUser?.id || (req as any).user?.id;
      const { id } = req.params;
      const result = await NotificationService.markAsRead(id, userId);
      res.status(200).json(result);
    } catch (err: any) {
      const status = err.statusCode || 500;
      res.status(status).json({ error: err.message || 'Failed to mark notification as read' });
    }
  }

  /**
   * Mark all unread notifications as read
   */
  static async markAllRead(req: Request, res: Response) {
    try {
      const userId = (req as any).fullUser?.id || (req as any).user?.id;
      const result = await NotificationService.markAllAsRead(userId);
      res.status(200).json(result);
    } catch (err: any) {
      const status = err.statusCode || 500;
      res.status(status).json({ error: err.message || 'Failed to mark notifications as read' });
    }
  }
}
