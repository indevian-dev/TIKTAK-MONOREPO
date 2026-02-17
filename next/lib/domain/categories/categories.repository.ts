import { db, categories, categoryFilters, categoryFilterOptions, eq, and, desc, asc } from '@/lib/database';
import type { DatabaseType } from '@/types';

export class CategoriesRepository {
    constructor(private readonly dbInstance: DatabaseType) { }

    async listCategories() {
        return this.dbInstance
            .select()
            .from(categories)
            .orderBy(asc(categories.title));
    }

    async getCategoryById(id: number) {
        const [category] = await this.dbInstance
            .select()
            .from(categories)
            .where(eq(categories.id, id))
            .limit(1);
        return category;
    }

    async listFilters(categoryId: number) {
        return this.dbInstance
            .select()
            .from(categoryFilters)
            .where(eq(categoryFilters.categoryId, categoryId))
            .orderBy(asc(categoryFilters.title));
    }

    async listFilterOptions(filterId: number) {
        return this.dbInstance
            .select()
            .from(categoryFilterOptions)
            .where(eq(categoryFilterOptions.filterId, filterId))
            .orderBy(asc(categoryFilterOptions.title));
    }
}
