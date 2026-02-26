import { BaseRepository } from "../base/Base.repository";
import { type DbClientTypes } from "@/lib/database";
import { and, asc, eq, gt, gte, lte, inArray, count } from 'drizzle-orm';
import {
    workspaces,
    accounts,
    accountNotifications,
    workspaceAccesses
} from '@/lib/database/schema';

/**
 * JobRepository - Handles job logs and persistence
 */
export class JobRepository extends BaseRepository {
    async logJob(data: any, tx?: DbClientTypes) {
        return { success: true };
    }

    async getStudentBatch(lastId?: string, batchSize: number = 1000) {
        return await this.db
            .select({ id: workspaces.id })
            .from(workspaces)
            .where(
                and(
                    eq(workspaces.type, "student"),
                    lastId ? gt(workspaces.id, lastId) : undefined
                )
            )
            .orderBy(asc(workspaces.id))
            .limit(batchSize);
    }

    async getStudentWithAccount(studentId: string) {
        const result = await this.db
            .select({
                student: workspaces,
                account: accounts
            })
            .from(workspaces)
            .leftJoin(workspaceAccesses, and(
                eq(workspaces.id, workspaceAccesses.targetWorkspaceId),
                eq(workspaceAccesses.accessRole, 'owner')
            ))
            .leftJoin(accounts, eq(workspaceAccesses.actorAccountId, accounts.id))
            .where(eq(workspaces.id, studentId))
            .limit(1);
        return result[0] || null;
    }

    // Legacy methods removed:
    // - getStudentActivity (used studentQuizzes, accountBookmarks)
    // - getTopicsBySubjectIds (used providerSubjectTopics)
    // - getTopicById (used providerSubjectTopics)
    // - getTopicsToProcessForAi (used providerSubjectTopics)
    // - saveStudentReport (used studentReports)
}
