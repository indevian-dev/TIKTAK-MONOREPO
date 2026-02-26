/**
 * Seed 30 cards: Geyim və Aksesuarlar (Clothing & Accessories)
 * Parent: 01KJB9Q9Y8JAG5H3
 * Run: bun run scripts/seed-cards-geyim.ts
 */
import { db } from '../lib/database';
import { sql } from 'drizzle-orm';

const WS = 'SEED_STORE_001', ACC = '01KJ7KW0AZDSJD7A', P = 'SEED2_CL_', PARENT = '01KJB9Q9Y8JAG5H3';
const IMGS = ['womens-fashion.jpg', 'mens-jacket.jpg', 'sneakers-nike.jpg', 'leather-bag.jpg', 'wristwatch.jpg'];
const img = (i: number, n = 3) => Array.from({ length: n }, (_, j) => IMGS[(i + j) % IMGS.length]);
const loc = (i: number) => [{ lat: 40.4093, lng: 49.8671 }, { lat: 40.4219, lng: 49.8530 }, { lat: 40.3790, lng: 49.8490 }, { lat: 40.4350, lng: 49.8750 }, { lat: 40.4150, lng: 49.9020 }][i % 5];
const f = (og: string, o: string) => ({ type: 'STATIC', option_id: o, option_group_id: og });

// Women's clothing 01KJB9Q9Y8JVSZB6: Size=01KJB9Q9Y852F3TX M=01KJB9Q9Y9DY4RGJ L=01KJB9Q9Y96GE69T XL=01KJB9Q9Y9PQ1NP6
// Type=01KJB9Q9Y98FXYPW: Dress=01KJB9Q9Y9P6ETNR Outerwear=01KJB9Q9Y9RAX5QF Pants=01KJB9Q9Y944E4VC Sport=01KJB9Q9Y9J1B8G8
// Season=01KJB9Q9Y9A5WMWE: Summer=01KJB9Q9Y99VPFC8 Winter=01KJB9Q9Y9TJJP9P AllSeason=01KJB9Q9Y93P796K
// Men's clothing 01KJB9Q9Y933X6D1: Size=01KJB9Q9Y9ABF4R2 L=01KJB9Q9Y9YYPHN6 XL=01KJB9Q9Y9MV12AM
// Type=01KJB9Q9Y9S0X0BC: Shirt=01KJB9Q9Y962GNR3 Pants=01KJB9Q9Y9PCRQGT Suit=01KJB9Q9Y9712WPQ Sport=01KJB9Q9Y977AWXK
// Bags 01KJB9Q9YAKK9R0Q: Gender=01KJB9Q9YACK29E0 Women=01KJB9Q9YA15WEF5 Men=01KJB9Q9YAJ1V69P  Unisex=01KJB9Q9YAQKFTN2
// Type=01KJB9Q9YAKNP1JP: Suitcase=01KJB9Q9YABVWARS Backpack=01KJB9Q9YAYFHRHC Handbag=01KJB9Q9YAF19P22
// Watches 01KJB9Q9YAQA4Z6X: Brand=01KJB9Q9YAESFDR6 Casio=01KJB9Q9YAMR1PM6 Tissot=01KJB9Q9YAR2CN17 Rolex=01KJB9Q9YAF0ZYP9
// Condition (parent): 01KJB9Q9Y8TJNABW New=01KJB9Q9Y8T7MP6H Used=01KJB9Q9Y8V25KYF

const CARDS = [
    // Women's (10)
    { id: `${P}001`, title: 'Zara Qadın Paltosu - L Beden', body: 'Zara camel rəngli uzun palto, L beden, qış, yeni etiketi var.', price: 180, cat: '01KJB9Q9Y8JVSZB6', filters: [f('01KJB9Q9Y852F3TX', '01KJB9Q9Y96GE69T'), f('01KJB9Q9Y98FXYPW', '01KJB9Q9Y9RAX5QF'), f('01KJB9Q9Y9A5WMWE', '01KJB9Q9Y9TJJP9P'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}002`, title: 'H&M Qadın Yay Donu - M Beden', body: 'H&M floral don, M beden, yay, açıq göy, bir dəfə geyinilib.', price: 35, cat: '01KJB9Q9Y8JVSZB6', filters: [f('01KJB9Q9Y852F3TX', '01KJB9Q9Y9DY4RGJ'), f('01KJB9Q9Y98FXYPW', '01KJB9Q9Y9P6ETNR'), f('01KJB9Q9Y9A5WMWE', '01KJB9Q9Y99VPFC8'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8V25KYF')] },
    { id: `${P}003`, title: 'Nike Qadın Training Dəsti', body: 'Nike Dri-FIT qadın idman dəsti, XL beden, qara, yeni.', price: 125, cat: '01KJB9Q9Y8JVSZB6', filters: [f('01KJB9Q9Y852F3TX', '01KJB9Q9Y9PQ1NP6'), f('01KJB9Q9Y98FXYPW', '01KJB9Q9Y9J1B8G8'), f('01KJB9Q9Y9A5WMWE', '01KJB9Q9Y93P796K'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}004`, title: 'Massimo Dutti Kostyum - S Beden', body: 'Massimo Dutti bej cins kostyumu, S beden, yeni.', price: 220, cat: '01KJB9Q9Y8JVSZB6', filters: [f('01KJB9Q9Y852F3TX', '01KJB9Q9Y9E2NNGG'), f('01KJB9Q9Y98FXYPW', '01KJB9Q9Y9RAX5QF'), f('01KJB9Q9Y9A5WMWE', '01KJB9Q9Y93P796K'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}005`, title: 'Mango Bluze - M Beden', body: 'Mango ağ ipək bluze, M beden, yay, yeni.', price: 65, cat: '01KJB9Q9Y8JVSZB6', filters: [f('01KJB9Q9Y852F3TX', '01KJB9Q9Y9DY4RGJ'), f('01KJB9Q9Y98FXYPW', '01KJB9Q9Y9DTHFG2'), f('01KJB9Q9Y9A5WMWE', '01KJB9Q9Y99VPFC8'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}006`, title: 'Levi\'s 711 Cins Şalvar - L', body: 'Levi\'s 711 skinny cins, L beden, koyu mavi, yeni.', price: 95, cat: '01KJB9Q9Y8JVSZB6', filters: [f('01KJB9Q9Y852F3TX', '01KJB9Q9Y96GE69T'), f('01KJB9Q9Y98FXYPW', '01KJB9Q9Y944E4VC'), f('01KJB9Q9Y9A5WMWE', '01KJB9Q9Y93P796K'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8V25KYF')] },
    { id: `${P}007`, title: 'Adidas Originals Üst Geyim - XL', body: 'Adidas Originals qadın track ceket, XL, qırmızı, yeni.', price: 110, cat: '01KJB9Q9Y8JVSZB6', filters: [f('01KJB9Q9Y852F3TX', '01KJB9Q9Y9PQ1NP6'), f('01KJB9Q9Y98FXYPW', '01KJB9Q9Y9RAX5QF'), f('01KJB9Q9Y9A5WMWE', '01KJB9Q9Y93P796K'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}008`, title: 'Calvin Klein Kombinezon - S', body: 'Calvin Klein slip kombinezon, S beden, bej, yeni, teg var.', price: 140, cat: '01KJB9Q9Y8JVSZB6', filters: [f('01KJB9Q9Y852F3TX', '01KJB9Q9Y9E2NNGG'), f('01KJB9Q9Y98FXYPW', '01KJB9Q9Y9FEYBZK'), f('01KJB9Q9Y9A5WMWE', '01KJB9Q9Y99VPFC8'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}009`, title: 'Zara Qış Paltarı - Mavi - L', body: 'Zara kobalt mavi paltar, L beden, polyester, uzun yengli, yeni.', price: 75, cat: '01KJB9Q9Y8JVSZB6', filters: [f('01KJB9Q9Y852F3TX', '01KJB9Q9Y96GE69T'), f('01KJB9Q9Y98FXYPW', '01KJB9Q9Y9P6ETNR'), f('01KJB9Q9Y9A5WMWE', '01KJB9Q9Y9TJJP9P'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}010`, title: 'Pijama Dəsti - İpək - M', body: 'İpək qadın pijama dəsti, M beden, çəhrayı, yeni.', price: 85, cat: '01KJB9Q9Y8JVSZB6', filters: [f('01KJB9Q9Y852F3TX', '01KJB9Q9Y9DY4RGJ'), f('01KJB9Q9Y98FXYPW', '01KJB9Q9Y9RQ06WS'), f('01KJB9Q9Y9A5WMWE', '01KJB9Q9Y93P796K'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    // Men's (10)
    { id: `${P}011`, title: 'Hugo Boss Kişi Kostyumu - XL', body: 'Hugo Boss slim fit kostyum, XL, tünd mavi, yeni.', price: 980, cat: '01KJB9Q9Y933X6D1', filters: [f('01KJB9Q9Y9ABF4R2', '01KJB9Q9Y9MV12AM'), f('01KJB9Q9Y9S0X0BC', '01KJB9Q9Y9712WPQ'), f('01KJB9Q9Y9CHZ43K', '01KJB9Q9Y93P796K'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}012`, title: 'Nike Air Max 270 Kişi Krossovkası', body: 'Nike Air Max 270, 43 beden, qara/ağ, yeni qutu, yeni.', price: 185, cat: '01KJB9Q9Y94WJRP0', filters: [f('01KJB9Q9Y9TXNGXH', '01KJB9Q9Y9R0DB8V'), f('01KJB9Q9Y9NPWTHH', '01KJB9Q9Y9V1SN7E'), f('01KJB9Q9Y9Z551VC', '01KJB9Q9Y9MW853Y'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}013`, title: 'Levi\'s 501 Original Cins - L', body: 'Levi\'s 501 kişi cins, L beden, stone wash, yeni.', price: 110, cat: '01KJB9Q9Y933X6D1', filters: [f('01KJB9Q9Y9ABF4R2', '01KJB9Q9Y9YYPHN6'), f('01KJB9Q9Y9S0X0BC', '01KJB9Q9Y9PCRQGT'), f('01KJB9Q9Y9CHZ43K', '01KJB9Q9Y93P796K'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}014`, title: 'Adidas Tiro Track Kişi Dəsti - L', body: 'Adidas Tiro 23 idman dəsti, L, qara, polyester, yeni.', price: 89, cat: '01KJB9Q9Y933X6D1', filters: [f('01KJB9Q9Y9ABF4R2', '01KJB9Q9Y9YYPHN6'), f('01KJB9Q9Y9S0X0BC', '01KJB9Q9Y977AWXK'), f('01KJB9Q9Y9CHZ43K', '01KJB9Q9Y93P796K'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}015`, title: 'Tommy Hilfiger Kişi Köynəyi - M', body: 'Tommy Hilfiger slim fit köynəyi, M, ağ, yeni.', price: 95, cat: '01KJB9Q9Y933X6D1', filters: [f('01KJB9Q9Y9ABF4R2', '01KJB9Q9Y95V1TH6'), f('01KJB9Q9Y9S0X0BC', '01KJB9Q9Y962GNR3'), f('01KJB9Q9Y9CHZ43K', '01KJB9Q9Y93P796K'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}016`, title: 'Versace Kişi Kəmər - Dəri', body: 'Versace dəri kəmər, qara, 95sm, İtaliya istehsalı, yeni.', price: 320, cat: '01KJB9Q9YAQGR057', filters: [f('01KJB9Q9YAJ5RT5X', '01KJB9Q9YA60S3EP'), f('01KJB9Q9YABK6MH8', '01KJB9Q9YAWH7YRC'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}017`, title: 'Ecco Kişi Çəkməsi - 43 Beden', body: 'Ecco Vitrus kişi dəri çəkməsi, 43 beden, qəhvəyi, yeni.', price: 280, cat: '01KJB9Q9Y94WJRP0', filters: [f('01KJB9Q9Y9TXNGXH', '01KJB9Q9Y9R0DB8V'), f('01KJB9Q9Y9NPWTHH', '01KJB9Q9Y9QQ33AF'), f('01KJB9Q9Y9Z551VC', '01KJB9Q9Y96F7NPV'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}018`, title: 'North Face Kişi Jacketı - XXL', body: 'North Face 1996 Nuptse giletli jaket, XXL, qara, yeni.', price: 450, cat: '01KJB9Q9Y933X6D1', filters: [f('01KJB9Q9Y9ABF4R2', '01KJB9Q9Y9Z0GKAC'), f('01KJB9Q9Y9S0X0BC', '01KJB9Q9Y9JWR2RF'), f('01KJB9Q9Y9CHZ43K', '01KJB9Q9Y9SEHQXA'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8V25KYF')] },
    { id: `${P}019`, title: 'Ralph Lauren Polo Köynək - XL', body: 'Ralph Lauren polo, XL, lacivert, pambıq, yeni.', price: 160, cat: '01KJB9Q9Y933X6D1', filters: [f('01KJB9Q9Y9ABF4R2', '01KJB9Q9Y9MV12AM'), f('01KJB9Q9Y9S0X0BC', '01KJB9Q9Y962GNR3'), f('01KJB9Q9Y9CHZ43K', '01KJB9Q9Y99VPFC8'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}020`, title: 'G-Star Kişi Pijama Dəsti - L', body: 'G-Star pijama, L beden, tünd mavi, pambıq, yeni.', price: 75, cat: '01KJB9Q9Y933X6D1', filters: [f('01KJB9Q9Y9ABF4R2', '01KJB9Q9Y9YYPHN6'), f('01KJB9Q9Y9S0X0BC', '01KJB9Q9Y925S1RW'), f('01KJB9Q9Y9CHZ43K', '01KJB9Q9Y93P796K'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    // Bags & Watches (10)
    { id: `${P}021`, title: 'Michael Kors Qadın Çantası', body: 'Michael Kors Jet Set Travel qadın çantası, qəhvəyi dəri, yeni.', price: 399, cat: '01KJB9Q9YAKK9R0Q', filters: [f('01KJB9Q9YACK29E0', '01KJB9Q9YA15WEF5'), f('01KJB9Q9YAKNP1JP', '01KJB9Q9YAF19P22'), f('01KJB9Q9YAN2GD6A', '01KJB9Q9YAHEXDWC'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}022`, title: 'Samsonite S\'Cure Çamadan - L', body: 'Samsonite S\'Cure çamadan, L beden, qara, spinner, yeni.', price: 350, cat: '01KJB9Q9YAKK9R0Q', filters: [f('01KJB9Q9YACK29E0', '01KJB9Q9YAQKFTN2'), f('01KJB9Q9YAKNP1JP', '01KJB9Q9YABVWARS'), f('01KJB9Q9YAN2GD6A', '01KJB9Q9YA5B4AZ6'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}023`, title: 'Nike Hava Jordan Kürək Çantası', body: 'Nike Air Jordan backpack, 30L, qara/qırmızı, yeni.', price: 89, cat: '01KJB9Q9YAKK9R0Q', filters: [f('01KJB9Q9YACK29E0', '01KJB9Q9YAQKFTN2'), f('01KJB9Q9YAKNP1JP', '01KJB9Q9YAYFHRHC'), f('01KJB9Q9YAN2GD6A', '01KJB9Q9YAM9T1HG'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}024`, title: 'Tissot PRX Kişi Saatı', body: 'Tissot PRX, kvars, paslanmaz polad, 40mm, gümüşü dial, yeni.', price: 680, cat: '01KJB9Q9YAQA4Z6X', filters: [f('01KJB9Q9YA5SNGXE', '01KJB9Q9YA93Z6P8'), f('01KJB9Q9YAG37XK1', '01KJB9Q9YA94RKJ7'), f('01KJB9Q9YAESFDR6', '01KJB9Q9YAR2CN17'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}025`, title: 'Casio G-Shock GA-2100', body: 'Casio G-Shock GA-2100, karbon çekirdək, qara, yeni.', price: 185, cat: '01KJB9Q9YAQA4Z6X', filters: [f('01KJB9Q9YA5SNGXE', '01KJB9Q9YAQKFTN2'), f('01KJB9Q9YAG37XK1', '01KJB9Q9YA94RKJ7'), f('01KJB9Q9YAESFDR6', '01KJB9Q9YAMR1PM6'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}026`, title: 'Seiko Presage Avtomatik', body: 'Seiko Presage SPB167J1, avtomatik, cocktail seriyası, yeni.', price: 950, cat: '01KJB9Q9YAQA4Z6X', filters: [f('01KJB9Q9YA5SNGXE', '01KJB9Q9YA93Z6P8'), f('01KJB9Q9YAG37XK1', '01KJB9Q9YAW8XJ9D'), f('01KJB9Q9YAESFDR6', '01KJB9Q9YAPZKWFD'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}027`, title: 'Gucci Marmont Mini Çanta', body: 'Gucci Marmont mini çanta, GG quilted, qırmızı dəri, işlənmiş.', price: 1200, cat: '01KJB9Q9YAKK9R0Q', filters: [f('01KJB9Q9YACK29E0', '01KJB9Q9YA15WEF5'), f('01KJB9Q9YAKNP1JP', '01KJB9Q9YAF19P22'), f('01KJB9Q9YAN2GD6A', '01KJB9Q9YAHEXDWC'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8V25KYF')] },
    { id: `${P}028`, title: 'Citizen Eco-Drive Qadın Saatı', body: 'Citizen Eco-Drive, qadın, gümüşü, 32mm, solar şarjlı, yeni.', price: 320, cat: '01KJB9Q9YAQA4Z6X', filters: [f('01KJB9Q9YA5SNGXE', '01KJB9Q9YAVTQKME'), f('01KJB9Q9YAG37XK1', '01KJB9Q9YA94RKJ7'), f('01KJB9Q9YAESFDR6', '01KJB9Q9YA2WZXY8'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8T7MP6H')] },
    { id: `${P}029`, title: 'Louis Vuitton Keepall 45', body: 'LV Keepall 45, Monogram canvas, qəhvəyi, işlənmiş.', price: 2200, cat: '01KJB9Q9YAKK9R0Q', filters: [f('01KJB9Q9YACK29E0', '01KJB9Q9YAQKFTN2'), f('01KJB9Q9YAKNP1JP', '01KJB9Q9YABVWARS'), f('01KJB9Q9YAN2GD6A', '01KJB9Q9YAHEXDWC'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8V25KYF')] },
    { id: `${P}030`, title: 'Rolex Submariner Date', body: 'Rolex Submariner Date, 41mm, qara dial, oyster bracelet, işlənmiş.', price: 18500, cat: '01KJB9Q9YAQA4Z6X', filters: [f('01KJB9Q9YA5SNGXE', '01KJB9Q9YA93Z6P8'), f('01KJB9Q9YAG37XK1', '01KJB9Q9YA0PPT9P'), f('01KJB9Q9YAESFDR6', '01KJB9Q9YAF0ZYP9'), f('01KJB9Q9Y8TJNABW', '01KJB9Q9Y8V25KYF')] },
];

async function main() {
    console.log('👗 Seeding Clothing & Accessories (30)...');
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
    console.log(`✅ Done: ${ok}/30 Clothing cards.`);
    process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
