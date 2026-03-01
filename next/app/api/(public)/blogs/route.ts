import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
export const GET = unifiedApiHandler(async (_req, { module, log }) => {
  try {
    const blogsList = await module.blogs.listBlogs({ isActive: true });
    return okResponse(blogsList.data);
  } catch (error) {
    log?.error('Error fetching blogs', error as Error);
    return serverErrorResponse('Failed to fetch blogs');
  }
});
