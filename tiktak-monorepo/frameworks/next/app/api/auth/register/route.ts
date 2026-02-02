import { withApiHandler }
  from '@/lib/auth/AccessValidatorForApis';
import { NextRequest, NextResponse }
  from 'next/server';
import type { ApiRouteHandler, ApiHandlerContext } from '@/types';
import {
  cleanPhoneNumber,
  validateAzerbaijanPhone
} from '@/lib/utils/phoneUtility';
import {
  validatePassword,
  hashPassword
} from '@/lib/utils/passwordUtility';

import {
  createUserWithAccount,
  verifyUserExists
} from '@/lib/auth/AuthDataRepository';
import { storeAndSendRegistrationOtp }
  from '@/lib/utils/otpHandlingUtility';
import type { RegisterRequest, RegisterResponse, OtpType } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
export const POST: ApiRouteHandler = withApiHandler(async (request: NextRequest, { authData, params }: ApiHandlerContext) => {
  try {
    const body: RegisterRequest = await request.json();
  const { name, email, password, confirmPassword, phone } = body;

    // Basic required fields validation
    if (!name || !email || !password || !confirmPassword || !phone) {
      return NextResponse.json({
        error: 'Name, email, password, confirmPassword, and phone are required',
        field: 'required'
      }, { status: 400 });
    }

    // Password mismatch validation
    if (password !== confirmPassword) {
      return NextResponse.json({
        error: 'Passwords do not match',
        field: 'confirmPassword'
      }, { status: 400 });
    }

    // Comprehensive password validation
    const { isPasswordValid, validatedPassword, errors: passwordErrors } = validatePassword({ password });
    if (!isPasswordValid) {
      return NextResponse.json({
        error: passwordErrors && passwordErrors.length > 0 ? passwordErrors.join('. ') : 'Please provide a valid password',
        field: 'password',
        validationErrors: passwordErrors
      }, { status: 400 });

    }

    // Clean and validate phone number
    const { cleanedPhone } = cleanPhoneNumber({ phone });
    const { isPhoneValid, validatedPhone } = validateAzerbaijanPhone({ cleanedPhone });
    if (!isPhoneValid) {
      return NextResponse.json({
        error: 'Please provide a valid Azerbaijan phone number',
        field: 'phone'
      }, { status: 400 });
    }

    // Check if user already exists using the new utility function
    const { existingUser, existingUserConflicts, error: verifyError } = await verifyUserExists({
      email: email,
      phone: validatedPhone || undefined
    });

    if (verifyError) {
      ConsoleLogger.log(('User verification error:'), verifyError);
      return NextResponse.json({
        error: 'Failed to verify user existence',
        field: 'verification'
      }, { status: 500 });
    }

    ConsoleLogger.log(('User exists check result:'), { existingUser, existingUserConflicts });

    if (existingUserConflicts.emailExists) {
      return NextResponse.json({
        error: 'Email already registered',
        field: 'email'
      }, { status: 400 });
    }
    if (existingUserConflicts.phoneExists) {
      return NextResponse.json({
        error: 'Phone number already registered',
        field: 'phone'
      }, { status: 400 });
    }

    const { hashedPassword } = await hashPassword({ password: validatedPassword! });

    const { success, createdUser, createdAccount, error } = await createUserWithAccount({
      name,
      email,
      password: hashedPassword,
      phone: validatedPhone || undefined
    });

    if (!success || !createdUser || !createdAccount) {
      return NextResponse.json({
        error: error || 'Failed to create user',
        field: 'createUser'
      }, { status: 400 });
    }

    // Send OTP verification codes to both email and phone for new user verification
    const otpResult = await storeAndSendRegistrationOtp({
      userId: createdUser.id,
      email: createdUser.email,
      phone: createdUser.phone || undefined,
      type: 'registration' as OtpType,
      ttlMinutes: 10
    });

    if (!otpResult.success) {
      // Log the error but don't fail the registration - user can request verification later
      ConsoleLogger.log(('Failed to send verification OTPs for new user:'), createdUser.id);
      ConsoleLogger.log(('OTP send errors:'), {
        emailError: otpResult.emailError,
        smsError: otpResult.smsError
      });
    }

    // Create response indicating registration successful but verification required
const responsePayload: RegisterResponse = {
      success: true,
      message: 'Registration successful. Please verify your email and phone to complete registration.',
      user: {
        id: createdUser.id,
        email: createdUser.email,
        phone: createdUser.phone || undefined,
        name: createdUser.name || undefined,
        emailIsVerified: createdUser.emailIsVerified || false,
        phoneIsVerified: createdUser.phoneIsVerified || false
      },
      account: {
        id: createdAccount.id,
        role: createdAccount.role || 'basic_role',
        isPersonal: createdAccount.isPersonal || false
      },
      verificationRequired: true,
      verificationSent: {
        email: otpResult.emailSent || false,
        sms: otpResult.smsSent || false
      }
    };

    // Include OTP code in development environment for testing
    if (Bun.env.NODE_ENV !== 'production' && otpResult.otp) {
      responsePayload.devCode = otpResult.otp;
    }

    return NextResponse.json(responsePayload, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred during registration' }, { status: 500 });
  }
});
