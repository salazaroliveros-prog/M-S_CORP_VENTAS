// Utilidad para manejar errores de Prisma de forma similar a Firestore
import { Prisma } from '@prisma/client';

export function handlePrismaError(error: any, operationType: string, path: string | null) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[PRISMA ERROR] (${operationType}) en ${path}:`, error.message);
  } else {
    console.error(`[ERROR] (${operationType}) en ${path}:`, error);
  }
}
