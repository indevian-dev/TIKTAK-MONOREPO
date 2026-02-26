/**
 * Seed 30 cards: Ev və Bağ (Home & Garden)
 * Parent: 01KJB9Q9Y5K20MTV
 * Run: bun run scripts/seed-cards-ev-bag.ts
 */
import { db } from '../lib/database';
import { sql } from 'drizzle-orm';

const WS = 'SEED_STORE_001', ACC = '01KJ7KW0AZDSJD7A', P = 'SEED2_HG_', PARENT = '01KJB9Q9Y5K20MTV';
const IMGS = ['apartment-living.jpg', 'apartment-bedroom.jpg', 'apartment-kitchen.jpg', 'house-exterior.jpg', 'baku-view.jpg'];
const img = (i: number, n = 3) => Array.from({ length: n }, (_, j) => IMGS[(i + j) % IMGS.length]);
const loc = (i: number) => [{ lat: 40.4093, lng: 49.8671 }, { lat: 40.4219, lng: 49.8530 }, { lat: 40.3790, lng: 49.8490 }, { lat: 40.4350, lng: 49.8750 }, { lat: 40.4150, lng: 49.9020 }][i % 5];
const f = (og: string, o: string) => ({ type: 'STATIC', option_id: o, option_group_id: og });

// Parent: 01KJB9Q9Y5K20MTV
// Condition(parent)=01KJB9Q9Y57VFJDH New=01KJB9Q9Y5ZD6H1A Used=01KJB9Q9Y5XTNZPK
// Delivery(parent)=01KJB9Q9Y57AKJWM Free=01KJB9Q9Y5SKB2HM Paid=01KJB9Q9Y5WJCH44

// Ev mebeli 01KJB9Q9Y5W45D2P: Room=01KJB9Q9Y57ZJ9VN Living=01KJB9Q9Y5AWER7B Bed=01KJB9Q9Y5VKD0NK Kitchen=01KJB9Q9Y59JEHEJ Kids=01KJB9Q9Y5A1XFZE Bath=01KJB9Q9Y52ZVTKN
// Type=01KJB9Q9Y5SCEN8K: Sofa=01KJB9Q9Y63RAVP0 Armchair=01KJB9Q9Y6HMZQC7 Bed=01KJB9Q9Y6JEXKNH Wardrobe=01KJB9Q9Y6D2T118 Table=01KJB9Q9Y6C0RXM0 Chair=01KJB9Q9Y63PD6KA Bookshelf=01KJB9Q9Y640KSKM Corner=01KJB9Q9Y6KXSE76
// Material=01KJB9Q9Y693Q3VW: Wood=01KJB9Q9Y6FYWV3E Lam=01KJB9Q9Y6F5RZEK Metal=01KJB9Q9Y6RD8NMC Leather=01KJB9Q9Y6QE4M5C Fabric=01KJB9Q9Y6S4RTX0

// Ofis mebeli 01KJB9Q9Y624DCTQ: Type=01KJB9Q9Y6C5DZKR Desk=01KJB9Q9Y6FPVP02 OChair=01KJB9Q9Y6VMZ02F Conf=01KJB9Q9Y601PZ2W Cabinet=01KJB9Q9Y64WDH5E Shelf=01KJB9Q9Y62T931X Locker=01KJB9Q9Y6927X1W
// Material=01KJB9Q9Y6G4GGP6: Wood=01KJB9Q9Y6SC5G98 Metal=01KJB9Q9Y6DRS6CA Glass=01KJB9Q9Y6ESDA2W

// Qapılar/Pəncərələr 01KJB9Q9Y6Q99GE8: Type=01KJB9Q9Y6189BD9 Interior=01KJB9Q9Y64PSG6T Entrance=01KJB9Q9Y6BD8YWQ Window=01KJB9Q9Y6EPE1XA Safe=01KJB9Q9Y65M1PRG Sliding=01KJB9Q9Y6DDYK7T
// Material=01KJB9Q9Y6TY1E88: Wood=01KJB9Q9Y6NYWVCD PVC=01KJB9Q9Y6N2SP60 Alum=01KJB9Q9Y6YHNSH9 Steel=01KJB9Q9Y6ZT3S7M

// Ev tekstili 01KJB9Q9Y6H99F82: Type=01KJB9Q9Y66BDW1Q Bedding=01KJB9Q9Y6AF1FKG Curtains=01KJB9Q9Y6TVK4XV Carpet=01KJB9Q9Y60R99Q4 Towel=01KJB9Q9Y6BYBWXS Quilt=01KJB9Q9Y6AMXAG7 Pillow=01KJB9Q9Y6ECT6A6 Rug=01KJB9Q9Y6B6D9G8
// Size=01KJB9Q9Y6G7ZG6C: Single=01KJB9Q9Y6B6XJ55 Double=01KJB9Q9Y65JW3FC King=01KJB9Q9Y6QF4ZHV Standard=01KJB9Q9Y60J59DX

// Qab-qacaq 01KJB9Q9Y68E25P2: Type=01KJB9Q9Y6SJ1YDF Cookware=01KJB9Q9Y67A3X39 Knife=01KJB9Q9Y6NHHSA7 Dinner=01KJB9Q9Y6WY1QZ1 Tea=01KJB9Q9Y6SSKJ75 Samovar=01KJB9Q9Y6MXKHKR Blender=01KJB9Q9Y65CC6BP
// Mat=01KJB9Q9Y610YVMF: CastIron=01KJB9Q9Y6N01EC8 Alum=01KJB9Q9Y61BZPZ4 Ceramic=01KJB9Q9Y61C7ZFF Glass=01KJB9Q9Y64ECDEB Steel=01KJB9Q9Y61Z7G2N

// İşıqlandırma 01KJB9Q9Y6PZAM0V: Type=01KJB9Q9Y6NDJKFD Chandelier=01KJB9Q9Y6Q7NE8Y Recessed=01KJB9Q9Y6R4DMS2 Sconce=01KJB9Q9Y65C0XD9 TableLamp=01KJB9Q9Y6MT9SNK FloorLamp=01KJB9Q9Y6A7HF2E DeskLamp=01KJB9Q9Y6WBPE86
// Bulb=01KJB9Q9Y6CVSEV8: LED=01KJB9Q9Y64P7P0T Energy=01KJB9Q9Y63MQ6MF Halogen=01KJB9Q9Y6D0TVJN Incandescent=01KJB9Q9Y673K0DN

// Tikinti 01KJB9Q9Y6ENXMYY: Type=01KJB9Q9Y67Z4DRB Brick=01KJB9Q9Y6JNV171 Cement=01KJB9Q9Y64FS6ER Wood=01KJB9Q9Y6D4CZ8N Steel=01KJB9Q9Y6TAQBSM Tile=01KJB9Q9Y6YAZ6S8 Paint=01KJB9Q9Y64B3QBR Insul=01KJB9Q9Y6E8M3H7 Roof=01KJB9Q9Y6STZ62E

// Santexnika 01KJB9Q9Y6GE7Z9C: Type=01KJB9Q9Y6PN6WJV Sink=01KJB9Q9Y69W7JZE Toilet=01KJB9Q9Y65R43RK Bath=01KJB9Q9Y6BP8PED Radiator=01KJB9Q9Y6727BP3 Faucet=01KJB9Q9Y6V3Z8YY Heater=01KJB9Q9Y6RGDE2W

// Bağ mebeli 01KJB9Q9Y62YJ9MW: Type=01KJB9Q9Y6QHB3KP GardenSet=01KJB9Q9Y6H8GMK7 Hammock=01KJB9Q9Y6RBAD8W BBQ=01KJB9Q9Y658V8WJ Pool=01KJB9Q9Y6E9CQFN Swing=01KJB9Q9Y68SER0E KidsArea=01KJB9Q9Y72MPN4H

// Ev bitkiləri 01KJB9Q9Y79S7124: Type=01KJB9Q9Y7A7MVGD Flowers=01KJB9Q9Y7EJK0RK Cactus=01KJB9Q9Y7Z4KCFX Palm=01KJB9Q9Y7GHF7GM Tree=01KJB9Q9Y72E71DT Seeds=01KJB9Q9Y7FFMBQC

// Kənd təsərrüfatı 01KJB9Q9Y7T8ZFKQ: Type=01KJB9Q9Y7RZ4SP9 Seeds=01KJB9Q9Y7PZC3QX Fertilizer=01KJB9Q9Y7M8X2ST Pesticide=01KJB9Q9Y78W4YQC Irrigate=01KJB9Q9Y7F1CZN4 HandTools=01KJB9Q9Y7KEA1SR Mower=01KJB9Q9Y75RMN7C

const CARDS = [
    // Ev mebeli - Sofa/furniture
    { id: `${P}001`, title: 'Natuzzi İtalyan Divan 3+2+1', body: 'İtaliya istehsalı Natuzzi divan dəsti 3+2+1, çəhrayı-boz parça, yeni.', price: 2800, cat: '01KJB9Q9Y5W45D2P', filters: [f('01KJB9Q9Y57ZJ9VN', '01KJB9Q9Y5AWER7B'), f('01KJB9Q9Y5SCEN8K', '01KJB9Q9Y63RAVP0'), f('01KJB9Q9Y693Q3VW', '01KJB9Q9Y6S4RTX0'), f('01KJB9Q9Y57VFJDH', '01KJB9Q9Y5ZD6H1A')] },
    { id: `${P}002`, title: 'İkea Dəri Kreslo + Ottoman', body: 'IKEA LANDSKRONA dəri kreslo + ayaqaltı, qara, az işlənmiş.', price: 480, cat: '01KJB9Q9Y5W45D2P', filters: [f('01KJB9Q9Y57ZJ9VN', '01KJB9Q9Y5AWER7B'), f('01KJB9Q9Y5SCEN8K', '01KJB9Q9Y6HMZQC7'), f('01KJB9Q9Y693Q3VW', '01KJB9Q9Y6QE4M5C'), f('01KJB9Q9Y57VFJDH', '01KJB9Q9Y5XTNZPK')] },
    { id: `${P}003`, title: 'Yataq dəsti 160x200 - Ortopedik', body: 'Taxta çarpayı + ortopedik matras 160x200, yeni, çatdırma mümkün.', price: 950, cat: '01KJB9Q9Y5W45D2P', filters: [f('01KJB9Q9Y57ZJ9VN', '01KJB9Q9Y5VKD0NK'), f('01KJB9Q9Y5SCEN8K', '01KJB9Q9Y6JEXKNH'), f('01KJB9Q9Y693Q3VW', '01KJB9Q9Y6FYWV3E'), f('01KJB9Q9Y57VFJDH', '01KJB9Q9Y5ZD6H1A')] },
    { id: `${P}004`, title: 'Garderobu 3 qapılı ağ laminat', body: '3 qapılı sürüşən aynalı garderobu, 220x180x60sm, ağ, yeni.', price: 650, cat: '01KJB9Q9Y5W45D2P', filters: [f('01KJB9Q9Y57ZJ9VN', '01KJB9Q9Y5VKD0NK'), f('01KJB9Q9Y5SCEN8K', '01KJB9Q9Y6D2T118'), f('01KJB9Q9Y693Q3VW', '01KJB9Q9Y6F5RZEK'), f('01KJB9Q9Y57VFJDH', '01KJB9Q9Y5ZD6H1A')] },
    { id: `${P}005`, title: 'Mətbəx stol dəsti (4 stul)', body: 'Taxta+metal mətbəx masası 120x70 + 4 stul, ağ-qara, yeni.', price: 380, cat: '01KJB9Q9Y5W45D2P', filters: [f('01KJB9Q9Y57ZJ9VN', '01KJB9Q9Y59JEHEJ'), f('01KJB9Q9Y5SCEN8K', '01KJB9Q9Y6C0RXM0'), f('01KJB9Q9Y693Q3VW', '01KJB9Q9Y6RD8NMC'), f('01KJB9Q9Y57VFJDH', '01KJB9Q9Y5ZD6H1A')] },
    { id: `${P}006`, title: 'Künc divan geniş L-forma', body: 'Geniş L-forma künc divan, boz rəng, yer olaraq açılır, yeni.', price: 1200, cat: '01KJB9Q9Y5W45D2P', filters: [f('01KJB9Q9Y57ZJ9VN', '01KJB9Q9Y5AWER7B'), f('01KJB9Q9Y5SCEN8K', '01KJB9Q9Y6KXSE76'), f('01KJB9Q9Y693Q3VW', '01KJB9Q9Y6S4RTX0'), f('01KJB9Q9Y57VFJDH', '01KJB9Q9Y5ZD6H1A')] },
    { id: `${P}007`, title: 'Uşaq otağı mebel dəsti', body: 'Uşaq üçün çarpayı+stol+rəf dəsti, sarı-ağ rəng, laminat.', price: 750, cat: '01KJB9Q9Y5W45D2P', filters: [f('01KJB9Q9Y57ZJ9VN', '01KJB9Q9Y5A1XFZE'), f('01KJB9Q9Y5SCEN8K', '01KJB9Q9Y6JEXKNH'), f('01KJB9Q9Y693Q3VW', '01KJB9Q9Y6F5RZEK'), f('01KJB9Q9Y57VFJDH', '01KJB9Q9Y5ZD6H1A')] },

    // Ofis mebeli
    { id: `${P}008`, title: 'IKEA Bekant İş Masası 160x80', body: 'IKEA BEKANT iş masası 160x80sm, tambur ağ ayaqları, az işlənmiş.', price: 280, cat: '01KJB9Q9Y624DCTQ', filters: [f('01KJB9Q9Y6C5DZKR', '01KJB9Q9Y6FPVP02'), f('01KJB9Q9Y6G4GGP6', '01KJB9Q9Y6SC5G98'), f('01KJB9Q9Y57VFJDH', '01KJB9Q9Y5XTNZPK')] },
    { id: `${P}009`, title: 'Ofis Kreslosu Gamer ergonomik', body: 'Ergonomik ofis kreslosu, bel dəstəyi, çevrələnən, qara-qırmızı, yeni.', price: 220, cat: '01KJB9Q9Y624DCTQ', filters: [f('01KJB9Q9Y6C5DZKR', '01KJB9Q9Y6VMZ02F'), f('01KJB9Q9Y6G4GGP6', '01KJB9Q9Y6DRS6CA'), f('01KJB9Q9Y57VFJDH', '01KJB9Q9Y5ZD6H1A')] },
    { id: `${P}010`, title: 'Sənəd şkafı metal 4 rəfli', body: '4 rəfli metal sənəd şkafı, kilidli, boz, A4 format.', price: 150, cat: '01KJB9Q9Y624DCTQ', filters: [f('01KJB9Q9Y6C5DZKR', '01KJB9Q9Y64WDH5E'), f('01KJB9Q9Y6G4GGP6', '01KJB9Q9Y6DRS6CA'), f('01KJB9Q9Y57VFJDH', '01KJB9Q9Y5ZD6H1A')] },

    // Qapılar/Pəncərələr
    { id: `${P}011`, title: 'Plastik pəncərə 120x140 2 qanadlı', body: 'VEKA profil plastik pəncərə 120x140sm, 2 qanadlı, montaj xidmət.', price: 420, cat: '01KJB9Q9Y6Q99GE8', filters: [f('01KJB9Q9Y6189BD9', '01KJB9Q9Y6EPE1XA'), f('01KJB9Q9Y6TY1E88', '01KJB9Q9Y6N2SP60')] },
    { id: `${P}012`, title: 'Taxta daxili qapı 200x80', body: 'Massiv taxta daxili qapı 200x80sm, ceviz rəngi, qapazlı.', price: 185, cat: '01KJB9Q9Y6Q99GE8', filters: [f('01KJB9Q9Y6189BD9', '01KJB9Q9Y64PSG6T'), f('01KJB9Q9Y6TY1E88', '01KJB9Q9Y6NYWVCD')] },
    { id: `${P}013`, title: 'Seyf Polad giriş qapısı', body: '6cm polad seyf giriş qapısı, 3 nöqtəli kilidlər, qara.', price: 890, cat: '01KJB9Q9Y6Q99GE8', filters: [f('01KJB9Q9Y6189BD9', '01KJB9Q9Y65M1PRG'), f('01KJB9Q9Y6TY1E88', '01KJB9Q9Y6ZT3S7M')] },

    // Ev tekstili
    { id: `${P}014`, title: 'Döşək bezi dəsti 200x140 kalikut', body: 'Kalikut 100% pambıq yataq dəsti 200x140, nəbad çap, yeni.', price: 45, cat: '01KJB9Q9Y6H99F82', filters: [f('01KJB9Q9Y66BDW1Q', '01KJB9Q9Y6AF1FKG'), f('01KJB9Q9Y6G7ZG6C', '01KJB9Q9Y65JW3FC')] },
    { id: `${P}015`, title: 'Tüll pərdə + qaralamaq dəsti', body: 'Qaralamaq + tüll pərdə dəsti 2x2.8m, bej rəng, yeni.', price: 75, cat: '01KJB9Q9Y6H99F82', filters: [f('01KJB9Q9Y66BDW1Q', '01KJB9Q9Y6TVK4XV'), f('01KJB9Q9Y6G7ZG6C', '01KJB9Q9Y60J59DX')] },
    { id: `${P}016`, title: 'Türk xalçası 200x300 Oushak', body: 'Türk iplik xalçası Oushak 200x300sm, iplik rəng, el işi.', price: 1100, cat: '01KJB9Q9Y6H99F82', filters: [f('01KJB9Q9Y66BDW1Q', '01KJB9Q9Y60R99Q4'), f('01KJB9Q9Y6G7ZG6C', '01KJB9Q9Y60J59DX')] },
    { id: `${P}017`, title: 'Bambu yorğan + 2 yastıq dəsti', body: 'Bambu 4 mövsümlü yorğan 200x220 + 2 yastıq, allergen deyil.', price: 120, cat: '01KJB9Q9Y6H99F82', filters: [f('01KJB9Q9Y66BDW1Q', '01KJB9Q9Y6AMXAG7'), f('01KJB9Q9Y6G7ZG6C', '01KJB9Q9Y65JW3FC')] },

    // Qab-qacaq
    { id: `${P}018`, title: 'Tefal İnduktiv tava dəsti 5 ədəd', body: 'Tefal Talent Pro 5 ədədlik tava/qazan dəsti, induktiv.', price: 185, cat: '01KJB9Q9Y68E25P2', filters: [f('01KJB9Q9Y6SJ1YDF', '01KJB9Q9Y67A3X39'), f('01KJB9Q9Y610YVMF', '01KJB9Q9Y61Z7G2N')] },
    { id: `${P}019`, title: 'Wüsthof Professional Bıçaq Dəsti 6', body: 'Wüsthof Classic 6 bıçaq dəsti + saxlama bloku, Almanya.', price: 320, cat: '01KJB9Q9Y68E25P2', filters: [f('01KJB9Q9Y6SJ1YDF', '01KJB9Q9Y6NHHSA7'), f('01KJB9Q9Y610YVMF', '01KJB9Q9Y61Z7G2N')] },
    { id: `${P}020`, title: 'Çay servizi Zümrüd 6+1 əl işi', body: 'Azərbaycan istehsalı Zümrüd firuzə çay servizi 6+1, əl işi.', price: 95, cat: '01KJB9Q9Y68E25P2', filters: [f('01KJB9Q9Y6SJ1YDF', '01KJB9Q9Y6SSKJ75'), f('01KJB9Q9Y610YVMF', '01KJB9Q9Y61C7ZFF')] },
    { id: `${P}021`, title: 'Bosch Blender 800W', body: 'Bosch MSB2FSMW 800W blender, 0.6L, 3 sürət + turbo.', price: 75, cat: '01KJB9Q9Y68E25P2', filters: [f('01KJB9Q9Y6SJ1YDF', '01KJB9Q9Y65CC6BP'), f('01KJB9Q9Y610YVMF', '01KJB9Q9Y61Z7G2N')] },

    // İşıqlandırma
    { id: `${P}022`, title: 'LED Çilçıraq 90W Kristal 8 qol', body: '90W LED çilçıraq, kristal, 8 qol, 3 rəng dəyişdirə bilən.', price: 245, cat: '01KJB9Q9Y6PZAM0V', filters: [f('01KJB9Q9Y6NDJKFD', '01KJB9Q9Y6Q7NE8Y'), f('01KJB9Q9Y6CVSEV8', '01KJB9Q9Y64P7P0T')] },
    { id: `${P}023`, title: 'Qol lampa E27 industrial', body: 'Metal industrial qol lampa (bra), E27, rotasiyalı, qara.', price: 35, cat: '01KJB9Q9Y6PZAM0V', filters: [f('01KJB9Q9Y6NDJKFD', '01KJB9Q9Y65C0XD9'), f('01KJB9Q9Y6CVSEV8', '01KJB9Q9Y64P7P0T')] },
    { id: `${P}024`, title: 'Torşer Arkon LED 12W', body: 'Arkon döşəmə lampası, 12W LED, soyuq/isti ağ, dimmer.', price: 89, cat: '01KJB9Q9Y6PZAM0V', filters: [f('01KJB9Q9Y6NDJKFD', '01KJB9Q9Y6A7HF2E'), f('01KJB9Q9Y6CVSEV8', '01KJB9Q9Y64P7P0T')] },

    // Tikinti materialları
    { id: `${P}025`, title: 'Kafel 60x60 Rektifisas Polished', body: 'İtaliya kafel 60x60sm, rektifisas, parlaq, 2.16m², 6 qutu oxşar.', price: 28, cat: '01KJB9Q9Y6ENXMYY', filters: [f('01KJB9Q9Y67Z4DRB', '01KJB9Q9Y6YAZ6S8')] },
    { id: `${P}026`, title: 'Knauf Alçı Suvaq 30kq', body: 'Knauf MP 75 alçı suvaq 30kq çuval, yeni bağlı, 12 çuval.', price: 22, cat: '01KJB9Q9Y6ENXMYY', filters: [f('01KJB9Q9Y67Z4DRB', '01KJB9Q9Y64FS6ER')] },

    // Santexnika
    { id: `${P}027`, title: 'Duravit Mövsüm Lavabo 50x41', body: 'Duravit D-Code 50x41sm asma lavabo, seramik, ağ, yeni.', price: 175, cat: '01KJB9Q9Y6GE7Z9C', filters: [f('01KJB9Q9Y6PN6WJV', '01KJB9Q9Y69W7JZE')] },
    { id: `${P}028`, title: 'Electrolux EWH 80L Su İsidici', body: 'Electrolux EWH 80 Slim su isidici, 80L, 1.5kW, ağ, yeni.', price: 320, cat: '01KJB9Q9Y6GE7Z9C', filters: [f('01KJB9Q9Y6PN6WJV', '01KJB9Q9Y6RGDE2W')] },

    // Bağ mebeli
    { id: `${P}029`, title: 'Rattan Bağ Dəsti 4+1 Çelenk', body: 'Suni rattan bağ divan dəsti: 2 kreslo + divan + stol + yastıqlar.', price: 890, cat: '01KJB9Q9Y62YJ9MW', filters: [f('01KJB9Q9Y6QHB3KP', '01KJB9Q9Y6H8GMK7')] },

    // Ev bitkiləri
    { id: `${P}030`, title: 'Moнstera Deliciosa 80sm', body: 'Monstera Deliciosa tropik ev bitkisi, 80sm, evdə becərilmiş + saksı.', price: 35, cat: '01KJB9Q9Y79S7124', filters: [f('01KJB9Q9Y7A7MVGD', '01KJB9Q9Y7GHF7GM')] },
];

async function main() {
    console.log('🏠 Seeding Home & Garden (30)...');
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
    console.log(`✅ Done: ${ok}/30 Home & Garden cards.`);
    process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
