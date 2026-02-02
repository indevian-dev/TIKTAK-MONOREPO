import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
import supabase from '@/lib/clients/supabaseServiceRoleClient'; // Adjust the path as necessary

export const GET = withApiHandler(async (req: NextRequest, { authData, params }: ApiHandlerContext) => {
  // Validate API Request (Auth, Permissions, 2FA, Suspension)
  // Auth handled by withApiHandler - authData available in context
  const { searchParams } = new URL(req.url);
  const parent_id = searchParams.get('parent_id'); // Get parent_id from URL params

  ConsoleLogger.log('parent_id', parent_id);

  let query = supabase.from('categories').select('*');

  // if (parent_id === undefined) {
  //     // If parent_id is null or undefined, return only parent categories
  // } else if ( parent_id === null) {
  //     // If parent_id is an integer, return categories with that parent_id
  //     query = query.is('parent_id', null);
  // } else {
  //     // If parent_id is an integer, return categories with that parent_id
  //     let parentId = parseInt(parent_id);
  //     query = query.eq('parent_id', parentId);
  // }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(JSON.stringify({ categories: data }), { status: 200 });
});
