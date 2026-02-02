/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    // Database
    PG_CONNECTION: string;
    PG_POOL_MAX?: string;
    PG_IDLE_TIMEOUT?: string;
    PG_CONNECT_TIMEOUT?: string;
    PG_MAX_LIFETIME?: string;
    PG_LOG_NOTICES?: string;
    PG_DEBUG?: string;

    // JWT
    JWT_AT_SECRET: string;
    JWT_RT_SECRET: string;
    JWT_TTL?: string;
    RT_TTL?: string;

    // Redis/Upstash
    UPSTASH_REDIS_REST_URL?: string;
    UPSTASH_REDIS_REST_TOKEN?: string;
    UPSTASH_CACHE_URL?: string;
    UPSTASH_CACHE_TOKEN?: string;
    UPSTASH_SESSION_URL?: string;
    UPSTASH_SESSION_TOKEN?: string;
    UPSTASH_STORE_URL?: string;
    UPSTASH_STORE_TOKEN?: string;

    // AWS/S3
    AWS_ACCESS_KEY_ID?: string;
    AWS_SECRET_ACCESS_KEY?: string;
    AWS_REGION?: string;
    AWS_S3_BUCKET?: string;
    TEBI_ENDPOINT?: string;
    TEBI_ACCESS_KEY?: string;
    TEBI_SECRET_KEY?: string;
    TEBI_BUCKET?: string;

    // Supabase
    NEXT_PUBLIC_SUPABASE_URL?: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;

    // OpenSearch
    OPENSEARCH_NODE?: string;
    OPENSEARCH_USERNAME?: string;
    OPENSEARCH_PASSWORD?: string;

    // Ably
    ABLY_API_KEY?: string;
    NEXT_PUBLIC_ABLY_CLIENT_ID?: string;

    // OAuth
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    FACEBOOK_CLIENT_ID?: string;
    FACEBOOK_CLIENT_SECRET?: string;
    APPLE_CLIENT_ID?: string;
    APPLE_TEAM_ID?: string;
    APPLE_KEY_ID?: string;
    APPLE_PRIVATE_KEY?: string;

    // Email
    ZEPTO_MAIL_TOKEN?: string;
    ZEPTO_MAIL_FROM?: string;

    // SMS
    SMS_SERVICE_URL?: string;
    SMS_SERVICE_TOKEN?: string;

    // Firebase
    FIREBASE_PROJECT_ID?: string;
    FIREBASE_CLIENT_EMAIL?: string;
    FIREBASE_PRIVATE_KEY?: string;

    // Coconut Video
    COCONUT_API_KEY?: string;

    // Environment
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_BASE_URL?: string;
    NEXT_PUBLIC_API_URL?: string;
  }
}

