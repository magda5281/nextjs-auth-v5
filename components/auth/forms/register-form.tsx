'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import CardWrapper from '@/components/auth/card-wrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { register } from '@/app/actions/register';
import { FormSuccess } from '../form-success';
import { FormError } from '../form-error';
const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await register(data); // Call the register function

      if (res.error) {
        // ✅ Correct way to check for errors
        setError(
          typeof res.error === 'string' ? res.error : JSON.stringify(res.error)
        );
        return;
      }

      if (res.success) {
        setLoading(false);
        setSuccess(res.success);
        setError('');
        form.reset();
      }
    } catch (err) {
      setError((err as Error).message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardWrapper
      headerLabel='Create an account'
      title='Register'
      backButtonHref='/auth/login'
      backButtonLabel='Already have an account'
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='johndoe@email.com'
                      type='email'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='John Doe' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='******' type='password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='passwordConfirmation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='******' type='password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={success} />
          <FormError message={error} />
          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Loading...' : 'Register'}
          </Button>
        </form>
      </Form>
      {/* <GoogleLogin /> */}
    </CardWrapper>
  );
};

export default RegisterForm;
