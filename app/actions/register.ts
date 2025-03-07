'use server';

import * as z from 'zod';
import { prisma } from '@/prisma/prisma';
import bcrypt from 'bcryptjs';
import { RegisterSchema } from '@/schemas';
// import { generateVerificationToken } from "@/lib/token";
// import { sendVerificationEmail } from "@/lib/mail";

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  try {
    // Validate the input data
    const result = RegisterSchema.safeParse(data);

    if (!result.success) {
      // Extract error messages from Zod
      const errorMessages = result.error.format();

      return { error: errorMessages };
    }

    const validatedData = result.data;
    // Proceed with signup process (e.g., send to API)

    //  Destructure the validated data
    const { email, name, password, passwordConfirmation } = validatedData;

    // Check if passwords match
    if (password !== passwordConfirmation) {
      return { error: 'Passwords do not match' };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check to see if user already exists
    const userExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    // If the user exists, return an error
    //it should redirect to login page and not throwing an error
    if (userExists) {
      return {
        error: 'Email already is in use. Please try another one or login.',
      };
    }

    const lowerCaseEmail = email.toLowerCase();

    // Create the user
    const user = await prisma.user.create({
      data: {
        email: lowerCaseEmail,
        name,
        password: hashedPassword,
      },
    });

    // Generate Verification Token
    // const verificationToken = await generateVerificationToken(email);

    // await sendVerificationEmail(lowerCaseEmail, verificationToken.token);

    return { success: 'User created successfully' };
  } catch (error) {
    // Handle the error, specifically check for a 503 error
    console.error('Database error:', error);

    if ((error as { code: string }).code === 'ETIMEDOUT') {
      return {
        error: 'Unable to connect to the database. Please try again later.',
      };
    } else if ((error as { code: string }).code === '503') {
      return {
        error: 'Service temporarily unavailable. Please try again later.',
      };
    } else {
      return { error: 'An unexpected error occurred. Please try again later.' };
    }
  }
};
