import { withApiHandler }
  from '@/lib/middleware/handlers/ApiInterceptor';
import { NextRequest, NextResponse }
  from 'next/server';
import type { ApiRouteHandler, ApiHandlerContext } from '@/types/next';
import { v4 as uuidv4 }
  from 'uuid';
import {
  verifyUserExists,
  createUserWithAccount,
  getUserData as getJWTUserAndAccount
} from '@/lib/auth/AuthDataRepository';
import { createUserSession } from '@/lib/auth/AuthDataRepository';
import { signAccessToken, signRefreshToken }
  from '@/lib/auth/AuthTokensManager';
import {
  OAUTH_CONFIGS,
  getOAuthToken,
  getUserData,
  getOAuthBaseUrl,
  linkOAuthProvider
} from '@/lib/auth/OauthHandler';
import type { OAuthUserInfo }
  from '@/types';
import { CookieManager }
  from '@/lib/auth/CookieManager';


import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
export const POST: ApiRouteHandler = withApiHandler(async (req: NextRequest, { authData, params }: ApiHandlerContext) => {
  const {
    code,
    state,
    provider,
    deviceInfo,
    emailByOAuthProvider: emailByOAuthProvider
  } = await req.json();

  if (!code || !provider) {
    return NextResponse.json(
      { error: 'Authorization code and provider are required' },
      { status: 400 }
    );
  }

  const validProviders = ['google', 'facebook', 'apple'] as const;
  if (!validProviders.includes(provider)) {
    return NextResponse.json(
      { error: 'Invalid provider' },
      { status: 400 }
    );
  }

  const config = OAUTH_CONFIGS[provider as 'google' | 'facebook' | 'apple'];
  if (!config) {
    return NextResponse.json(
      { error: 'Invalid provider' },
      { status: 400 }
    );
  }

  const redirectUri = await getOAuthBaseUrl() + `/auth/oauth/callback`;

  // Get OAuth token
  const { oauthTokenData, error: oauthTokenError } = await getOAuthToken({
    code,
    config,
    redirectUri
  });

  if (oauthTokenError || !oauthTokenData) {
    return NextResponse.json(
      { error: oauthTokenError || 'Failed to get OAuth token' },
      { status: 500 }
    );
  }

  // Get user data from OAuth provider
  let userData: OAuthUserInfo;
  try {
    userData = await getUserData({
      accessToken: oauthTokenData.access_token,
      provider,
      config
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get user data from OAuth provider' },
      { status: 500 }
    );
  }

  // If email is missing and not provided manually, request it from the user
  if (!userData.email && !emailByOAuthProvider) {
    return NextResponse.json(
      { error: 'Email is required', needEmail: true },
      { status: 428 }
    );
  }

  // Use manually provided email if no email from OAuth
  if (!userData.email && emailByOAuthProvider) {
    userData.email = emailByOAuthProvider;
  }

  const { existingUser } = await verifyUserExists({
    email: userData.email,
    phone: undefined
  });

  ConsoleLogger.log(('existingUser:'), existingUser);

  // Get IP from request
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    '0.0.0.0';

  // Generate unique session ID
  const sessionId = uuidv4();

  let user = null, account = null;

  if (!existingUser) {
    // Create new user with account
    const { success, createdUser, createdAccount, error } = await createUserWithAccount({
      email: userData.email,
      provider: provider,
      providerId: userData.id,
      providerData: {
        name: userData.name,
        avatar_url: userData.avatarUrl
      }
    });

    if (!success || !createdUser || !createdAccount) {
      return NextResponse.json(
        { error: error || 'Failed to create user' },
        { status: 500 }
      );
    }

    ConsoleLogger.log(('Created new user:'), createdUser);
    ConsoleLogger.log(('Created new account:'), createdAccount);

    user = createdUser;
    account = createdAccount;
  } else {
    // Link OAuth provider to existing user
    const { error: linkError } = await linkOAuthProvider({
      userId: existingUser.id,
      provider: provider,
      providerId: userData.id,
      providerData: {
        name: userData.name,
        avatar_url: userData.avatarUrl
      }
    });

    if (linkError) {
      return NextResponse.json(
        { error: 'Failed to link OAuth provider' },
        { status: 500 }
      );
    }

    // Get the user's account
    const { user: existingUserData, account: existingAccountData } = await getJWTUserAndAccount({
      type: 'user_id',
      userId: existingUser.id
    });

    user = existingUserData;
    account = existingAccountData;
  }

  // Validate we have user and account
  if (!user || !account) {
    return NextResponse.json(
      { error: 'Failed to get user or account data' },
      { status: 500 }
    );
  }

  // Create session data
  const sessionData = {
    id: sessionId,
    ip: ip,
    user_agent: deviceInfo?.userAgent || 'Unknown',
    timestamp: Date.now(),
    expires_at: Math.floor(Date.now() / 1000) + parseInt(Bun.env.SESSION_TTL || '86400') * 15
  };

  // Create session in database
  const { createdSession, sessionCreationError } = await createUserSession({
    user: user,
    session: sessionData
  });

  if (sessionCreationError) {
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }

  // Generate tokens with minimal payload
  const { token: generatedAccessToken, error: accessTokenError } = await signAccessToken({
    userId: user.id,
    accountId: account.id,
    sessionId: sessionId,
    role: account.role || 'basic_role',
    suspended: account.suspended || false,
    emailVerified: user.emailIsVerified || false,
    phoneVerified: user.phoneIsVerified || false,
    isPersonal: account.isPersonal || true,
    email: user.email,
    name: user.name
  });

  const { token: generatedRefreshToken, error: refreshTokenError } = await signRefreshToken({
    sessionId: sessionId,
    userId: user.id,
    accountId: account.id,
    tokenId: `rt_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  });

  if (accessTokenError || refreshTokenError) {
    return NextResponse.json(
      { error: 'Failed to generate tokens' },
      { status: 500 }
    );
  }

  // Create response
  let response = NextResponse.json(
    {
      user: user,
      account: account,
      accessToken: generatedAccessToken,
      refreshToken: generatedRefreshToken
    },
    { status: 200 }
  );

  // Set authentication cookies
  const { authCookiesResponse } = CookieManager.setAuthCookies({
    response: response,
    data: {
      accessToken: generatedAccessToken ?? undefined,
      refreshToken: generatedRefreshToken ?? undefined,
    }
  });

  return authCookiesResponse;
});
