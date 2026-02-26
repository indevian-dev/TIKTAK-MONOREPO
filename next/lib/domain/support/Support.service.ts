
import { SupportRepository } from "./Support.repository";
import { BaseService } from "../base/Base.service";
import { AuthContext } from "@/lib/domain/Domain.types";
import { DbClientTypes } from "@/lib/database";
import { mapNotificationsToPrivate, mapNotificationToPrivate } from "../notification/Notification.mapper";

/**
 * SupportService - Manages notifications, bookmarks, and regional settings
 */
export class SupportService extends BaseService {
    constructor(
        private readonly repository: SupportRepository,
        private readonly ctx: AuthContext,
        private readonly db: DbClientTypes
    ) {
        super();
    }

    async getNotifications(accountId: string) {
        try {
            const rows = await this.repository.listNotifications(accountId);
            return { success: true, data: mapNotificationsToPrivate(rows) };
        } catch (error) {
            this.handleError(error, "getNotifications");
            return { success: false, error: "Failed to load notifications" };
        }
    }

    async getNotificationsContext(params: { accountId: string; page?: number; limit?: number }) {
        try {
            const page = params.page || 1;
            const limit = params.limit || 5;
            const offset = (page - 1) * limit;

            const [rows, total, unreadCount] = await Promise.all([
                this.repository.listNotificationsPaginated(params.accountId, { limit, offset }),
                this.repository.countNotifications(params.accountId),
                this.repository.countUnreadNotifications(params.accountId)
            ]);

            return {
                success: true,
                data: {
                    notifications: mapNotificationsToPrivate(rows),
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages: Math.ceil(total / limit),
                        hasNext: page < Math.ceil(total / limit),
                        hasPrev: page > 1
                    },
                    unreadCount
                }
            };
        } catch (error) {
            this.handleError(error, "getNotificationsContext");
            return { success: false, error: "Failed to load notifications context" };
        }
    }

    async markAsRead(notificationId: string) {
        try {
            const rows = await this.repository.markNotificationRead(notificationId);
            return { success: true, data: rows[0] ? mapNotificationToPrivate(rows[0]) : null };
        } catch (error) {
            this.handleError(error, "markAsRead");
            return { success: false, error: "Failed to update notification" };
        }
    }


    async getCountries() {
        try {
            const countries = await this.repository.listCountries();
            return { success: true, data: countries };
        } catch (error) {
            this.handleError(error, "getCountries");
            return { success: false, error: "Failed to load countries" };
        }
    }

    async getPublicProviderStats() {
        try {
            const [total, withLocation] = await Promise.all([
                this.repository.countActiveProviders(),
                this.repository.countActiveProvidersWithLocation()
            ]);

            return {
                success: true,
                data: {
                    total,
                    active: total,
                    withLocation
                }
            };
        } catch (error) {
            this.handleError(error, "getPublicProviderStats");
            return { success: false, error: "Failed to load provider stats" };
        }
    }
}
