'use client';

import { useSearchParams }
  from 'next/navigation';
import { AuthVerificationWidget }
  from '@/app/[locale]/auth/verify/(widgets)/AuthEmailVerificationWidget';

export default function AuthVerifyPage() {
  const searchParams = useSearchParams();

  // Extract URL parameters
  const email = searchParams.get('email');
  const operation = searchParams.get('operation') || 'verification'; // Default to 'verification'
  const redirect = searchParams.get('redirect');

  return (
    <AuthVerificationWidget
      operation={operation}
      mode={'email'}
      contact={email || undefined}
      redirectPath={redirect || undefined}
    />
  );
}