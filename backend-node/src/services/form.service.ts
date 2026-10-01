import { prisma } from '../lib/prisma';
import { FormStatus, QuestionType } from '@prisma/client';

export class FormService {
  
  static async listForms(organizationId: string, userRole: string, userId: string) {
    if (userRole === 'MANAGER' || userRole === 'TECH_LEAD') {
      return prisma.form.findMany({
        where: { organization_id: organizationId },
        include: { _count: { select: { submissions: true } } },
        orderBy: { created_at: 'desc' }
      });
    } else {
      // Intern: see published forms assigned to their role
      return prisma.form.findMany({
        where: {
          organization_id: organizationId,
          status: FormStatus.PUBLISHED,
          target_roles: { has: userRole }
        },
        include: {
          submissions: {
            where: { submitter_id: userId }
          }
        },
        orderBy: { deadline: 'asc' }
      });
    }
  }

  static async getForm(formId: string, organizationId: string) {
    return prisma.form.findFirst({
      where: { id: formId, organization_id: organizationId },
      include: {
        questions: { orderBy: { order_index: 'asc' } },
        creator: { select: { id: true, name: true, email: true } }
      }
    });
  }

  static async createForm(data: any, organizationId: string, creatorId: string) {
    return prisma.form.create({
      data: {
        title: data.title,
        description: data.description,
        target_roles: data.target_roles || ['INTERN'],
        deadline: data.deadline ? new Date(data.deadline) : null,
        organization_id: organizationId,
        creator_id: creatorId,
        project_id: data.project_id || null
      }
    });
  }

  static async updateForm(formId: string, data: any, organizationId: string) {
    return prisma.form.update({
      where: { id: formId, organization_id: organizationId },
      data: {
        title: data.title,
        description: data.description,
        target_roles: data.target_roles,
        deadline: data.deadline ? new Date(data.deadline) : null
      }
    });
  }

  static async updateStatus(formId: string, status: FormStatus, organizationId: string) {
    return prisma.form.update({
      where: { id: formId, organization_id: organizationId },
      data: { status }
    });
  }

  static async addQuestion(formId: string, data: any) {
    const existing = await prisma.formQuestion.count({ where: { form_id: formId } });
    return prisma.formQuestion.create({
      data: {
        form_id: formId,
        type: data.type as QuestionType,
        text: data.text,
        description: data.description,
        is_required: data.is_required ?? true,
        order_index: existing,
        options: data.options || []
      }
    });
  }

  static async updateQuestion(questionId: string, data: any) {
    return prisma.formQuestion.update({
      where: { id: questionId },
      data: {
        text: data.text,
        description: data.description,
        is_required: data.is_required,
        options: data.options,
        order_index: data.order_index
      }
    });
  }

  static async deleteQuestion(questionId: string) {
    return prisma.formQuestion.delete({ where: { id: questionId } });
  }

  static async submitForm(formId: string, submitterId: string, answers: any[]) {
    // Basic validation
    const form = await prisma.form.findUnique({ where: { id: formId }, include: { questions: true } });
    if (!form || form.status !== FormStatus.PUBLISHED) {
      throw new Error('Form is not available for submission');
    }

    // Check duplicate
    const existing = await prisma.formSubmission.findFirst({
      where: { form_id: formId, submitter_id: submitterId }
    });
    if (existing) throw new Error('You have already submitted this form');

    // Create submission
    return prisma.formSubmission.create({
      data: {
        form_id: formId,
        submitter_id: submitterId,
        answers: {
          create: answers.map((ans: any) => ({
            question_id: ans.question_id,
            value_string: ans.value_string,
            value_number: ans.value_number,
            value_boolean: ans.value_boolean,
            value_array: ans.value_array || []
          }))
        }
      }
    });
  }

  static async listSubmissions(formId: string, organizationId: string) {
    return prisma.formSubmission.findMany({
      where: { form_id: formId, form: { organization_id: organizationId } },
      include: {
        submitter: { select: { id: true, name: true, email: true } },
        answers: {
          include: { question: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  }
}
