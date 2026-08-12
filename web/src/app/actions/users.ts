'use server';

import { prisma } from 'db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createUser(state: any, formData: FormData) {
  const name = formData.get('name') as string;
  const phone_number = formData.get('phone_number') as string;
  const diet_type = (formData.get('diet_type') as string) || 'veg';
  const address = formData.get('address') as string;
  const has_preferences = formData.get('has_preferences') === 'on';
  const preferences_text = formData.get('preferences_text') as string;
  const meal_balance = parseInt(formData.get('meal_balance') as string) || 0;

  if (!name || !phone_number || !address) {
    return { error: 'Name, phone number, and address are required' };
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        phone_number,
        diet_type,
        address,
        has_preferences,
        preferences_text,
        meal_balance,
      }
    });

    // Log initial balance if any
    if (meal_balance > 0) {
      await prisma.balanceTransaction.create({
        data: {
          user_id: user.id,
          amount: meal_balance,
          reason: 'Initial balance on registration',
        }
      });
    }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'Phone number already exists' };
    }
    return { error: 'An error occurred while saving the user' };
  }

  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}

export async function toggleUserStatus(userId: number, isActive: boolean) {
  await prisma.user.update({
    where: { id: userId },
    data: { is_active: isActive },
  });
  revalidatePath('/dashboard/users');
}

export async function adjustBalance(state: any, formData: FormData) {
  const userId = parseInt(formData.get('userId') as string);
  const amount = parseInt(formData.get('amount') as string);
  const mode = formData.get('mode') as string;
  const reason = formData.get('reason') as string;

  if (!userId || !amount || amount <= 0) {
    return { error: 'Invalid amount' };
  }

  if (!reason) {
    return { error: 'A reason is required' };
  }

  const effectiveAmount = mode === 'remove' ? -amount : amount;

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { meal_balance: { increment: effectiveAmount } },
      }),
      prisma.balanceTransaction.create({
        data: {
          user_id: userId,
          amount: effectiveAmount,
          reason,
        },
      }),
    ]);
  } catch (error: any) {
    return { error: 'Failed to update balance' };
  }

  revalidatePath(`/dashboard/users/${userId}`);
  revalidatePath('/dashboard/users');
  return { error: '' };
}

