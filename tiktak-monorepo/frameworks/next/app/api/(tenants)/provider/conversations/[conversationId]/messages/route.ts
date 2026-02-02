import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import {
  db,
  eq,
  or,
  and,
  desc
} from '@/db';
import {
  conversations,
  messages
} from '@/db/schema';
import { requireIntParam } from '@/lib/utils/paramsHelper';

export const GET = withApiHandler(async (req: NextRequest, { authData, params }: ApiHandlerContext) => {
  try {
    if (!authData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    if (!resolvedParams?.conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
    }
    const conversationId = requireIntParam(resolvedParams.conversationId, 'Conversation ID');

    if (!authData?.account) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const accountId = authData.account.id;

    // Check if user is participant in this conversation
    const conversation = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.id, conversationId),
          or(
            eq(conversations.accountId, accountId),
            eq(conversations.cardAccountId, accountId)
          )
        )
      )
      .limit(1);

    if (!conversation || conversation.length === 0) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50') || 50;
    const offset = parseInt(searchParams.get('offset') || '0') || 0;

    // Load messages from database
    const messagesResult = await db
      .select({
        id: messages.id,
        content: messages.content,
        messageType: messages.messageType,
        createdAt: messages.createdAt,
        senderId: messages.senderId,
        isRead: messages.isRead,
        readAt: messages.readAt,
      })
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(limit + 1)
      .offset(offset);

    // Check if there are more messages
    const hasMore = messagesResult.length > limit;
    const actualMessages = hasMore ? messagesResult.slice(0, limit) : messagesResult;

    // Update conversation to mark as no new messages
    await db
      .update(conversations)
      .set({
        hasNew: false,
        updatedAt: new Date()
      })
      .where(eq(conversations.id, conversationId));

    return NextResponse.json({
      success: true,
      data: actualMessages.reverse(), // Return in chronological order (oldest first)
      pagination: {
        limit,
        offset,
        hasMore
      }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      error: errorMessage || 'Failed to fetch messages'
    }, { status: 500 });
  }
})
