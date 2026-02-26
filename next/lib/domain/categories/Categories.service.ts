import type { CategoriesRepository } from './Categories.repository';
import type { AuthContext } from '../Domain.types';
import type { DbClientTypes } from '@/lib/database';
import { mapCategoriesToPublic, mapCategoryToPublic, mapCategoryToFull } from './Categories.mapper';

export class CategoriesService {
    constructor(
        private readonly categoriesRepo: CategoriesRepository,
        private readonly ctx: AuthContext,
        private readonly db: DbClientTypes
    ) { }

    async getCategories() {
        const rows = await this.categoriesRepo.listCategories();
        return mapCategoriesToPublic(rows);
    }

    async getActiveCategories() {
        const rows = await this.categoriesRepo.listActiveCategories();
        return mapCategoriesToPublic(rows);
    }

    async getCategoryById(id: string) {
        const row = await this.categoriesRepo.getCategoryById(id);
        if (!row) return null;
        return mapCategoryToPublic(row);
    }

    async getFiltersForCategories(categoryIds: string[]) {
        const filters = await this.categoriesRepo.listFiltersForCategories(categoryIds);
        const filterIds = filters.map(f => f.id);

        let options: any[] = [];
        if (filterIds.length > 0) {
            options = await this.categoriesRepo.listFilterOptionsForFilters(filterIds);
        }

        return filters.map(filter => ({
            id: filter.id,
            title: filter.title, // JSONB { az, ru, en }
            type: filter.type,
            categoryId: filter.categoryId,
            category_filter_options: options.filter(opt => opt.filterId === filter.id)
        }));
    }

    async getCategoryWithFilters(id: number) {
        const row = await this.categoriesRepo.getCategoryById(String(id));
        if (!row) return null;

        const category = mapCategoryToFull(row);
        const filters = await this.categoriesRepo.listFilters(String(id));

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
