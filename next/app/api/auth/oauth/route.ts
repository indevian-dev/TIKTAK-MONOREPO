import { unifiedApiHandler } from '@/lib/middleware/_Middleware.index';
import { errorResponse } from '@/lib/middleware/Response.Api.middleware';

// TODO: Implement OAuth via AuthService when needed
export const POST = unifiedApiHandler(async () => {
  return errorResponse('OAuth is not currently supported', 501);
});
