import { withApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types/next';
import { NextResponse } from 'next/server';
import supabase from '@/lib/clients/supabaseServiceRoleClient';

export const GET = withApiHandler(async (req: NextRequest, { authData, params }: ApiHandlerContext) => {
  if (!authData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;
  if (!resolvedParams?.id) {
    return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
  }
  const storeId = resolvedParams.id;

  try {
    // Fetch user data from Supabase using the provided token
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .single();

    if (error) throw error;

    // Respond with the fetched data
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      error: 'Failed to fetch Store data from Supabase'
    }, { status: 500 });
  }
})
