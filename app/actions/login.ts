'use server';
import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/prisma/prisma';
import { isUserInvalid } from '@/lib/utils';

export const login = async (data: z.infer<typeof LoginSchema>) => {
  try {
    // Validate the input data
    const validatedData = LoginSchema.safeParse(data);

    if (!validatedData.success) {
      // Extract error messages from Zod
      const errorMessages = validatedData.error.format();

      return { error: errorMessages };
    }

    const { email, password } = validatedData.data;
    const userExists = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!userExists) {
      return { error: 'User not found - please register' };
    }
    if (isUserInvalid(userExists)) {
      return { error: 'Login invalid' };
    }

    await signIn('credentials', {
      email: userExists.email,
      password: password,
      redirect: true,
      redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials' };
        default:
          return { error: 'Login error' };
      }
      return { error: 'An error occurred' };
    }
    throw error;
  }
  return { success: 'User logged in successfully' };
};
