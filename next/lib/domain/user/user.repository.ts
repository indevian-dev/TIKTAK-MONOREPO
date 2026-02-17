import { eq, or, ilike, sql, and } from "drizzle-orm";
import { users, userCredentials } from "@/lib/database/schema";
import { BaseRepository } from "../domain/BaseRepository";
import { type DbClient } from "@/lib/database";

export interface UserListOptions {
    limit: number;
    offset: number;
    search?: string;
    searchType?: 'email' | 'user_name' | 'all';
}

export class UserRepository extends BaseRepository {
    async findById(id: string, tx?: DbClient) {
        const client = tx ?? this.db;
        const result = await client
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);
        return result[0] || null;
    }

    async findByEmail(email: string, tx?: DbClient) {
        const client = tx ?? this.db;
        const result = await client
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);
        return result[0] || null;
    }

    async list(options: UserListOptions, tx?: DbClient) {
        const client = tx ?? this.db;
        let whereCondition = undefined;

        if (options.search) {
            const searchValue = `%${options.search}%`;
            if (options.searchType === 'email') {
                whereCondition = ilike(users.email, searchValue);
            } else if (options.searchType === 'user_name') {
                whereCondition = or(
                    ilike(users.name, searchValue),
                    ilike(users.lastName, searchValue)
                );
            } else {
                whereCondition = or(
                    ilike(users.email, searchValue),
                    ilike(users.name, searchValue),
                    ilike(users.lastName, searchValue)
                );
            }
        }

        const data = await client
            .select()
            .from(users)
            .where(whereCondition)
            .limit(options.limit)
            .offset(options.offset);

        return data;
    }

    async count(search?: string, searchType?: string, tx?: DbClient) {
        const client = tx ?? this.db;
        const { count } = require("drizzle-orm");

        let whereCondition = undefined;
        if (search) {
            const searchValue = `%${search}%`;
            if (searchType === 'email') {
                whereCondition = ilike(users.email, searchValue);
            } else if (searchType === 'user_name') {
                whereCondition = or(
                    ilike(users.name, searchValue),
                    ilike(users.lastName, searchValue)
                );
            } else {
                whereCondition = or(
                    ilike(users.email, searchValue),
                    ilike(users.name, searchValue),
                    ilike(users.lastName, searchValue)
                );
            }
        }

        const result = await client
            .select({ value: count() })
            .from(users)
            .where(whereCondition);

        return result[0].value;
    }

    async update(id: string, data: Partial<typeof users.$inferInsert>, tx?: DbClient) {
        const client = tx ?? this.db;
        const result = await client
            .update(users)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(users.id, id))
            .returning();
        return result[0] || null;
    }
}
