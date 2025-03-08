'use server';
import { auth } from '@/auth';

export default async function DashboardPage() {
  const session = await auth();
  return <div>DASHBOARD</div>;
}
