-- ============================================================
-- CLEANUP: Remove ALL existing categories and related data
-- Run this BEFORE seeding with the new seed-*.sql files
-- ============================================================
-- Cascade order: options → filters → categories
-- FK constraints are respected via the DELETE order below.
-- ============================================================

BEGIN;

-- 1. Delete all filter options first (references category_filters)
DELETE FROM category_filter_options;

-- 2. Delete all filters (references categories)
DELETE FROM category_filters;

-- 3. Delete all categories (root and children)
DELETE FROM categories;

COMMIT;
