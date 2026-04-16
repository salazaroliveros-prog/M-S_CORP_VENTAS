import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  const { email, name, avatar } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Falta el correo' });
  }
  try {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || '',
          avatar: avatar || '',
          provider: 'google',
        },
      });
    }
    // Aquí puedes generar un JWT o sesión
    return res.status(200).json({ user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar } });
  } catch (error) {
    return res.status(500).json({ error: 'Error interno' });
  }
}
