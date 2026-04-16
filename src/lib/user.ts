// Ejemplo de función para obtener usuario por email
import { prisma } from './prisma';
import { handlePrismaError } from './prismaError';

export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    handlePrismaError(error, 'get', `user/email/${email}`);
    return null;
  }
}

// Ejemplo de función para crear usuario
export async function createUser(data: {
  email: string;
  name?: string;
  password?: string;
  role?: string;
  avatarUrl?: string;
}) {
  try {
    return await prisma.user.create({ data });
  } catch (error) {
    handlePrismaError(error, 'create', 'user');
    return null;
  }
}
