'use client';

import { socialAuthenticate } from '@/app/actions/socialLogin';
import { useActionState } from 'react';
import { BsGoogle } from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import { stat } from 'fs';
export default function GoogleLogin() {
  const [state, formAction, isPending] = useActionState(
    socialAuthenticate,
    null
  );

  return (
    <form action={formAction} className='flex mt-4'>
      <Button
        disabled={isPending}
        variant={'outline'}
        className='flex items-center gap-3 w-full'
      >
        <BsGoogle />
        Login in with Google
      </Button>
      <p> {state?.error}</p>
    </form>
  );
}
