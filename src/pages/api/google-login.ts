import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { signJwt } from '../../lib/jwt';

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
          avatarUrl: avatar || '',
          role: 'user',
        },
      });
    } else {
      // Actualizar nombre/avatar si cambió
      user = await prisma.user.update({
        where: { email },
        data: {
          name: name || user.name,
          avatarUrl: avatar || user.avatarUrl
        }
      });
    }
    // Generar JWT
    const token = signJwt({ id: user.id, email: user.email, name: user.name, role: user.role });
    return res.status(200).json({
      user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl, role: user.role },
      token
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error interno' });
  }
}
