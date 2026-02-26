import { db } from './lib/database';
import { sql } from 'drizzle-orm';
import { pgsqlClient } from './lib/integrations/Pgsql.Supabase.client';
import { pgsqlSearchClient } from './lib/integrations/Pgsql.Neon.client';

// ====================================================================
// SEED 100 CARDS WITH REAL-LOOKING DATA
// Images stored as filenames only — path is deterministic:
// ${S3_PREFIX}/cards/${storage_prefix}/${filename}
// All cards share storage_prefix = 'seed_shared'
// ====================================================================

// Shared storage prefix — upload images once to this folder
const SHARED_STORAGE_PREFIX = 'seed_shared';

// Image filenames only — upload these to S3: /cards/seed_shared/
const IMAGE_POOL = [
    'img_01.webp',
    'img_02.webp',
    'img_03.webp',
    'img_04.webp',
    'img_05.webp',
    'img_06.webp',
    'img_07.webp',
    'img_08.webp',
    'img_09.webp',
    'img_10.webp',
    'img_11.webp',
    'img_12.webp',
];

// Shuffle helper
function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pick<T>(arr: T[], n: number): T[] {
    return shuffle(arr).slice(0, n);
}

function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Real categories from DB
const CATEGORIES = {
    transport: '01KHPX62GKGX3BSS',
    realEstate: '01KHPX62GK7VM447',
    mothersKids: '01KHPX62GKNSE8JP',
    items: '01KHPX62GKV8E17W',
    services: '01KHPX62GKNYGMZE',
    places: '01KHPX62GKNNGXP6J',
    telecom: '01KHPX62GMY552A1',
    electronics: '01KHPX62GKETSNBZ',
    waterTransport: '01KHPX62GJDWS0F9',
    apartments: '01KHPX62GKSSWG9R',
    vehicles: '01KHPX62GKY24C65',
    passengerCars: '01KHPX62GMV8DQ57',
};

// Real filter options from DB
const FILTER_OPTIONS = {
    ram8gb: { option_id: '01KHPX62R9KPG0BF', option_group_id: '01KHPX62K6DS7TDF' },
    ram4gb: { option_id: '01KHPX62R87FB8TK', option_group_id: '01KHPX62K6DS7TDF' },
    ram12gb: { option_id: '01KHPX62R9SQPKM9', option_group_id: '01KHPX62K6DS7TDF' },
    rom128: { option_id: '01KHPX62R95YCWG0', option_group_id: '01KHPX62K6EGZ0D8' },
    rom64: { option_id: '01KHPX62R9TZK3RW', option_group_id: '01KHPX62K6EGZ0D8' },
    rom32: { option_id: '01KHPX62R9PGM9DG', option_group_id: '01KHPX62K6EGZ0D8' },
    isNew: { option_id: '01KHPX62R9AN3R6V', option_group_id: '01KHPX62K63H6P11' },
    isUsed: { option_id: '01KHPX62R9XK4MWG', option_group_id: '01KHPX62K63H6P11' },
    delivery: { option_id: '01KHPX62R9WC4WCZ', option_group_id: '01KHPX62K6TKFC16' },
    noDelivery: { option_id: '01KHPX62R9P11FY8', option_group_id: '01KHPX62K6TKFC16' },
};

// Baku area coordinates
const BAKU_LOCATIONS = [
    { lat: 40.4093, lng: 49.8671 }, // Center
    { lat: 40.4219, lng: 49.8530 }, // Nasimi
    { lat: 40.3790, lng: 49.8490 }, // Yasamal
    { lat: 40.4350, lng: 49.8750 }, // Narimanov
    { lat: 40.4150, lng: 49.9020 }, // Khatai
    { lat: 40.3950, lng: 49.8820 }, // Sabail
    { lat: 40.4450, lng: 49.8300 }, // Binagadi
    { lat: 40.3700, lng: 49.8400 }, // Surakhani
    { lat: 40.4600, lng: 49.8100 }, // Khirdalan
    { lat: 40.4010, lng: 49.8550 }, // Nizami
];

// Account
const ACCOUNT_ID = '01KJ7KW0AZDSJD7A';

// Product templates
interface CardTemplate {
    title: string;
    body: string;
    price: number;
    categories: string[];
    filters?: { type: string; option_id: string; option_group_id: string }[];
}

const CARD_TEMPLATES: CardTemplate[] = [
    // PHONES (20 items)
    {
        title: 'iPhone 15 Pro Max 256GB', body: 'Apple iPhone 15 Pro Max, Titanium dizayn, A17 Pro çip, 48MP kamera sistemi. Yeni, qutuda, 1 il zəmanət.', price: 2899, categories: [CATEGORIES.telecom], filters: [
            { type: 'STATIC', ...FILTER_OPTIONS.ram8gb }, { type: 'STATIC', ...FILTER_OPTIONS.rom128 }, { type: 'STATIC', ...FILTER_OPTIONS.isNew }, { type: 'STATIC', ...FILTER_OPTIONS.delivery }]
    },
    {
        title: 'Samsung Galaxy S24 Ultra 512GB', body: 'Samsung Galaxy S24 Ultra, Titanium Gray, S Pen daxildir, 200MP kamera.', price: 2499, categories: [CATEGORIES.telecom], filters: [
            { type: 'STATIC', ...FILTER_OPTIONS.ram12gb }, { type: 'STATIC', ...FILTER_OPTIONS.rom128 }, { type: 'STATIC', ...FILTER_OPTIONS.isNew }, { type: 'STATIC', ...FILTER_OPTIONS.delivery }]
    },
    {
        title: 'Google Pixel 8 Pro 256GB', body: 'Google Pixel 8 Pro, Tensor G3 çip, ən yaxşı kamera AI ilə.', price: 1999, categories: [CATEGORIES.telecom], filters: [
            { type: 'STATIC', ...FILTER_OPTIONS.ram12gb }, { type: 'STATIC', ...FILTER_OPTIONS.rom128 }, { type: 'STATIC', ...FILTER_OPTIONS.isNew }]
    },
    {
        title: 'Xiaomi 14 Ultra - Leica', body: 'Xiaomi 14 Ultra, Leica kamera sistemi, Snapdragon 8 Gen 3.', price: 1799, categories: [CATEGORIES.telecom], filters: [
            { type: 'STATIC', ...FILTER_OPTIONS.ram12gb }, { type: 'STATIC', ...FILTER_OPTIONS.rom128 }, { type: 'STATIC', ...FILTER_OPTIONS.isNew }]
    },
    {
        title: 'iPhone 14 Pro - İşlənmiş', body: 'iPhone 14 Pro, 128GB, Deep Purple, əla vəziyyətdə.', price: 1450, categories: [CATEGORIES.telecom], filters: [
            { type: 'STATIC', ...FILTER_OPTIONS.ram8gb }, { type: 'STATIC', ...FILTER_OPTIONS.rom128 }, { type: 'STATIC', ...FILTER_OPTIONS.isUsed }]
    },
    {
        title: 'Samsung Galaxy A54 5G', body: 'Samsung Galaxy A54, Super AMOLED, 5000mAh batareya.', price: 599, categories: [CATEGORIES.telecom], filters: [
            { type: 'STATIC', ...FILTER_OPTIONS.ram8gb }, { type: 'STATIC', ...FILTER_OPTIONS.rom128 }, { type: 'STATIC', ...FILTER_OPTIONS.isNew }]
    },
    {
        title: 'OnePlus 12 - 16GB RAM', body: 'OnePlus 12, 16GB RAM, 512GB, Hasselblad kamera.', price: 1599, categories: [CATEGORIES.telecom], filters: [
            { type: 'STATIC', ...FILTER_OPTIONS.ram12gb }, { type: 'STATIC', ...FILTER_OPTIONS.rom128 }, { type: 'STATIC', ...FILTER_OPTIONS.isNew }, { type: 'STATIC', ...FILTER_OPTIONS.delivery }]
    },
    {
        title: 'Huawei P60 Pro 256GB', body: 'Huawei P60 Pro, XMAGE kamera, IP68, 66W şarj.', price: 1299, categories: [CATEGORIES.telecom], filters: [
            { type: 'STATIC', ...FILTER_OPTIONS.ram8gb }, { type: 'STATIC', ...FILTER_OPTIONS.rom128 }, { type: 'STATIC', ...FILTER_OPTIONS.isNew }]
    },
    {
        title: 'Redmi Note 13 Pro Plus', body: 'Xiaomi Redmi Note 13 Pro+, 200MP kamera, AMOLED ekran.', price: 449, categories: [CATEGORIES.telecom], filters: [
            { type: 'STATIC', ...FILTER_OPTIONS.ram8gb }, { type: 'STATIC', ...FILTER_OPTIONS.rom128 }, { type: 'STATIC', ...FILTER_OPTIONS.isNew }, { type: 'STATIC', ...FILTER_OPTIONS.delivery }]
    },
    {
        title: 'iPhone 13 - 128GB Ağ', body: 'Apple iPhone 13, ağ rəng, 128GB, yaxşı vəziyyət.', price: 799, categories: [CATEGORIES.telecom], filters: [
            { type: 'STATIC', ...FILTER_OPTIONS.ram4gb }, { type: 'STATIC', ...FILTER_OPTIONS.rom128 }, { type: 'STATIC', ...FILTER_OPTIONS.isUsed }]
    },

    // LAPTOPS / ELECTRONICS (15 items)
    { title: 'MacBook Pro M3 Pro - 14 düym', body: 'Apple MacBook Pro, M3 Pro çip, 18GB RAM, 512GB SSD, Space Black.', price: 3200, categories: [CATEGORIES.electronics] },
    { title: 'MacBook Air M2 - 15 düym', body: 'MacBook Air 15, M2 çip, 8GB RAM, 256GB SSD, Midnight.', price: 1899, categories: [CATEGORIES.electronics] },
    { title: 'Dell XPS 15 - i7 13-cü nəsil', body: 'Dell XPS 15, Intel Core i7-13700H, 16GB RAM, 512GB SSD, OLED ekran.', price: 2499, categories: [CATEGORIES.electronics] },
    { title: 'Lenovo ThinkPad X1 Carbon', body: 'ThinkPad X1 Carbon Gen 11, i7, 16GB, 512GB, 14" 2.8K OLED.', price: 2799, categories: [CATEGORIES.electronics] },
    { title: 'ASUS ROG Strix G16 - Gaming', body: 'ASUS ROG Strix G16, RTX 4060, i7-13650HX, 16GB, 512GB.', price: 2199, categories: [CATEGORIES.electronics] },
    { title: 'HP Pavilion 15 - Büdcə', body: 'HP Pavilion 15, Ryzen 5, 8GB RAM, 256GB SSD, Windows 11.', price: 799, categories: [CATEGORIES.electronics] },
    { title: 'iPad Pro M2 12.9 düym', body: 'Apple iPad Pro 12.9, M2 çip, 256GB, WiFi + 5G, Apple Pencil 2 dəstəyi.', price: 1899, categories: [CATEGORIES.electronics] },
    { title: 'Sony PlayStation 5 - Disk', body: 'Sony PS5, disk versiyası, 2 DualSense, 3 oyun daxildir.', price: 999, categories: [CATEGORIES.electronics] },
    { title: 'Canon EOS R6 Mark II', body: 'Canon EOS R6 II, RF 24-105mm f/4 lens ilə, 4K 60fps video.', price: 4200, categories: [CATEGORIES.electronics] },
    { title: 'Sony WH-1000XM5 Qulaqlıq', body: 'Sony WH-1000XM5, ən yaxşı ANC, 30 saat batareya, LDAC.', price: 449, categories: [CATEGORIES.electronics] },
    { title: 'Apple Watch Ultra 2', body: 'Apple Watch Ultra 2, Titanium, 49mm, GPS + Cellular, Əla fitness izləmə.', price: 1199, categories: [CATEGORIES.electronics] },
    { title: 'DJI Mavic 3 Pro Dron', body: 'DJI Mavic 3 Pro, Hasselblad kamera, 43 dəq uçuş, 4/3 CMOS sensor.', price: 3599, categories: [CATEGORIES.electronics] },
    { title: 'Samsung 65" OLED 4K TV', body: 'Samsung QD-OLED 65", 4K, 120Hz, Dolby Atmos, Smart TV.', price: 2899, categories: [CATEGORIES.electronics] },
    { title: 'Dyson V15 Detect Tozsoran', body: 'Dyson V15 Detect, lazer texnologiyası, LCD ekran, 60 dəq batareya.', price: 1150, categories: [CATEGORIES.items] },
    { title: 'Nintendo Switch OLED', body: 'Nintendo Switch OLED, ağ rəng, 64GB, 2 Joy-Con, yeni.', price: 499, categories: [CATEGORIES.electronics] },

    // REAL ESTATE (15 items)
    { title: '3 otaqlı mənzil - Nəsimi', body: 'Bakı, Nəsimi rayonu, 90 kv.m, 14/9, yeni təmirli, mebelli.\n\n📍 Metroya 5 dəqiqə piyada\n🏗️ Yeni tikili\n🛏️ 2 yataq otağı + 1 qonaq otağı', price: 185000, categories: [CATEGORIES.apartments] },
    { title: '2 otaqlı mənzil - Yasamal', body: 'Yasamal rayonu, 65 kv.m, 16/8, həyəti manzaralı, tam təmir.', price: 125000, categories: [CATEGORIES.apartments] },
    { title: '1 otaqlı studio - Xətai', body: 'Xətai rayonu, 45 kv.m, 22/15, studio planlaşdırma, smart ev.', price: 85000, categories: [CATEGORIES.apartments] },
    { title: '4 otaqlı mənzil - Sahil', body: 'Sahil metrosu yaxınlığı, 140 kv.m, 12/6, dəniz manzaralı, penthouse.', price: 350000, categories: [CATEGORIES.apartments] },
    { title: '2 otaqlı - 28 May metrosu', body: '28 May metrosu, 55 kv.m, 5/3, köhnə tikili, yeni təmir, çox əlverişli.', price: 95000, categories: [CATEGORIES.apartments] },
    { title: 'Həyət evi - Mərdəkan', body: 'Mərdəkan bağ evi, 200 kv.m həyət, 4 otaq, qaraj, hovuz.', price: 250000, categories: [CATEGORIES.realEstate] },
    { title: 'Ofis sahəsi - Nizami küçəsi', body: 'Nizami küçəsində 80 kv.m ofis, 3/2, təmirli, hazırdır.', price: 1500, categories: [CATEGORIES.realEstate] },
    { title: '3 otaqlı - Gənclik', body: 'Gənclik metrosu, 85 kv.m, 9/4, yeni tikili, kupçalı, mebelli.', price: 165000, categories: [CATEGORIES.apartments] },
    { title: '1+1 mənzil - Badamdar', body: 'Badamdar, 50 kv.m, 6/3, təzə təmir, mebelli, manzara.', price: 110000, categories: [CATEGORIES.apartments] },
    { title: 'Villa - Novxanı', body: 'Novxanı bağlar massivi, 300 kv.m, 6 otaq, hovuz, sauna.', price: 450000, categories: [CATEGORIES.realEstate] },

    // VEHICLES (15 items)
    { title: 'Toyota Camry 2023 Hybrid', body: 'Toyota Camry 2023, hibrid, 15,000 km yürüş, tam komplekt.', price: 52000, categories: [CATEGORIES.transport] },
    { title: 'Mercedes-Benz E200 2022', body: 'Mercedes E200, AMG paket, panoramik tavan, 20,000 km.', price: 68000, categories: [CATEGORIES.transport] },
    { title: 'BMW 520i 2021 - M Sport', body: 'BMW 520i, M Sport paket, benzin, 30,000 km, ideal vəziyyət.', price: 55000, categories: [CATEGORIES.transport] },
    { title: 'Hyundai Tucson 2023', body: 'Hyundai Tucson 2023, 1.6T, AWD, tam komplekt, 10,000 km.', price: 42000, categories: [CATEGORIES.transport] },
    { title: 'Kia Sportage 2022 - Hybrid', body: 'Kia Sportage hibrid, GT-Line, panorama, HUD, 18,000 km.', price: 38000, categories: [CATEGORIES.transport] },
    { title: 'Toyota RAV4 2022 Prime', body: 'RAV4 Prime, plug-in hybrid, XSE, 12,000 km, qara rəng.', price: 48000, categories: [CATEGORIES.transport] },
    { title: 'Lexus RX 350 2023', body: 'Lexus RX 350, F-Sport, tam komplekt, 8,000 km, yeni kimi.', price: 72000, categories: [CATEGORIES.transport] },
    { title: 'Volkswagen Passat B8 2020', body: 'VW Passat B8, 2.0 TDI, DSG, R-Line, 45,000 km.', price: 32000, categories: [CATEGORIES.transport] },
    { title: 'Chevrolet Malibu 2023', body: 'Chevrolet Malibu 2023, 1.5T, LT trim, 5,000 km, ağ.', price: 28000, categories: [CATEGORIES.transport] },
    { title: 'Nissan Qashqai 2022', body: 'Nissan Qashqai e-POWER, Tekna+, ProPilot, 15,000 km.', price: 35000, categories: [CATEGORIES.transport] },

    // ITEMS / FURNITURE / MISC (25 items)
    { title: 'IKEA Divan - Açılan model', body: 'IKEA açılan divan, gri rəng, yataq bölməli, 220 sm.', price: 650, categories: [CATEGORIES.items] },
    { title: 'Nike Air Max 270 - Orijinal', body: 'Nike Air Max 270, orijinal, ölçü 42-43, qutuda. Yeni.', price: 189, categories: [CATEGORIES.items] },
    { title: 'Adidas Ultraboost 22', body: 'Adidas Ultraboost 22, qara, ölçü 41, yeni, etiketli.', price: 229, categories: [CATEGORIES.items] },
    { title: 'Samsung Paltaryuyan 9kg', body: 'Samsung paltaryuyan, 9kg, 1400 dövrə, invertorlu, A+++.', price: 799, categories: [CATEGORIES.items] },
    { title: 'LG Soyuducu 380L No Frost', body: 'LG soyuducu, 380L, No Frost, invertorlu, gümüşü rəng.', price: 1099, categories: [CATEGORIES.items] },
    { title: 'Weber Gas Barbekü', body: 'Weber Spirit II E-310, 3 oçaqlı, 11 kW, üzlüklü.', price: 1299, categories: [CATEGORIES.items] },
    { title: 'Bosch Robot Tozsoran', body: 'Bosch Roxxter Serie 6, lazer naviqasiya, Wi-Fi, tətbiq.', price: 899, categories: [CATEGORIES.items] },
    { title: 'IKEA Yemək Masası + 4 Stul', body: 'IKEA yemək dəsti, ağac, 120x75 sm, 4 stul, çox yaxşı vəziyyət.', price: 350, categories: [CATEGORIES.items] },
    { title: 'Uşaq Arabası - Stokke Xplory', body: 'Stokke Xplory V6, tam dəst, boz rəng, az istifadə edilib.', price: 599, categories: [CATEGORIES.mothersKids] },
    { title: 'Uşaq Yatağı - Əl işi Palıd', body: 'Palıd ağacından uşaq yatağı, 120x60 sm, matrası daxildir.', price: 450, categories: [CATEGORIES.mothersKids] },
    { title: 'Elektrik Gitara - Fender', body: 'Fender Player Stratocaster, Sunburst, çantası ilə.', price: 1350, categories: [CATEGORIES.items] },
    { title: 'Velosiped - Giant TCR', body: 'Giant TCR Advanced 2, Shimano 105, karbon, 56 sm çərçivə.', price: 2200, categories: [CATEGORIES.items] },
    { title: 'Qaçış Ayaqqabısı - ASICS', body: 'ASICS Gel-Kayano 30, ölçü 43, qara/neon, yeni.', price: 259, categories: [CATEGORIES.items] },
    { title: 'Kamp Çadırı - 4 nəfərlik', body: 'Quechua MH100, 4 nəfərlik, su keçirməz, asan qurulma.', price: 149, categories: [CATEGORIES.items] },
    { title: 'Ofis Stulu - Ergonomik', body: 'Herman Miller Aeron, tam funksional, mesh, qara.', price: 1800, categories: [CATEGORIES.items] },
    { title: 'Air Conditioner - 12000 BTU', body: 'Midea 12000 BTU, invertorlu, Wi-Fi, A++ enerji sinfi.', price: 599, categories: [CATEGORIES.items] },
    { title: 'Qabyuyan Maşın - Bosch', body: 'Bosch SMS4HVI33E, 13 dəst, A++, HomeConnect.', price: 899, categories: [CATEGORIES.items] },
    { title: 'Masa Lampası - Dyson', body: 'Dyson Lightcycle Morph, müxtəlif rejimlər, USB-C şarj.', price: 799, categories: [CATEGORIES.items] },
    { title: 'Smart Saat - Garmin Fenix 7', body: 'Garmin Fenix 7X Solar, titanium, xəritəli, 37 gün batareya.', price: 1099, categories: [CATEGORIES.electronics] },
    { title: 'Elektrikli Skuter - Xiaomi', body: 'Xiaomi Electric Scooter 4 Pro, 25 km/s, 45 km məsafə.', price: 699, categories: [CATEGORIES.transport] },

    // SERVICES (5 items)
    { title: 'Ev təmiri xidməti', body: 'Peşəkar ev təmiri: elektrik, santexnika, boya, kafel.\n\nTecrübə: 10+ il\nZəmanət: 2 il\nBakı daxili pulsuz baxış.', price: 50, categories: [CATEGORIES.services] },
    { title: 'Fotoqraf - Toy çəkilişi', body: 'Professional toy fotoqrafı, 8 saat, 500+ işlənmiş foto, albom.\n\n📸 Canon R5 + RF lenses\n🎬 Video da mövcuddur', price: 800, categories: [CATEGORIES.services] },
    { title: 'İngilis dili kursu', body: 'İngilis dili dərsləri, IELTS/TOEFL hazırlığı, fərdi və qrup.\n\n👨‍🏫 Native speaker müəllim\n📍 Online/Offline', price: 120, categories: [CATEGORIES.services] },
    { title: 'Avtomobil detailing', body: 'Professional avtomobil detailing xidməti.\n\nDaxili + xarici tam təmizlik\nKeramik örtük\nBoya korreksiyası', price: 150, categories: [CATEGORIES.services] },
    { title: 'Web sayt hazırlanması', body: 'Professional web sayt, mobil tətbiq hazırlanması.\n\nReact, Next.js, React Native\nSEO optimizasiya\nTexniki dəstək', price: 2000, categories: [CATEGORIES.services] },
];

async function main() {
    console.log('🚀 Starting seed: 100 cards...\n');

    let inserted = 0;
    let templateIdx = 0;

    for (let i = 1; i <= 100; i++) {
        const template = CARD_TEMPLATES[templateIdx % CARD_TEMPLATES.length];
        templateIdx++;

        const cardId = `SEED_CARD_${String(i).padStart(3, '0')}`;
        const storagePrefix = SHARED_STORAGE_PREFIX;

        // Random 3-5 images from pool, shuffled
        const cardImages = pick(IMAGE_POOL, rand(3, 5));
        const coverImage = cardImages[0];
        const location = BAKU_LOCATIONS[rand(0, BAKU_LOCATIONS.length - 1)];

        // Add slight price variation (+/- 10%)
        const priceVariation = template.price * (0.9 + Math.random() * 0.2);
        const finalPrice = Math.round(priceVariation);

        // Title variation for duplicates (append suffix for items after first cycle)
        const cycle = Math.floor((i - 1) / CARD_TEMPLATES.length);
        const titleSuffix = cycle > 0 ? ` #${cycle + 1}` : '';
        const title = template.title + titleSuffix;

        try {
            await db.execute(sql`
        INSERT INTO cards (id, created_at, title, is_approved, price, body, account_id, storage_prefix, location, images, cover, video, filters_options, categories, workspace_id)
        VALUES (
          ${cardId},
          NOW(),
          ${title},
          true,
          ${finalPrice},
          ${template.body},
          ${ACCOUNT_ID},
          ${storagePrefix},
          ${JSON.stringify(location)}::json,
          ${JSON.stringify(cardImages)}::json,
          ${coverImage},
          null,
          ${template.filters ? JSON.stringify(template.filters) : '[]'}::jsonb,
          ${JSON.stringify(template.categories)}::jsonb,
          null
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          price = EXCLUDED.price,
          body = EXCLUDED.body,
          account_id = EXCLUDED.account_id,
          location = EXCLUDED.location,
          images = EXCLUDED.images,
          cover = EXCLUDED.cover,
          filters_options = EXCLUDED.filters_options,
          categories = EXCLUDED.categories,
          is_approved = true,
          updated_at = NOW()
      `);

            inserted++;
            if (i % 10 === 0) console.log(`  ✅ ${i}/100 cards inserted...`);
        } catch (err) {
            console.error(`  ❌ Failed card ${cardId}:`, (err as Error).message);
        }
    }

    console.log(`\n🎉 Done! Inserted/updated ${inserted} cards.`);

    // Verify count
    const result = await db.execute(sql`SELECT COUNT(*) as count FROM cards WHERE id LIKE 'SEED_CARD_%'`);
    const count = (result as any[])[0]?.count;
    console.log(`📊 Total SEED cards in DB: ${count}`);

    // ═══════════════════════════════════════════════════
    // AUTO-SYNC TO NEON SEARCH
    // ═══════════════════════════════════════════════════
    console.log('\n🔄 Syncing to Neon search...');

    const allCards = await pgsqlClient`
      SELECT id, title, body, price, account_id, workspace_id,
             images, cover, video, storage_prefix, location,
             categories, filters_options, is_approved, created_at, updated_at
      FROM cards WHERE is_approved = true
    `;

    let synced = 0;
    for (const card of allCards) {
        const data = {
            title: card.title, body: card.body, price: card.price,
            account_id: card.account_id, images: card.images,
            cover: card.cover, video: card.video,
            storage_prefix: card.storage_prefix, location: card.location,
            categories: card.categories, filters_options: card.filters_options,
            is_approved: card.is_approved, created_at: card.created_at,
            updated_at: card.updated_at,
        };
        await pgsqlSearchClient`
        INSERT INTO neon_search_cards (id, workspace_id, data, synced_at)
        VALUES (${card.id}, ${card.workspace_id || ''}, ${JSON.stringify(data)}::jsonb, NOW())
        ON CONFLICT (id) DO UPDATE SET
          workspace_id = EXCLUDED.workspace_id, data = EXCLUDED.data, synced_at = NOW()
      `;
        synced++;
    }
    console.log(`✅ Synced ${synced} cards to Neon search.`);

    process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
