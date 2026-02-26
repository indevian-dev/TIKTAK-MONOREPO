
import { eq, and, desc, sql, count, isNotNull } from "drizzle-orm";
import { accountNotifications, cities, countries, workspaces } from "@/lib/database/schema";
import { BaseRepository } from "../base/Base.repository";
import { type DbClientTypes } from "@/lib/database";

/**
 * SupportRepository - Handles notifications, cities, countries, and workspace stats
 */
export class SupportRepository extends BaseRepository {
    // ═══════════════════════════════════════════════════════════════
    // NOTIFICATIONS
    // ═══════════════════════════════════════════════════════════════

    async listNotifications(accountId: string, tx?: DbClientTypes) {
        const client = tx ?? this.db;
        return await client
            .select()
            .from(accountNotifications)
            .where(eq(accountNotifications.accountId, accountId))
            .orderBy(desc(accountNotifications.createdAt));
    }

    async listNotificationsPaginated(accountId: string, options: { limit: number; offset: number }, tx?: DbClientTypes) {
        const client = tx ?? this.db;
        return await client
            .select()
            .from(accountNotifications)
            .where(eq(accountNotifications.accountId, accountId))
            .orderBy(desc(accountNotifications.createdAt))
            .limit(options.limit)
            .offset(options.offset);
    }

    async countNotifications(accountId: string, tx?: DbClientTypes) {
        const client = tx ?? this.db;
        const result = await client
            .select({ count: count() })
            .from(accountNotifications)
            .where(eq(accountNotifications.accountId, accountId));
        return Number(result[0]?.count || 0);
    }

    async countUnreadNotifications(accountId: string, tx?: DbClientTypes) {
        const client = tx ?? this.db;
        const result = await client
            .select({ count: count() })
            .from(accountNotifications)
            .where(
                and(
                    eq(accountNotifications.accountId, accountId),
                    eq(accountNotifications.markAsRead, false)
                )
            );
        return Number(result[0]?.count || 0);
    }

    async markNotificationRead(id: string, tx?: DbClientTypes) {
        const client = tx ?? this.db;
        return await client
            .update(accountNotifications)
            .set({ markAsRead: true, updatedAt: new Date() })
            .where(eq(accountNotifications.id, id))
            .returning();
    }

    async createNotification(data: typeof accountNotifications.$inferInsert, tx?: DbClientTypes) {
        const client = tx ?? this.db;
        const result = await client.insert(accountNotifications).values(data).returning();
        return result[0];
    }

    // Legacy bookmark methods removed (accountBookmarks + questionsTable tables no longer exist)

    // ═══════════════════════════════════════════════════════════════
    // GEOGRAPHY
    // ═══════════════════════════════════════════════════════════════

    async listCountries(tx?: DbClientTypes) {
        const client = tx ?? this.db;
        return await client.select().from(countries).orderBy(countries.name);
    }

    async listCitiesByCountry(countryId: string, tx?: DbClientTypes) {
        const client = tx ?? this.db;
        return await client
            .select()
            .from(cities)
            .where(eq(cities.countryId, countryId))
            .orderBy(cities.title);
    }

    async listAllCities(tx?: DbClientTypes) {
        const client = tx ?? this.db;
        return await client.select().from(cities).orderBy(cities.title);
    }

    // ═══════════════════════════════════════════════════════════════
    // WORKSPACE STATS
    // ═══════════════════════════════════════════════════════════════

    async countActiveProviders(tx?: DbClientTypes) {
        const client = tx ?? this.db;
        const result = await client
            .select({ value: count() })
            .from(workspaces)
            .where(
                and(
                    eq(workspaces.type, 'provider'),
                    eq(workspaces.isActive, true)
                )
            );
        return result[0]?.value || 0;
    }

    async countActiveProvidersWithLocation(tx?: DbClientTypes) {
        const client = tx ?? this.db;
        const result = await client
            .select({ value: count() })
            .from(workspaces)
            .where(
                and(
                    eq(workspaces.type, 'provider'),
                    eq(workspaces.isActive, true),
                    isNotNull(workspaces.cityId)
                )
            );
        return result[0]?.value || 0;
    }
}
