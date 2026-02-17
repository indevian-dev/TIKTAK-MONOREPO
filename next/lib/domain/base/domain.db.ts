import {
    pgTable,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core';

/**
 * Countries table - Country definitions
 * ID: varchar (slimulid)
 */
export const countries = pgTable('countries', {
    id: varchar('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    name: varchar('name').notNull().unique(),
    isoCode: varchar('iso_code').unique(),
    phoneCode: varchar('phone_code'),
    currency: varchar('currency').default('AZN'),
});

/**
 * Cities table - Location data linked to countries
 * ID: varchar (slimulid)
 */
export const cities = pgTable('cities', {
    id: varchar('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    title: varchar('title'),
    countryId: varchar('country_id'),
});

export type CountryRow = typeof countries.$inferSelect;
export type CountryInsert = typeof countries.$inferInsert;
export type CityRow = typeof cities.$inferSelect;
export type CityInsert = typeof cities.$inferInsert;
