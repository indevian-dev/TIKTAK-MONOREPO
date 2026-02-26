
import { db } from "@/lib/database";
import { AuthContext } from "@/lib/domain/Domain.types";

// Services
import { AuthService } from "./auth/Auth.service";
import { WorkspaceService } from "./workspace/Workspace.service";
import { ContentService } from "./content/Content.service";
import { SupportService } from "./support/Support.service";
import { RoleService } from "./role/Role.service";
import { CategoriesService } from "./categories/Categories.service";
import { UserService } from "./user/User.service";

// Repositories
import { AuthRepository } from "./auth/Auth.repository";
import { WorkspaceRepository } from "./workspace/Workspace.repository";
import { ContentRepository } from "./content/Content.repository";
import { SupportRepository } from "./support/Support.repository";
// import { JobRepository } from "./jobs/Jobs.repository"; // TODO: uncomment when JobService is created
import { RoleRepository } from "./role/Role.repository";
import { CategoriesRepository } from "./categories/Categories.repository";
import { UserRepository } from "./user/User.repository";
// import { PaymentRepository } from "./payment/Payment.repository"; // TODO: uncomment when payment getter is added
import { OtpRepository } from "./auth/Otp.repository";
import { OtpService } from "./auth/Otp.service";

// Shared/Legacy Services
import { MailService } from "@/lib/notifications/Mail.service";
import { VerificationService } from "./auth/Verification.service";

import { CardsService } from "./cards/Cards.service";
import { CardsRepository } from "./cards/Cards.repository";
// import { StoresService } from "./workspace/Stores.service";
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
            new OtpService(new OtpRepository(db)),
            this.ctx
        );
    }

    get verification() {
        return new VerificationService(
            new AuthRepository(db),
            new OtpService(new OtpRepository(db)),
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

    // TODO: JobService not yet created
    // get jobs() {
    //     return new JobService(
    //         new JobRepository(db),
    //         this.ctx,
    //         db
    //     );
    // }

    get roles() {
        return new RoleService(
            new RoleRepository(db),
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

    // TODO: AccountService/AccountRepository not yet created
    // get account() {
    //     return new AccountService(
    //         new AccountRepository(db),
    //         this.ctx,
    //         db
    //     );
    // }

    get cards() {
        return new CardsService(
            new CardsRepository(db),
            this.ctx,
            db
        );
    }

    // TODO: StoresService not yet created
    // get stores() {
    //     return new StoresService(
    //         new WorkspaceRepository(db),
    //         this.ctx,
    //         db
    //     );
    // }

    // TODO: intelligence getter not yet implemented
    // get systemPrompts() {
    //     return this.intelligence;
    // }

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

    // TODO: ReportService not yet created
    // get reports() {
    //     return new ReportService(this.ctx);
    // }

    // TODO: AuditService not yet created
    // get audit() {
    //     return new AuditService(this.ctx, db);
    // }
}
