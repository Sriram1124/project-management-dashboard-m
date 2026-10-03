import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import { prisma } from '../lib/prisma';

export interface CreateOrganizationWithManagerInput {
  organizationName: string;
  managerName: string;
  managerEmail: string;
}

export class OrganizationService {
  /**
   * Helper to generate a secure, human-friendly temporary password
   */
  private static generateTemporaryPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    const randomBytes = crypto.randomBytes(12);
    let pwd = '';
    for (let i = 0; i < 12; i++) {
      pwd += chars[randomBytes[i] % chars.length];
    }
    return pwd;
  }

  /**
   * Helper to generate a unique user code for the manager within an organization
   */
  private static generateUserCode(prefix: string = 'MGR'): string {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${num}`;
  }

  /**
   * Create an Organization and its initial Manager in an atomic transaction
   */
  static async createOrganizationWithManager(input: CreateOrganizationWithManagerInput) {
    const { organizationName, managerName, managerEmail } = input;

    if (!organizationName?.trim()) {
      throw new Error('Organization name is required');
    }
    if (!managerName?.trim()) {
      throw new Error('Manager name is required');
    }
    if (!managerEmail?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(managerEmail.trim())) {
      throw new Error('A valid manager email is required');
    }

    const normalizedEmail = managerEmail.trim().toLowerCase();

    // Check if email already exists globally across the platform
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      throw new Error(`A user with email "${normalizedEmail}" already exists`);
    }

    // Find the MANAGER role
    const managerRole = await prisma.role.findUnique({
      where: { name: 'MANAGER' },
    });
    if (!managerRole) {
      throw new Error('MANAGER role not found in system. Please run seeds.');
    }

    const temporaryPassword = this.generateTemporaryPassword();
    const passwordHash = await argon2.hash(temporaryPassword);
    const userCode = this.generateUserCode('MGR');

    // Execute atomic creation in transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Organization
      const org = await tx.organization.create({
        data: {
          name: organizationName.trim(),
        },
      });

      // 2. Create Initial Manager User
      const managerUser = await tx.user.create({
        data: {
          organization_id: org.id,
          name: managerName.trim(),
          email: normalizedEmail,
          user_code: userCode,
          must_change_password: true,
          password_hash: passwordHash,
          is_active: true,
        },
      });

      // 3. Assign MANAGER role to Manager User
      await tx.userRole.create({
        data: {
          user_id: managerUser.id,
          role_id: managerRole.id,
        },
      });

      return {
        organization: org,
        manager: {
          id: managerUser.id,
          user_code: managerUser.user_code,
          name: managerUser.name,
          email: managerUser.email,
          role: 'MANAGER',
          must_change_password: managerUser.must_change_password,
          temporary_password: temporaryPassword, // Returned ONLY here in response, not stored in DB
        },
      };
    });

    return result;
  }

  /**
   * List all platform organizations with summary stats for Super Admin
   */
  static async listOrganizations() {
    const orgs = await prisma.organization.findMany({
      include: {
        _count: {
          select: {
            users: true,
            projects: true,
            work_items: true,
            forms: true,
          },
        },
        users: {
          where: {
            roles: {
              some: {
                role: { name: 'MANAGER' },
              },
            },
          },
          select: {
            id: true,
            name: true,
            email: true,
            user_code: true,
            is_active: true,
          },
          take: 5,
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return orgs.map((org) => ({
      id: org.id,
      name: org.name,
      created_at: org.created_at,
      updated_at: org.updated_at,
      stats: {
        user_count: org._count.users,
        project_count: org._count.projects,
        work_item_count: org._count.work_items,
        form_count: org._count.forms,
      },
      managers: org.users,
    }));
  }

  /**
   * Get single organization details for Super Admin
   */
  static async getOrganizationById(id: string) {
    const org = await prisma.organization.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            projects: true,
            work_items: true,
            forms: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            user_code: true,
            is_active: true,
            created_at: true,
            roles: {
              select: {
                role: {
                  select: { name: true },
                },
              },
            },
          },
          orderBy: { created_at: 'asc' },
        },
      },
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    return {
      id: org.id,
      name: org.name,
      created_at: org.created_at,
      updated_at: org.updated_at,
      stats: {
        user_count: org._count.users,
        project_count: org._count.projects,
        work_item_count: org._count.work_items,
        form_count: org._count.forms,
      },
      users: org.users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        user_code: u.user_code,
        is_active: u.is_active,
        role: u.roles[0]?.role?.name || 'USER',
        created_at: u.created_at,
      })),
    };
  }
}
