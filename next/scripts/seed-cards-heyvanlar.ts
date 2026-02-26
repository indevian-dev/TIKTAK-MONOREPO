/**
 * Seed 30 cards: Heyvanlar (Animals)
 * Parent: 01KJB9Q9YMYSP6HS
 * Run: bun run scripts/seed-cards-heyvanlar.ts
 */
import { db } from '../lib/database';
import { sql } from 'drizzle-orm';

const WS = 'SEED_STORE_001', ACC = '01KJ7KW0AZDSJD7A', P = 'SEED2_AN_', PARENT = '01KJB9Q9YMYSP6HS';
const IMGS = ['golden-retriever.jpg', 'cat-persian.jpg', 'parrot-colorful.jpg', 'dog-puppy.jpg'];
const img = (i: number, n = 3) => Array.from({ length: n }, (_, j) => IMGS[(i + j) % IMGS.length]);
const loc = (i: number) => [{ lat: 40.4093, lng: 49.8671 }, { lat: 40.4219, lng: 49.8530 }, { lat: 40.3790, lng: 49.8490 }, { lat: 40.4350, lng: 49.8750 }, { lat: 40.4150, lng: 49.9020 }][i % 5];
const f = (og: string, o: string) => ({ type: 'STATIC', option_id: o, option_group_id: og });

// Parent: 01KJB9Q9YMYSP6HS Delivery=01KJB9Q9YMACSMGS Free=01KJB9Q9YMTXHEXV Paid=01KJB9Q9YMGT7TYT No=01KJB9Q9YMYCP4H3

// İtlər 01KJB9Q9YM8T7C3K: Age=01KJB9Q9YMK6AQ6V Puppy=01KJB9Q9YME3E3VY 6mo=01KJB9Q9YM9E5E2V 1-3=01KJB9Q9YMKMP8VM 3-7=01KJB9Q9YMZ0399Q 7+=01KJB9Q9YM8V75AJ
// Size=01KJB9Q9YMRDA28E Small=01KJB9Q9YMWWMEHB Medium=01KJB9Q9YM2FZ1JJ Large=01KJB9Q9YNTRR554

// Pişiklər 01KJB9Q9YNF6XMKE: Age=01KJB9Q9YNXDP45Y Kitten=01KJB9Q9YNB1DZVW 6mo=01KJB9Q9YN86QGV9 1-5=01KJB9Q9YNKJ7980 5+=01KJB9Q9YNWFTDT5

// Quşlar 01KJB9Q9YNV53C7P: Species=01KJB9Q9YNC667V1 Parrot=01KJB9Q9YNR6S0KE Canary=01KJB9Q9YNS9HJMM Pigeon=01KJB9Q9YNB5MGT7 Finch=01KJB9Q9YNB6X5NZ Eagle=01KJB9Q9YNSY0C07 Other=01KJB9Q9YN98YGKT

// Kənd heyvanlar 01KJB9Q9YNMH48P0: Species=01KJB9Q9YN35NQFT Cow=01KJB9Q9YN95WQHT Sheep=01KJB9Q9YN5VYSQY Pig=01KJB9Q9YNKDQREE Horse=01KJB9Q9YN9W9HCS Poultry=01KJB9Q9YNATXPYK Bee=01KJB9Q9YN3RRTTR

// Akvarium 01KJB9Q9YN4AKXZW: Type=01KJB9Q9YNKH2SS8 Fish=01KJB9Q9YN24EDF0 Plants=01KJB9Q9YN09XFX1 Tank=01KJB9Q9YNNY5VZ4 Filter=01KJB9Q9YNKCA329

// Sürünənlər 01KJB9Q9YNMPS1B0: Species=01KJB9Q9YNSR8VAX Lizard=01KJB9Q9YNRN1XBN Snake=01KJB9Q9YNK0NRSE Turtle=01KJB9Q9YN3EK788 Chameleon=01KJB9Q9YNMAVV3N Scorpion=01KJB9Q9YNBXSR1M Other=01KJB9Q9YNCHAY9X

// Heyvan qidası 01KJB9Q9YN2166F5: PetType=01KJB9Q9YNXWVYJN Dog=01KJB9Q9YN1PZG4E Cat=01KJB9Q9YN9XG96J Bird=01KJB9Q9YNSSEX6Y Fish=01KJB9Q9YNFGARET Other=01KJB9Q9YNKNFN6R
// Format=01KJB9Q9YNDAX6DS Dry=01KJB9Q9YN14SZW3 Wet=01KJB9Q9YNC1RBCG Natural=01KJB9Q9YNK8NV2N

// Aksesuar 01KJB9Q9YN2P6N85: PetType=01KJB9Q9YNHACDVY Dog=01KJB9Q9YNNZS6MR Cat=01KJB9Q9YNCPMFRG Bird=01KJB9Q9YNC09RSE Other=01KJB9Q9YNC3Z8NW
// Type=01KJB9Q9YNKBRWWF Carrier=01KJB9Q9YN00K38C Bed=01KJB9Q9YNW3D80K Leash=01KJB9Q9YNJD6B4C Toys=01KJB9Q9YN6GD1GK Grooming=01KJB9Q9YND7QYN6

// Baytarlıq 01KJB9Q9YNE479ST: PetType=01KJB9Q9YNJWFSV9 Dog=01KJB9Q9YNW8ZRSE Cat=01KJB9Q9YN4MMXG5 Bird=01KJB9Q9YNNPY3CS Other=01KJB9Q9YNBCMCYN
// Type=01KJB9Q9YNVVCY4E Anti=01KJB9Q9YNN9SWCN Vitamins=01KJB9Q9YNEG4T9R Vaccine=01KJB9Q9YNFHE321 Antibiotics=01KJB9Q9YN6090WR

const CARDS = [
    // İtlər - Dogs
    { id: `${P}001`, title: 'Golden Retriever balası - 2 aylıq', body: 'Cins Golden Retriever balası, 2 aylıq, peyvəndi vurulmuş, sənədi var.', price: 650, cat: '01KJB9Q9YM8T7C3K', filters: [f('01KJB9Q9YMK6AQ6V', '01KJB9Q9YME3E3VY'), f('01KJB9Q9YMRDA28E', '01KJB9Q9YNTRR554'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMTXHEXV')] },
    { id: `${P}002`, title: 'Malteze balası - 45 günlük', body: 'Cins Malteze balası, ağ, 45 günlük, ana yanında, peyvənd yoxdur hələ.', price: 350, cat: '01KJB9Q9YM8T7C3K', filters: [f('01KJB9Q9YMK6AQ6V', '01KJB9Q9YME3E3VY'), f('01KJB9Q9YMRDA28E', '01KJB9Q9YMWWMEHB'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMTXHEXV')] },
    { id: `${P}003`, title: 'Labrador 1.5 yaş - Evə uyğun', body: 'Labrador erkək, 1.5 yaş, kastrə olmayan, sakit xarakter, peyvəndli.', price: 450, cat: '01KJB9Q9YM8T7C3K', filters: [f('01KJB9Q9YMK6AQ6V', '01KJB9Q9YMKMP8VM'), f('01KJB9Q9YMRDA28E', '01KJB9Q9YNTRR554'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMTXHEXV')] },
    { id: `${P}004`, title: 'Yorkshire Terrier - 3 yaş dişi', body: 'Yorkshire Terrier dişi, 3 yaş, sənədli, qiyafəsi + güvə var.', price: 280, cat: '01KJB9Q9YM8T7C3K', filters: [f('01KJB9Q9YMK6AQ6V', '01KJB9Q9YMKMP8VM'), f('01KJB9Q9YMRDA28E', '01KJB9Q9YMWWMEHB'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMTXHEXV')] },
    { id: `${P}005`, title: 'Alman Çoban İti - 5 aylıq', body: 'Alman çoban iti balası, erkək, 5 aylıq, peyvəndli, sənədsiz.', price: 320, cat: '01KJB9Q9YM8T7C3K', filters: [f('01KJB9Q9YMK6AQ6V', '01KJB9Q9YM9E5E2V'), f('01KJB9Q9YMRDA28E', '01KJB9Q9YNTRR554'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMTXHEXV')] },
    { id: `${P}006`, title: 'Husky Sibirya 8 aylıq', body: 'Sibirya Husky, 8 aylıq, gözəl mavi gözlü, əla karakter, sağlam.', price: 550, cat: '01KJB9Q9YM8T7C3K', filters: [f('01KJB9Q9YMK6AQ6V', '01KJB9Q9YM9E5E2V'), f('01KJB9Q9YMRDA28E', '01KJB9Q9YNTRR554'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMYCP4H3')] },
    { id: `${P}007`, title: 'Fransız Buldoq balası 3 aylıq', body: 'Fransız Buldoq, 3 aylıq, cins əlamətlər, peyvənd + sənəd.', price: 900, cat: '01KJB9Q9YM8T7C3K', filters: [f('01KJB9Q9YMK6AQ6V', '01KJB9Q9YME3E3VY'), f('01KJB9Q9YMRDA28E', '01KJB9Q9YMWWMEHB'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMTXHEXV')] },
    { id: `${P}008`, title: 'Poodle Toy - 2 yaş dişi sənədli', body: 'Cins Toy Poodle aprikoz rəng, dişi, 2 yaş, FCI sənədli.', price: 750, cat: '01KJB9Q9YM8T7C3K', filters: [f('01KJB9Q9YMK6AQ6V', '01KJB9Q9YMKMP8VM'), f('01KJB9Q9YMRDA28E', '01KJB9Q9YMWWMEHB'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMTXHEXV')] },

    // Pişiklər - Cats
    { id: `${P}009`, title: 'Britaniya Qısatüklü balası 2 aylıq', body: 'Britaniya qısatüklüsü, boz-nilufər, 2 aylıq, sənədli, peyvəndli.', price: 280, cat: '01KJB9Q9YNF6XMKE', filters: [f('01KJB9Q9YNXDP45Y', '01KJB9Q9YNB1DZVW'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMTXHEXV')] },
    { id: `${P}010`, title: 'Scottishfold Pişiyi - 4 aylıq', body: 'Scottishfold cinsi, qulaqlar qatlanmış, narıncı, 4 aylıq.', price: 420, cat: '01KJB9Q9YNF6XMKE', filters: [f('01KJB9Q9YNXDP45Y', '01KJB9Q9YNB1DZVW'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMTXHEXV')] },
    { id: `${P}011`, title: 'Maine Coon 3 yaş erkək', body: 'Maine Coon erkək, 3 yaş, tabby rəng, 6kg, sağlam, kastrə edilmiş.', price: 350, cat: '01KJB9Q9YNF6XMKE', filters: [f('01KJB9Q9YNXDP45Y', '01KJB9Q9YNKJ7980'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMTXHEXV')] },
    { id: `${P}012`, title: 'Persiya pişiyi bala 45 günlük', body: 'Persiya pişiyi, ağ, 45 günlük, gözəl tüklər, sənədsiz. ', price: 190, cat: '01KJB9Q9YNF6XMKE', filters: [f('01KJB9Q9YNXDP45Y', '01KJB9Q9YNB1DZVW'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMYCP4H3')] },

    // Quşlar - Birds
    { id: `${P}013`, title: 'Aleksandr Tutuquşu - 6 aylıq', body: 'Aleksandr (ringneck) tutuquşu, yaşıl, 6 aylıq, danışdırmaq üçün əla.', price: 180, cat: '01KJB9Q9YNV53C7P', filters: [f('01KJB9Q9YNC667V1', '01KJB9Q9YNR6S0KE'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMTXHEXV')] },
    { id: `${P}014`, title: 'Kakadu tutuquşu - Ağ', body: 'Kakadu tutuquşu, ağ, yetkin, danışır, ev sahibi olmağa hazırdır.', price: 1200, cat: '01KJB9Q9YNV53C7P', filters: [f('01KJB9Q9YNC667V1', '01KJB9Q9YNR6S0KE'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMTXHEXV')] },
    { id: `${P}015`, title: 'Kanar quşu - 1 cüt sarı', body: '1 cüt sarı kanar quşu, gözəl mahnı oxuyur, sağlam.', price: 35, cat: '01KJB9Q9YNV53C7P', filters: [f('01KJB9Q9YNC667V1', '01KJB9Q9YNS9HJMM'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMYCP4H3')] },
    { id: `${P}016`, title: 'Yol göyərçinləri - 10 ədəd', body: 'Yol göyərçinlər, müxtəlif rəngdə, 10 ədəd, sağlam.', price: 5, cat: '01KJB9Q9YNV53C7P', filters: [f('01KJB9Q9YNC667V1', '01KJB9Q9YNB5MGT7'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMYCP4H3')] },

    // Kənd heyvanlar
    { id: `${P}017`, title: 'İnək - Sütçü Qaraşım 4 yaş', body: 'Sütçü qaraşım inək, 4 yaş, gündə 15L süd, sağlam.', price: 2200, cat: '01KJB9Q9YNMH48P0', filters: [f('01KJB9Q9YN35NQFT', '01KJB9Q9YN95WQHT'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMYCP4H3')] },
    { id: `${P}018`, title: 'Qoyun cüt - Merinoslar', body: 'Merinos cinsi 2 qoyun, dişi, erkək, 1 il.', price: 450, cat: '01KJB9Q9YNMH48P0', filters: [f('01KJB9Q9YN35NQFT', '01KJB9Q9YN5VYSQY'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMYCP4H3')] },
    { id: `${P}019`, title: 'At - Ərəb cinsi 3 yaşlı', body: 'Ərəb atı, 3 yaş, boz rəng, minik üçün hazır, sənədi mövcuddur.', price: 8500, cat: '01KJB9Q9YNMH48P0', filters: [f('01KJB9Q9YN35NQFT', '01KJB9Q9YN9W9HCS'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMYCP4H3')] },
    { id: `${P}020`, title: 'Arı ailəsi - 5 qutulu', body: '5 qutulu arı ailəsi, Bakı yaxınlığı, illik 40kq bal, mövsüm başlayır.', price: 350, cat: '01KJB9Q9YNMH48P0', filters: [f('01KJB9Q9YN35NQFT', '01KJB9Q9YN3RRTTR'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMYCP4H3')] },

    // Akvarium
    { id: `${P}021`, title: 'Juwel Akvarium 120L tam dəst', body: 'Juwel Vision 120L akvarium, LED, filtr, ısıtıcı, balıq + bitkilər.', price: 380, cat: '01KJB9Q9YN4AKXZW', filters: [f('01KJB9Q9YNKH2SS8', '01KJB9Q9YNNY5VZ4'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMYCP4H3')] },
    { id: `${P}022`, title: 'Diskus balıqları - 6 ədəd', body: '6 ədəd diskus balığı (Symphysodon), türklü rəng, yetkin.', price: 25, cat: '01KJB9Q9YN4AKXZW', filters: [f('01KJB9Q9YNKH2SS8', '01KJB9Q9YN24EDF0'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMTXHEXV')] },
    { id: `${P}023`, title: 'Akvarium bitkiləri 10 növ', body: 'Canlı su bitkiləri 10 növ paketi: Anubias, Java Fern, Ludwigia...', price: 18, cat: '01KJB9Q9YN4AKXZW', filters: [f('01KJB9Q9YNKH2SS8', '01KJB9Q9YN09XFX1'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMTXHEXV')] },

    // Sürünənlər
    { id: `${P}024`, title: 'Bölgə tısbağası 15sm', body: 'Yerli bölgə (Testudo graeca) tısbağası, 15sm, 5 yaş, dişi, sağlam.', price: 95, cat: '01KJB9Q9YNMPS1B0', filters: [f('01KJB9Q9YNSR8VAX', '01KJB9Q9YN3EK788'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMYCP4H3')] },
    { id: `${P}025`, title: 'Chameleon Veiled - 1 yaş erkək', body: 'Veiled chameleon (Chamaeleo calyptratus), 1 yaş, kafəsi + zolaqlar mövcuddur.', price: 220, cat: '01KJB9Q9YNMPS1B0', filters: [f('01KJB9Q9YNSR8VAX', '01KJB9Q9YNMAVV3N'), f('01KJB9Q9YMACSMGS', '01KJB9Q9YMYCP4H3')] },

    // Heyvan qidası
    { id: `${P}026`, title: 'Royal Canin Adult İt qidası 15kq', body: 'Royal Canin Adult Large Breed it qidası 15kq çuval, yeni bağlı.', price: 75, cat: '01KJB9Q9YN2166F5', filters: [f('01KJB9Q9YNXWVYJN', '01KJB9Q9YN1PZG4E'), f('01KJB9Q9YNDAX6DS', '01KJB9Q9YN14SZW3')] },
    { id: `${P}027`, title: 'Hills Science Pişik qidası 7kq', body: "Hill's Science Diet Pişik qidası, sterilized, 7kq, yeni bağlı.", price: 55, cat: '01KJB9Q9YN2166F5', filters: [f('01KJB9Q9YNXWVYJN', '01KJB9Q9YN9XG96J'), f('01KJB9Q9YNDAX6DS', '01KJB9Q9YN14SZW3')] },
    { id: `${P}028`, title: 'Whiskas Konserv 12-lilik dəst', body: 'Whiskas pişik konservi, müxtəlif ətli, 85g, 12-lik dəst.', price: 12, cat: '01KJB9Q9YN2166F5', filters: [f('01KJB9Q9YNXWVYJN', '01KJB9Q9YN9XG96J'), f('01KJB9Q9YNDAX6DS', '01KJB9Q9YNC1RBCG')] },

    // Aksesuar
    { id: `${P}029`, title: 'It daşıyıcı çanta Ryanair uyğun', body: 'Aviosəfərlər üçün it çantası, Ryanair ölçüsü, 40x20x25sm.', price: 45, cat: '01KJB9Q9YN2P6N85', filters: [f('01KJB9Q9YNHACDVY', '01KJB9Q9YNNZS6MR'), f('01KJB9Q9YNKBRWWF', '01KJB9Q9YN00K38C')] },

    // Baytarlıq
    { id: `${P}030`, title: 'Frontline Plus qene/bit dərman', body: 'Frontline Plus it üçün parazit damcısı (M ölçü 10-20kq), 3-aylıq.', price: 18, cat: '01KJB9Q9YNE479ST', filters: [f('01KJB9Q9YNJWFSV9', '01KJB9Q9YNW8ZRSE'), f('01KJB9Q9YNVVCY4E', '01KJB9Q9YNN9SWCN')] },
];

async function main() {
    console.log('🐾 Seeding Animals (30)...');
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
    console.log(`✅ Done: ${ok}/30 Animals cards.`);
    process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
