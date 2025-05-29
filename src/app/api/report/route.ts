import { NextRequest } from 'next/server';
import { prisma } from '@/api/lib/prisma';

export async function GET(_req: NextRequest) {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return Response.json({ reports });
} 