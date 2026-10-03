import { Router } from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// All organization routes require authentication and SUPER_ADMIN role
router.use(authenticate);
router.use(requireRole(['SUPER_ADMIN']));

router.post('/', OrganizationController.create);
router.get('/', OrganizationController.list);
router.get('/:id', OrganizationController.getById);

export { router as organizationRouter };
