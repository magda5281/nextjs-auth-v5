'use client';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import CardWrapper from '@/components/auth/card-wrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { login } from '@/app/actions/login';

import { FormError } from '../form-error';

const LoginForm = () => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    try {
      const res = await login(data); // Call the login function

      if (res.error) {
        // ✅ Correct way to check for errors
        setError('root', {
          type: 'manual',
          message:
            typeof res.error === 'string'
              ? res.error
              : JSON.stringify(res.error),
        });
      }

      if (res.success) {
        // Redirect to the dashboard
        console.log('Server is Redirecting to the dashboard');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CardWrapper
      headerLabel='Login to your account'
      title='Login'
      backButtonHref='/auth/register'
      backButtonLabel="Dont't have an account? Register here"
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
                      onChange={(e) => {
                        field.onChange(e); // Update field value
                        form.clearErrors('root'); // Clear API error
                      }}
                    />
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
                    <Input
                      {...field}
                      placeholder='******'
                      type='password'
                      onChange={(e) => {
                        field.onChange(e);
                        form.clearErrors('root');
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormError message={errors.root?.message} />
          <Button
            type='submit'
            className='w-full'
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Is submitting...' : 'Login'}
          </Button>
        </form>
      </Form>
      {/* <GoogleLogin /> */}
    </CardWrapper>
  );
};

export default LoginForm;
