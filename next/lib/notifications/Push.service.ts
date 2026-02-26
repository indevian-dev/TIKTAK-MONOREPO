import { BaseService } from '@/lib/domain/base/Base.service';
import { AuthContext } from '@/lib/domain/base/Base.types';
import { ConsoleLogger } from '@/lib/logging/Console.logger';
import type { NotificationResult } from './Notification.types';

// TODO: Integrate a real push notification provider (e.g. Firebase Cloud Messaging, OneSignal)

/**
 * PushService - Handles push notification sending operations
 */
export class PushService extends BaseService {
  constructor(private readonly ctx: AuthContext) {
    super();
  }

  /**
   * Send a generic push notification
   */
  async send(params: {
    to: string;
    title: string;
    body: string;
    data?: Record<string, unknown>;
  }): Promise<NotificationResult> {
    try {
      if (!params.to || !params.title || !params.body) {
        throw new Error('Missing required push notification parameters');
      }

      // TODO: Call real push provider here
      ConsoleLogger.log('Push notification sending not yet implemented', {
        to: params.to,
        title: params.title,
        body: params.body,
        data: params.data,
      });

      return {
        success: true,
        messageId: `placeholder_${Date.now()}`,
      };
    } catch (error) {
      this.handleError(error, 'PushService.send');
      return { success: false, error: 'Failed to send push notification' };
    }
  }

  /**
   * Send an OTP push notification
   */
  async sendOtp(params: {
    to: string;
    otp: string;
    expiryMinutes?: number;
    operation?: string;
  }): Promise<NotificationResult> {
    const operationTitles: Record<string, string> = {
      verification: 'Verify Your Account',
      password_reset: 'Password Reset Code',
      '2fa': 'Two-Factor Authentication',
      email_change: 'Verify Email Change',
      phone_change: 'Verify Phone Change',
    };

    const title =
      operationTitles[params.operation ?? 'verification'] ??
      operationTitles.verification;

    const body = `Your verification code is: ${params.otp}. Expires in ${params.expiryMinutes ?? 10} minutes.`;

    return this.send({
      to: params.to,
      title,
      body,
      data: {
        type: 'otp',
        otp: params.otp,
        operation: params.operation ?? 'verification',
        expiryMinutes: params.expiryMinutes ?? 10,
      },
    });
  }

  /**
   * Send a registration verification OTP push notification
   */
  async sendRegistrationOtp(params: {
    to: string;
    otp: string;
    expiryMinutes?: number;
  }): Promise<NotificationResult> {
    return this.sendOtp({ ...params, operation: 'verification' });
  }

  /**
   * Send a password reset OTP push notification
   */
  async sendPasswordResetOtp(params: {
    to: string;
    otp: string;
    expiryMinutes?: number;
  }): Promise<NotificationResult> {
    return this.sendOtp({ ...params, operation: 'password_reset' });
  }
}
