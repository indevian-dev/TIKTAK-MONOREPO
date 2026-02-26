/**
 * Seed 30 cards: Daşınmaz əmlak (Real Estate)
 * Parent: 01KJB9Q9XX3MXF8B
 * Run: bun run scripts/seed-cards-dashinmaz.ts
 */
import { db } from '../lib/database';
import { sql } from 'drizzle-orm';

const WORKSPACE_ID = 'SEED_STORE_001';
const ACCOUNT_ID = '01KJ7KW0AZDSJD7A';
const PREFIX = 'SEED2_RE_';
const PARENT_RE = '01KJB9Q9XX3MXF8B';
const IMGS = ['apartment-living.jpg', 'apartment-bedroom.jpg', 'apartment-kitchen.jpg', 'house-exterior.jpg', 'baku-view.jpg'];
const img = (i: number, n = 3) => Array.from({ length: n }, (_, j) => IMGS[(i + j) % IMGS.length]);

const LOCS = [
    { lat: 40.4093, lng: 49.8671 }, { lat: 40.4219, lng: 49.8530 }, { lat: 40.3790, lng: 49.8490 },
    { lat: 40.4350, lng: 49.8750 }, { lat: 40.4150, lng: 49.9020 }, { lat: 40.3950, lng: 49.8820 },
    { lat: 40.4450, lng: 49.8300 }, { lat: 40.3700, lng: 49.8400 }, { lat: 40.4600, lng: 49.8100 },
    { lat: 40.4010, lng: 49.8550 },
];
const loc = (i: number) => LOCS[i % LOCS.length];

// ── Mənzillər (Apartments) category: 01KJB9Q9XXSY8Y3Z
// deal_type filter: 01KJB9Q9XXQAQD9K  → Sale:01KJB9Q9XY1B75SK  Rent:01KJB9Q9XY1EA8ED
// rooms filter:    01KJB9Q9XYE6GBXX  → 1:XYQGN4Y2 2:XYD21NSD 3:XYT8DJCX 4:XYQAA1RD
// repair filter:   01KJB9Q9XY1YACPW  → Good:01KJB9Q9XYSSZ33D  Excellent:01KJB9Q9XYDBWMSS
// doc filter:      01KJB9Q9XYS1R8DK  → Yes:01KJB9Q9XYZSC0X3
// project filter:  01KJB9Q9XYKDS78S  → NewBuild:01KJB9Q9XYYJPCQY  Kiyev:01KJB9Q9XY80N793

// ── Evlər və villalar (Houses & Villas) category: 01KJB9Q9XYE39AJZ
// deal_type: 01KJB9Q9XYFKAZKC → Sale:01KJB9Q9XY5R0RMJ
// rooms:     01KJB9Q9XZJHB4HQ → 4:01KJB9Q9XZY5QV57  5:01KJB9Q9XZD08Z0N
// repair:    01KJB9Q9XZ8TZJV1 → Excellent:01KJB9Q9XZ77BF2M
// doc:       01KJB9Q9XZK1TWC0 → Yes:01KJB9Q9XZGDR8ER

// ── Kommersiya əmlakı (Commercial) category: 01KJB9Q9XZC07QJB
// deal:   01KJB9Q9XZMZNVY8 → Rent:01KJB9Q9XZ6G89KY
// type:   01KJB9Q9XZB95FM4 → Office:01KJB9Q9XZWWPY2Q  Shop:01KJB9Q9XZKY05W8

const CARDS: { id: string; title: string; body: string; price: number; categories: string[]; filters: object[]; location?: object }[] = [
    // 1-10 Apartments for sale
    { id: `${PREFIX}001`, title: '3 otaqlı mənzil - Nəsimi', body: 'Bakı, Nəsimi rayonu, 92 kv.m, 14/9, yeni tikili, tam mebelli, küçəyə baxış.', price: 185000, categories: ['01KJB9Q9XXSY8Y3Z'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XY1B75SK', option_group_id: '01KJB9Q9XXQAQD9K' }, { type: 'STATIC', option_id: '01KJB9Q9XYT8DJCX', option_group_id: '01KJB9Q9XYE6GBXX' }, { type: 'STATIC', option_id: '01KJB9Q9XYDBWMSS', option_group_id: '01KJB9Q9XY1YACPW' }, { type: 'STATIC', option_id: '01KJB9Q9XYZSC0X3', option_group_id: '01KJB9Q9XYS1R8DK' }, { type: 'STATIC', option_id: '01KJB9Q9XYYJPCQY', option_group_id: '01KJB9Q9XYKDS78S' }], location: loc(0) },
    { id: `${PREFIX}002`, title: '2 otaqlı mənzil - Yasamal', body: 'Yasamal rayonu, 68 kv.m, 16/8, həyəti manzaralı, tam təmir.', price: 128000, categories: ['01KJB9Q9XXSY8Y3Z'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XY1B75SK', option_group_id: '01KJB9Q9XXQAQD9K' }, { type: 'STATIC', option_id: '01KJB9Q9XYD21NSD', option_group_id: '01KJB9Q9XYE6GBXX' }, { type: 'STATIC', option_id: '01KJB9Q9XYSSZ33D', option_group_id: '01KJB9Q9XY1YACPW' }, { type: 'STATIC', option_id: '01KJB9Q9XYZSC0X3', option_group_id: '01KJB9Q9XYS1R8DK' }], location: loc(1) },
    { id: `${PREFIX}003`, title: '1 otaqlı studio - Xətai', body: 'Xətai rayonu, 48 kv.m, 22/15, studio, smart ev sistemi.', price: 88000, categories: ['01KJB9Q9XXSY8Y3Z'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XY1B75SK', option_group_id: '01KJB9Q9XXQAQD9K' }, { type: 'STATIC', option_id: '01KJB9Q9XYQGN4Y2', option_group_id: '01KJB9Q9XYE6GBXX' }, { type: 'STATIC', option_id: '01KJB9Q9XYDBWMSS', option_group_id: '01KJB9Q9XY1YACPW' }, { type: 'STATIC', option_id: '01KJB9Q9XYZSC0X3', option_group_id: '01KJB9Q9XYS1R8DK' }, { type: 'STATIC', option_id: '01KJB9Q9XYYJPCQY', option_group_id: '01KJB9Q9XYKDS78S' }], location: loc(2) },
    { id: `${PREFIX}004`, title: '4 otaqlı mənzil - Sahil', body: 'Sahil metrosu yaxınlığı, 145 kv.m, 12/6, dəniz manzaralı, penthouse.', price: 355000, categories: ['01KJB9Q9XXSY8Y3Z'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XY1B75SK', option_group_id: '01KJB9Q9XXQAQD9K' }, { type: 'STATIC', option_id: '01KJB9Q9XYQAA1RD', option_group_id: '01KJB9Q9XYE6GBXX' }, { type: 'STATIC', option_id: '01KJB9Q9XYDBWMSS', option_group_id: '01KJB9Q9XY1YACPW' }, { type: 'STATIC', option_id: '01KJB9Q9XYZSC0X3', option_group_id: '01KJB9Q9XYS1R8DK' }], location: loc(3) },
    { id: `${PREFIX}005`, title: '2 otaqlı - 28 May metrosu', body: '28 May metrosu, 58 kv.m, 5/3, köhnə tikili, tam əsaslı yenilənmiş.', price: 97000, categories: ['01KJB9Q9XXSY8Y3Z'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XY1B75SK', option_group_id: '01KJB9Q9XXQAQD9K' }, { type: 'STATIC', option_id: '01KJB9Q9XYD21NSD', option_group_id: '01KJB9Q9XYE6GBXX' }, { type: 'STATIC', option_id: '01KJB9Q9XYSSZ33D', option_group_id: '01KJB9Q9XY1YACPW' }, { type: 'STATIC', option_id: '01KJB9Q9XYZSC0X3', option_group_id: '01KJB9Q9XYS1R8DK' }, { type: 'STATIC', option_id: '01KJB9Q9XY80N793', option_group_id: '01KJB9Q9XYKDS78S' }], location: loc(4) },
    { id: `${PREFIX}006`, title: '3 otaqlı - Gənclik', body: 'Gənclik metrosu, 88 kv.m, 9/4, yeni tikili, kupçalı, mebelli.', price: 168000, categories: ['01KJB9Q9XXSY8Y3Z'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XY1B75SK', option_group_id: '01KJB9Q9XXQAQD9K' }, { type: 'STATIC', option_id: '01KJB9Q9XYT8DJCX', option_group_id: '01KJB9Q9XYE6GBXX' }, { type: 'STATIC', option_id: '01KJB9Q9XYDBWMSS', option_group_id: '01KJB9Q9XY1YACPW' }, { type: 'STATIC', option_id: '01KJB9Q9XYZSC0X3', option_group_id: '01KJB9Q9XYS1R8DK' }, { type: 'STATIC', option_id: '01KJB9Q9XYYJPCQY', option_group_id: '01KJB9Q9XYKDS78S' }], location: loc(5) },
    { id: `${PREFIX}007`, title: '1+1 mənzil - Badamdar', body: 'Badamdar, 53 kv.m, 6/3, təzə təmir, mebelli, Bakı manzarası.', price: 112000, categories: ['01KJB9Q9XXSY8Y3Z'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XY1B75SK', option_group_id: '01KJB9Q9XXQAQD9K' }, { type: 'STATIC', option_id: '01KJB9Q9XYQGN4Y2', option_group_id: '01KJB9Q9XYE6GBXX' }, { type: 'STATIC', option_id: '01KJB9Q9XYSSZ33D', option_group_id: '01KJB9Q9XY1YACPW' }, { type: 'STATIC', option_id: '01KJB9Q9XYZSC0X3', option_group_id: '01KJB9Q9XYS1R8DK' }], location: loc(6) },
    { id: `${PREFIX}008`, title: '5 otaqlı - Biləcəri', body: 'Biləcəri, 180 kv.m, yeni tikili, QC layihə, iki hamam, qaraj.', price: 295000, categories: ['01KJB9Q9XXSY8Y3Z'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XY1B75SK', option_group_id: '01KJB9Q9XXQAQD9K' }, { type: 'STATIC', option_id: '01KJB9Q9XYDPB9C8', option_group_id: '01KJB9Q9XYE6GBXX' }, { type: 'STATIC', option_id: '01KJB9Q9XYDBWMSS', option_group_id: '01KJB9Q9XY1YACPW' }, { type: 'STATIC', option_id: '01KJB9Q9XYZSC0X3', option_group_id: '01KJB9Q9XYS1R8DK' }, { type: 'STATIC', option_id: '01KJB9Q9XYYJPCQY', option_group_id: '01KJB9Q9XYKDS78S' }], location: loc(7) },
    // 9-10 Apartments for rent
    { id: `${PREFIX}009`, title: '2 otaqlı kirayə - Nərimanov', body: 'Nərimanov, 70 kv.m, mebelli, aylıq kirayə. Bütün şəraitlər var.', price: 900, categories: ['01KJB9Q9XXSY8Y3Z'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XY1EA8ED', option_group_id: '01KJB9Q9XXQAQD9K' }, { type: 'STATIC', option_id: '01KJB9Q9XYD21NSD', option_group_id: '01KJB9Q9XYE6GBXX' }, { type: 'STATIC', option_id: '01KJB9Q9XYSSZ33D', option_group_id: '01KJB9Q9XY1YACPW' }], location: loc(8) },
    { id: `${PREFIX}010`, title: '3 otaqlı kirayə - İnşaatçılar', body: 'İnşaatçılar metrosu, 90 kv.m, mebelli, uzunmüddətli kirayə.', price: 1200, categories: ['01KJB9Q9XXSY8Y3Z'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XY1EA8ED', option_group_id: '01KJB9Q9XXQAQD9K' }, { type: 'STATIC', option_id: '01KJB9Q9XYT8DJCX', option_group_id: '01KJB9Q9XYE6GBXX' }, { type: 'STATIC', option_id: '01KJB9Q9XYDBWMSS', option_group_id: '01KJB9Q9XY1YACPW' }], location: loc(9) },
    // 11-20 Houses & Villas
    { id: `${PREFIX}011`, title: 'Həyət evi - Mərdəkan', body: 'Mərdəkan, 4 otaq, 220 kv.m, 12 sot həyət, qaraj, hovuz.', price: 260000, categories: ['01KJB9Q9XYE39AJZ'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XY5R0RMJ', option_group_id: '01KJB9Q9XYFKAZKC' }, { type: 'STATIC', option_id: '01KJB9Q9XZY5QV57', option_group_id: '01KJB9Q9XZJHB4HQ' }, { type: 'STATIC', option_id: '01KJB9Q9XZ77BF2M', option_group_id: '01KJB9Q9XZ8TZJV1' }, { type: 'STATIC', option_id: '01KJB9Q9XZGDR8ER', option_group_id: '01KJB9Q9XZK1TWC0' }], location: loc(0) },
    { id: `${PREFIX}012`, title: 'Villa - Novxanı', body: 'Novxanı bağlar massivi, 310 kv.m, 6 otaq, hovuz, sauna, BBQ.', price: 460000, categories: ['01KJB9Q9XYE39AJZ'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XY5R0RMJ', option_group_id: '01KJB9Q9XYFKAZKC' }, { type: 'STATIC', option_id: '01KJB9Q9XZB5TKN1', option_group_id: '01KJB9Q9XZJHB4HQ' }, { type: 'STATIC', option_id: '01KJB9Q9XZ77BF2M', option_group_id: '01KJB9Q9XZ8TZJV1' }, { type: 'STATIC', option_id: '01KJB9Q9XZGDR8ER', option_group_id: '01KJB9Q9XZK1TWC0' }], location: loc(1) },
    { id: `${PREFIX}013`, title: 'Həyət evi - Maştağa', body: 'Maştağa, 5 otaq, 280 kv.m, 18 sot torpaq, yarımbasement.', price: 380000, categories: ['01KJB9Q9XYE39AJZ'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XY5R0RMJ', option_group_id: '01KJB9Q9XYFKAZKC' }, { type: 'STATIC', option_id: '01KJB9Q9XZD08Z0N', option_group_id: '01KJB9Q9XZJHB4HQ' }, { type: 'STATIC', option_id: '01KJB9Q9XZ77BF2M', option_group_id: '01KJB9Q9XZ8TZJV1' }, { type: 'STATIC', option_id: '01KJB9Q9XZGDR8ER', option_group_id: '01KJB9Q9XZK1TWC0' }], location: loc(2) },
    { id: `${PREFIX}014`, title: 'Bağ evi - Pirəkəşkül', body: 'Pirəkəşkül, 3 otaq, 140 kv.m, 8 sot, meyvə bağı.', price: 145000, categories: ['01KJB9Q9XYE39AJZ'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XY5R0RMJ', option_group_id: '01KJB9Q9XYFKAZKC' }, { type: 'STATIC', option_id: '01KJB9Q9XZTR2BGN', option_group_id: '01KJB9Q9XZJHB4HQ' }, { type: 'STATIC', option_id: '01KJB9Q9XZXA1BK4', option_group_id: '01KJB9Q9XZ8TZJV1' }, { type: 'STATIC', option_id: '01KJB9Q9XZGDR8ER', option_group_id: '01KJB9Q9XZK1TWC0' }], location: loc(3) },
    { id: `${PREFIX}015`, title: 'Villa - Binə', body: 'Binə, 7 otaq, 450 kv.m, qapalı ərazidə, mebelli, hazır.', price: 680000, categories: ['01KJB9Q9XYE39AJZ'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XY5R0RMJ', option_group_id: '01KJB9Q9XYFKAZKC' }, { type: 'STATIC', option_id: '01KJB9Q9XZ4ZFZWX', option_group_id: '01KJB9Q9XZJHB4HQ' }, { type: 'STATIC', option_id: '01KJB9Q9XZ77BF2M', option_group_id: '01KJB9Q9XZ8TZJV1' }, { type: 'STATIC', option_id: '01KJB9Q9XZGDR8ER', option_group_id: '01KJB9Q9XZK1TWC0' }], location: loc(4) },
    { id: `${PREFIX}016`, title: 'Həyət evi kirayəsi - Zabrat', body: 'Zabrat, 4 otaq, 200 kv.m, mebelli, aylıq 1500 AZN.', price: 1500, categories: ['01KJB9Q9XYE39AJZ'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XZ6K2C0J', option_group_id: '01KJB9Q9XYFKAZKC' }, { type: 'STATIC', option_id: '01KJB9Q9XZY5QV57', option_group_id: '01KJB9Q9XZJHB4HQ' }, { type: 'STATIC', option_id: '01KJB9Q9XZ77BF2M', option_group_id: '01KJB9Q9XZ8TZJV1' }], location: loc(5) },
    { id: `${PREFIX}017`, title: 'Bağ evi - Corat', body: 'Corat bağlar məntəqəsi, 3 otaq, 120 kv.m, 6 sot, gölcük.', price: 130000, categories: ['01KJB9Q9XYE39AJZ'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XY5R0RMJ', option_group_id: '01KJB9Q9XYFKAZKC' }, { type: 'STATIC', option_id: '01KJB9Q9XZTR2BGN', option_group_id: '01KJB9Q9XZJHB4HQ' }, { type: 'STATIC', option_id: '01KJB9Q9XZXA1BK4', option_group_id: '01KJB9Q9XZ8TZJV1' }], location: loc(6) },
    { id: `${PREFIX}018`, title: '4 otaqlı ev - Biləcəri', body: 'Biləcəri 4 otaq, 2 mərtəbəli, 25 sot torpaq, qaraj + anbar.', price: 220000, categories: ['01KJB9Q9XYE39AJZ'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XY5R0RMJ', option_group_id: '01KJB9Q9XYFKAZKC' }, { type: 'STATIC', option_id: '01KJB9Q9XZY5QV57', option_group_id: '01KJB9Q9XZJHB4HQ' }, { type: 'STATIC', option_id: '01KJB9Q9XZ25JCGQ', option_group_id: '01KJB9Q9XZ8TZJV1' }, { type: 'STATIC', option_id: '01KJB9Q9XZGDR8ER', option_group_id: '01KJB9Q9XZK1TWC0' }], location: loc(7) },
    { id: `${PREFIX}019`, title: 'Villa kirayəsi - Novxanı', body: 'Novxanı, 6 otaq, 350 kv.m, hovuzlu, aylıq 3000 AZN.', price: 3000, categories: ['01KJB9Q9XYE39AJZ'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XZ6K2C0J', option_group_id: '01KJB9Q9XYFKAZKC' }, { type: 'STATIC', option_id: '01KJB9Q9XZB5TKN1', option_group_id: '01KJB9Q9XZJHB4HQ' }, { type: 'STATIC', option_id: '01KJB9Q9XZ77BF2M', option_group_id: '01KJB9Q9XZ8TZJV1' }], location: loc(8) },
    { id: `${PREFIX}020`, title: '3 otaqlı ev - Sabunçu', body: 'Sabunçu, 3 otaq, 150 kv.m, 10 sot, yaxşı vəziyyət.', price: 175000, categories: ['01KJB9Q9XYE39AJZ'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XY5R0RMJ', option_group_id: '01KJB9Q9XYFKAZKC' }, { type: 'STATIC', option_id: '01KJB9Q9XZTR2BGN', option_group_id: '01KJB9Q9XZJHB4HQ' }, { type: 'STATIC', option_id: '01KJB9Q9XZ25JCGQ', option_group_id: '01KJB9Q9XZ8TZJV1' }, { type: 'STATIC', option_id: '01KJB9Q9XZGDR8ER', option_group_id: '01KJB9Q9XZK1TWC0' }], location: loc(9) },
    // 21-30 Commercial
    { id: `${PREFIX}021`, title: 'Ofis - Nizami küçəsi', body: 'Nizami küçəsi, 85 kv.m, 3/2, tam mebelli ofis, hazırdır.', price: 1800, categories: ['01KJB9Q9XZC07QJB'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XZ6G89KY', option_group_id: '01KJB9Q9XZMZNVY8' }, { type: 'STATIC', option_id: '01KJB9Q9XZWWPY2Q', option_group_id: '01KJB9Q9XZB95FM4' }], location: loc(0) },
    { id: `${PREFIX}022`, title: 'Mağaza - İçərişəhər', body: 'İçərişəhər, 60 kv.m, 1/1, turist axını, əla yerləşmə.', price: 220000, categories: ['01KJB9Q9XZC07QJB'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XZPW08SA', option_group_id: '01KJB9Q9XZMZNVY8' }, { type: 'STATIC', option_id: '01KJB9Q9XZKY05W8', option_group_id: '01KJB9Q9XZB95FM4' }], location: loc(1) },
    { id: `${PREFIX}023`, title: 'Anbar - Binəqədi', body: 'Binəqədi sənaye zonası, 400 kv.m anbar, 5m tavan, rampa.', price: 2500, categories: ['01KJB9Q9XZC07QJB'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XZ6G89KY', option_group_id: '01KJB9Q9XZMZNVY8' }, { type: 'STATIC', option_id: '01KJB9Q9XZF4JA0S', option_group_id: '01KJB9Q9XZB95FM4' }], location: loc(2) },
    { id: `${PREFIX}024`, title: 'Ofis mərkəzi - Şah Square', body: 'Şah Square business mərkəzi, 120 kv.m ofis, A+ sinif.', price: 4500, categories: ['01KJB9Q9XZC07QJB'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XZ6G89KY', option_group_id: '01KJB9Q9XZMZNVY8' }, { type: 'STATIC', option_id: '01KJB9Q9XZWWPY2Q', option_group_id: '01KJB9Q9XZB95FM4' }], location: loc(3) },
    { id: `${PREFIX}025`, title: 'Obyekt satışı - Kənar yol', body: 'Kənar yolda 250 kv.m obyekt, ticarət üçün idealdır.', price: 350000, categories: ['01KJB9Q9XZC07QJB'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XZPW08SA', option_group_id: '01KJB9Q9XZMZNVY8' }, { type: 'STATIC', option_id: '01KJB9Q9XZVMECX9', option_group_id: '01KJB9Q9XZB95FM4' }], location: loc(4) },
    { id: `${PREFIX}026`, title: 'Mağaza kirayəsi - Hüsü Hacıyev', body: 'Hüsü Hacıyev küç, 45 kv.m mağaza, əla trafik.', price: 1200, categories: ['01KJB9Q9XZC07QJB'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XZ6G89KY', option_group_id: '01KJB9Q9XZMZNVY8' }, { type: 'STATIC', option_id: '01KJB9Q9XZKY05W8', option_group_id: '01KJB9Q9XZB95FM4' }], location: loc(5) },
    { id: `${PREFIX}027`, title: 'Ofis - Port Baku', body: 'Port Baku Towers, 90 kv.m premium ofis, dəniz manzarası.', price: 5500, categories: ['01KJB9Q9XZC07QJB'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XZ6G89KY', option_group_id: '01KJB9Q9XZMZNVY8' }, { type: 'STATIC', option_id: '01KJB9Q9XZWWPY2Q', option_group_id: '01KJB9Q9XZB95FM4' }], location: loc(6) },
    { id: `${PREFIX}028`, title: 'Restoran binası - Bulvar', body: 'Neftçilər pr, 300 kv.m, aşağıda mağaza 2 mərtəbə ofis.', price: 8000, categories: ['01KJB9Q9XZC07QJB'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XZ6G89KY', option_group_id: '01KJB9Q9XZMZNVY8' }, { type: 'STATIC', option_id: '01KJB9Q9XZVMECX9', option_group_id: '01KJB9Q9XZB95FM4' }], location: loc(7) },
    { id: `${PREFIX}029`, title: 'Zavod binası - Suraxanı', body: 'Suraxanı sənaye zonası, 1500 kv.m zavod + ofis bloqu.', price: 1200000, categories: ['01KJB9Q9XZC07QJB'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XZPW08SA', option_group_id: '01KJB9Q9XZMZNVY8' }, { type: 'STATIC', option_id: '01KJB9Q9XZB9EY0Q', option_group_id: '01KJB9Q9XZB95FM4' }], location: loc(8) },
    { id: `${PREFIX}030`, title: 'Kiçik mağaza - Əhmədli', body: 'Əhmədli m., 30 kv.m mağaza, köşkdən istiqlaliyyət, hazır müştəri bazası.', price: 800, categories: ['01KJB9Q9XZC07QJB'], filters: [{ type: 'STATIC', option_id: '01KJB9Q9XZ6G89KY', option_group_id: '01KJB9Q9XZMZNVY8' }, { type: 'STATIC', option_id: '01KJB9Q9XZKY05W8', option_group_id: '01KJB9Q9XZB95FM4' }], location: loc(9) },
];

async function main() {
    console.log('🏠 Seeding Real Estate cards (30)...');
    let ok = 0;
    for (const card of CARDS) {
        const images = img(CARDS.indexOf(card));
        const cover = images[0];
        try {
            await db.execute(sql`
        INSERT INTO cards (id, created_at, title, is_approved, price, body, account_id, location, images, cover, video, filters_options, categories, workspace_id)
        VALUES (
          ${card.id}, NOW(), ${card.title}, true, ${card.price}, ${card.body},
          ${ACCOUNT_ID},
          ${card.location ? JSON.stringify(card.location) : null}::json,
          ${JSON.stringify(images)}::json,
          ${cover}, null,
          ${JSON.stringify(card.filters)}::jsonb,
          ${JSON.stringify([PARENT_RE, ...card.categories])}::jsonb,
          ${WORKSPACE_ID}
        )
        ON CONFLICT (id) DO UPDATE SET
          title=EXCLUDED.title, price=EXCLUDED.price, body=EXCLUDED.body,
          images=EXCLUDED.images, cover=EXCLUDED.cover,
          filters_options=EXCLUDED.filters_options, categories=EXCLUDED.categories,
          workspace_id=EXCLUDED.workspace_id, is_approved=true, updated_at=NOW()
      `);
            ok++;
        } catch (e: any) { console.error(`❌ ${card.id}:`, e.message); }
    }
    console.log(`✅ Done: ${ok}/30 Real Estate cards inserted.`);
    process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
