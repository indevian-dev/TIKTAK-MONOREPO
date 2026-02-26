import { drizzle } from "drizzle-orm/postgres-js";
import { pgsqlClient } from "@/lib/integrations/Pgsql.Supabase.client";
import { pgsqlSearchClient } from "@/lib/integrations/Pgsql.Neon.client";
import * as schema from "./schema";

// ═══════════════════════════════════════════════════════════════
// DRIZZLE DATABASE CLIENT (MAIN DATABASE — Supabase Postgres)
// ═══════════════════════════════════════════════════════════════

export const db = drizzle(pgsqlClient, { schema });
export type Database = typeof db;

// Helper type for Transaction or Database
export type DbClientTypes = Database | Parameters<Parameters<Database["transaction"]>[0]>[0];

// ═══════════════════════════════════════════════════════════════
// RAW PGSQL CLIENT (SEARCH DATABASE — Neon PgSQL + pg_search)
// ═══════════════════════════════════════════════════════════════

export const searchDb = pgsqlSearchClient;

export { schema };

// ═══════════════════════════════════════════════════════════════
// DB RECORD TYPE RE-EXPORTS
// Import DB record types from here, not directly from schema:
//   import type { CardDbRecord } from '@/lib/database'
// ═══════════════════════════════════════════════════════════════
export type {
    // Users & Auth
    UserDbRecord, UserDbInsert,
    UserCredentialDbRecord, UserCredentialDbInsert,
    UserSessionDbRecord, UserSessionDbInsert,
    AccountOtpDbRecord, AccountOtpDbInsert,
    // Accounts
    AccountDbRecord, AccountDbInsert,
    // Workspaces
    WorkspaceDbRecord, WorkspaceDbInsert,
    WorkspaceAccessDbRecord, WorkspaceAccessDbInsert,
    WorkspaceRoleDbRecord, WorkspaceRoleDbInsert,
    WorkspaceInvitationDbRecord, WorkspaceInvitationDbInsert,
    WorkspaceSubscriptionCouponDbRecord, WorkspaceSubscriptionCouponDbInsert,
    WorkspaceSubscriptionTransactionDbRecord, WorkspaceSubscriptionTransactionDbInsert,
    // Notifications
    AccountNotificationDbRecord, AccountNotificationDbInsert,
    // Cards
    CardDbRecord, CardDbInsert,
    FavoriteCardDbRecord, FavoriteCardDbInsert,
    // Categories
    CategoryDbRecord, CategoryDbInsert,
    CategoryFilterDbRecord, CategoryFilterDbInsert,
    CategoryFilterOptionDbRecord, CategoryFilterOptionDbInsert,
    // Support
    ConversationDbRecord, ConversationDbInsert,
    MessageDbRecord, MessageDbInsert,
    // Content
    BlogDbRecord, BlogDbInsert,
    DocDbRecord, DocDbInsert,
    // Geo
    CountryDbRecord, CountryDbInsert,
    CityDbRecord, CityDbInsert,
    // Deactivation
    DeactivationRequestDbRecord, DeactivationRequestDbInsert,
} from './schema';
