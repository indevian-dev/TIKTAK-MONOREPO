'use client';

import { useSearchParams }
  from 'next/navigation';
import { AuthPhoneVerificationWidget }
  from '@/app/[locale]/auth/verify/(widgets)/AuthPhoneVerificationWidget';

export default function AuthVerifyPage() {
  const searchParams = useSearchParams();

  // Extract URL parameters
  const phone = searchParams.get('phone');
  const operation = searchParams.get('operation') || 'verification'; // Default to 'verification'
  const redirect = searchParams.get('redirect');

  return (
    <AuthPhoneVerificationWidget
      operation={operation}
      mode={'phone'}
      contact={phone || undefined}
      redirectPath={redirect || undefined}
    />
  );
}