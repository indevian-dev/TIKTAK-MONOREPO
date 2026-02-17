
import { db } from "@/lib/database";
import { AuthContext } from "@/lib/domain/types";

// Services
import { AuthService } from "./auth/auth.service";
import { WorkspaceService } from "./workspace/workspace.service";
import { ContentService } from "./content/content.service";
import { SupportService } from "./support/support.service";
import { JobService } from "./jobs/jobs.service";
import { RoleService } from "./workspace/role.service";
import { SystemPromptService } from "./intelligence/system-prompt.service";
import { CategoriesService } from "./categories/categories.service";
import { UserService } from "./user/user.service";
import { AccountService } from "./account/account.service";

// Repositories
import { AuthRepository } from "./auth/auth.repository";
import { WorkspaceRepository } from "./workspace/workspace.repository";
import { ContentRepository } from "./content/content.repository";
import { SupportRepository } from "./support/support.repository";
import { JobRepository } from "./jobs/jobs.repository";
import { RoleRepository } from "./workspace/role.repository";
import { SystemPromptRepository } from "./intelligence/system-prompt.repository";
import { CategoriesRepository } from "./categories/categories.repository";
import { UserRepository } from "./user/user.repository";
import { AccountRepository } from "./account/account.repository";

// Shared/Legacy Services
import { MailService } from "./domain/MailService";
import { ReportService } from "./domain/ReportService";
import { VerificationService } from "./auth/verification.service";
import { AuditService } from "./domain/AuditService";

/**
 * ModuleFactory - Central entry point for all modularized services
 */
export class ModuleFactory {
    constructor(private ctx: AuthContext) { }

    // ═══════════════════════════════════════════════════════════════
    // MODULES
    // ═══════════════════════════════════════════════════════════════

    get auth() {
        return new AuthService(
            new AuthRepository(db),
            this.ctx
        );
    }

    get verification() {
        return new VerificationService(
            new AuthRepository(db),
            this.ctx
        );
    }

    get provider() {
        const workspaceService = new WorkspaceService(
            new WorkspaceRepository(db),
            this.ctx,
            db
        );
        return {
            list: (options?: any) => workspaceService.listProviders(options),
            get: (id: string) => workspaceService.getWorkspace(id),
        };
    }

    get workspace() {
        return new WorkspaceService(
            new WorkspaceRepository(db),
            this.ctx,
            db
        );
    }

    get content() {
        const contentRepo = new ContentRepository(db);
        const supportRepo = new SupportRepository(db);

        // Return a hybrid for backward compatibility
        const service = new ContentService(contentRepo, this.ctx, db);
        return Object.assign(service, {
            contentRepo,
            supportRepo
        });
    }

    get support() {
        return new SupportService(
            new SupportRepository(db),
            this.ctx,
            db
        );
    }

    get jobs() {
        return new JobService(
            new JobRepository(db),
            this.ctx,
            db
        );
    }

    get roles() {
        return new RoleService(
            new RoleRepository(db),
            this.ctx,
            db
        );
    }

    get intelligence() {
        return new SystemPromptService(
            new SystemPromptRepository(db),
            this.ctx,
            db
        );
    }

    get categories() {
        return new CategoriesService(
            new CategoriesRepository(db),
            this.ctx,
            db
        );
    }

    get user() {
        return new UserService(
            new UserRepository(db),
            this.ctx,
            db
        );
    }

    get account() {
        return new AccountService(
            new AccountRepository(db),
            this.ctx,
            db
        );
    }

    get systemPrompts() {
        return this.intelligence;
    }

    // ═══════════════════════════════════════════════════════════════
    // ALIASES (Backward Compatibility)
    // ═══════════════════════════════════════════════════════════════

    get blogs() {
        return this.content;
    }

    get eduOrgs() {
        return this.workspace;
    }

    // ═══════════════════════════════════════════════════════════════
    // CORE UTILITIES
    // ═══════════════════════════════════════════════════════════════

    get mail() {
        return new MailService(this.ctx);
    }

    get reports() {
        return new ReportService(this.ctx);
    }

    get audit() {
        return new AuditService(this.ctx, db);
    }
}
