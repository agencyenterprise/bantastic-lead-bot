import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Utility to create a new conversation
export async function createConversationId() {
  return prisma.conversation.create({ data: {} });
}

// Utility to log a message
export async function logMessage({ conversationId, sender, content }: { conversationId: string, sender: string, content: string }) {
  return prisma.message.create({
    data: {
      conversationId,
      sender,
      content,
    },
  });
} 