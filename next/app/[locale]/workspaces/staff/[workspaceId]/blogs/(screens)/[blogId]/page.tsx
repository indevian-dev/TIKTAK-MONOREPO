import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import { StaffBlogEditWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/blogs/(widgets)/StaffBlogEdit.widget';

export default withPageAuth(
  async function BlogEditPage({ params }: { params: Promise<{ locale: string; blogId: string }> }) {
    return <StaffBlogEditWidget params={params} />;
  },
  { path: '/staff/blogs/:blogId', inlineHandlers: true }
);
