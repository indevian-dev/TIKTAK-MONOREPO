// app/[locale]/(public)/ui/messageButton.jsx
'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { FiMessageSquare } from 'react-icons/fi';
import { loadClientSideCoLocatedTranslations } from '@/i18n/i18nClientSide';

import { ConsoleLogger } from '@/lib/logging/Console.logger';
interface PublicMessageButtonTileProps {
  cardId: string;
  cardTitle: string;
  accountId?: string;
  storeId?: string;
}

export function PublicMessageButtonTile({ cardId, cardTitle }: PublicMessageButtonTileProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = loadClientSideCoLocatedTranslations('PublicMessageButtonTile');

  const handleMessage = async () => {
    try {
      setLoading(true);

      // Start conversation - API will handle authentication
      const conversationResponse = await fetch('/api/provider/conversations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: cardId,
          message: `Hi! I'm interested in your "${cardTitle}" listing.`
        }),
      });

      const conversationData = await conversationResponse.json();

      if (!conversationResponse.ok) {
        if (conversationResponse.status === 401) {
          // Redirect to login if not authenticated
          router.push('/auth/login');
          return;
        }

        if (conversationData.error === 'Conversation already exists') {
          // Redirect to existing conversation
          router.push(`/provider/conversations/${conversationData.conversationId}`);
          return;
        }

        if (conversationData.error === 'Cannot start conversation with yourself') {
          alert(t('cannot_message_yourself') || 'You cannot message yourself');
          return;
        }

        throw new Error(conversationData.error || 'Failed to start conversation');
      } else {
        // Redirect to new conversation
        router.push(`/provider/conversations/${conversationData.data.conversation.id}`);
      }
    } catch (error) {
      ConsoleLogger.error('Error starting conversation:', error);
      alert(t('error_starting_conversation') || 'Error starting conversation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMessage}
      disabled={loading}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <FiMessageSquare size={18} />
      {loading ? (t('loading') || 'Loading...') : (t('message') || 'Message')}
    </button>
  );
}