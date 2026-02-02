import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import {
  db,
  eq,
  or,
  and,
  isNull
} from '@/db';
import { requireIntParam } from '@/lib/utils/paramsHelper';
import {
  conversations,
  actionLogs
} from '@/db/schema';
import { ablyRest } from '@/lib/clients/ablyChatClient';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
export const POST = withApiHandler(async (req: NextRequest, { authData, params }: ApiHandlerContext) => {
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

        const body = await req.json();
        const { content, messageType = 'text' } = body;

        if (!content) {
            return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
        }

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
                    ),
                    or(
                        isNull(conversations.isActive),
                        eq(conversations.isActive, true)
                    )
                )
            )
            .limit(1);

        if (!conversation || conversation.length === 0) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        // Send message via Ably channel (if configured)
        ConsoleLogger.log('ABLY_API_KEY set:', !!Bun.env.ABLY_API_KEY);
        ConsoleLogger.log('NEXT_PUBLIC_ABLY_API_KEY set:', !!Bun.env.NEXT_PUBLIC_ABLY_API_KEY);
        ConsoleLogger.log('Keys are different (this is normal):', Bun.env.ABLY_API_KEY !== Bun.env.NEXT_PUBLIC_ABLY_API_KEY);
        ConsoleLogger.log('ablyRest exists:', !!ablyRest);
        if (ablyRest) {
            const channel = ablyRest.channels.get(`conversation-${conversationId}`);
            ConsoleLogger.log('Publishing message to channel:', `conversation-${conversationId}`);
            await channel.publish('new-message', {
                message: {
                    id: `msg-${Date.now()}`,
                    content: content,
                    createdAt: new Date().toISOString(),
                    senderId: accountId,
                    messageType: messageType
                },
                conversationId: conversationId,
                senderId: accountId
            });
            ConsoleLogger.log('Message published successfully to Ably');
        } else {
            ConsoleLogger.log('Ably not configured - skipping real-time publish');
        }

        // Update conversation metadata
        await db
            .update(conversations)
            .set({
                updatedAt: new Date(),
                hasNew: true
            })
            .where(eq(conversations.id, conversationId));

        // Log the action
        await db
            .insert(actionLogs)
            .values({
                action: 'send_message',
                createdBy: accountId,
                resourceType: 'conversations',
                resourceId: conversationId
            });

        // Format response to match expected structure
        const message = {
            id: `msg-${Date.now()}`,
            content: content,
            createdAt: new Date().toISOString(),
            senderId: accountId,
            messageType: messageType
        };

        return NextResponse.json({
            success: true,
            data: message
        }, { status: 201 });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: errorMessage || 'Failed to send message'
        }, { status: 500 });
    }
})
