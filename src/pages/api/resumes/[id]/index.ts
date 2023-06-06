import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { resumeValidationSchema } from 'validationSchema/resumes';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.resume
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getResumeById();
    case 'PUT':
      return updateResumeById();
    case 'DELETE':
      return deleteResumeById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getResumeById() {
    const data = await prisma.resume.findFirst(convertQueryToPrismaUtil(req.query, 'resume'));
    return res.status(200).json(data);
  }

  async function updateResumeById() {
    await resumeValidationSchema.validate(req.body);
    const data = await prisma.resume.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteResumeById() {
    const data = await prisma.resume.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
