import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';

import { PublicPrivacyPolicyWidget }
  from '@/app/[locale]/(tenants)/(guest)/pages/privacy/(widgets)/PublicPrivacyPolicyWidget'
import supabase
  from '@/lib/clients/supabaseServiceRoleClient'
import { cache }
  from 'react'

// Cached data fetching function
const getPrivacyPolicyData = cache(async () => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('type', 'PRIVACY')
    .single();

  if (error) {
    ConsoleLogger.error('Error fetching privacy policy:', error);
    return null;
  }

  return data;
});

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const data = await getPrivacyPolicyData();

  return {
    title: data?.title || 'Privacy Policy',
    description: data?.description || 'Our privacy policy and data protection guidelines',
    openGraph: {
      title: data?.title || 'Privacy Policy',
      description: data?.description || 'Our privacy policy and data protection guidelines',
      type: 'website',
      locale: locale,
      url: `${Bun.env.NEXT_PUBLIC_SITE_URL}/${locale}/docs/policy`,
    },
  };
}

export default async function PublicPolicyPage() {
  const data = await getPrivacyPolicyData();

  return (
    <>
      <PublicPrivacyPolicyWidget {...data} />
    </>
  )
}