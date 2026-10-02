import { Request, Response } from 'express';
import { FormService } from '../services/form.service';

export class FormController {
  
  static async listForms(req: Request, res: Response): Promise<void> {
    try {
      const { organization_id, id } = req.fullUser as any; const role = (req as any).user.role;
      const forms = await FormService.listForms(organization_id, role, id);
      res.status(200).json({ forms });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getForm(req: Request, res: Response): Promise<void> {
    try {
      const form = await FormService.getForm(req.params.id, (req.fullUser as any).organization_id);
      if (!form) {
        res.status(404).json({ error: 'Form not found' });
        return;
      }
      res.status(200).json({ form });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createForm(req: Request, res: Response): Promise<void> {
    try {
      const { organization_id, id } = req.fullUser as any;
      const form = await FormService.createForm(req.body, organization_id, id);
      res.status(201).json({ form });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateForm(req: Request, res: Response): Promise<void> {
    try {
      const form = await FormService.updateForm(req.params.id, req.body, (req.fullUser as any).organization_id);
      res.status(200).json({ form });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async publishForm(req: Request, res: Response): Promise<void> {
    try {
      const form = await FormService.updateStatus(req.params.id, 'PUBLISHED', (req.fullUser as any).organization_id);
      res.status(200).json({ form });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async archiveForm(req: Request, res: Response): Promise<void> {
    try {
      const form = await FormService.updateStatus(req.params.id, 'ARCHIVED', (req.fullUser as any).organization_id);
      res.status(200).json({ form });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async addQuestion(req: Request, res: Response): Promise<void> {
    try {
      const question = await FormService.addQuestion(req.params.id, req.body);
      res.status(201).json({ question });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateQuestion(req: Request, res: Response): Promise<void> {
    try {
      const question = await FormService.updateQuestion(req.params.questionId, req.body);
      res.status(200).json({ question });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteQuestion(req: Request, res: Response): Promise<void> {
    try {
      await FormService.deleteQuestion(req.params.questionId);
      res.status(200).json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async submitForm(req: Request, res: Response): Promise<void> {
    try {
      const { id: submitterId } = req.fullUser as any;
      const submission = await FormService.submitForm(req.params.id, submitterId, req.body.answers);
      res.status(201).json({ submission });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async listSubmissions(req: Request, res: Response): Promise<void> {
    try {
      const submissions = await FormService.listSubmissions(req.params.id, (req.fullUser as any).organization_id);
      res.status(200).json({ submissions });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getMySubmission(req: Request, res: Response): Promise<void> {
    try {
      const { id: userId, organization_id } = req.fullUser as any;
      const submissions = await FormService.listSubmissions(req.params.id, organization_id);
      const mySubmission = submissions.find(s => s.submitter_id === userId);
      res.status(200).json({ submission: mySubmission || null });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
