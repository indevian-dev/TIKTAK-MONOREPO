import { eq, and, sql } from "drizzle-orm";
import { accounts, users, workspaceRoles, workspaceAccesses } from "@/lib/database/schema";
import { BaseRepository } from "../domain/BaseRepository";
import { type DbClient } from "@/lib/database";

export class AccountRepository extends BaseRepository {
    async findById(id: string, tx?: DbClient) {
        const client = tx ?? this.db;
        const result = await client
            .select()
            .from(accounts)
            .where(eq(accounts.id, id))
            .limit(1);
        return result[0] || null;
    }

    async findByUserId(userId: string, tx?: DbClient) {
        const client = tx ?? this.db;
        const result = await client
            .select()
            .from(accounts)
            .where(eq(accounts.userId, userId));
        return result;
    }

    async getProfile(accountId: string, workspaceId?: string, tx?: DbClient) {
        const client = tx ?? this.db;

        const query = client
            .select({
                account: accounts,
                user: users,
                role: workspaceRoles,
                access: workspaceAccesses
            })
            .from(accounts)
            .innerJoin(users, eq(accounts.userId, users.id))
            .leftJoin(workspaceAccesses, and(
                eq(workspaceAccesses.actorAccountId, accounts.id),
                workspaceId ? eq(workspaceAccesses.targetWorkspaceId, workspaceId) : sql`FALSE`
            ))
            .leftJoin(workspaceRoles, eq(workspaceAccesses.accessRole, workspaceRoles.name))
            .where(eq(accounts.id, accountId))
            .limit(1);

        const result = await query;
        return result[0] || null;
    }

    async update(id: string, data: Partial<typeof accounts.$inferInsert>, tx?: DbClient) {
        const client = tx ?? this.db;
        const result = await client
            .update(accounts)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(accounts.id, id))
            .returning();
        return result[0] || null;
    }
}
