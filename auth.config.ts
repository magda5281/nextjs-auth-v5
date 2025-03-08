import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { LoginSchema } from './schemas';
import { prisma } from './prisma/prisma';

import bcrypt from 'bcryptjs';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
if (!googleClientId) {
  throw new Error('GOOGLE_CLIENT_ID is not defined. Check your .env file.');
}

const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!googleClientSecret) {
  throw new Error('GOOGLE_CLIENT_SECRET is not defined. Check your .env file.');
}

export default {
  providers: [
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    Credentials({
      async authorize(credentials) {
        const validatedData = LoginSchema.safeParse(credentials);
        if (!validatedData.success) {
          return null;
        }

        const { email, password } = validatedData.data;

        const user = await prisma.user.findFirst({
          where: {
            email,
          },
        });

        if (!user || !user.password) {
          return null; // User exists but has no password (likely a social login)
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        return passwordMatch ? user : null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET || 'hfjhgdgsdaerwte676565wqaers',
} satisfies NextAuthConfig;
