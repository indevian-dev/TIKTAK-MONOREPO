/**
 * @deprecated STUB — useChat hook removed. Migrate to Ably integration client.
 * This file exists only to prevent build errors.
 */

import { useState, useCallback } from 'react';
import { ConsoleLogger } from '@/lib/logging/Console.logger';

const MIGRATION_MSG = '[MIGRATION NEEDED] useChat hook is removed. Migrate to Ably integration.';

export function useChat(_channelId: string, _userId: string | null) {
  const [messages, setMessages] = useState<unknown[]>([]);
  const [isConnected] = useState(false);
  const [isTyping] = useState(false);
  const [ablyConfigured] = useState(false);

  const sendMessage = useCallback(async (_content: string) => {
    ConsoleLogger.warn(MIGRATION_MSG);
    return null;
  }, []);

  const sendTypingIndicator = useCallback((_isTyping: boolean) => {
    // no-op stub
  }, []);

  const loadMessages = useCallback(async () => {
    ConsoleLogger.warn(MIGRATION_MSG);
    return [];
  }, []);

  return {
    messages,
    isConnected,
    isTyping,
    ablyConfigured,
    sendMessage,
    sendTypingIndicator,
    loadMessages,
  };
}
