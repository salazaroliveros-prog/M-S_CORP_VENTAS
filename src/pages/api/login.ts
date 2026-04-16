import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import { signJwt } from '../../lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan credenciales' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    // Forzar rol admin solo para el correo del administrador
    let role = user.role;
    if (user.email === 'salazaroliveros@gmail.com') {
      if (user.role !== 'admin') {
        await prisma.user.update({ where: { email }, data: { role: 'admin' } });
      }
      role = 'admin';
    } else if (user.role !== 'user') {
      await prisma.user.update({ where: { email }, data: { role: 'user' } });
      role = 'user';
    }
    // Generar JWT
    const token = signJwt({ id: user.id, email: user.email, name: user.name, role });
    return res.status(200).json({
      user: { id: user.id, email: user.email, name: user.name, role },
      token
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error interno' });
  }
}
