'use server';

import { prisma } from 'db';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(state: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Username and password are required' };
  }

  const admin = await prisma.adminUser.findUnique({
    where: { username },
  });

  if (!admin) {
    return { error: 'Invalid credentials' };
  }

  const isValidPassword = await bcrypt.compare(password, admin.password);

  if (!isValidPassword) {
    return { error: 'Invalid credentials' };
  }

  // Create the session
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ adminId: admin.id, expires });

  // Save the session in a cookie
  (await cookies()).set('session', session, { expires, httpOnly: true });

  redirect('/dashboard');
}

export async function logout() {
  (await cookies()).delete('session');
  redirect('/login');
}
