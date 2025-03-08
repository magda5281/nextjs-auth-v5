import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isUserInvalid = (
  user: any
): user is null | { email: string; password: null } => {
  return !user || !user.email || !user.password;
};
