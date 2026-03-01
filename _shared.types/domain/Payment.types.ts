/**
 * Payment Types — Shared API Contract
 * ════════════════════════════════════════════════════════════════
 * These are the OUTPUT types — the shape of data the API *returns* to clients.
 * The mapper bridges DB records → these types.
 * ════════════════════════════════════════════════════════════════
 */

export namespace Payment {
    // ═══════════════════════════════════════════════════════════════
    // TRANSACTION VIEWS
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
    // COUPON VIEWS
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
}
