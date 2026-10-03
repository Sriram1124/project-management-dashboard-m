import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// All notification routes require authentication
router.use(authenticate);

// Authenticated user: retrieve notifications and unread counts
router.get('/', NotificationController.list);
router.get('/unread-count', NotificationController.unreadCount);
router.patch('/read-all', NotificationController.markAllRead);
router.patch('/:id/read', NotificationController.markRead);

// Manager / Tech Lead: create and dispatch broadcast notification
router.post('/', requireRole(['MANAGER', 'TECH_LEAD']), NotificationController.create);

export { router as notificationRouter };
