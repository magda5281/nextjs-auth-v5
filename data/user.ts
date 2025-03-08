import { prisma } from '@/prisma/prisma';

export const getUserById = async (id: string) => {
  try {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error('Error fetching account by user ID:', error);
    throw error;
    return null;
  }
};
