/**
 * Seed 30 cards: Gözəllik və Sağlamlıq (Beauty & Health)
 * Parent: 01KJB9Q9YE9RHY1A
 * Run: bun run scripts/seed-cards-gozallik.ts
 */
import { db } from '../lib/database';
import { sql } from 'drizzle-orm';

const WS = 'SEED_STORE_001', ACC = '01KJ7KW0AZDSJD7A', P = 'SEED2_BE_', PARENT = '01KJB9Q9YE9RHY1A';
const IMGS = ['perfume-bottle.jpg', 'makeup-set.jpg', 'skincare-cream.jpg', 'hair-products.jpg'];
const img = (i: number, n = 3) => Array.from({ length: n }, (_, j) => IMGS[(i + j) % IMGS.length]);
const loc = (i: number) => [{ lat: 40.4093, lng: 49.8671 }, { lat: 40.4219, lng: 49.8530 }, { lat: 40.3790, lng: 49.8490 }, { lat: 40.4350, lng: 49.8750 }, { lat: 40.4150, lng: 49.9020 }][i % 5];
const f = (og: string, o: string) => ({ type: 'STATIC', option_id: o, option_group_id: og });

// Perfumes 01KJB9Q9YEDPA719: Gender=01KJB9Q9YENSQQCQ Men=01KJB9Q9YEBF6DFB Women=01KJB9Q9YE8VKJXG Unisex=01KJB9Q9YE3HK5BK
// Volume=01KJB9Q9YETHS5XK: 50ml=01KJB9Q9YEP6PQAP 75ml=01KJB9Q9YEZ9W6T9 100ml=01KJB9Q9YEVSABWM 150ml=01KJB9Q9YEFJ262H
// Type=01KJB9Q9YEWERCA9: EDP=01KJB9Q9YEGYAMGM EDT=01KJB9Q9YEY3TJQM
// Makeup 01KJB9Q9YEGYFB2Y: Type=01KJB9Q9YEXR9XVK; Brand=01KJB9Q9YE7YHT61 MAC=01KJB9Q9YEEBF64Y NYX=01KJB9Q9YE62Z487 Maybelline=01KJB9Q9YE4D3X27
// Skincare 01KJB9Q9YE2E8PDX: Gender=01KJB9Q9YENKHHE5; Type=01KJB9Q9YEVD41DJ Cream=01KJB9Q9YER5D94W Serum=01KJB9Q9YE0YVG8B
// Hair 01KJB9Q9YE5TT4MG: Type=01KJB9Q9YEQ9Z2V5 Shampoo=01KJB9Q9YEQF6CRD Cond=01KJB9Q9YE5JTHCY Mask=01KJB9Q9YE58MTW3 Dye=01KJB9Q9YF3MNMD9
// HairType=01KJB9Q9YFC38GEQ: Oily=01KJB9Q9YFP06HZT Dry=01KJB9Q9YF0YQ5RK Normal=01KJB9Q9YFXG5Z4W
// Nails 01KJB9Q9YFX6E4X4: Type=01KJB9Q9YF1GS8YS Gel=01KJB9Q9YFBBD70T Polish=01KJB9Q9YFXY1270
// Condition(parent)=01KJB9Q9YEBH99B9 New=01KJB9Q9YEM90PHA

const CARDS = [
    // Perfumes
    { id: `${P}001`, title: 'Chanel No.5 EDP 100ml', body: 'Chanel No.5 Eau de Parfum, 100ml, qadın, orijinal, yeni.', price: 420, cat: '01KJB9Q9YEDPA719', filters: [f('01KJB9Q9YENSQQCQ', '01KJB9Q9YE8VKJXG'), f('01KJB9Q9YETHS5XK', '01KJB9Q9YEVSABWM'), f('01KJB9Q9YEWERCA9', '01KJB9Q9YEGYAMGM'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}002`, title: 'Dior Sauvage EDT 100ml', body: 'Dior Sauvage Eau de Toilette, 100ml, kişi, orijinal.', price: 280, cat: '01KJB9Q9YEDPA719', filters: [f('01KJB9Q9YENSQQCQ', '01KJB9Q9YEBF6DFB'), f('01KJB9Q9YETHS5XK', '01KJB9Q9YEVSABWM'), f('01KJB9Q9YEWERCA9', '01KJB9Q9YEY3TJQM'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}003`, title: 'Tom Ford Black Orchid EDP 50ml', body: 'Tom Ford Black Orchid, 50ml, uniseks, qadın üçün müvafiq.', price: 340, cat: '01KJB9Q9YEDPA719', filters: [f('01KJB9Q9YENSQQCQ', '01KJB9Q9YE3HK5BK'), f('01KJB9Q9YETHS5XK', '01KJB9Q9YEP6PQAP'), f('01KJB9Q9YEWERCA9', '01KJB9Q9YEGYAMGM'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}004`, title: 'Versace Eros EDT 100ml', body: 'Versace Eros, 100ml, kişi, güclü qoxu, orijinal.', price: 195, cat: '01KJB9Q9YEDPA719', filters: [f('01KJB9Q9YENSQQCQ', '01KJB9Q9YEBF6DFB'), f('01KJB9Q9YETHS5XK', '01KJB9Q9YEVSABWM'), f('01KJB9Q9YEWERCA9', '01KJB9Q9YEY3TJQM'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}005`, title: 'Lancôme La Vie est Belle EDP 75ml', body: 'Lancôme La Vie est Belle, 75ml, qadın, işlənmiş 80%.', price: 130, cat: '01KJB9Q9YEDPA719', filters: [f('01KJB9Q9YENSQQCQ', '01KJB9Q9YE8VKJXG'), f('01KJB9Q9YETHS5XK', '01KJB9Q9YEZ9W6T9'), f('01KJB9Q9YEWERCA9', '01KJB9Q9YEGYAMGM')] },
    { id: `${P}006`, title: 'Creed Aventus 100ml', body: 'Creed Aventus, 100ml, kişi, partiya 22A01, yeni.', price: 890, cat: '01KJB9Q9YEDPA719', filters: [f('01KJB9Q9YENSQQCQ', '01KJB9Q9YEBF6DFB'), f('01KJB9Q9YETHS5XK', '01KJB9Q9YEVSABWM'), f('01KJB9Q9YEWERCA9', '01KJB9Q9YEGYAMGM'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}007`, title: 'YSL Libre EDP 90ml', body: 'YSL Libre, 90ml, qadın, lavanda-mandarin, qızılı qab.', price: 320, cat: '01KJB9Q9YEDPA719', filters: [f('01KJB9Q9YENSQQCQ', '01KJB9Q9YE8VKJXG'), f('01KJB9Q9YETHS5XK', '01KJB9Q9YEZ9W6T9'), f('01KJB9Q9YEWERCA9', '01KJB9Q9YEGYAMGM'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}008`, title: 'Armani Acqua di Giò EDP 75ml', body: 'Giorgio Armani Acqua di Giò EDP, 75ml, kişi, yeni.', price: 220, cat: '01KJB9Q9YEDPA719', filters: [f('01KJB9Q9YENSQQCQ', '01KJB9Q9YEBF6DFB'), f('01KJB9Q9YETHS5XK', '01KJB9Q9YEZ9W6T9'), f('01KJB9Q9YEWERCA9', '01KJB9Q9YEGYAMGM'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    // Makeup
    { id: `${P}009`, title: 'MAC Studio Fix Foundation', body: 'MAC Studio Fix Fluid Foundation, NC30, SPF 15, 30ml, yeni.', price: 65, cat: '01KJB9Q9YEGYFB2Y', filters: [f('01KJB9Q9YEXR9XVK', '01KJB9Q9YE2HX8B5'), f('01KJB9Q9YE7YHT61', '01KJB9Q9YEEBF64Y'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}010`, title: 'NYX Soft Matte Lip Cream Set', body: 'NYX 10-ədədlik Soft Matte Lip Cream dəsti, müxtəlif çalarlı, yeni.', price: 49, cat: '01KJB9Q9YEGYFB2Y', filters: [f('01KJB9Q9YEXR9XVK', '01KJB9Q9YEJEA99N'), f('01KJB9Q9YE7YHT61', '01KJB9Q9YE62Z487'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}011`, title: 'Maybelline Sky High Mascara', body: 'Maybelline Sky High Mascara, qara, uzandırıcı, su keçirməz, yeni.', price: 25, cat: '01KJB9Q9YEGYFB2Y', filters: [f('01KJB9Q9YEXR9XVK', '01KJB9Q9YEG630DB'), f('01KJB9Q9YE7YHT61', '01KJB9Q9YE4D3X27'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}012`, title: 'Charlotte Tilbury Kist Dəsti', body: 'Charlotte Tilbury 12-parçalı professional kist dəsti, yeni.', price: 189, cat: '01KJB9Q9YEGYFB2Y', filters: [f('01KJB9Q9YEXR9XVK', '01KJB9Q9YEXT4KXW'), f('01KJB9Q9YE7YHT61', '01KJB9Q9YERFWBXG'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    // Skincare
    { id: `${P}013`, title: 'La Roche-Posay SPF50 Krem 50ml', body: 'La Roche-Posay Anthelios UVmune 400, SPF50+, yağsız, 50ml.', price: 45, cat: '01KJB9Q9YE2E8PDX', filters: [f('01KJB9Q9YENKHHE5', '01KJB9Q9YE1JJMKJ'), f('01KJB9Q9YEVD41DJ', '01KJB9Q9YEN78K7G'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}014`, title: 'The Ordinary Niacinamide 10% Serum', body: 'The Ordinary Niacinamide 10% + Zinc 1%, 30ml, üz serumu, yeni.', price: 22, cat: '01KJB9Q9YE2E8PDX', filters: [f('01KJB9Q9YENKHHE5', '01KJB9Q9YE1JJMKJ'), f('01KJB9Q9YEVD41DJ', '01KJB9Q9YE0YVG8B'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}015`, title: 'CeraVe Moisturising Cream 454g', body: 'CeraVe Moisturizing Cream, 454g, normal/quru dəri, ceramid.', price: 35, cat: '01KJB9Q9YE2E8PDX', filters: [f('01KJB9Q9YENKHHE5', '01KJB9Q9YE1JJMKJ'), f('01KJB9Q9YEVD41DJ', '01KJB9Q9YER5D94W'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}016`, title: 'Skin Aqua UV Milk SPF50+', body: 'Skin Aqua UV Moisture Protection Milk, SPF50+ PA++++, 40ml.', price: 28, cat: '01KJB9Q9YE2E8PDX', filters: [f('01KJB9Q9YENKHHE5', '01KJB9Q9YE1JJMKJ'), f('01KJB9Q9YEVD41DJ', '01KJB9Q9YEN78K7G'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}017`, title: 'Glow Recipe Watermelon Mask', body: 'Glow Recipe Watermelon Glow Sleeping Mask, 80ml, gecə maskası.', price: 65, cat: '01KJB9Q9YE2E8PDX', filters: [f('01KJB9Q9YENKHHE5', '01KJB9Q9YEBA8KA0'), f('01KJB9Q9YEVD41DJ', '01KJB9Q9YEEBCPTR'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    // Hair
    { id: `${P}018`, title: 'Olaplex No.3 Saç Maskası 100ml', body: 'Olaplex No.3 Hair Perfector, 100ml, zərli saçlar üçün, yeni.', price: 55, cat: '01KJB9Q9YE5TT4MG', filters: [f('01KJB9Q9YEQ9Z2V5', '01KJB9Q9YE58MTW3'), f('01KJB9Q9YFC38GEQ', '01KJB9Q9YFP3PAH7'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}019`, title: 'Kerastase Nutritive Şampun 250ml', body: 'Kérastase Nutritive Bain Satin, 250ml, quru saçlar.', price: 45, cat: '01KJB9Q9YE5TT4MG', filters: [f('01KJB9Q9YEQ9Z2V5', '01KJB9Q9YEQF6CRD'), f('01KJB9Q9YFC38GEQ', '01KJB9Q9YF0YQ5RK'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}020`, title: 'Wella Koleston Saç Boyası - 7/0', body: 'Wella Koleston Perfect, 7/0 Orta Sarı, 60ml tüpü daxil.', price: 18, cat: '01KJB9Q9YE5TT4MG', filters: [f('01KJB9Q9YEQ9Z2V5', '01KJB9Q9YF3MNMD9'), f('01KJB9Q9YFC38GEQ', '01KJB9Q9YFNTC4H2'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}021`, title: 'Moroccanoil Saç Yağı 100ml', body: 'Moroccanoil Treatment, 100ml, bütün saç tipləri üçün.', price: 89, cat: '01KJB9Q9YE5TT4MG', filters: [f('01KJB9Q9YEQ9Z2V5', '01KJB9Q9YFDGDNY3'), f('01KJB9Q9YFC38GEQ', '01KJB9Q9YFXG5Z4W'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    // Nails
    { id: `${P}022`, title: 'OPI Gel Color Professional Set', body: 'OPI GelColor 8-rəng professional dəst + UV lampa, 48W.', price: 149, cat: '01KJB9Q9YFX6E4X4', filters: [f('01KJB9Q9YF1GS8YS', '01KJB9Q9YFBBD70T'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}023`, title: 'Essie Gel Couture Oje Dəsti', body: 'Essie Gel Couture 12 rəng oje dəsti, UV lazımsız.', price: 79, cat: '01KJB9Q9YFX6E4X4', filters: [f('01KJB9Q9YF1GS8YS', '01KJB9Q9YFXY1270'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}024`, title: 'UV/LED Lampa 48W SUNUV', body: 'SUNUV SUNone 48W UV/LED lampa dırnaq quruducu, 365+405nm.', price: 65, cat: '01KJB9Q9YFX6E4X4', filters: [f('01KJB9Q9YF1GS8YS', '01KJB9Q9YF7ZH3MD'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    // Medical & Weight loss
    { id: `${P}025`, title: 'Omron M3 Tonometr', body: 'Omron M3 qol tonometri, 30 yadda saxlamaq, əlvan ekran.', price: 99, cat: '01KJB9Q9YFVTQ3RF', filters: [f('01KJB9Q9YFDVZSQX', '01KJB9Q9YFJTR562'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}026`, title: 'AccuChek Active Qlükometr', body: 'Roche AccuChek Active glukozeölçən dəsti, 10 zolaq daxil.', price: 75, cat: '01KJB9Q9YFVTQ3RF', filters: [f('01KJB9Q9YFDVZSQX', '01KJB9Q9YFVAJXYN'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}027`, title: 'Protein Tozu - Optimum Nutrition Gold', body: 'ON Gold Standard 100% Whey, 2.27kg Chocolate Mint, yeni.', price: 110, cat: '01KJB9Q9YFN4VX00', filters: [f('01KJB9Q9YFZNRCZ2', '01KJB9Q9YFXJ2W4D'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}028`, title: 'Lipo-6 Yağ Yandıran 120kapsul', body: 'Nutrex Lipo-6 yağ yandıran qara seriya, 120 kapsul.', price: 55, cat: '01KJB9Q9YFN4VX00', filters: [f('01KJB9Q9YFZNRCZ2', '01KJB9Q9YFRGAHY4'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}029`, title: 'Optika Linza - Acuvue Oasys 30', body: 'Acuvue Oasys 1-Day günlük linzalar, 30 ədəd, -2.50.', price: 49, cat: '01KJB9Q9YFTQAQHV', filters: [f('01KJB9Q9YFDN5DTE', '01KJB9Q9YF56C395'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
    { id: `${P}030`, title: 'Rəngli Linzalar - Freshlook Colorblends', body: 'Freshlook Colorblends rəngli aylıq linzalar, 2 ədəd, Blue.', price: 29, cat: '01KJB9Q9YFTQAQHV', filters: [f('01KJB9Q9YFDN5DTE', '01KJB9Q9YFYYY21A'), f('01KJB9Q9YEBH99B9', '01KJB9Q9YEM90PHA')] },
];

async function main() {
    console.log('💄 Seeding Beauty & Health (30)...');
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
    console.log(`✅ Done: ${ok}/30 Beauty cards.`);
    process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
