import type { CategoriesRepository } from './categories.repository';
import type { AuthContext } from '../types';
import type { DatabaseType } from '@/types';

export class CategoriesService {
    constructor(
        private readonly categoriesRepo: CategoriesRepository,
        private readonly ctx: AuthContext,
        private readonly db: DatabaseType
    ) { }

    async getCategories() {
        return this.categoriesRepo.listCategories();
    }

    async getCategoryWithFilters(id: number) {
        const category = await this.categoriesRepo.getCategoryById(id);
        if (!category) return null;

        const filters = await this.categoriesRepo.listFilters(id);

        // Enrich filters with options
        const enrichedFilters = await Promise.all(
            filters.map(async (filter) => ({
                ...filter,
                options: await this.categoriesRepo.listFilterOptions(filter.id),
            }))
        );

        return {
            ...category,
            filters: enrichedFilters,
        };
    }
}
