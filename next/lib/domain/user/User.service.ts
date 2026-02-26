import { BaseService } from "../base/Base.service";
import { UserRepository } from "./User.repository";
import { AuthContext } from "../Domain.types";
import { type DbClientTypes } from "@/lib/database";
import { mapUserToPrivate, mapUserToFull, mapUsersToPublic } from "./User.mapper";

export class UserService extends BaseService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly ctx: AuthContext,
        private readonly db: DbClientTypes
    ) {
        super();
    }

    async getCurrentUser() {
        const userId = this.ctx.userId;
        if (!userId) throw new Error("Unauthorized");
        const row = await this.userRepo.findById(userId);
        if (!row) return null;
        return mapUserToPrivate(row);
    }

    async listUsers(options: { page: number; pageSize: number; search?: string; searchType?: any }) {
        const limit = options.pageSize;
        const offset = (options.page - 1) * options.pageSize;

        const [rows, total] = await Promise.all([
            this.userRepo.list({ limit, offset, search: options.search, searchType: options.searchType }),
            this.userRepo.count(options.search, options.searchType)
        ]);

        return {
            users: mapUsersToPublic(rows),
            total,
            page: options.page,
            pageSize: options.pageSize,
            totalPages: Math.ceil(total / options.pageSize)
        };
    }

    async updateUserProfile(data: any) {
        const userId = this.ctx.userId;
        if (!userId) throw new Error("Unauthorized");

        const row = await this.userRepo.update(userId, data);
        if (!row) return null;
        return mapUserToFull(row);
    }
}
