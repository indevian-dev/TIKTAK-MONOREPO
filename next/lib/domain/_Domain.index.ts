/**
 * Module Exports - Central barrel file for all domain modules
 * 
 * Each module is self-contained with:
 * - Repository (database layer)
 * - Service (business logic)
 * - Types (TypeScript interfaces)
 * - Schema (Zod validation)
 */

// Module Factory - Primary access point
export { ModuleFactory } from './Domain.factory';

// Individual Modules
export * from './auth/_Auth.index';
export * from './content/_Content.index';
export * from './support/_Support.index';
export * from './jobs/_Jobs.index';




