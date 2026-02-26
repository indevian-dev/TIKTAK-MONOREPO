
import type {
    WorkspaceSubscriptionTransactionDbRecord,
    WorkspaceSubscriptionCouponDbRecord,
} from "@/lib/database/schema";

// ═══════════════════════════════════════════════════════════════
// (PaymentSubscription removed — table was dropped)
// ═══════════════════════════════════════════════════════════════

/** Private: user sees their payment history */
export interface TransactionPrivateView {
    id: string;
    paymentChannel: string | null;
    paidAmount: number | null;
    status: string | null;
    createdAt: Date;
}

/** Full: staff — includes account/workspace and metadata */
export interface TransactionFullView extends TransactionPrivateView {
    accountId: string | null;
    workspaceId: string | null;
    metadata: unknown;
    statusMetadata: unknown;
}

// ═══════════════════════════════════════════════════════════════
// COUPON VIEWS — Private / Full
// ═══════════════════════════════════════════════════════════════

/** Private: coupon holder sees code and discount */
export interface CouponPrivateView {
    id: string;
    code: string;
    discountPercent: number | null;
    isActive: boolean | null;
}

/** Full: staff — includes usage stats and workspace */
export interface CouponFullView extends CouponPrivateView {
    usageCount: number | null;
    workspaceId: string | null;
    createdAt: Date;
}

// ═══════════════════════════════════════════════════════════════
// MAPPERS
// ═══════════════════════════════════════════════════════════════

export function toTransactionPrivateView(row: WorkspaceSubscriptionTransactionDbRecord): TransactionPrivateView {
    return {
        id: row.id,
        paymentChannel: row.paymentChannel,
        paidAmount: row.paidAmount,
        status: row.status,
        createdAt: row.createdAt,
    };
}

export function toTransactionFullView(row: WorkspaceSubscriptionTransactionDbRecord): TransactionFullView {
    return {
        ...toTransactionPrivateView(row),
        accountId: row.accountId,
        workspaceId: row.workspaceId,
        metadata: row.metadata,
        statusMetadata: row.statusMetadata,
    };
}

export function toCouponPrivateView(row: WorkspaceSubscriptionCouponDbRecord): CouponPrivateView {
    return {
        id: row.id,
        code: row.code,
        discountPercent: row.discountPercent,
        isActive: row.isActive,
    };
}

export function toCouponFullView(row: WorkspaceSubscriptionCouponDbRecord): CouponFullView {
    return {
        ...toCouponPrivateView(row),
        usageCount: row.usageCount,
        workspaceId: row.workspaceId,
        createdAt: row.createdAt,
    };
}
