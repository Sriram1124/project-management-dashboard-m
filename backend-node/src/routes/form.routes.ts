import { Router } from 'express';
import { FormController } from '../controllers/form.controller';
import { authenticate, requirePermission } from '../middleware/auth.middleware';

const router = Router();

// Require login for all routes
router.use(authenticate);

// Get forms
router.get('/', FormController.listForms);

// Manager only: create/update forms
router.post('/', requirePermission('PROJECT_CREATE'), FormController.createForm);
router.get('/:id', FormController.getForm);
router.patch('/:id', requirePermission('PROJECT_UPDATE'), FormController.updateForm);

// Status changes
router.post('/:id/publish', requirePermission('PROJECT_UPDATE'), FormController.publishForm);
router.post('/:id/archive', requirePermission('PROJECT_UPDATE'), FormController.archiveForm);

// Questions
router.post('/:id/questions', requirePermission('PROJECT_UPDATE'), FormController.addQuestion);
router.patch('/:id/questions/:questionId', requirePermission('PROJECT_UPDATE'), FormController.updateQuestion);
router.delete('/:id/questions/:questionId', requirePermission('PROJECT_UPDATE'), FormController.deleteQuestion);

// Submissions
router.post('/:id/submissions', FormController.submitForm);
router.get('/:id/submissions', requirePermission('PROJECT_READ'), FormController.listSubmissions);
router.get('/:id/submissions/my', FormController.getMySubmission);

export { router as formRouter };
