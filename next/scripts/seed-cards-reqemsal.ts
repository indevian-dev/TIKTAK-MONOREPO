/**
 * Seed 30 cards: Rəqəmsal və Qeydiyyat (Digital & Registration)
 * Parent: 01KJB9Q9YXFE9G8M
 * Run: bun run scripts/seed-cards-reqemsal.ts
 */
import { db } from '../lib/database';
import { sql } from 'drizzle-orm';

const WS = 'SEED_STORE_001', ACC = '01KJ7KW0AZDSJD7A', P = 'SEED2_DG_', PARENT = '01KJB9Q9YXFE9G8M';
const IMGS = ['vip-number.jpg', 'domain-web.jpg', 'gaming-account.jpg'];
const img = (i: number, n = 3) => Array.from({ length: n }, (_, j) => IMGS[(i + j) % IMGS.length]);
const loc = (i: number) => [{ lat: 40.4093, lng: 49.8671 }, { lat: 40.4219, lng: 49.8530 }, { lat: 40.3790, lng: 49.8490 }, { lat: 40.4350, lng: 49.8750 }, { lat: 40.4150, lng: 49.9020 }][i % 5];
const f = (og: string, o: string) => ({ type: 'STATIC', option_id: o, option_group_id: og });

// VIP Nişanlar 01KJB9Q9YXYH4TZC: Format=01KJB9Q9YXFH0Q57 AA000=01KJB9Q9YXHTGET0 00AAA=01KJB9Q9YXZGF085 Triple=01KJB9Q9YXD7N15V Special=01KJB9Q9YXRG2T94

// VIP Nömrələr 01KJB9Q9YXBW1BFX: Operator=01KJB9Q9YXGX94QM Azercell=01KJB9Q9YXH7W0HN Bakcell=01KJB9Q9YX9B768Q Nar=01KJB9Q9YXSCSC4N Naxtel=01KJB9Q9YX0EH8D5
// Type=01KJB9Q9YXN7EWHF: Gold=01KJB9Q9YXK5P8AC Silver=01KJB9Q9YXZ647JM Bronze=01KJB9Q9YX10WPXR Special=01KJB9Q9YXS1YJ95

// Domenlər 01KJB9Q9YXHVMFDQ: Ext=01KJB9Q9YXJJAB1K .az=01KJB9Q9YXJHTHAS .com=01KJB9Q9YX61B9SJ .net=01KJB9Q9YXVD4Z43 .org=01KJB9Q9YXZ4NM8S .info=01KJB9Q9YXJJVT85 .io=01KJB9Q9YX2PS484 Other=01KJB9Q9YX7P4RV7
// Type=01KJB9Q9YXY5DHNT: Premium=01KJB9Q9YXHA47WD Brand=01KJB9Q9YXM42SFS Keyword=01KJB9Q9YX47TQCD Regular=01KJB9Q9YX2TC6M5

// Hazır saytlar 01KJB9Q9YXTHGT44: Type=01KJB9Q9YXD483BE Website=01KJB9Q9YXNNXT3K Mobile=01KJB9Q9YXCD9YQB Ecom=01KJB9Q9YXZJG3GJ Blog=01KJB9Q9YXS75P0S
// Monetization=01KJB9Q9YX9E9CA6: Active=01KJB9Q9YX8BZHSG None=01KJB9Q9YX8CA0HM

// Oyun hesabları 01KJB9Q9YYW4YNM6: Platform=01KJB9Q9YYRJM45J Steam=01KJB9Q9YYQ0SDAN Epic=01KJB9Q9YY7VAVYT PS=01KJB9Q9YYSTTTRS Xbox=01KJB9Q9YYM37JEH Riot=01KJB9Q9YY77R3HG Mobile=01KJB9Q9YY5W6FRK Social=01KJB9Q9YYNGVS3J

const CARDS = [
    // VIP Car Plates
    { id: `${P}001`, title: 'VIP Nişan 10-AA-001', body: 'VIP avtomobil qeydiyyat nişanı 10-AA-001 formatında, unikal kombinasiya.', price: 3500, cat: '01KJB9Q9YXYH4TZC', filters: [f('01KJB9Q9YXFH0Q57', '01KJB9Q9YXHTGET0')] },
    { id: `${P}002`, title: 'VIP Nişan 77-77-AAA', body: 'LR plaka formatı, qoşa 77 rəqəm, bütün hərflər eyni olması mümkün.', price: 5500, cat: '01KJB9Q9YXYH4TZC', filters: [f('01KJB9Q9YXFH0Q57', '01KJB9Q9YXZGF085')] },
    { id: `${P}003`, title: 'VIP Nişan 11-11-111 tam palindrom', body: 'Tam palindrom rəqəmsal nişan, çox nadir, yüksək dəyər.', price: 12000, cat: '01KJB9Q9YXYH4TZC', filters: [f('01KJB9Q9YXFH0Q57', '01KJB9Q9YXD7N15V')] },
    { id: `${P}004`, title: 'VIP Nişan xüsusi sifarişlə', body: 'Müştəri seçimi üzrə xüsusi nişan sifariş xidməti. Qiymət danışıqlı.', price: 2000, cat: '01KJB9Q9YXYH4TZC', filters: [f('01KJB9Q9YXFH0Q57', '01KJB9Q9YXRG2T94')] },
    { id: `${P}005`, title: 'VIP Nişan 55-55-555', body: 'Triple nişan 55-55-555, tək sahibi var, sənədlər hazırdır.', price: 9000, cat: '01KJB9Q9YXYH4TZC', filters: [f('01KJB9Q9YXFH0Q57', '01KJB9Q9YXD7N15V')] },
    { id: `${P}006`, title: 'VIP Nişan 00-AA-007', body: 'Casus agentliyi Bond nişanı :) 007 kombinasiyası çox populyardır.', price: 4200, cat: '01KJB9Q9YXYH4TZC', filters: [f('01KJB9Q9YXFH0Q57', '01KJB9Q9YXHTGET0')] },
    { id: `${P}007`, title: 'VIP Nişan 06-VIP-888', body: 'Xüsusi kombinasiyalı VIP nişan, sənədi hazır, təcili satış.', price: 6800, cat: '01KJB9Q9YXYH4TZC', filters: [f('01KJB9Q9YXFH0Q57', '01KJB9Q9YXRG2T94')] },
    { id: `${P}008`, title: 'VIP Nişan 08-08-888', body: 'Uğur rəqəmi 8-lər üçlüyü, Azercell plaka seriya.', price: 8800, cat: '01KJB9Q9YXYH4TZC', filters: [f('01KJB9Q9YXFH0Q57', '01KJB9Q9YXD7N15V')] },

    // VIP Mobile Numbers
    { id: `${P}009`, title: 'Azercell Qızıl 055-555-55-55', body: 'Azercell Gold nömrə 055-555-55-55 tam palindrom, çox nadir.', price: 4500, cat: '01KJB9Q9YXBW1BFX', filters: [f('01KJB9Q9YXGX94QM', '01KJB9Q9YXH7W0HN'), f('01KJB9Q9YXN7EWHF', '01KJB9Q9YXK5P8AC')] },
    { id: `${P}010`, title: 'Azercell VIP 050-100-00-00', body: 'Azercell Premium nömrə 050-100-00-00, gözəl kombinasiya.', price: 2800, cat: '01KJB9Q9YXBW1BFX', filters: [f('01KJB9Q9YXGX94QM', '01KJB9Q9YXH7W0HN'), f('01KJB9Q9YXN7EWHF', '01KJB9Q9YXK5P8AC')] },
    { id: `${P}011`, title: 'Bakcell VIP 070-777-77-77', body: 'Bakcell Gold 070-777-77-77 çoxlu 7 rəqəmi. Uğur simvolu.', price: 5500, cat: '01KJB9Q9YXBW1BFX', filters: [f('01KJB9Q9YXGX94QM', '01KJB9Q9YX9B768Q'), f('01KJB9Q9YXN7EWHF', '01KJB9Q9YXK5P8AC')] },
    { id: `${P}012`, title: 'Nar Gümüşü 010-321-00-00', body: 'Nar Mobile Silver nömrə 010-321-0000, güclü kombinasiya.', price: 850, cat: '01KJB9Q9YXBW1BFX', filters: [f('01KJB9Q9YXGX94QM', '01KJB9Q9YXSCSC4N'), f('01KJB9Q9YXN7EWHF', '01KJB9Q9YXZ647JM')] },
    { id: `${P}013`, title: 'Azercell Bronze 050-300-00-33', body: 'Azercell Bronze 050-300-00-33, orta qiymət, axıcı nömrə.', price: 380, cat: '01KJB9Q9YXBW1BFX', filters: [f('01KJB9Q9YXGX94QM', '01KJB9Q9YXH7W0HN'), f('01KJB9Q9YXN7EWHF', '01KJB9Q9YX10WPXR')] },
    { id: `${P}014`, title: 'Naxtel Gold 022-222-22-22', body: 'Naxtel Gold nömrə 022-222-22-22, nadir, Naxçıvan kodu ilə.', price: 3200, cat: '01KJB9Q9YXBW1BFX', filters: [f('01KJB9Q9YXGX94QM', '01KJB9Q9YX0EH8D5'), f('01KJB9Q9YXN7EWHF', '01KJB9Q9YXK5P8AC')] },
    { id: `${P}015`, title: 'Bakcell Gold 070-888-08-88', body: 'Bakcell 070 Gold nömrə, 8-lər kombinasiyası, xoşbəxtlik rəqəmi.', price: 2100, cat: '01KJB9Q9YXBW1BFX', filters: [f('01KJB9Q9YXGX94QM', '01KJB9Q9YX9B768Q'), f('01KJB9Q9YXN7EWHF', '01KJB9Q9YXK5P8AC')] },
    { id: `${P}016`, title: 'Azercell Xüsusi 055-TIKTAK', body: 'Azercell xüsusi marka nömrə: 055-845825 (TIKTAK), unikal.', price: 1500, cat: '01KJB9Q9YXBW1BFX', filters: [f('01KJB9Q9YXGX94QM', '01KJB9Q9YXH7W0HN'), f('01KJB9Q9YXN7EWHF', '01KJB9Q9YXS1YJ95')] },

    // Domains
    { id: `${P}017`, title: 'taxiaz.az premium domen', body: 'taxiaz.az premium .az domen adı, taxi sektoru üçün mükəmməl.', price: 1200, cat: '01KJB9Q9YXHVMFDQ', filters: [f('01KJB9Q9YXJJAB1K', '01KJB9Q9YXJHTHAS'), f('01KJB9Q9YXY5DHNT', '01KJB9Q9YXHA47WD')] },
    { id: `${P}018`, title: 'baku.io - brend domen .io', body: 'baku.io domen, texnologiya startap üçün ideal qlobal brend adı.', price: 2800, cat: '01KJB9Q9YXHVMFDQ', filters: [f('01KJB9Q9YXJJAB1K', '01KJB9Q9YX2PS484'), f('01KJB9Q9YXY5DHNT', '01KJB9Q9YXM42SFS')] },
    { id: `${P}019`, title: 'realestate.az - əmlak domen', body: 'realestate.az keyword domen, əmlak saytı üçün SEO üstünlüyü.', price: 950, cat: '01KJB9Q9YXHVMFDQ', filters: [f('01KJB9Q9YXJJAB1K', '01KJB9Q9YXJHTHAS'), f('01KJB9Q9YXY5DHNT', '01KJB9Q9YX47TQCD')] },
    { id: `${P}020`, title: 'shop.az - e-ticarət domen', body: 'shop.az ultra premium domen, e-ticarət bazarı üçün ən güclü brend.', price: 8500, cat: '01KJB9Q9YXHVMFDQ', filters: [f('01KJB9Q9YXJJAB1K', '01KJB9Q9YXJHTHAS'), f('01KJB9Q9YXY5DHNT', '01KJB9Q9YXHA47WD')] },
    { id: `${P}021`, title: 'beauty.com.az - gözəllik domen', body: 'beauty.com.az .com.az domen, gözəllik mərkəzi üçün ideal.', price: 280, cat: '01KJB9Q9YXHVMFDQ', filters: [f('01KJB9Q9YXJJAB1K', '01KJB9Q9YXJHTHAS'), f('01KJB9Q9YXY5DHNT', '01KJB9Q9YXM42SFS')] },

    // Ready websites
    { id: `${P}022`, title: 'Hazır Ərzaq çatdırılma saytı', body: 'Ərzaq çatdırılma həlli: Next.js + Supabase. Aktiv gəlir, 200+ sifariş/ay.', price: 3500, cat: '01KJB9Q9YXTHGT44', filters: [f('01KJB9Q9YXD483BE', '01KJB9Q9YXZJG3GJ'), f('01KJB9Q9YX9E9CA6', '01KJB9Q9YX8BZHSG')] },
    { id: `${P}023`, title: 'Hazır Bloq saytı - WordPress', body: 'WordPress bloq saytı, SEO optimallaşdırılmış, 5K/ay ziyarətçi. Gəlir yox.', price: 450, cat: '01KJB9Q9YXTHGT44', filters: [f('01KJB9Q9YXD483BE', '01KJB9Q9YXS75P0S'), f('01KJB9Q9YX9E9CA6', '01KJB9Q9YX8CA0HM')] },
    { id: `${P}024`, title: 'Mobil Tətbiq - Fitness Tracker', body: 'React Native fitness tətbiqi iOS+Android, 500+ istifadəçi, satış üçün.', price: 1800, cat: '01KJB9Q9YXTHGT44', filters: [f('01KJB9Q9YXD483BE', '01KJB9Q9YXCD9YQB'), f('01KJB9Q9YX9E9CA6', '01KJB9Q9YX8BZHSG')] },
    { id: `${P}025`, title: 'Hazır Online Mağaza Geyim', body: 'Shopify geyim mağazası, 150+ məhsul, aktiv müştəri bazası, transfer hazır.', price: 2200, cat: '01KJB9Q9YXTHGT44', filters: [f('01KJB9Q9YXD483BE', '01KJB9Q9YXZJG3GJ'), f('01KJB9Q9YX9E9CA6', '01KJB9Q9YX8BZHSG')] },

    // Gaming accounts
    { id: `${P}026`, title: 'CS2 Prime Hesab - Global Elite', body: 'CS2 Prime hesab, Global Elite rank, 3000+ saat, nadir dərili + karakullar.', price: 180, cat: '01KJB9Q9YYW4YNM6', filters: [f('01KJB9Q9YYRJM45J', '01KJB9Q9YYQ0SDAN')] },
    { id: `${P}027`, title: 'Valorant Hesab - Radiant Rank', body: 'Valorant Radiant hesab, agent kolleksiyası tam, EP7 skins.', price: 350, cat: '01KJB9Q9YYW4YNM6', filters: [f('01KJB9Q9YYRJM45J', '01KJB9Q9YY77R3HG')] },
    { id: `${P}028`, title: 'PS5 Hesab - 50+ Oyun Kitabxanası', body: 'PlayStation 5 hesabı, 50+ oyun (GTA6, Spider-Man 2, God of War), Premium.', price: 420, cat: '01KJB9Q9YYW4YNM6', filters: [f('01KJB9Q9YYRJM45J', '01KJB9Q9YYSTTTRS')] },
    { id: `${P}029`, title: 'Clash of Clans - Town Hall 16 Maxed', body: 'CoC Town Hall 16 max, 5+ yıldız hero, 10+ yıl hesab, mobil.', price: 95, cat: '01KJB9Q9YYW4YNM6', filters: [f('01KJB9Q9YYRJM45J', '01KJB9Q9YY5W6FRK')] },
    { id: `${P}030`, title: 'Instagram 50K Follower Az Hesabı', body: 'Azərbaycanlı müşteri bazası 50K follower. Gözəllik niş. Aktiv engaged.', price: 750, cat: '01KJB9Q9YYW4YNM6', filters: [f('01KJB9Q9YYRJM45J', '01KJB9Q9YYNGVS3J')] },
];

async function main() {
    console.log('💻 Seeding Digital & Registration (30)...');
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
    console.log(`✅ Done: ${ok}/30 Digital & Registration cards.`);
    process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
