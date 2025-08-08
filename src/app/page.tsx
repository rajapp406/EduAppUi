import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to dashboard as the default route
  redirect('/dashboard');
}
