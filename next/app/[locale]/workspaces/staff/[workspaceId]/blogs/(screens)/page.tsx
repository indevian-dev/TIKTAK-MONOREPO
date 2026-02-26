import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";

export default withPageAuth(
  async function BlogsPage({ }) {
    return <div>Blogs</div>;
  },
  { path: '/staff/blogs', inlineHandlers: true }
);
