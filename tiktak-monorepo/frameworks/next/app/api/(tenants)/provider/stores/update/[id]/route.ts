import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import supabase from '@/lib/clients/supabaseServiceRoleClient';

export const PUT = withApiHandler(async (req: NextRequest, { authData, params }: ApiHandlerContext) => {
  if (!authData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;
  if (!resolvedParams?.id) {
    return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
  }
  const id = resolvedParams.id;

  const { data, error } = await supabase
    .from('stores')
    .update(await req.json())
    .match({ id: id })
    .select();

  if (error) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
})
