import dotenv from 'dotenv';
dotenv.config();

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma/prisma';
import authConfig from './auth.config';
import { get } from 'http';
import { getUserById } from './data/user';
import { getAccountByUserId } from './data/account';

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  ...authConfig,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentilas') {
        return true;
      }

      if (!user?.id) return false;
      const existingUser = await getUserById(user.id);

      if (!existingUser?.emailVerified) return false;
      return true;
    },
    async jwt({ token, account, profile, user }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);
      token.isOauth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image;

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: { ...session.user, id: token.sub, isOauth: token.isOath },
      };
    },
  },
});
