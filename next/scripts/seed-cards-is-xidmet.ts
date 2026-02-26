/**
 * Seed 30 cards: İş və Xidmətlər (Jobs & Services)
 * Parent: 01KJB9Q9YQ4T79AY
 * Run: bun run scripts/seed-cards-is-xidmet.ts
 */
import { db } from '../lib/database';
import { sql } from 'drizzle-orm';

const WS = 'SEED_STORE_001', ACC = '01KJ7KW0AZDSJD7A', P = 'SEED2_JS_', PARENT = '01KJB9Q9YQ4T79AY';
const IMGS = ['home-repair.jpg', 'photographer.jpg', 'car-wash.jpg'];
const img = (i: number, n = 3) => Array.from({ length: n }, (_, j) => IMGS[(i + j) % IMGS.length]);
const loc = (i: number) => [{ lat: 40.4093, lng: 49.8671 }, { lat: 40.4219, lng: 49.8530 }, { lat: 40.3790, lng: 49.8490 }, { lat: 40.4350, lng: 49.8750 }, { lat: 40.4150, lng: 49.9020 }][i % 5];
const f = (og: string, o: string) => ({ type: 'STATIC', option_id: o, option_group_id: og });

// Parent: 01KJB9Q9YQ4T79AY

// Vakansiyalar 01KJB9Q9YQHED513:
// Industry=01KJB9Q9YQWY1A9D: IT=01KJB9Q9YQBM2RY4 Sales=01KJB9Q9YQV55ERD Finance=01KJB9Q9YQKCWJ6S Edu=01KJB9Q9YQ3B1CP0 Med=01KJB9Q9YQW8Q4GB Logistics=01KJB9Q9YQWYTPN9 Construction=01KJB9Q9YQ0CP07V Tourism=01KJB9Q9YQF6S2RD Admin=01KJB9Q9YQ2PQK1S Prod=01KJB9Q9YR9ARFCY
// Exp=01KJB9Q9YR1WWDPB: None=01KJB9Q9YRQAKX0C <1yr=01KJB9Q9YRRWZTJM 1-3=01KJB9Q9YR7T4V8C 3-5=01KJB9Q9YRPBVFFS 5+=01KJB9Q9YR8BES15
// Schedule=01KJB9Q9YRBPFHEX: Full=01KJB9Q9YRSEWSDZ Part=01KJB9Q9YRXVS1QZ Freelance=01KJB9Q9YRCC0S1J Shift=01KJB9Q9YREQ7D23 Remote=01KJB9Q9YRKWMAEA

// CVlər 01KJB9Q9YRWX0KFQ:
// Industry=01KJB9Q9YR81SH4M: IT=01KJB9Q9YRKK0WP2 Sales=01KJB9Q9YRB682KP Finance=01KJB9Q9YR9TY1YP Edu=01KJB9Q9YRG5NCWX Med=01KJB9Q9YRZDBTJW Logistics=01KJB9Q9YR1A74RT Construction=01KJB9Q9YRNDDBJX Other=01KJB9Q9YRWQMGGR
// Exp=01KJB9Q9YR69YD5P: None=01KJB9Q9YRSKWD67 <1=01KJB9Q9YRNCZVZ1 1-3=01KJB9Q9YRGJH7XS 3-5=01KJB9Q9YR46ANX9 5+=01KJB9Q9YR94XTB4
// Schedule=01KJB9Q9YRXTSG4F: Full=01KJB9Q9YR01F9XA Part=01KJB9Q9YRZT6WXV Freelance=01KJB9Q9YRW8MMMV Shift=01KJB9Q9YR6CEQT4 Remote=01KJB9Q9YRQX6EAC

// Təmir/Tikinti xidmət 01KJB9Q9YR2RTSY2: Type=01KJB9Q9YR1NYYCW Keys=01KJB9Q9YRWGKE3F Plumber=01KJB9Q9YR2CEZRJ Electrician=01KJB9Q9YRV22QCH Painter=01KJB9Q9YRTF28RJ Tiler=01KJB9Q9YRDW65J6 Plaster=01KJB9Q9YRR6FWCK DoorWin=01KJB9Q9YR0FDMME Garden=01KJB9Q9YR8RC23A

// Usta xidmət 01KJB9Q9YR43D0F5: Type=01KJB9Q9YR0X28KQ Furniture=01KJB9Q9YR3VHZA1 Appliance=01KJB9Q9YR1Y11J7 AC=01KJB9Q9YRV5HBMG TV=01KJB9Q9YRV1NVWW Lock=01KJB9Q9YRY966PF

// Avtomobil təmiri 01KJB9Q9YR8RBNTK: Type=01KJB9Q9YR2WVF5V Engine=01KJB9Q9YRD3MFME Body=01KJB9Q9YRQW9XTZ Electric=01KJB9Q9YR5MGAFB Tire=01KJB9Q9YRHAVCXG Oil=01KJB9Q9YRF0MS5N Tinting=01KJB9Q9YR2WMW3B

// Elektronika təmiri 01KJB9Q9YRGS97Y8: Type=01KJB9Q9YR80QTQ7 Phone=01KJB9Q9YRQ317XQ Laptop=01KJB9Q9YRV0TV1V Tablet=01KJB9Q9YRJQBA65 TV=01KJB9Q9YR96WC67 Washer=01KJB9Q9YRKSNSSW Fridge=01KJB9Q9YR9P9RKJ AC=01KJB9Q9YR1AHY54

// Nəqliyyat/Logistika 01KJB9Q9YRMND7SC: Type=01KJB9Q9YRS7QTVS Freight=01KJB9Q9YRAHJEXD Taxi=01KJB9Q9YRA7GZ4T Tow=01KJB9Q9YRQDP4D2 Rental=01KJB9Q9YRGXED2W Courier=01KJB9Q9YREQYXRP

// Təmizlik 01KJB9Q9YRRYBFQW: Type=01KJB9Q9YRDRTAMY General=01KJB9Q9YR6FBCX0 Regular=01KJB9Q9YRH04T1H Window=01KJB9Q9YRBZAAHD Carpet=01KJB9Q9YRYJDDFT Office=01KJB9Q9YRMT1PRD Pipe=01KJB9Q9YRHP8VXN

// Fotostudiya 01KJB9Q9YRPTTCB5: Type=01KJB9Q9YR18B5YA Wedding=01KJB9Q9YR6P76Z6 Commercial=01KJB9Q9YRZ99YMT Portrait=01KJB9Q9YRQKXZAG Drone=01KJB9Q9YRQ09CEC

// Kurslar 01KJB9Q9YRD4NSK8: Subject=01KJB9Q9YRWDBMTZ Lang=01KJB9Q9YR2SXM06 Math=01KJB9Q9YR3PCZ8M IT=01KJB9Q9YRHAEH4P School=01KJB9Q9YR422KQ6 Music=01KJB9Q9YR9A25EW Marketing=01KJB9Q9YRP25AA5
// Format=01KJB9Q9YRJ0Q9J6: Online=01KJB9Q9YRZMWF1S Offline=01KJB9Q9YRW2G7MH Both=01KJB9Q9YR7K2Q9S

// Gözəllik xidmət 01KJB9Q9YR786EHM: Type=01KJB9Q9YR027A8Q Hair=01KJB9Q9YRXYBMQG Manicure=01KJB9Q9YR6NDFP0 Lash=01KJB9Q9YRKP1NP4 Massage=01KJB9Q9YRKEQWE3 Cosmo=01KJB9Q9YR9NSYBD Makeup=01KJB9Q9YRZMMRS2

// Hüquqi 01KJB9Q9YR81X2YJ: Type=01KJB9Q9YRXNCWKR Legal=01KJB9Q9YRWGPGSK Accounting=01KJB9Q9YRM96PQ9 Notary=01KJB9Q9YRCTXMST Contract=01KJB9Q9YRM0TBQ2 BizReg=01KJB9Q9YR7G07WC

// Təşkilat 01KJB9Q9YRGJXH8M: Type=01KJB9Q9YRCEB9NF Wedding=01KJB9Q9YRJASWR6 Corporate=01KJB9Q9YSMZ8183 Kids=01KJB9Q9YS9XG9DS Animator=01KJB9Q9YSSV2TS2 DJ=01KJB9Q9YSSJDQ7Y

const CARDS = [
    // Job Vacancies
    { id: `${P}001`, title: 'Junior React Developer - Hibrid', body: 'React.js junior developer axtarırıq. 6+ ay React. 900-1200 AZN maaş. Hibrid rejim.', price: 1000, cat: '01KJB9Q9YQHED513', filters: [f('01KJB9Q9YQWY1A9D', '01KJB9Q9YQBM2RY4'), f('01KJB9Q9YR1WWDPB', '01KJB9Q9YRRWZTJM'), f('01KJB9Q9YRBPFHEX', '01KJB9Q9YRKWMAEA')] },
    { id: `${P}002`, title: 'Mühasib - Yerli şirkət Bakı', body: 'Ticarət şirkəti mali uçot üçün mühasib axtarır. 1-3 il təcrübə, 1C bilmək.', price: 800, cat: '01KJB9Q9YQHED513', filters: [f('01KJB9Q9YQWY1A9D', '01KJB9Q9YQKCWJ6S'), f('01KJB9Q9YR1WWDPB', '01KJB9Q9YR7T4V8C'), f('01KJB9Q9YRBPFHEX', '01KJB9Q9YRSEWSDZ')] },
    { id: `${P}003`, title: 'İngilis dili müəllimi - İlkin sinif', body: 'Uşaq mərkəzi üçün ingilis dili müəllimi. Tam gün. Sertifikat gərəkli.', price: 700, cat: '01KJB9Q9YQHED513', filters: [f('01KJB9Q9YQWY1A9D', '01KJB9Q9YQ3B1CP0'), f('01KJB9Q9YR1WWDPB', '01KJB9Q9YR7T4V8C'), f('01KJB9Q9YRBPFHEX', '01KJB9Q9YRSEWSDZ')] },
    { id: `${P}004`, title: 'Konditer / Pastacı - Kafe', body: 'Bakı kafesi uzun müddətli konditer/pastacı axtarır. Növbəli qrafik. Yeyim təminatı.', price: 650, cat: '01KJB9Q9YQHED513', filters: [f('01KJB9Q9YQWY1A9D', '01KJB9Q9YQF6S2RD'), f('01KJB9Q9YR1WWDPB', '01KJB9Q9YRRWZTJM'), f('01KJB9Q9YRBPFHEX', '01KJB9Q9YREQ7D23')] },
    { id: `${P}005`, title: 'Satış meneceri - Avtosalon', body: 'Avtosalon üçün satış meneceri. Komissiya + sabit. Sürücülük vəsiqəsi şərt.', price: 1200, cat: '01KJB9Q9YQHED513', filters: [f('01KJB9Q9YQWY1A9D', '01KJB9Q9YQV55ERD'), f('01KJB9Q9YR1WWDPB', '01KJB9Q9YR7T4V8C'), f('01KJB9Q9YRBPFHEX', '01KJB9Q9YRSEWSDZ')] },

    // CVs
    { id: `${P}006`, title: 'Full-stack Developer - 4 il təcrübə', body: 'React/Node.js 4 il. AWS, PostgreSQL, Docker. Uzaqdan işə açığam. 2500+ AZN.', price: 2500, cat: '01KJB9Q9YRWX0KFQ', filters: [f('01KJB9Q9YR81SH4M', '01KJB9Q9YRKK0WP2'), f('01KJB9Q9YR69YD5P', '01KJB9Q9YR46ANX9'), f('01KJB9Q9YRXTSG4F', '01KJB9Q9YRQX6EAC')] },
    { id: `${P}007`, title: 'Marketinq Mütəxəssisi - SMM/Digital', body: 'SMM, Google Ads, Meta Ads, Canva - 2 il. Portfolyo mövcuddur. Hibrid iş.', price: 1000, cat: '01KJB9Q9YRWX0KFQ', filters: [f('01KJB9Q9YR81SH4M', '01KJB9Q9YRB682KP'), f('01KJB9Q9YR69YD5P', '01KJB9Q9YRGJH7XS'), f('01KJB9Q9YRXTSG4F', '01KJB9Q9YRW8MMMV')] },

    // Repair Services
    { id: `${P}008`, title: 'Mənzil Açar Təslimi Təmiri', body: 'Açar təslimi mənzil təmiri, materiallar daxil, 3D layihə + qarantiya.', price: 180, cat: '01KJB9Q9YR2RTSY2', filters: [f('01KJB9Q9YR1NYYCW', '01KJB9Q9YRWGKE3F')] },
    { id: `${P}009`, title: 'Santexnik - Sürətli xidmət', body: 'Santexnik xidmətləri: su sızması, boru dəyişmə, lavabo quraşdırma. Gündəlik.', price: 50, cat: '01KJB9Q9YR2RTSY2', filters: [f('01KJB9Q9YR1NYYCW', '01KJB9Q9YR2CEZRJ')] },
    { id: `${P}010`, title: 'Elektrik xidmətləri - Panel+Kabel', body: 'Elektrik paneli, kabel çəkimi, rozetka/açar quraşdırma, ISO qarantiyalı.', price: 60, cat: '01KJB9Q9YR2RTSY2', filters: [f('01KJB9Q9YR1NYYCW', '01KJB9Q9YRV22QCH')] },
    { id: `${P}011`, title: 'Kafel+metlax ustası', body: 'Hamam, mətbəx kafelçisi. Alucobond da işləyirəm. Nümunə işlər mövcud.', price: 25, cat: '01KJB9Q9YR2RTSY2', filters: [f('01KJB9Q9YR1NYYCW', '01KJB9Q9YRDW65J6')] },
    { id: `${P}012`, title: 'Kondisioner quraşdırma - Certified', body: 'Samsung/LG/Daikin kondisioner quraşdırılması, boşaldılma mövsümü. Sertifikatlı.', price: 80, cat: '01KJB9Q9YR43D0F5', filters: [f('01KJB9Q9YR0X28KQ', '01KJB9Q9YRV5HBMG')] },
    { id: `${P}013`, title: 'Mebel yığım xidməti', body: 'IKEA, BRW, Nomi mebelini yığmağı dəstəkləyirəm. Eyni gün servis. Ucuz.', price: 30, cat: '01KJB9Q9YR43D0F5', filters: [f('01KJB9Q9YR0X28KQ', '01KJB9Q9YR3VHZA1')] },

    // Auto Repair
    { id: `${P}014`, title: 'Motor diagnostikası + yağ dəyişikliyi', body: 'Kompüter diagnostikası + yağ dəyişdirmə (filter + yağ daxil). Bakı Nərimanov.', price: 45, cat: '01KJB9Q9YR8RBNTK', filters: [f('01KJB9Q9YR2WVF5V', '01KJB9Q9YRF0MS5N')] },
    { id: `${P}015`, title: 'Şin balanslanma + quraşdırma', body: '4 şin dəyişdirmə + balans + kilidlər + azot dolumu. Hamısı əhatəli.', price: 40, cat: '01KJB9Q9YR8RBNTK', filters: [f('01KJB9Q9YR2WVF5V', '01KJB9Q9YRHAVCXG')] },
    { id: `${P}016`, title: 'Avtoşüşə qaraldılması (toning)', body: 'Avtomobil şüşəsi qaraldılması, 3M film, zəmanət 2 il. Nərimanov.', price: 120, cat: '01KJB9Q9YR8RBNTK', filters: [f('01KJB9Q9YR2WVF5V', '01KJB9Q9YR2WMW3B')] },

    // Electronics Repair
    { id: `${P}017`, title: 'iPhone Ekran dəyişdirmə - Eyni gün', body: 'iPhone 12/13/14/15 ekran dəyişdirmə. Orijinal panel. Zəmanət 6 ay.', price: 85, cat: '01KJB9Q9YRGS97Y8', filters: [f('01KJB9Q9YR80QTQ7', '01KJB9Q9YRQ317XQ')] },
    { id: `${P}018`, title: 'Noutbuk təmizlənmə + termin pasta', body: 'Noutbuk daxili təmizlənməsi + termal pasta dəyişdirmə. 1 il zəmanət.', price: 35, cat: '01KJB9Q9YRGS97Y8', filters: [f('01KJB9Q9YR80QTQ7', '01KJB9Q9YRV0TV1V')] },
    { id: `${P}019`, title: 'Paltaryuyan maşın təmiri evdə', body: 'Paltaryuyan drenajı, motor, nasos, manjet - evdə gəlib baxıram. Mövcud.', price: 55, cat: '01KJB9Q9YRGS97Y8', filters: [f('01KJB9Q9YR80QTQ7', '01KJB9Q9YRKSNSSW')] },

    // Transport
    { id: `${P}020`, title: 'Yükdaşıma Bakı - Abşeron + Köç', body: 'Bakı içi və Abşeron Rayonlarına köç xidmətləri. Fəhlə + avtomobil. Günlük.', price: 120, cat: '01KJB9Q9YRMND7SC', filters: [f('01KJB9Q9YRS7QTVS', '01KJB9Q9YRAHJEXD')] },
    { id: `${P}021`, title: 'Hava limanı Transfer - 24/7', body: 'Heydar Əliyev hava limanı transferi. Isuzu/Mercedes minivan. Sabit qiymət.', price: 35, cat: '01KJB9Q9YRMND7SC', filters: [f('01KJB9Q9YRS7QTVS', '01KJB9Q9YRA7GZ4T')] },
    { id: `${P}022`, title: 'Kuryer xidməti Bakı - Eyni gün', body: 'Bakı daxili kuryer. Sürətli çatdırılma. Sənəd, ərzaq, hər şeyi daşıyırıq.', price: 8, cat: '01KJB9Q9YRMND7SC', filters: [f('01KJB9Q9YRS7QTVS', '01KJB9Q9YREQYXRP')] },

    // Cleaning
    { id: `${P}023`, title: 'Ümumi təmizlik - 3 otaqlı mənzil', body: 'Professional ümumi təmizlik, bütün materiallar sinimizdən. 3 nəfər brigade.', price: 95, cat: '01KJB9Q9YRRYBFQW', filters: [f('01KJB9Q9YRDRTAMY', '01KJB9Q9YR6FBCX0')] },
    { id: `${P}024`, title: 'Xalça yuma + çatdırılma', body: 'Xalça, kilim, palaz yuma. Evdən aparırıq, yuyuruq, geri gətiririk.', price: 15, cat: '01KJB9Q9YRRYBFQW', filters: [f('01KJB9Q9YRDRTAMY', '01KJB9Q9YRYJDDFT')] },
    { id: `${P}025`, title: 'Ofis həftəlik təmizlik müqaviləsi', body: 'Həftəlik ofis təmizlik müqaviləsi. Materiallar bizdən. Rəsmiləşdirilmiş.', price: 200, cat: '01KJB9Q9YRRYBFQW', filters: [f('01KJB9Q9YRDRTAMY', '01KJB9Q9YRMT1PRD')] },

    // Photo/Video
    { id: `${P}026`, title: 'Toy Fotoqrafı + Videooqraf', body: 'Toy+ad günü foto+video. 12 saatlıq xidmət, 2 operator. Albom+flash drive.', price: 900, cat: '01KJB9Q9YRPTTCB5', filters: [f('01KJB9Q9YR18B5YA', '01KJB9Q9YR6P76Z6')] },
    { id: `${P}027`, title: 'Drone çəkilişi - Tikinti tərəqqisi', body: 'DJI Mavic 3 drone. Tikinti tərəqqi, real-estate turu, reklam çəkilişi.', price: 150, cat: '01KJB9Q9YRPTTCB5', filters: [f('01KJB9Q9YR18B5YA', '01KJB9Q9YRQ09CEC')] },

    // Tutoring
    { id: `${P}028`, title: 'İngilis dili IELTS hazırlığı', body: 'IELTS Academic hazırlığı. 8.0 bandlı müəllim. Onlayn/Offline. 1 aylıq kurs.', price: 180, cat: '01KJB9Q9YRD4NSK8', filters: [f('01KJB9Q9YRWDBMTZ', '01KJB9Q9YR2SXM06'), f('01KJB9Q9YRJ0Q9J6', '01KJB9Q9YR7K2Q9S')] },
    { id: `${P}029`, title: 'Riyaziyyat - Universitetə hazırlıq', body: 'Ali məktəb giriş imtahanı üçün riyaziyyat kursu. Onlayn. 2 ay intensiv.', price: 150, cat: '01KJB9Q9YRD4NSK8', filters: [f('01KJB9Q9YRWDBMTZ', '01KJB9Q9YR3PCZ8M'), f('01KJB9Q9YRJ0Q9J6', '01KJB9Q9YRZMWF1S')] },

    // Beauty Services
    { id: `${P}030`, title: 'Gəlinlik Makyaj + Saç - Evdə', body: 'Toy gəlinliyiniz üçün evdə makyaj + saç düzümü. Portfolio var. Bakı.', price: 200, cat: '01KJB9Q9YR786EHM', filters: [f('01KJB9Q9YR027A8Q', '01KJB9Q9YRZMMRS2')] },
];

async function main() {
    console.log('💼 Seeding Jobs & Services (30)...');
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
    console.log(`✅ Done: ${ok}/30 Jobs & Services cards.`);
    process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
