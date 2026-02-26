import { categories, categoryFilters, categoryFilterOptions } from '@/lib/database/schema';
import { eq, inArray, asc, sql } from 'drizzle-orm';
import type { DbClientTypes } from '@/lib/database';

export class CategoriesRepository {
    constructor(private readonly dbInstance: DbClientTypes) { }

    async listCategories() {
        return this.dbInstance
            .select()
            .from(categories)
            .orderBy(asc(categories.id));
    }

    async listActiveCategories() {
        return this.dbInstance
            .select()
            .from(categories)
            .where(sql`${categories.isActive} = true`)
            .orderBy(asc(categories.id));
    }

    async getCategoryById(id: string) {
        const [category] = await this.dbInstance
            .select()
            .from(categories)
            .where(eq(categories.id, id))
            .limit(1);
        return category;
    }

    async listFilters(categoryId: string) {
        return this.dbInstance
            .select()
            .from(categoryFilters)
            .where(eq(categoryFilters.categoryId, categoryId))
            .orderBy(asc(categoryFilters.id));
    }

    async listFiltersForCategories(categoryIds: string[]) {
        return this.dbInstance
            .select()
            .from(categoryFilters)
            .where(inArray(categoryFilters.categoryId, categoryIds))
            .orderBy(asc(categoryFilters.id));
    }

    async listFilterOptions(filterId: string) {
        return this.dbInstance
            .select()
            .from(categoryFilterOptions)
            .where(eq(categoryFilterOptions.filterId, filterId))
            .orderBy(asc(categoryFilterOptions.id));
    }

    async listFilterOptionsForFilters(filterIds: string[]) {
        return this.dbInstance
            .select()
            .from(categoryFilterOptions)
            .where(inArray(categoryFilterOptions.filterId, filterIds));
    }
}
