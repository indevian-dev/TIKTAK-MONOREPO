import { NextRequest } from 'next/server';
import { headers } from "next/headers";
import crypto from "crypto";
import { unifiedApiHandler } from "@/lib/middleware/_Middleware.index";
import { okResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
import { OAuthInitiateSchema } from '@tiktak/shared/types/auth/Auth.schemas';
import { validateBody } from '@/lib/utils/Zod.validate.util';

export const POST = unifiedApiHandler(async (req: NextRequest) => {
  try {
    const parsed = await validateBody(req, OAuthInitiateSchema);
    if (!parsed.success) return parsed.errorResponse;

    const { provider } = parsed.data;

    // Define provider-specific configurations
    type ProviderConfig = {
      clientId: string | undefined;
      authUrl: string;
      scope: string;
    };

    const providerConfigs: Record<string, ProviderConfig> = {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        scope: "email profile",
      },
      facebook: {
        clientId: process.env.FACEBOOK_CLIENT_ID,
        authUrl: "https://www.facebook.com/v12.0/dialog/oauth",
        scope: "email public_profile",
      },
      apple: {
        clientId: process.env.APPLE_CLIENT_ID,
        authUrl: "https://appleid.apple.com/auth/authorize",
        scope: "email name",
      },
    };

    const config: ProviderConfig | undefined = providerConfigs[provider];
    if (!config) {
      return errorResponse("Invalid provider", 400);
    }

    const redirectUri = (await getBaseUrl()) + `/auth/oauth/callback`;
    const state = crypto.randomUUID();
    const authUrl = `${config.authUrl}?client_id=${config.clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(config.scope)}&state=${state}`;

    return okResponse(authUrl);

  } catch (error) {
    console.error("OAuth Initiate Error", error);
    return serverErrorResponse("Internal server error");
  }
});

// Helper Function to dynamically build the base URL based on request
const getBaseUrl = async () => {
  const headersList = await headers();
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const host = headersList.get("host");
  return `${protocol}://${host}`;
};
