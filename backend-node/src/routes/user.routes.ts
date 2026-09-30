import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, requirePermission } from '../middleware/auth.middleware';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// List organization users (scoped to user's organization, returns safe fields only)
router.get('/', requirePermission('USER_READ'), UserController.list);

export { router as userRouter };
