import { CardsRepository } from './Cards.repository';
import type { AuthContext } from '../Domain.types';
import type { DbClientTypes } from '@/lib/database';
import type { Card } from './Cards.types';

export class CardsService {
    constructor(
        private readonly cardsRepo: CardsRepository,
        private readonly ctx: AuthContext,
        private readonly db: DbClientTypes
    ) { }

    async getFeaturedCards(): Promise<Card.PublicAccess[]> {
        return this.cardsRepo.listFeaturedCards();
    }

    async getPublicCard(id: string) {
        return this.cardsRepo.getPublicCard(id);
    }

    async searchCards(query: Card.SearchQuery): Promise<Card.SearchResult> {
        return this.cardsRepo.searchCards(query);
    }

    async approveCard(id: number) {
        return this.cardsRepo.approveCard(id);
    }

    async updateCard(id: number, data: Record<string, unknown>) {
        return this.cardsRepo.updateCard(id, data);
    }
    async deleteCard(id: number) {
        return this.cardsRepo.deleteCard(id);
    }
}
