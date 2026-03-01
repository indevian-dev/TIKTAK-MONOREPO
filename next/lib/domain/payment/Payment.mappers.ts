
import type {
    WorkspaceSubscriptionTransactionDbRecord,
    WorkspaceSubscriptionCouponDbRecord,
} from "@/lib/database/schema";
import type { Payment } from '@tiktak/shared/types/domain/Payment.types';

// ═══════════════════════════════════════════════════════════════
// PAYMENT MAPPERS — satisfies Payment.* from _shared.types
// ═══════════════════════════════════════════════════════════════

// ─── TRANSACTION ─────────────────────────────────────────────

export function toTransactionPrivateView(row: WorkspaceSubscriptionTransactionDbRecord) {
    return {
        id: row.id,
        paymentChannel: row.paymentChannel,
        paidAmount: row.paidAmount,
        status: row.status,
        createdAt: row.createdAt,
    } satisfies Payment.TransactionPrivateView;
}

export function toTransactionFullView(row: WorkspaceSubscriptionTransactionDbRecord) {
    return {
        ...toTransactionPrivateView(row),
        accountId: row.accountId,
        workspaceId: row.workspaceId,
        metadata: row.metadata,
        statusMetadata: row.statusMetadata,
    } satisfies Payment.TransactionFullView;
}

// ─── COUPON ──────────────────────────────────────────────────

export function toCouponPrivateView(row: WorkspaceSubscriptionCouponDbRecord) {
    return {
        id: row.id,
        code: row.code,
        discountPercent: row.discountPercent,
        isActive: row.isActive,
    } satisfies Payment.CouponPrivateView;
}

export function toCouponFullView(row: WorkspaceSubscriptionCouponDbRecord) {
    return {
        ...toCouponPrivateView(row),
        usageCount: row.usageCount,
        workspaceId: row.workspaceId,
        createdAt: row.createdAt,
    } satisfies Payment.CouponFullView;
}
