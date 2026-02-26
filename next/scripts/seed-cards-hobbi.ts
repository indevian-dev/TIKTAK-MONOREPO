/**
 * Seed 30 cards: Hobbi, İdman və Əyləncə (Hobbies, Sports & Leisure)
 * Parent: 01KJB9Q9YH8K5AB3
 * Run: bun run scripts/seed-cards-hobbi.ts
 */
import { db } from '../lib/database';
import { sql } from 'drizzle-orm';

const WS = 'SEED_STORE_001', ACC = '01KJ7KW0AZDSJD7A', P = 'SEED2_HB_', PARENT = '01KJB9Q9YH8K5AB3';
const IMGS = ['gym-equipment.jpg', 'bicycle-mountain.jpg', 'guitar-fender.jpg', 'camping-tent.jpg', 'boxing-gloves.jpg'];
const img = (i: number, n = 3) => Array.from({ length: n }, (_, j) => IMGS[(i + j) % IMGS.length]);
const loc = (i: number) => [{ lat: 40.4093, lng: 49.8671 }, { lat: 40.4219, lng: 49.8530 }, { lat: 40.3790, lng: 49.8490 }, { lat: 40.4350, lng: 49.8750 }, { lat: 40.4150, lng: 49.9020 }][i % 5];
const f = (og: string, o: string) => ({ type: 'STATIC', option_id: o, option_group_id: og });

// Parent Condition=01KJB9Q9YHHYVYCR New=01KJB9Q9YHB3N2G2 Used=01KJB9Q9YHM6JDSN
// Parent Delivery=01KJB9Q9YH9NTF98 Free=01KJB9Q9YHP58VGN Paid=01KJB9Q9YH7MFFAH No=01KJB9Q9YHSFJ739

// İdman geyimi 01KJB9Q9YHE3W0AT: Gender=01KJB9Q9YH7J81G2 Men=01KJB9Q9YHDJ91Z3 Women=01KJB9Q9YHK2MSDF Unisex=01KJB9Q9YH2JZZYT
// Brand=01KJB9Q9YH0TYNQJ: Nike=01KJB9Q9YH2XG2JS Adidas=01KJB9Q9YH4RXFFY Puma=01KJB9Q9YHRDVSAA UA=01KJB9Q9YHZ9DHJF Reebok=01KJB9Q9YHRYVS6A NB=01KJB9Q9YHGE167S Other=01KJB9Q9YH1TYRGG
// Type=01KJB9Q9YH21W942: Tops=01KJB9Q9YHJ1DR78 Pants=01KJB9Q9YH09CM5G Sneakers=01KJB9Q9YHAC6053 Compression=01KJB9Q9YHZSQJ5S

// İdman qidalanması 01KJB9Q9YHXWYA1S: Type=01KJB9Q9YHEQZBJ7 Protein=01KJB9Q9YHWATD0P Creatine=01KJB9Q9YHRMYCWG BCAA=01KJB9Q9YHQXGKPD Gainer=01KJB9Q9YHXH1VZQ Vitamins=01KJB9Q9YH6P08HS FatBurn=01KJB9Q9YHASCHSY Bars=01KJB9Q9YHVQCKR4

// Fitnes trenajoru 01KJB9Q9YH6SB53F: Type=01KJB9Q9YHV8556X Treadmill=01KJB9Q9YHVEWD0C Bike=01KJB9Q9YHQ24X66 Elliptical=01KJB9Q9YHE14PRW Strength=01KJB9Q9YHFWSTQH Dumbbells=01KJB9Q9YHKVA0G9 Mat=01KJB9Q9YHDDEKRC

// Boks 01KJB9Q9YH13PGQV: Type=01KJB9Q9YHV62B5F Gloves=01KJB9Q9YH6BV93A Bag=01KJB9Q9YHSA466W Headgear=01KJB9Q9YH3FDA54 Shin=01KJB9Q9YHYNA2DR Kimono=01KJB9Q9YH66751M MMA=01KJB9Q9YHQAZQ5X
// Sport=01KJB9Q9YHQF1GA3: Boxing=01KJB9Q9YHTM0S6T Karate=01KJB9Q9YHBT1191 Judo=01KJB9Q9YHMMTCSN Taekwondo=01KJB9Q9YJH9AY9X MMA=01KJB9Q9YJ29VFEK Wrestling=01KJB9Q9YJ60PKRJ

// Velosiped 01KJB9Q9YJZ2ZJZH: Type=01KJB9Q9YJARXTSX Mtb=01KJB9Q9YJQE6Y05 City=01KJB9Q9YJYW4N3H BMX=01KJB9Q9YJGT1A70 Kids=01KJB9Q9YJXPR9GW Elec=01KJB9Q9YJY57SDF Road=01KJB9Q9YJV8VM0Q
// Frame=01KJB9Q9YJ1KS7B6: 13=01KJB9Q9YJS29FSK 15=01KJB9Q9YJT1JQBW 17=01KJB9Q9YJ879DSX 19=01KJB9Q9YJNRWQ33 21=01KJB9Q9YJVAEEK2

// Roller/Skate 01KJB9Q9YJ3GZQMR: Type=01KJB9Q9YJG928E9 Roller=01KJB9Q9YJ090YNV Inline=01KJB9Q9YJW8FF7A Skate=01KJB9Q9YJR3G59T Scooter=01KJB9Q9YJN0G1HS EScooter=01KJB9Q9YJQZNAJM

// Kembing 01KJB9Q9YJNFPCNK: Type=01KJB9Q9YJ494CP3 Tent=01KJB9Q9YJJGCFWX SleepBag=01KJB9Q9YJSY93AQ Mat=01KJB9Q9YJ1GNRBX Lantern=01KJB9Q9YJ6GT77K Stove=01KJB9Q9YJP2XRQD
// Season=01KJB9Q9YJCETBWT: 3s=01KJB9Q9YJ0A1V55 4s=01KJB9Q9YJHFPW7T Summer=01KJB9Q9YJ4EM1PZ

// Qış idman 01KJB9Q9YJMZVGBE: Type=01KJB9Q9YJTV3SEH Ski=01KJB9Q9YJ85VPH5 Snowboard=01KJB9Q9YJMP2EYA IceSkate=01KJB9Q9YJ0M1WED SkiApparel=01KJB9Q9YJ5G30PC SkiBoots=01KJB9Q9YJD99867 Helmet=01KJB9Q9YJ7NMQAZ

// Ovçuluq/Balıqçılıq 01KJB9Q9YJ7R6T7Q: Type=01KJB9Q9YJAWEMEK Rod=01KJB9Q9YJ0VD4TS Boat=01KJB9Q9YJ07KPJ3 Lure=01KJB9Q9YJCTC4Y6 FisherClothing=01KJB9Q9YJ668XPW Hunting=01KJB9Q9YJFKNTFC

// Musiqi 01KJB9Q9YJSHMYXZ: Condition=01KJB9Q9YJ6XKQ4X New=01KJB9Q9YJFJS3NE Used=01KJB9Q9YJ7B0FXX
// Type=01KJB9Q9YJFJT4TR: Guitar=01KJB9Q9YJ52HHNR Bass=01KJB9Q9YJ3E1NYM Piano=01KJB9Q9YJR22TSK Drums=01KJB9Q9YJT5VFPF Wind=01KJB9Q9YJNK0DYP Violin=01KJB9Q9YJWZGRS6 Tar=01KJB9Q9YJE0FDFN Zurna=01KJB9Q9YJ98NF5W Studio=01KJB9Q9YJNCAPY6
// Brand=01KJB9Q9YJX7AGY2: Yamaha=01KJB9Q9YJP8CVTB Fender=01KJB9Q9YJ1H9600 Gibson=01KJB9Q9YJTRDSDQ Roland=01KJB9Q9YJERSRB8 Casio=01KJB9Q9YJZP0QGB Other=01KJB9Q9YJ59BGG8

// Kitablar 01KJB9Q9YJZVGHYJ: Lang=01KJB9Q9YJ9BH649 Az=01KJB9Q9YJQXWPP9 Ru=01KJB9Q9YJBD3JFC En=01KJB9Q9YJ8JFH8S Tr=01KJB9Q9YJJV9HJH
// Genre=01KJB9Q9YJB5W5FG: Fiction=01KJB9Q9YJDFAPK1 Kids=01KJB9Q9YJ6VJ9HR Science=01KJB9Q9YJ5F481X History=01KJB9Q9YJJ55WTE Business=01KJB9Q9YJD6QN6T Poetry=01KJB9Q9YJCCXA4F Textbook=01KJB9Q9YJMA2FEJ Magazine=01KJB9Q9YJRR7VDD

// Kolleksiya 01KJB9Q9YJ94S7QP: Type=01KJB9Q9YJESGM8Y Coins=01KJB9Q9YJYEB6WY Stamps=01KJB9Q9YJNA6711 Banknotes=01KJB9Q9YJFMC80C Antiques=01KJB9Q9YJD780ED CollToys=01KJB9Q9YJR4RKM6 Art=01KJB9Q9YJZ2CXP0
// Era=01KJB9Q9YJNWBKEJ: Soviet=01KJB9Q9YJTH690X Tsarist=01KJB9Q9YJV3B7A0 Modern=01KJB9Q9YJQS877S

// Bilet/Səyahət 01KJB9Q9YJK27DGE: Type=01KJB9Q9YJC3DYHD Concert=01KJB9Q9YJVGFAV0 Cinema=01KJB9Q9YJC761N3 Sports=01KJB9Q9YJZGKQD2 Tour=01KJB9Q9YJZREAMC Hotel=01KJB9Q9YJSFSYC1

const CARDS = [
    // Sports apparel
    { id: `${P}001`, title: 'Nike Air Max 270 Kişi - 43 ölçü', body: 'Nike Air Max 270 idman ayaqqabısı, ağ-qara, 43 ölçü, yeni qutusu ilə.', price: 220, cat: '01KJB9Q9YHE3W0AT', filters: [f('01KJB9Q9YH7J81G2', '01KJB9Q9YHDJ91Z3'), f('01KJB9Q9YH0TYNQJ', '01KJB9Q9YH2XG2JS'), f('01KJB9Q9YH21W942', '01KJB9Q9YHAC6053'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}002`, title: 'Adidas Ultraboost Qadın - 38', body: 'Adidas Ultraboost 22 qadın qaçış ayaqqabı, boz-limon, 38, yeni.', price: 195, cat: '01KJB9Q9YHE3W0AT', filters: [f('01KJB9Q9YH7J81G2', '01KJB9Q9YHK2MSDF'), f('01KJB9Q9YH0TYNQJ', '01KJB9Q9YH4RXFFY'), f('01KJB9Q9YH21W942', '01KJB9Q9YHAC6053'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}003`, title: 'Under Armour Termo Köynək', body: 'UA ColdGear qış kompressiya köynəyi, L ölçü, qara, yeni.', price: 75, cat: '01KJB9Q9YHE3W0AT', filters: [f('01KJB9Q9YH7J81G2', '01KJB9Q9YH2JZZYT'), f('01KJB9Q9YH0TYNQJ', '01KJB9Q9YHZ9DHJF'), f('01KJB9Q9YH21W942', '01KJB9Q9YHZSQJ5S'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },

    // Sports Nutrition
    { id: `${P}004`, title: 'ON Gold Standard Whey 2.27kq', body: 'Optimum Nutrition Gold Standard 100% Whey, Double Rich Chocolate, 2.27kq.', price: 115, cat: '01KJB9Q9YHXWYA1S', filters: [f('01KJB9Q9YHEQZBJ7', '01KJB9Q9YHWATD0P')] },
    { id: `${P}005`, title: 'Creatine Monohydrate 500q MyProtein', body: 'MyProtein Creatine Monohydrate, 500q, unflavoured, sertifikatlı.', price: 35, cat: '01KJB9Q9YHXWYA1S', filters: [f('01KJB9Q9YHEQZBJ7', '01KJB9Q9YHRMYCWG')] },
    { id: `${P}006`, title: 'BCAA 2:1:1 Scitec 700kapsul', body: 'Scitec Nutrition BCAA 2:1:1, 700 kapsul, müntəzəm istifadə üçün ideal.', price: 55, cat: '01KJB9Q9YHXWYA1S', filters: [f('01KJB9Q9YHEQZBJ7', '01KJB9Q9YHQXGKPD')] },
    { id: `${P}007`, title: 'Mutant Mass Gainer 6.8kq', body: 'Mutant Mass XXXtreme gainer, çikolad, 6.8kq çuval, yeni, bağlı.', price: 145, cat: '01KJB9Q9YHXWYA1S', filters: [f('01KJB9Q9YHEQZBJ7', '01KJB9Q9YHXH1VZQ')] },

    // Fitness Equipment
    { id: `${P}008`, title: 'Wahoo KICKR Əyləc Trenajor', body: 'Wahoo KICKR Smart Trainer, 2200W, Zwift uyğunlu, az işlənmiş.', price: 850, cat: '01KJB9Q9YH6SB53F', filters: [f('01KJB9Q9YHV8556X', '01KJB9Q9YHQ24X66'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHM6JDSN')] },
    { id: `${P}009`, title: 'Güc Trenajoru Multipleks 14 Funksiya', body: '14 funksiyalı ev güc maşını, 75kq ağırlıq, yeni, tam qurulanmış.', price: 650, cat: '01KJB9Q9YH6SB53F', filters: [f('01KJB9Q9YHV8556X', '01KJB9Q9YHFWSTQH'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}010`, title: 'Dəmir Qantellər 2x20kq', body: 'Gofrat dəmir qantellər cütü 2x20kq, ev idman salonu üçün.', price: 89, cat: '01KJB9Q9YH6SB53F', filters: [f('01KJB9Q9YHV8556X', '01KJB9Q9YHKVA0G9'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },

    // Boxing
    { id: `${P}011`, title: 'Hayabusa T3 Boks Əlcəkləri 16oz', body: 'Hayabusa T3 premium boks əlcəkləri, 16oz, qırmızı, yeni.', price: 145, cat: '01KJB9Q9YH13PGQV', filters: [f('01KJB9Q9YHV62B5F', '01KJB9Q9YH6BV93A'), f('01KJB9Q9YHQF1GA3', '01KJB9Q9YHTM0S6T'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}012`, title: 'MMA Döyüş dəsti - qalxan+qolluq', body: 'Everlast Elite MMA sparring dəsti: qalxan, qolluq, kixotlər.', price: 95, cat: '01KJB9Q9YH13PGQV', filters: [f('01KJB9Q9YHV62B5F', '01KJB9Q9YHQAZQ5X'), f('01KJB9Q9YHQF1GA3', '01KJB9Q9YJ29VFEK'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },

    // Bicycles
    { id: `${P}013`, title: 'Trek Marlin 7 MTB 29" - M', body: 'Trek Marlin 7 dağ velosipedi, 29", M çərçivə, 2022 model, az işlənmiş.', price: 850, cat: '01KJB9Q9YJZ2ZJZH', filters: [f('01KJB9Q9YJARXTSX', '01KJB9Q9YJQE6Y05'), f('01KJB9Q9YJ1KS7B6', '01KJB9Q9YJ879DSX'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHM6JDSN')] },
    { id: `${P}014`, title: 'Bianchi Intenso Şəhər Velosipedi', body: 'Bianchi Intenso şəhər velosipedi, L ölçü, 28" təkər, 8 sürət, yeni.', price: 680, cat: '01KJB9Q9YJZ2ZJZH', filters: [f('01KJB9Q9YJARXTSX', '01KJB9Q9YJYW4N3H'), f('01KJB9Q9YJ1KS7B6', '01KJB9Q9YJVAEEK2'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}015`, title: 'Xiaomi Electric Scooter Pro 2', body: 'Xiaomi Mi Electric Scooter Pro 2, maks 25km/h, 45km menzil, yeni.', price: 450, cat: '01KJB9Q9YJ3GZQMR', filters: [f('01KJB9Q9YJG928E9', '01KJB9Q9YJQZNAJM'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}016`, title: 'Inline Rollerlər Fila Legacy 42-44', body: 'Fila Legacy Pro inline rollerlər, 42-44, abecil üçün, yeni.', price: 75, cat: '01KJB9Q9YJ3GZQMR', filters: [f('01KJB9Q9YJG928E9', '01KJB9Q9YJW8FF7A'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },

    // Camping
    { id: `${P}017`, title: 'MSR Hubba Hubba 2P Çadır 3-mövsüm', body: 'MSR Hubba Hubba NX 2-nəfərlik çadır, 3-mövsüm, su keçirməz, yeni.', price: 380, cat: '01KJB9Q9YJNFPCNK', filters: [f('01KJB9Q9YJ494CP3', '01KJB9Q9YJJGCFWX'), f('01KJB9Q9YJCETBWT', '01KJB9Q9YJ0A1V55'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
    { id: `${P}018`, title: 'Yataq kisəsi -5°C Marmot Trestles', body: 'Marmot Trestles 30°F/-1°C yataq kisəsi, mumiyalı, yüngül, yeni.', price: 120, cat: '01KJB9Q9YJNFPCNK', filters: [f('01KJB9Q9YJ494CP3', '01KJB9Q9YJSY93AQ'), f('01KJB9Q9YJCETBWT', '01KJB9Q9YJ0A1V55'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },

    // Musical instruments
    { id: `${P}019`, title: 'Fender Player Stratocaster SSS', body: 'Fender Player Strat, Sunburst, gümüş sap, yeni qutusu ilə, Meksika.', price: 720, cat: '01KJB9Q9YJSHMYXZ', filters: [f('01KJB9Q9YJ6XKQ4X', '01KJB9Q9YJFJS3NE'), f('01KJB9Q9YJFJT4TR', '01KJB9Q9YJ52HHNR'), f('01KJB9Q9YJX7AGY2', '01KJB9Q9YJ1H9600')] },
    { id: `${P}020`, title: 'Yamaha P-125 Rəqəmsal Piano', body: 'Yamaha P-125 88 tuş ağ, GHC aksiyonu, Bluetooth, yeni.', price: 650, cat: '01KJB9Q9YJSHMYXZ', filters: [f('01KJB9Q9YJ6XKQ4X', '01KJB9Q9YJFJS3NE'), f('01KJB9Q9YJFJT4TR', '01KJB9Q9YJR22TSK'), f('01KJB9Q9YJX7AGY2', '01KJB9Q9YJP8CVTB')] },
    { id: `${P}021`, title: 'Zurna Azərbaycan ağac ustası işi', body: 'Usta əl işi Azərbaycan zurna, ağ şümşad ağacı, orijinal tembr.', price: 85, cat: '01KJB9Q9YJSHMYXZ', filters: [f('01KJB9Q9YJ6XKQ4X', '01KJB9Q9YJFJS3NE'), f('01KJB9Q9YJFJT4TR', '01KJB9Q9YJ98NF5W'), f('01KJB9Q9YJX7AGY2', '01KJB9Q9YJ59BGG8')] },
    { id: `${P}022`, title: 'Tar - Məşhur usta Bəhruz əl işi', body: 'Prim tar, Bəhruz düzmeli, akustik, çanta ilə birlikdə, yeni.', price: 450, cat: '01KJB9Q9YJSHMYXZ', filters: [f('01KJB9Q9YJ6XKQ4X', '01KJB9Q9YJFJS3NE'), f('01KJB9Q9YJFJT4TR', '01KJB9Q9YJE0FDFN'), f('01KJB9Q9YJX7AGY2', '01KJB9Q9YJ59BGG8')] },

    // Books
    { id: `${P}023`, title: 'Atomic Habits - James Clear Az/Ru', body: 'Atomic Habits kitabı, Azərbaycan + Rus dillərində, yeni.', price: 18, cat: '01KJB9Q9YJZVGHYJ', filters: [f('01KJB9Q9YJ9BH649', '01KJB9Q9YJQXWPP9'), f('01KJB9Q9YJB5W5FG', '01KJB9Q9YJD6QN6T')] },
    { id: `${P}024`, title: 'Harry Potter Tam 7 Kitab Dəsti', body: 'Harry Potter tam seriya, Rus dilində, NArsız, yaxşı vəziyyət.', price: 55, cat: '01KJB9Q9YJZVGHYJ', filters: [f('01KJB9Q9YJ9BH649', '01KJB9Q9YJBD3JFC'), f('01KJB9Q9YJB5W5FG', '01KJB9Q9YJDFAPK1')] },
    { id: `${P}025`, title: 'Dərslik Azərbaycan Tarix 5-11 sinif', body: 'Azərbaycan tarixi dərslikləri, 5-11 sinif, tam dəst, yeni nəşr.', price: 35, cat: '01KJB9Q9YJZVGHYJ', filters: [f('01KJB9Q9YJ9BH649', '01KJB9Q9YJQXWPP9'), f('01KJB9Q9YJB5W5FG', '01KJB9Q9YJMA2FEJ')] },

    // Collectibles
    { id: `${P}026`, title: 'Sovet dövrü sikkəsi - 1961 1 Qəpik', body: '1961 Sovet 1 Qəpik sikkəsi, mükəmməl vəziyyət, kollektor üçün.', price: 12, cat: '01KJB9Q9YJ94S7QP', filters: [f('01KJB9Q9YJESGM8Y', '01KJB9Q9YJYEB6WY'), f('01KJB9Q9YJNWBKEJ', '01KJB9Q9YJTH690X')] },
    { id: `${P}027`, title: '1918-ci il Azərbaycan Xalq Cümhuriyyəti Markası', body: 'Nadir AXC 1918 marka bloku, lokal çap, nümayəndəlik üçün sertifikat.', price: 280, cat: '01KJB9Q9YJ94S7QP', filters: [f('01KJB9Q9YJESGM8Y', '01KJB9Q9YJNA6711'), f('01KJB9Q9YJNWBKEJ', '01KJB9Q9YJV3B7A0')] },

    // Tickets
    { id: `${P}028`, title: 'Qarabağ FK - Qalib Turnir Biletlər 2', body: 'Qarabağ FK ev matçı 2 bilet (VIP tribuna), 15 mart 2026.', price: 45, cat: '01KJB9Q9YJK27DGE', filters: [f('01KJB9Q9YJC3DYHD', '01KJB9Q9YJZGKQD2')] },

    // Winter sports
    { id: `${P}029`, title: 'Atomic Redster X9 Xizək Paketi', body: 'Atomic Redster X9 xizəkləri 175sm + çəkmə + direym dəsti, çox az işlənmiş.', price: 1100, cat: '01KJB9Q9YJMZVGBE', filters: [f('01KJB9Q9YJTV3SEH', '01KJB9Q9YJ85VPH5'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHM6JDSN')] },

    // Hunting/Fishing
    { id: `${P}030`, title: 'Shimano Stradic FM Maşalka + Olta', body: 'Shimano Stradic 2500 FM maşalka + Shimano Catana 5 sırıqlı olta.', price: 185, cat: '01KJB9Q9YJ7R6T7Q', filters: [f('01KJB9Q9YJAWEMEK', '01KJB9Q9YJ0VD4TS'), f('01KJB9Q9YHHYVYCR', '01KJB9Q9YHB3N2G2')] },
];

async function main() {
    console.log('🎯 Seeding Hobbies, Sports & Leisure (30)...');
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
    console.log(`✅ Done: ${ok}/30 Hobbies/Sports/Leisure cards.`);
    process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
