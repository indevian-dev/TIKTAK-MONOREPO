/**
 * Sanity Schema Index
 * 
 * Exports all schemas for use in Sanity Studio configuration.
 * Import this in your sanity.config.ts: schemaTypes: [page, blog]
 */
import page from './page';
import blog from './blog';

export const schemaTypes = [page, blog];

export { page, blog };
