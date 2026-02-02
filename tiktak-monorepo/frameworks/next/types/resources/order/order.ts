/**
 * Order Types
 * Transaction entity with role-based views (Buyer/Seller/Admin)
 */

import type { Timestamps } from '@/types/base';
import type { Money, Pagination } from '@/types/values';

export namespace Order {
  // ═══════════════════════════════════════════════════════════════
  // FULL ENTITY (Database/Internal)
  // ═══════════════════════════════════════════════════════════════
  
  export interface Full extends Timestamps {
    id: number;
    orderNumber: string;
    externalId?: string;
    buyerId: string;
    buyerAccountId: number;
    sellerId: string;
    sellerAccountId: number;
    items: OrderItem[];
    subtotal: Money;
    tax: Money;
    shipping: Money;
    discount: Money;
    total: Money;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    fulfillmentStatus: FulfillmentStatus;
    orderedAt: string;
    paidAt?: string;
    shippedAt?: string;
    deliveredAt?: string;
    cancelledAt?: string;
    shippingAddress: Address;
    shippingMethod?: string;
    trackingNumber?: string;
    buyerNotes?: string;
    sellerNotes?: string;
    source: OrderSource;
    ipAddress: string;
    userAgent: string;
  }

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN VIEWS
  // ═══════════════════════════════════════════════════════════════

  /** Public access - basic order information (for tracking) */
  export interface PublicAccess {
    id: number;
    orderNumber: string;
    status: OrderStatus;
    orderedAt: string;
    total: Money;
    items: Array<{
      cardTitle: string;
      quantity: number;
    }>;
  }

  /** Private access - full order details for buyer/seller */
  export interface PrivateAccess extends Omit<Full, 'ipAddress' | 'userAgent'> {
    role: 'buyer' | 'seller';
    counterparty: {
      id: string;
      name: string;
      rating?: number;
    };
    canCancel: boolean;
    canReview?: boolean; // buyer only
    canFulfill?: boolean; // seller only
  }


  // ═══════════════════════════════════════════════════════════════
  // SUB-TYPES
  // ═══════════════════════════════════════════════════════════════

  export interface OrderItem {
    id: number;
    cardId: number;
    cardTitle: string;
    cardImage?: string;
    quantity: number;
    unitPrice: Money;
    subtotal: Money;
  }

  export interface Address {
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  }

  export interface PaymentDetails {
    method: string;
    transactionId?: string;
    last4?: string;
    brand?: string;
  }

  export type OrderStatus = 'pending' | 'confirmed' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
  export type FulfillmentStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  export type OrderSource = 'web' | 'mobile' | 'api';

  // ═══════════════════════════════════════════════════════════════
  // OPERATIONS
  // ═══════════════════════════════════════════════════════════════

  export interface CreateInput {
    items: Array<{
      cardId: number;
      quantity: number;
    }>;
    shippingAddress: Address;
    buyerNotes?: string;
  }

  export interface ListQuery {
    status?: OrderStatus[];
    role?: 'buyer' | 'seller';
    page?: number;
    pageSize?: number;
  }

  export interface ListResult {
    orders: (PublicAccess | PrivateAccess)[];
    pagination: Pagination;
  }
}

