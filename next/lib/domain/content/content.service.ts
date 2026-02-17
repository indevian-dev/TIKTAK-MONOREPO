
import { ContentRepository } from "./content.repository";
import { BaseService } from "../domain/BaseService";
import { AuthContext } from "@/lib/domain/types";
import { DbClient } from "@/lib/database";

/**
 * ContentService - Manages blogs, docs (pages), and system prompts
 */
export class ContentService extends BaseService {
    constructor(
        private readonly repository: ContentRepository,
        private readonly ctx: AuthContext,
        private readonly db: DbClient
    ) {
        super();
    }

    // ═══════════════════════════════════════════════════════════════
    // BLOGS
    // ═══════════════════════════════════════════════════════════════

    async listBlogs(options: {
        page?: number;
        limit?: number;
        search?: string;
        isActive?: boolean;
    } = {}) {
        try {
            const page = options.page || 1;
            const limit = options.limit || 10;
            const offset = (page - 1) * limit;

            const result = await this.repository.listBlogs({
                onlyActive: options.isActive !== false,
                limit,
                offset,
                search: options.search
            });

            return {
                success: true,
                data: {
                    blogs: result.data,
                    pagination: {
                        page,
                        limit,
                        total: result.total,
                        totalPages: Math.ceil(result.total / limit)
                    }
                }
            };
        } catch (error) {
            this.handleError(error, "listBlogs");
            return { success: false, error: "Failed to list blogs" };
        }
    }

    async createBlog(data: any) {
        try {
            // Map legacy/flat fields to localizedContent if present
            const finalData = { ...data };
            if (!finalData.localizedContent && (data.titleAz || data.contentAz || data.titleEn || data.contentEn)) {
                finalData.localizedContent = {
                    az: { title: data.titleAz, content: data.contentAz },
                    en: { title: data.titleEn, content: data.contentEn },
                    ru: { title: data.titleRu, content: data.contentRu }
                };
            }

            const created = await this.repository.createBlog({
                ...finalData,
                createdBy: this.ctx.accountId ? String(this.ctx.accountId) : undefined
            });

            return { success: true, data: created };
        } catch (error) {
            this.handleError(error, "createBlog");
            return { success: false, error: "Failed to create blog" };
        }
    }

    async getBlog(id: string) {
        try {
            const blog = await this.repository.findBlogById(id);
            if (!blog) return { success: false, error: "Blog not found" };
            return { success: true, data: blog };
        } catch (error) {
            this.handleError(error, "getBlog");
            return { success: false, error: "Failed to get blog" };
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // DOCS (PAGES)
    // ═══════════════════════════════════════════════════════════════

    async getPage(type: string) {
        try {
            const page = await this.repository.findDocByType(type);
            if (!page) return { success: false, error: "Page not found" };
            return { success: true, data: page };
        } catch (error) {
            this.handleError(error, "getPage");
            return { success: false, error: "Failed to get page" };
        }
    }

    async updatePageContent(type: string, data: any) {
        try {
            // 1. Find page (doc) by type
            const page = await this.repository.findDocByType(type);
            if (!page) return { success: false, error: "Page not found", code: 404 };

            // 2. Build update object
            const updateData: any = {};
            if (data.type !== undefined) updateData.type = data.type;

            // Localized content mapping
            const localized: any = (page.localizedContent as any) || {};

            // Map incoming flat fields to JSONB structure
            const az = { ...localized.az };
            const ru = { ...localized.ru };
            const en = { ...localized.en };

            if (data.contentAz !== undefined) az.content = data.contentAz;
            if (data.content_az !== undefined) az.content = data.content_az;
            if (data.titleAz !== undefined) az.title = data.titleAz;

            if (data.contentRu !== undefined) ru.content = data.contentRu;
            if (data.content_ru !== undefined) ru.content = data.content_ru;
            if (data.titleRu !== undefined) ru.title = data.titleRu;

            if (data.contentEn !== undefined) en.content = data.contentEn;
            if (data.content_en !== undefined) en.content = data.content_en;
            if (data.titleEn !== undefined) en.title = data.titleEn;

            if (data.metaTitle !== undefined) {
                // Defaulting metaTitle to AZ if not specified
                az.metaTitle = data.metaTitle;
            }

            updateData.localizedContent = { az, ru, en };

            // 3. Update if type updated (check uniqueness)
            if (updateData.type && updateData.type !== type) {
                const existing = await this.repository.findDocByType(updateData.type);
                if (existing) return { success: false, error: "Page type already exists", code: 409 };
            }

            const updatedRows = await this.repository.updateDoc(page.id, updateData);
            return { success: true, data: updatedRows[0] };
        } catch (error) {
            this.handleError(error, "updatePageContent");
            return { success: false, error: "Failed to update page" };
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // PROMPTS
    // ═══════════════════════════════════════════════════════════════

    async listPrompts() {
        try {
            const prompts = await this.repository.listPrompts();
            return { success: true, data: prompts };
        } catch (error) {
            this.handleError(error, "listPrompts");
            return { success: false, error: "Failed to list prompts" };
        }
    }

    async managePrompts(options: { page?: number; limit?: number; search?: string }) {
        try {
            const page = options.page || 1;
            const limit = options.limit || 10;
            const offset = (page - 1) * limit;

            const [prompts, total] = await Promise.all([
                this.repository.listPromptsPaginated({ limit, offset, search: options.search }),
                this.repository.countPrompts({ search: options.search })
            ]);

            return {
                success: true,
                data: {
                    prompts,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages: Math.ceil(total / limit)
                    }
                }
            };
        } catch (error) {
            this.handleError(error, "managePrompts");
            return { success: false, error: "Failed to manage prompts" };
        }
    }

    async createPrompt(data: { title: string; body: string }) {
        try {
            const created = await this.repository.createPrompt({
                title: data.title,
                body: data.body,
                createdAt: new Date()
            } as any);
            return { success: true, data: created };
        } catch (error) {
            this.handleError(error, "createPrompt");
            return { success: false, error: "Failed to create prompt" };
        }
    }

    async getPromptDetails(id: string) {
        try {
            const prompt = await this.repository.findPromptById(id);
            if (!prompt) return { success: false, error: "Prompt not found", code: 404 };
            return { success: true, data: { prompt } };
        } catch (error) {
            this.handleError(error, "getPromptDetails");
            return { success: false, error: "Failed to get prompt details" };
        }
    }

    async updatePrompt(id: string, data: { title?: string; body?: string }) {
        try {
            const updateData: any = {};
            if (data.title !== undefined) updateData.title = data.title;
            if (data.body !== undefined) updateData.body = data.body;

            if (Object.keys(updateData).length === 0) {
                return { success: false, error: "No fields to update", code: 400 };
            }

            const updated = await this.repository.updatePrompt(id, updateData);
            if (!updated) return { success: false, error: "Prompt not found", code: 404 };
            return { success: true, data: { prompt: updated } };
        } catch (error) {
            this.handleError(error, "updatePrompt");
            return { success: false, error: "Failed to update prompt" };
        }
    }

    async deletePrompt(id: string) {
        try {
            const deleted = await this.repository.deletePrompt(id);
            if (!deleted) return { success: false, error: "Prompt not found", code: 404 };
            return { success: true, message: "Prompt deleted successfully" };
        } catch (error) {
            this.handleError(error, "deletePrompt");
            return { success: false, error: "Failed to delete prompt" };
        }
    }
}
