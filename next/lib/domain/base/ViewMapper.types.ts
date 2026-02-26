
// ═══════════════════════════════════════════════════════════════
// VIEW MAPPER BASE TYPES
// ═══════════════════════════════════════════════════════════════

/**
 * View levels control which shape of data is returned:
 * - public:  Unauthenticated consumers (landing pages, SEO, public API)
 * - private: Authenticated owner (student's own data, provider's own subjects)
 * - full:    Staff / admin dashboards (all fields exposed)
 */
export type ViewLevel = 'public' | 'private' | 'full';

/**
 * Generic mapper contract that each domain module implements.
 * TEntity = raw Drizzle row, TPublic/TPrivate/TFull = projected shapes.
 */
export interface ViewMapper<TEntity, TPublic, TPrivate, TFull> {
    toPublicView(entity: TEntity): TPublic;
    toPrivateView(entity: TEntity): TPrivate;
    toFullView(entity: TEntity): TFull;
}

/**
 * Helper: map an array of entities to a specific view level.
 */
export function mapToView<T, R>(entities: T[], mapper: (entity: T) => R): R[] {
    return entities.map(mapper);
}
