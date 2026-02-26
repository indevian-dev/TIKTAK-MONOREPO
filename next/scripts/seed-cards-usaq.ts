/**
 * Seed 30 cards: Uşaq aləmi (Kids & Baby)
 * Parent: 01KJB9Q9YBEM65B5
 * Run: bun run scripts/seed-cards-usaq.ts
 */
import { db } from '../lib/database';
import { sql } from 'drizzle-orm';

const WS = 'SEED_STORE_001', ACC = '01KJ7KW0AZDSJD7A', P = 'SEED2_KD_', PARENT = '01KJB9Q9YBEM65B5';
// Aliases for backwards compatibility with card data using ${PREFIX} and ${ACCOUNT_ID}
const PREFIX = P, ACCOUNT_ID = ACC;
const IMGS = ['baby-stroller.jpg', 'kids-toys.jpg', 'kids-clothing.jpg', 'baby-bed.jpg'];
const img = (i: number, n = 3) => Array.from({ length: n }, (_, j) => IMGS[(i + j) % IMGS.length]);
const loc = (i: number) => [{ lat: 40.4093, lng: 49.8671 }, { lat: 40.4219, lng: 49.8530 }, { lat: 40.3790, lng: 49.8490 }, { lat: 40.4350, lng: 49.8750 }, { lat: 40.4150, lng: 49.9020 }][i % 5];
const f = (og: string, o: string) => ({ type: 'STATIC', option_id: o, option_group_id: og });

// Clothing 01KJB9Q9YCAJ9T52: Age=01KJB9Q9YC4P4XXX, Season=01KJB9Q9YCH3W5ET
// Shoes 01KJB9Q9YCRFF024: ShoeSize=01KJB9Q9YCND5MNJ, Type=01KJB9Q9YC4N46VZ
// Furniture 01KJB9Q9YCJZRGX8: Type=01KJB9Q9YC9HZ3QS, AgeGroup=01KJB9Q9YCMMEFJK
// Toys 01KJB9Q9YC159KJ6: Age=01KJB9Q9YCTK1C1M, Type=01KJB9Q9YCSAEMVQ
// Strollers 01KJB9Q9YCA9SYB0: Type=01KJB9Q9YCV6T71F, AgeGroup=01KJB9Q9YC3SPQ5C
// Feeding 01KJB9Q9YCHT8MS3: Type=01KJB9Q9YCAZ42ER
// Cribs 01KJB9Q9YCPWSNFE: Type=01KJB9Q9YC25PQAP
// Condition(parent): 01KJB9Q9YCRFE08D New=01KJB9Q9YCKD5M04 Used=01KJB9Q9YCPFPWVT

const CARDS = [
    // Strollers (10)
    { id: `${PREFIX}001`, title: 'Bugaboo Fox 5 Universal Araba', body: 'Bugaboo Fox 5, universal, naviqasiya ilə, mavi, 0-4 yaş, yeni.', price: 2200, cat: '01KJB9Q9YCA9SYB0', filters: [f('01KJB9Q9YCV6T71F', '01KJB9Q9YCDE4W0R'), f('01KJB9Q9YC3SPQ5C', '01KJB9Q9YC4FPFFM'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}002`, title: 'Cybex Priam 4 Yüngül Araba', body: 'Cybex Priam 4, yüngül, tam dönən təkər, qara, yeni.', price: 1450, cat: '01KJB9Q9YCA9SYB0', filters: [f('01KJB9Q9YCV6T71F', '01KJB9Q9YCFRNC7P'), f('01KJB9Q9YC3SPQ5C', '01KJB9Q9YC4FPFFM'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}003`, title: 'Maxi-Cosi Pebble 360 Plus Avto Oturacaq', body: 'Maxi-Cosi Pebble 360 Plus, 360 dönən, 0-18 kq, yeni.', price: 850, cat: '01KJB9Q9YCA9SYB0', filters: [f('01KJB9Q9YCV6T71F', '01KJB9Q9YC3GBF00'), f('01KJB9Q9YC3SPQ5C', '01KJB9Q9YC4FPFFM'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}004`, title: 'Chicco Next2Me Magic Manej', body: 'Chicco Next2Me Magic, ana yanı beşik-manej, 0-9 ay, ağ.', price: 480, cat: '01KJB9Q9YCA9SYB0', filters: [f('01KJB9Q9YCV6T71F', '01KJB9Q9YCBQSP61'), f('01KJB9Q9YC3SPQ5C', '01KJB9Q9YCC067BV'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}005`, title: 'Stokke Xplory X - Lüks Araba', body: 'Stokke Xplory X, tənzimlənən hündürlük, topaz blue, 0-4 yaş.', price: 3200, cat: '01KJB9Q9YCA9SYB0', filters: [f('01KJB9Q9YCV6T71F', '01KJB9Q9YCDE4W0R'), f('01KJB9Q9YC3SPQ5C', '01KJB9Q9YC4FPFFM'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}006`, title: 'Universal Araba - Mimas Plus', body: 'Mimas Plus 2in1, küvet+oturacaq, boz, 0-3 yaş, işlənmiş.', price: 350, cat: '01KJB9Q9YCA9SYB0', filters: [f('01KJB9Q9YCV6T71F', '01KJB9Q9YCDE4W0R'), f('01KJB9Q9YC3SPQ5C', '01KJB9Q9YC4FPFFM'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCPFPWVT')] },
    { id: `${PREFIX}007`, title: 'Kinderkraft Avto Oturacaq XRIDER', body: 'KinderKraft Xrider i-Size, 9-18 kq, boz, yeni.', price: 399, cat: '01KJB9Q9YCA9SYB0', filters: [f('01KJB9Q9YCV6T71F', '01KJB9Q9YC3GBF00'), f('01KJB9Q9YC3SPQ5C', '01KJB9Q9YCY6EHW4'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}008`, title: 'Joie Nitro LX Yüngül Araba', body: 'Joie Nitro LX, 6 ay+, 13 kq yük tutumu, qırmızı, yeni.', price: 249, cat: '01KJB9Q9YCA9SYB0', filters: [f('01KJB9Q9YCV6T71F', '01KJB9Q9YCFRNC7P'), f('01KJB9Q9YC3SPQ5C', '01KJB9Q9YCY6EHW4'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}009`, title: 'Xodunok 3in1', body: 'Multifunksiyalı xodunok, musiqi, stul, araba, ağ, 6-18 ay.', price: 89, cat: '01KJB9Q9YCA9SYB0', filters: [f('01KJB9Q9YCV6T71F', '01KJB9Q9YCGXT8WJ'), f('01KJB9Q9YC3SPQ5C', '01KJB9Q9YCC067BV'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}010`, title: 'Booster Oturacaq Britax Römer', body: 'Britax Römer Kidfix M i-Size, 3-12 yaş, qara.', price: 349, cat: '01KJB9Q9YCA9SYB0', filters: [f('01KJB9Q9YCV6T71F', '01KJB9Q9YCRTG887'), f('01KJB9Q9YC3SPQ5C', '01KJB9Q9YC2DSW50'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    // Toys (10)
    { id: `${PREFIX}011`, title: 'LEGO Technic Bugatti Chiron', body: 'LEGO Technic 42083 Bugatti Chiron, 3599 hissə, 14+ yaş.', price: 399, cat: '01KJB9Q9YC159KJ6', filters: [f('01KJB9Q9YCTK1C1M', '01KJB9Q9YCXR9QA6'), f('01KJB9Q9YCSAEMVQ', '01KJB9Q9YC3NT4WH'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}012`, title: 'Barbie Dreamhouse 3-Mərtəbəli', body: 'Barbie Dreamhouse, 3 mərtəbə, 75+ parça, qız uşaqları üçün.', price: 179, cat: '01KJB9Q9YC159KJ6', filters: [f('01KJB9Q9YCTK1C1M', '01KJB9Q9YC68SD89'), f('01KJB9Q9YCSAEMVQ', '01KJB9Q9YCQQ7F3F'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}013`, title: 'Hot Wheels Ultimate Garage', body: 'Hot Wheels Ultimate Garage, 4 mərtəbəli, 2 lift, 140+ araba sığır.', price: 149, cat: '01KJB9Q9YC159KJ6', filters: [f('01KJB9Q9YCTK1C1M', '01KJB9Q9YC68SD89'), f('01KJB9Q9YCSAEMVQ', '01KJB9Q9YCQ9G9BE'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}014`, title: 'Catan Stolüstü Oyunu', body: 'Catan board game, 10+ yaş, 3-4 oyunçu, Azərbaycan dilindədir.', price: 59, cat: '01KJB9Q9YC159KJ6', filters: [f('01KJB9Q9YCTK1C1M', '01KJB9Q9YCXR9QA6'), f('01KJB9Q9YCSAEMVQ', '01KJB9Q9YC8JDYSM'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}015`, title: 'RC Dron - DJI Mini 4 Pro', body: 'DJI Mini 4 Pro, 4K video, obstacle avoidance, 34 dəq uçuş.', price: 899, cat: '01KJB9Q9YC159KJ6', filters: [f('01KJB9Q9YCTK1C1M', '01KJB9Q9YCXR9QA6'), f('01KJB9Q9YCSAEMVQ', '01KJB9Q9YCQ9G9BE'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}016`, title: 'Yumşaq Oyuncaq - Steiff Ayı', body: 'Steiff Teddy Bear, 35cm, mohair, kollektor versiyası.', price: 120, cat: '01KJB9Q9YC159KJ6', filters: [f('01KJB9Q9YCTK1C1M', '01KJB9Q9YC8GJB7P'), f('01KJB9Q9YCSAEMVQ', '01KJB9Q9YCYM1FZ6'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}017`, title: 'Puzzle 1000 Parça - Van Gogh', body: 'Ravensburger 1000 parça puzzle, Van Gogh Starry Night, 12+.', price: 35, cat: '01KJB9Q9YC159KJ6', filters: [f('01KJB9Q9YCTK1C1M', '01KJB9Q9YCXR9QA6'), f('01KJB9Q9YCSAEMVQ', '01KJB9Q9YCP6T2ZT'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}018`, title: 'LEGO City Police Station', body: 'LEGO City 60316, Polis Stansiyası, 668 parça, 6-12 yaş.', price: 89, cat: '01KJB9Q9YC159KJ6', filters: [f('01KJB9Q9YCTK1C1M', '01KJB9Q9YCKZW328'), f('01KJB9Q9YCSAEMVQ', '01KJB9Q9YC3NT4WH'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}019`, title: 'Baby Einstein Ocean Oyuncağı', body: 'Baby Einstein çırpışdırma halqaları, 3+ ay, BPA-free.', price: 29, cat: '01KJB9Q9YC159KJ6', filters: [f('01KJB9Q9YCTK1C1M', '01KJB9Q9YC8GJB7P'), f('01KJB9Q9YCSAEMVQ', '01KJB9Q9YCYM1FZ6'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}020`, title: 'Playmobil Pirat Gəmisi', body: 'Playmobil Pirat Gəmisi, 4 fiqur daxil, 4-10 yaş.', price: 69, cat: '01KJB9Q9YC159KJ6', filters: [f('01KJB9Q9YCTK1C1M', '01KJB9Q9YC68SD89'), f('01KJB9Q9YCSAEMVQ', '01KJB9Q9YCQ9G9BE'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    // Kids clothing & furniture (10)
    { id: `${PREFIX}021`, title: 'Uşaq qış geyim dəsti 2-4 yaş', body: 'Uşaq qış dəsti, jaket+şalvar+papaq, su keçirməz, boz.', price: 89, cat: '01KJB9Q9YCAJ9T52', filters: [f('01KJB9Q9YC4P4XXX', '01KJB9Q9YC2XSJMX'), f('01KJB9Q9YCH3W5ET', '01KJB9Q9YC040XEJ'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}022`, title: 'Uşaq yay pijaması 6-10 yaş', body: '100% pambıq yay pijama dəsti, dinozavr naxışlı, açıq mavi.', price: 25, cat: '01KJB9Q9YCAJ9T52', filters: [f('01KJB9Q9YC4P4XXX', '01KJB9Q9YCH5ECNX'), f('01KJB9Q9YCH3W5ET', '01KJB9Q9YCRZ9WTM'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}023`, title: 'Uşaq çarpayısı + döşək', body: 'Uşaq çarpayısı, 70x140, tənzimlənən divar, ak., döşək daxil.', price: 450, cat: '01KJB9Q9YCJZRGX8', filters: [f('01KJB9Q9YC9HZ3QS', '01KJB9Q9YCA6W8SA'), f('01KJB9Q9YCMMEFJK', '01KJB9Q9YC0V84Y7'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}024`, title: 'Uşaq şkafı - Ikea STUVA', body: 'IKEA STUVA uşaq şkafı, ağ, 2 bölmə, 80x50x192cm.', price: 280, cat: '01KJB9Q9YCJZRGX8', filters: [f('01KJB9Q9YC9HZ3QS', '01KJB9Q9YCS0AYX3'), f('01KJB9Q9YCMMEFJK', '01KJB9Q9YCPHAE69'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCPFPWVT')] },
    { id: `${PREFIX}025`, title: 'Körpə oyanacaq dəsti 0-6 ay', body: '12 parçalı körpə geyim dəsti, 0-6 ay, organik pambıq, sarı.', price: 49, cat: '01KJB9Q9YCAJ9T52', filters: [f('01KJB9Q9YC4P4XXX', '01KJB9Q9YCA51QXS'), f('01KJB9Q9YCH3W5ET', '01KJB9Q9YCVSS0HY'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}026`, title: 'Uşaq yataq dəsti - Babyzula', body: 'Körpə yataq dəsti, yorğan+balış+çarşaf, zürafa naxışlı.', price: 75, cat: '01KJB9Q9YCPWSNFE', filters: [f('01KJB9Q9YC25PQAP', '01KJB9Q9YCDSMX3Y'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}027`, title: 'Uşaq beşiyi - Graco LX', body: 'Graco LX 4in1 beşik, tırıldadaq, sürücü, musiqi, 0-6 ay.', price: 320, cat: '01KJB9Q9YCPWSNFE', filters: [f('01KJB9Q9YC25PQAP', '01KJB9Q9YCSSP0QX'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}028`, title: 'Uşaq məktəb çantası - Nike', body: 'Nike uşaq məktəb çantası, su keçirməz, çox bölmə, 20L, qara.', price: 79, cat: '01KJB9Q9YCR0QE4M', filters: [f('01KJB9Q9YCM43733', '01KJB9Q9YC7GVJDX'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}029`, title: 'Bez dəsti - Pampers Premium', body: 'Pampers Premium 5 Beden, 82 ədəd, 11-16 kq, aloe vera.', price: 39, cat: '01KJB9Q9YCHT8MS3', filters: [f('01KJB9Q9YCAZ42ER', '01KJB9Q9YCF468AQ'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
    { id: `${PREFIX}030`, title: 'Körpə monitori - Infant Optics', body: 'Infant Optics DXR-8 Pro, 720p kamera, 2-tərəfli audio.', price: 189, cat: '01KJB9Q9YCHT8MS3', filters: [f('01KJB9Q9YCAZ42ER', '01KJB9Q9YCF468AQ'), f('01KJB9Q9YCRFE08D', '01KJB9Q9YCKD5M04')] },
];

async function main() {
    console.log('🧸 Seeding Kids & Baby cards (30)...');
    let ok = 0;
    for (let i = 0; i < CARDS.length; i++) {
        const card = CARDS[i];
        const images = img(i);
        try {
            await db.execute(sql`
        INSERT INTO cards (id,created_at,title,is_approved,price,body,account_id,location,images,cover,video,filters_options,categories,workspace_id)
        VALUES (${card.id},NOW(),${card.title},true,${card.price},${card.body},${ACCOUNT_ID},
          ${JSON.stringify(loc(i))}::json,${JSON.stringify(images)}::json,${images[0]},null,
          ${JSON.stringify(card.filters)}::jsonb,${JSON.stringify([PARENT, card.cat])}::jsonb,${WS})
        ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title,price=EXCLUDED.price,body=EXCLUDED.body,
          images=EXCLUDED.images,cover=EXCLUDED.cover,filters_options=EXCLUDED.filters_options,
          categories=EXCLUDED.categories,workspace_id=EXCLUDED.workspace_id,is_approved=true,updated_at=NOW()
      `);
            ok++;
        } catch (e: any) { console.error(`❌ ${card.id}:`, e.message); }
    }
    console.log(`✅ Done: ${ok}/30 Kids cards.`);
    process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
