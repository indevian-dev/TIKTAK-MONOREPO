import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";

export default withPageAuth(
  async function BlogsPage({ }) {
    return <div>Blogs</div>;
  },
  { pagePath: '/staff/blogs', inlineHandlers: true }
);
