import { Request, Response } from 'express';
import { OrganizationService } from '../services/organization.service';

export class OrganizationController {
  /**
   * POST /api/organizations
   * Super Admin creates Organization + Initial Manager in atomic transaction
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { organizationName, managerName, managerEmail } = req.body;

      if (!organizationName || !managerName || !managerEmail) {
        res.status(400).json({
          error: 'organizationName, managerName, and managerEmail are required',
        });
        return;
      }

      const result = await OrganizationService.createOrganizationWithManager({
        organizationName,
        managerName,
        managerEmail,
      });

      res.status(201).json(result);
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        res.status(409).json({ error: error.message });
      } else if (error.message?.includes('required') || error.message?.includes('valid')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || 'Failed to create organization' });
      }
    }
  }

  /**
   * GET /api/organizations
   * Super Admin lists all organizations with metrics
   */
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const organizations = await OrganizationService.listOrganizations();
      res.status(200).json({ organizations });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to list organizations' });
    }
  }

  /**
   * GET /api/organizations/:id
   * Super Admin gets details of a single organization
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const organization = await OrganizationService.getOrganizationById(id);
      res.status(200).json({ organization });
    } catch (error: any) {
      if (error.message === 'Organization not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || 'Failed to fetch organization details' });
      }
    }
  }
}
