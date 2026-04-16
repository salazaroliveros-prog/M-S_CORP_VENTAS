// SOLO USAR EN ENDPOINTS API O BACKEND
if (typeof window !== 'undefined') {
  throw new Error('src/lib/user.ts solo debe usarse en backend/API, nunca en frontend');
}
// import { prisma } from './prisma';
// import { handlePrismaError } from './prismaError';
// export async function getUserByEmail(email: string) { ... }
// export async function createUser(data: any) { ... }
