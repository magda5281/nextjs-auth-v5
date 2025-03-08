'use server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
//TODO: sign in dynamically based on the provider
export async function socialAuthenticate() {
  try {
    await signIn('google', {
      redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        default:
          return {
            error: 'Google login error',
          };
      }
    }
    throw error;
  }
}
