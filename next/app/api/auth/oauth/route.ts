import { withApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types/next';
import { NextResponse } from 'next/server';
import supabase from '@/lib/clients/supabaseServiceRoleClient';

export const POST = withApiHandler(async (req: NextRequest, { authData, params }: ApiHandlerContext) => {
  const { provider } = await req.json();

  if (!provider) {
    return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
  }

  try {
    const { error } = await supabase.auth.signInWithOAuth({ provider });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
