// Utilidad para manejar errores de Prisma
// import { Prisma } from '@prisma/client'; // Solo backend

export function handlePrismaError(error: any, operationType: string, path: string | null) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[PRISMA ERROR] (${operationType}) en ${path}:`, error.message);
  } else {
    console.error(`[ERROR] (${operationType}) en ${path}:`, error);
  }
}
