/**
 * Seed 30 cards: Hobbi, İdman və Əyləncə (Sports & Hobbies)
 * Parent: 01KJB9Q9YH8K5AB3
 * Run: bun run scripts/seed-cards-idman.ts
 */
import { db } from '../lib/database';
import { sql } from 'drizzle-orm';

const WS = 'SEED_STORE_001', ACC = '01KJ7KW0AZDSJD7A', P = 'SEED2_SP_', PARENT = '01KJB9Q9YH8K5AB3';
const IMGS = ['bicycle-mountain.jpg', 'guitar-fender.jpg', 'boxing-gloves.jpg', 'camping-tent.jpg', 'gym-equipment.jpg'];
const img = (i: number, n = 3) => Array.from({ length: n }, (_, j) => IMGS[(i + j) % IMGS.length]);
const loc = (i: number) => [{ lat: 40.4093, lng: 49.8671 }, { lat: 40.4219, lng: 49.8530 }, { lat: 40.3790, lng: 49.8490 }, { lat: 40.4350, lng: 49.8750 }, { lat: 40.4150, lng: 49.9020 }][i % 5];
const f = (og: string, o: string) => ({ type: 'STATIC', option_id: o, option_group_id: og });

// Bicycles 01KJB9Q9YJZ2ZJZH: Type=01KJB9Q9YJARXTSX Mountain=01KJB9Q9YJQE6Y05 City=01KJB9Q9YJYW4N3H Electric=01KJB9Q9YJY57SDF
// Speeds=01KJB9Q9YJH411H6: 21=01KJB9Q9YJJV9VHK 24+=01KJB9Q9YJFF07NT 7=01KJB9Q9YJQ9DQKC
// Fitness 01KJB9Q9YH6SB53F: Type=01KJB9Q9YHV8556X Treadmill=01KJB9Q9YHVEWD0C ExBike=01KJB9Q9YHQ24X66 Dumbbells=01KJB9Q9YHKVA0G9
// Boxing 01KJB9Q9YH13PGQV: Type=01KJB9Q9YHV62B5F Gloves=01KJB9Q9YH6BV93A Bag=01KJB9Q9YHSA466W Kimono=01KJB9Q9YH66751M
// Sport=01KJB9Q9YHQF1GA3 Boxing=01KJB9Q9YHTM0S6T MMA=01KJB9Q9YJ29VFEK Karate=01KJB9Q9YHBT1191
// Camping 01KJB9Q9YJNFPCNK: Type=01KJB9Q9YJ494CP3 Tent=01KJB9Q9YJJGCFWX SleepBag=01KJB9Q9YJSY93AQ Mat=01KJB9Q9YJ1GNRBX
// Season=01KJB9Q9YJCETBWT 3season=01KJB9Q9YJ0A1V55 4season=01KJB9Q9YJHFPW7T
// Music 01KJB9Q9YJSHMYXZ: Type=01KJB9Q9YJFJT4TR Guitar=01KJB9Q9YJ52HHNR Piano=01KJB9Q9YJR22TSK Drums=01KJB9Q9YJT5VFPF Tar=01KJB9Q9YJE0FDFN
// Brand=01KJB9Q9YJX7AGY2 Yamaha=01KJB9Q9YJP8CVTB Fender=01KJB9Q9YJ1H9600 Gibson=01KJB9Q9YJTRDSDQ
// Condition(parent)=01KJB9Q9YHHYVYCR New=01KJB9Q9YHB3N2G2 Used=01KJB9Q9YHM6JDSN

const CARDS = [
    // Bicycles (8)
    { id: `${P}001`, title: 'Trek Marlin 7 Dağ Velosipedi 29"', body: 'Trek Marlin 7, 29", Large, Hydraulic disk, 8 sürət, mineral mavi, yeni.', price: 999, cat: '01KJB9Q9YJZ2ZJZH', filters: [f('01KJB9Q9YJARXTSX', '01KJB9Q9YJQE6Y05'), f('01KJB9Q9YJH411H6', '01KJB9Q9YJFF07NT'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}002`, title: 'Giant Revolt 2 Gravel Velosipedi', body: 'Giant Revolt 2, gravel, 700c, 2x11 sürət, qara, yeni.', price: 1450, cat: '01KJB9Q9YJZ2ZJZH', filters: [f('01KJB9Q9YJARXTSX', '01KJB9Q9YJV8VM0Q'), f('01KJB9Q9YJH411H6', '01KJB9Q9YJFF07NT'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}003`, title: 'Xiaomi Mi Electric Scooter Pro 2', body: 'Xiaomi Mi Electric Scooter Pro 2, 45km/h, 45km range, qara.', price: 649, cat: '01KJB9Q9YJ3GZQMR', filters: [f('01KJB9Q9YJG928E9', '01KJB9Q9YJQZNAJM'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}004`, title: 'Cube Reaction C:62 Pro 2022', body: 'Cube Reaction Pro karbon, Large, Shimano XT, qırmızı, işlənmiş.', price: 2200, cat: '01KJB9Q9YJZ2ZJZH', filters: [f('01KJB9Q9YJARXTSX', '01KJB9Q9YJQE6Y05'), f('01KJB9Q9YJH411H6', '01KJB9Q9YJFF07NT'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHM6JDSN')] },
    { id: `${P}005`, title: 'Bianchi C-Sport City Velosipedi', body: 'Bianchi C-Sport 2, şəhər, 7 sürət, celeste yaşıl, yeni.', price: 599, cat: '01KJB9Q9YJZ2ZJZH', filters: [f('01KJB9Q9YJARXTSX', '01KJB9Q9YJYW4N3H'), f('01KJB9Q9YJH411H6', '01KJB9Q9YJQ9DQKC'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}006`, title: 'Segway Ninebot Max Electric Scooter', body: 'Segway Ninebot Max G30, 65km range, airless tires, qara.', price: 999, cat: '01KJB9Q9YJ3GZQMR', filters: [f('01KJB9Q9YJG928E9', '01KJB9Q9YJQZNAJM'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}007`, title: 'Uşaq Dağ Velosipedi 24" - Ghost', body: 'Ghost Kato 24", alüminium, 21 sürət, disk firen, yeni.', price: 399, cat: '01KJB9Q9YJZ2ZJZH', filters: [f('01KJB9Q9YJARXTSX', '01KJB9Q9YJXPR9GW'), f('01KJB9Q9YJH411H6', '01KJB9Q9YJJV9VHK'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}008`, title: 'Canyon Spectral 29 CF 7 2022', body: 'Canyon Spectral 29 karbon Frame, L, Shimano SLX, işlənmiş.', price: 3500, cat: '01KJB9Q9YJZ2ZJZH', filters: [f('01KJB9Q9YJARXTSX', '01KJB9Q9YJQE6Y05'), f('01KJB9Q9YJH411H6', '01KJB9Q9YJFF07NT'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHM6JDSN')] },
    // Fitness & Boxing (8)
    { id: `${P}009`, title: 'Technogym Qaçış Aparatı Run', body: 'Technogym Run, 22km/h max, WiFi, MyWellness, yeni.', price: 4999, cat: '01KJB9Q9YH6SB53F', filters: [f('01KJB9Q9YHV8556X', '01KJB9Q9YHVEWD0C'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}010`, title: 'Bowflex SelectTech 552 Qantellər', body: 'Bowflex SelectTech 552, 2-24kg arası, 2 ədəd, yeni.', price: 699, cat: '01KJB9Q9YH6SB53F', filters: [f('01KJB9Q9YHV8556X', '01KJB9Q9YHKVA0G9'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}011`, title: 'Peloton Spin Bike', body: 'Peloton Original Bike, ayarlanabilir çarx, yeni kondisiya.', price: 2199, cat: '01KJB9Q9YH6SB53F', filters: [f('01KJB9Q9YHV8556X', '01KJB9Q9YHQ24X66'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}012`, title: 'Hayabusa T3 Boks Əlcəkləri 12oz', body: 'Hayabusa T3 boks əlcəkləri, 12oz, ikiqatlı divərji qoruma, qara.', price: 149, cat: '01KJB9Q9YH13PGQV', filters: [f('01KJB9Q9YHV62B5F', '01KJB9Q9YH6BV93A'), f('01KJB9Q9YHQF1GA3', '01KJB9Q9YHTM0S6T'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}013`, title: 'Century Wavemaster XXL Boks Kisəsi', body: 'Century Wavemaster XXL, müstəqil dayaq, yeni.', price: 299, cat: '01KJB9Q9YH13PGQV', filters: [f('01KJB9Q9YHV62B5F', '01KJB9Q9YHSA466W'), f('01KJB9Q9YHQF1GA3', '01KJB9Q9YHTM0S6T'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}014`, title: 'Fuji Mae Karate Kimino A4', body: 'Fuji Mae Advantage Lite kimono, A4 beden, ağ, WKF approved.', price: 89, cat: '01KJB9Q9YH13PGQV', filters: [f('01KJB9Q9YHV62B5F', '01KJB9Q9YH66751M'), f('01KJB9Q9YHQF1GA3', '01KJB9Q9YHBT1191'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}015`, title: 'Venum MMA Dəsti - Sol Böyük', body: 'Venum MMA dəsti: əlcək+kask+protector, sol böyük, yeni.', price: 189, cat: '01KJB9Q9YH13PGQV', filters: [f('01KJB9Q9YHV62B5F', '01KJB9Q9YHQAZQ5X'), f('01KJB9Q9YHQF1GA3', '01KJB9Q9YJ29VFEK'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    // Camping (4)
    { id: `${P}016`, title: 'MSR Hubba Hubba NX 3-Mövsüm Çadır', body: 'MSR Hubba Hubba NX, 2 nəfərlik, 3 mövsüm, ultralight, yeni.', price: 549, cat: '01KJB9Q9YJNFPCNK', filters: [f('01KJB9Q9YJ494CP3', '01KJB9Q9YJJGCFWX'), f('01KJB9Q9YJCETBWT', '01KJB9Q9YJ0A1V55'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}017`, title: 'Sea to Summit Spark SP1 Yataq Kisəsi', body: 'Sea to Summit Spark SP1, -15°C, 340g, ultra-compact.', price: 299, cat: '01KJB9Q9YJNFPCNK', filters: [f('01KJB9Q9YJ494CP3', '01KJB9Q9YJSY93AQ'), f('01KJB9Q9YJCETBWT', '01KJB9Q9YJHFPW7T'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}018`, title: 'Big Agnes Copper Spur HV UL2', body: 'Big Agnes Copper Spur HV UL2, freestanding, 2 nəfər, yeni.', price: 699, cat: '01KJB9Q9YJNFPCNK', filters: [f('01KJB9Q9YJ494CP3', '01KJB9Q9YJJGCFWX'), f('01KJB9Q9YJCETBWT', '01KJB9Q9YJ0A1V55'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}019`, title: 'Thermarest NeoAir XLite Turistik Mat', body: 'Thermarest NeoAir XLite, ultralight, R=4.2, 350g.', price: 219, cat: '01KJB9Q9YJNFPCNK', filters: [f('01KJB9Q9YJ494CP3', '01KJB9Q9YJ1GNRBX'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    // Music (8)
    { id: `${P}020`, title: 'Fender American Professional II Strat', body: 'Fender American Professional II Stratocaster, qara, Rosewood, yeni.', price: 2200, cat: '01KJB9Q9YJSHMYXZ', filters: [f('01KJB9Q9YJFJT4TR', '01KJB9Q9YJ52HHNR'), f('01KJB9Q9YJX7AGY2', '01KJB9Q9YJ1H9600'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}021`, title: 'Yamaha P-145 Elektron Piano', body: 'Yamaha P-145, 88 klaviş, graded hammer, 50W, qara.', price: 699, cat: '01KJB9Q9YJSHMYXZ', filters: [f('01KJB9Q9YJFJT4TR', '01KJB9Q9YJR22TSK'), f('01KJB9Q9YJX7AGY2', '01KJB9Q9YJP8CVTB'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}022`, title: 'Pearl Export EXX 5-parça Davul Dəsti', body: 'Pearl Export EXX 5-piece drum kit, hardware daxil, qara.', price: 1299, cat: '01KJB9Q9YJSHMYXZ', filters: [f('01KJB9Q9YJFJT4TR', '01KJB9Q9YJT5VFPF'), f('01KJB9Q9YJX7AGY2', '01KJB9Q9YJ59BGG8'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}023`, title: 'Azərbaycan Tari - Ustad Dəstəsi', body: 'Peşəkar tar, tut ağacı, öküz dərisi, Bakı ustası, yeni.', price: 450, cat: '01KJB9Q9YJSHMYXZ', filters: [f('01KJB9Q9YJFJT4TR', '01KJB9Q9YJE0FDFN'), f('01KJB9Q9YJX7AGY2', '01KJB9Q9YJ59BGG8'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}024`, title: 'Gibson Les Paul Standard 50s', body: 'Gibson Les Paul Standard 50s, Gold Top, P-90, yeni.', price: 3500, cat: '01KJB9Q9YJSHMYXZ', filters: [f('01KJB9Q9YJFJT4TR', '01KJB9Q9YJ52HHNR'), f('01KJB9Q9YJX7AGY2', '01KJB9Q9YJTRDSDQ'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}025`, title: 'Roland TD-27KV V-Drums Elektron Davul', body: 'Roland TD-27KV V-Drums, mesh paketli, Bluetooth, yeni.', price: 3999, cat: '01KJB9Q9YJSHMYXZ', filters: [f('01KJB9Q9YJFJT4TR', '01KJB9Q9YJT5VFPF'), f('01KJB9Q9YJX7AGY2', '01KJB9Q9YJERSRB8'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}026`, title: 'İşlənmiş Fender Telecaster MX', body: 'Fender Telecaster Player Series, MX, sarı, işlənmiş yaxşı.', price: 950, cat: '01KJB9Q9YJSHMYXZ', filters: [f('01KJB9Q9YJFJT4TR', '01KJB9Q9YJ52HHNR'), f('01KJB9Q9YJX7AGY2', '01KJB9Q9YJ1H9600'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHM6JDSN')] },
    // Books & Collecting (4)
    { id: `${P}027`, title: 'Nurani Qazan Sikkə Kolleksiyası', body: '1970-2000 Sovet sikkə kolleksiyası, 45 ədəd, albomda.', price: 180, cat: '01KJB9Q9YJ94S7QP', filters: [f('01KJB9Q9YJESGM8Y', '01KJB9Q9YJYEB6WY'), f('01KJB9Q9YJNWBKEJ', '01KJB9Q9YJTH690X'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHM6JDSN')] },
    { id: `${P}028`, title: 'Dövlət Pul Nişanı Kolleksiyası', body: 'Azərbaycan AXC 1919-1920 pul nişanları, 5 ədəd, əla vəziyyət.', price: 320, cat: '01KJB9Q9YJ94S7QP', filters: [f('01KJB9Q9YJESGM8Y', '01KJB9Q9YJFMC80C'), f('01KJB9Q9YJNWBKEJ', '01KJB9Q9YJV3B7A0'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHM6JDSN')] },
    { id: `${P}029`, title: 'Harari - Sapiens (Az dili)', body: 'Yuval Noah Harari "Sapiens", Azərbaycan dilindədir, yeni.', price: 25, cat: '01KJB9Q9YJZVGHYJ', filters: [f('01KJB9Q9YJ9BH649', '01KJB9Q9YJQXWPP9'), f('01KJB9Q9YJB5W5FG', '01KJB9Q9YJDFAPK1'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}030`, title: 'Konser Bileti - Bakı Jazz Festivalı', body: 'Bakı Beynəlxalq Caz Festivalı, 2 gün bilet, VIP, mart 2026.', price: 120, cat: '01KJB9Q9YJK27DGE', filters: [f('01KJB9Q9YJC3DYHD', '01KJB9Q9YJVGFAV0'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
];

async function main() {
    console.log('🏋 Seeding Sports & Hobbies (30)...');
    let ok = 0;
    for (let i = 0; i < CARDS.length; i++) {
        const card = CARDS[i];
        const images = img(i);
        try {
            await db.execute(sql`
        INSERT INTO cards (id,created_at,title,is_approved,price,body,account_id,location,images,cover,video,filters_options,categories,workspace_id)
        VALUES (${card.id},NOW(),${card.title},true,${card.price},${card.body},${ACC},
          ${JSON.stringify(loc(i))}::json,${JSON.stringify(images)}::json,${images[0]},null,
          ${JSON.stringify(card.filters)}::jsonb,${JSON.stringify([PARENT, card.cat])}::jsonb,${WS})
        ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title,price=EXCLUDED.price,body=EXCLUDED.body,
          images=EXCLUDED.images,cover=EXCLUDED.cover,filters_options=EXCLUDED.filters_options,
          categories=EXCLUDED.categories,workspace_id=EXCLUDED.workspace_id,is_approved=true,updated_at=NOW()
      `);
            ok++;
        } catch (e: any) { console.error(`❌ ${card.id}:`, e.message); }
    }
    console.log(`✅ Done: ${ok}/30 Sports cards.`);
    process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
