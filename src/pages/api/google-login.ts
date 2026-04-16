import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { signJwt } from '../../lib/jwt';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  const { email, name, avatar } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Falta el correo' });
  }
  try {
    let user = await prisma.user.findUnique({ where: { email } });
    let role = 'user';
    if (!user) {
      // Si es el admin, crear con rol admin
      role = email === 'salazaroliveros@gmail.com' ? 'admin' : 'user';
      user = await prisma.user.create({
        data: {
          email,
          name: name || '',
          avatarUrl: avatar || '',
          role,
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
      // Forzar rol admin solo para el correo del administrador
      if (user.email === 'salazaroliveros@gmail.com' && user.role !== 'admin') {
        await prisma.user.update({ where: { email }, data: { role: 'admin' } });
        role = 'admin';
      } else if (user.email !== 'salazaroliveros@gmail.com' && user.role !== 'user') {
        await prisma.user.update({ where: { email }, data: { role: 'user' } });
        role = 'user';
      } else {
        role = user.role;
      }
    }
    // Generar JWT
    const token = signJwt({ id: user.id, email: user.email, name: user.name, role });
    return res.status(200).json({
      user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl, role },
      token
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error interno' });
  }
}
