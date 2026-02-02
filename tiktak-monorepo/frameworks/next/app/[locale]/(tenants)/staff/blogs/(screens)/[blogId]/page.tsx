import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import { StaffBlogEditWidget }
  from '@/app/[locale]/(tenants)/staff/blogs/(widgets)/StaffBlogEditWidget';

export default withPageAuth(
  async function BlogEditPage({ params }: { params: Promise<{ locale: string; blogId: string }> }) {
    return <StaffBlogEditWidget params={params} />;
  },
  { pagePath: '/staff/blogs/:blogId', inlineHandlers: true }
);
