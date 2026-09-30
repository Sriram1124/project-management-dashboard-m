import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding roles and permissions...');

  // 1. Create Roles
  const roles = ['ADMIN', 'MANAGER', 'INTERN', 'TECH_LEAD'];
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }

  // 2. Create Permissions
  const permissions = [
    'USER_READ', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE',
    'PROJECT_READ', 'PROJECT_CREATE', 'PROJECT_UPDATE', 'PROJECT_DELETE',
    'TASK_READ', 'TASK_CREATE', 'TASK_UPDATE', 'TASK_DELETE', 'TASK_ASSIGN',
    'FORM_READ', 'FORM_CREATE', 'FORM_UPDATE', 'FORM_DELETE', 'FORM_SUBMIT',
    'ATTENDANCE_READ', 'ATTENDANCE_CREATE', 'ATTENDANCE_UPDATE',
    'EVALUATION_READ', 'EVALUATION_CREATE', 'EVALUATION_UPDATE'
  ];

  for (const permName of permissions) {
    await prisma.permission.upsert({
      where: { name: permName },
      update: {},
      create: { name: permName },
    });
  }

  // 3. Assign Permissions to Roles (Manager & Intern)
  const managerRole = await prisma.role.findUnique({ where: { name: 'MANAGER' } });
  const internRole = await prisma.role.findUnique({ where: { name: 'INTERN' } });

  const managerPerms = [
    'USER_READ', 'PROJECT_READ', 'PROJECT_CREATE', 'PROJECT_UPDATE', 'PROJECT_DELETE',
    'TASK_READ', 'TASK_CREATE', 'TASK_UPDATE', 'TASK_DELETE', 'TASK_ASSIGN',
    'FORM_READ', 'FORM_CREATE', 'FORM_UPDATE', 'EVALUATION_READ', 'EVALUATION_CREATE', 'EVALUATION_UPDATE',
    'ATTENDANCE_READ', 'ATTENDANCE_CREATE', 'ATTENDANCE_UPDATE'
  ];

  const internPerms = [
    'PROJECT_READ', 'TASK_READ', 'TASK_UPDATE', 'FORM_READ', 'FORM_SUBMIT',
    'ATTENDANCE_READ', 'ATTENDANCE_CREATE'
  ];

  if (managerRole) {
    for (const permName of managerPerms) {
      const perm = await prisma.permission.findUnique({ where: { name: permName } });
      if (perm) {
        await prisma.rolePermission.upsert({
          where: {
            role_id_permission_id: {
              role_id: managerRole.id,
              permission_id: perm.id
            }
          },
          update: {},
          create: {
            role_id: managerRole.id,
            permission_id: perm.id
          }
        });
      }
    }
  }

  if (internRole) {
    for (const permName of internPerms) {
      const perm = await prisma.permission.findUnique({ where: { name: permName } });
      if (perm) {
        await prisma.rolePermission.upsert({
          where: {
            role_id_permission_id: {
              role_id: internRole.id,
              permission_id: perm.id
            }
          },
          update: {},
          create: {
            role_id: internRole.id,
            permission_id: perm.id
          }
        });
      }
    }
  }

  // 4. Default Organization
  let org = await prisma.organization.findFirst({ where: { name: 'Dailoqa Technologies' } });
  if (!org) {
    org = await prisma.organization.create({
      data: { name: 'Dailoqa Technologies' },
    });
  }

  // 5. Create / Update Users
  const passwordHash = await argon2.hash('password123');
  
  const manager = await prisma.user.upsert({
    where: { email: 'manager@dailoqa.com' },
    update: { organization_id: org.id },
    create: {
      name: 'Test Manager',
      email: 'manager@dailoqa.com',
      password_hash: passwordHash,
      organization_id: org.id,
    },
  });

  const intern = await prisma.user.upsert({
    where: { email: 'intern@dailoqa.com' },
    update: { organization_id: org.id },
    create: {
      name: 'Test Intern',
      email: 'intern@dailoqa.com',
      password_hash: passwordHash,
      organization_id: org.id,
    },
  });

  const lead = await prisma.user.upsert({
    where: { email: 'lead@dailoqa.com' },
    update: { organization_id: org.id },
    create: {
      name: 'Alex Tech Lead',
      email: 'lead@dailoqa.com',
      password_hash: passwordHash,
      organization_id: org.id,
    },
  });

  // 6. Assign Users to Roles
  const techLeadRole = await prisma.role.findUnique({ where: { name: 'TECH_LEAD' } });

  if (managerRole && manager) {
    await prisma.userRole.upsert({
      where: {
        user_id_role_id: {
          user_id: manager.id,
          role_id: managerRole.id
        }
      },
      update: {},
      create: {
        user_id: manager.id,
        role_id: managerRole.id
      }
    });
  }

  if (internRole && intern) {
    await prisma.userRole.upsert({
      where: {
        user_id_role_id: {
          user_id: intern.id,
          role_id: internRole.id
        }
      },
      update: {},
      create: {
        user_id: intern.id,
        role_id: internRole.id
      }
    });
  }

  if (techLeadRole && lead) {
    await prisma.userRole.upsert({
      where: {
        user_id_role_id: {
          user_id: lead.id,
          role_id: techLeadRole.id
        }
      },
      update: {},
      create: {
        user_id: lead.id,
        role_id: techLeadRole.id
      }
    });
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

