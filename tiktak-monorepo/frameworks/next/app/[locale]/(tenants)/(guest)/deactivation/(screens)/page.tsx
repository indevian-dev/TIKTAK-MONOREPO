'use client';

import dynamic
  from 'next/dynamic';

const PublicDeactivationFormWidget = dynamic(() => import('@/app/[locale]/(tenants)/(guest)/deactivation/(widgets)/PublicDeactivationFormWidget'), {
  ssr: false,
});

export default function PublicDeactivationPage() {
  return <PublicDeactivationFormWidget />;
}