import { BaseService } from "../domain/BaseService";
import { AccountRepository } from "./account.repository";
import { AuthContext } from "../types";
import { type DatabaseType } from "@/types";

export class AccountService extends BaseService {
    constructor(
        private readonly accountRepo: AccountRepository,
        private readonly ctx: AuthContext,
        private readonly db: DatabaseType
    ) {
        super();
    }

    async getMyAccount(workspaceId?: string) {
        const accountId = this.ctx.authData?.account?.id;
        if (!accountId) throw new Error("Unauthorized");

        // This usually returns user + account + role info for current context
        return this.accountRepo.getProfile(accountId.toString(), workspaceId);
    }

    async updateAccount(data: any) {
        const accountId = this.ctx.authData?.account?.id;
        if (!accountId) throw new Error("Unauthorized");

        return this.accountRepo.update(accountId.toString(), data);
    }
}
