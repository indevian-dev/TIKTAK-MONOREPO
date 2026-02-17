import { BaseService } from "../domain/BaseService";
import { UserRepository } from "./user.repository";
import { AuthContext } from "../types";
import { type DatabaseType } from "@/types";

export class UserService extends BaseService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly ctx: AuthContext,
        private readonly db: DatabaseType
    ) {
        super();
    }

    async getCurrentUser() {
        const userId = this.ctx.authData?.user?.id;
        if (!userId) throw new Error("Unauthorized");
        return this.userRepo.findById(userId);
    }

    async listUsers(options: { page: number; pageSize: number; search?: string; searchType?: any }) {
        const limit = options.pageSize;
        const offset = (options.page - 1) * options.pageSize;

        const [users, total] = await Promise.all([
            this.userRepo.list({ limit, offset, search: options.search, searchType: options.searchType }),
            this.userRepo.count(options.search, options.searchType)
        ]);

        return {
            users,
            total,
            page: options.page,
            pageSize: options.pageSize,
            totalPages: Math.ceil(total / options.pageSize)
        };
    }

    async updateUserProfile(data: any) {
        const userId = this.ctx.authData?.user?.id;
        if (!userId) throw new Error("Unauthorized");

        return this.userRepo.update(userId, data);
    }
}
