import { LocalizedText, Filter, SubCategory, RootCategory } from './categories-1';

function l(text: string): LocalizedText {
    const p = text.split('|');
    return { az: p[0], en: p[1] || p[0], ru: p[2] || p[0] };
}
function f(titleStr: string, type: 'STATIC' | 'DYNAMIC', opts?: string[]): Filter {
    return { title: l(titleStr), type, options: opts?.map(o => ({ title: l(o) })) };
}

const cond = f('Vəziyyəti|Condition|Состояние', 'STATIC', ['Yeni|New|Новый', 'İşlənmiş|Used|Б/у']);
const deliv = f('Çatdırılma|Delivery|Доставка', 'STATIC', ['Pulsuz|Free|Бесплатно', 'Ödənişli|Paid|Платно', 'Yoxdur|No|Нет']);
const gender = f('Cins|Gender|Пол', 'STATIC', ['Kişi|Men|Мужской', 'Qadın|Women|Женский', 'Uniseks|Unisex|Унисекс']);
const sizeW = f('Ölçü (Geyim)|Size|Размер', 'STATIC', ['XXS|XXS|XXS', 'XS|XS|XS', 'S|S|S', 'M|M|M', 'L|L|L', 'XL|XL|XL', 'XXL|XXL|XXL', '3XL|3XL|3XL', '4XL+|4XL+|4XL+']);
const sizeS = f('Ölçü (Ayaqqabı)|Shoe Size|Размер обуви', 'STATIC', ['35|35|35', '36|36|36', '37|37|37', '38|38|38', '39|39|39', '40|40|40', '41|41|41', '42|42|42', '43|43|43', '44|44|44', '45|45|45', '46+|46+|46+']);

export const categoriesData2: RootCategory[] = [
    // 4. Ev və Bağ
    {
        title: l('Ev və Bağ|Home & Garden|Дом и Сад'), icon: 'home', filters: [cond, deliv],
        subcategories: [
            {
                title: l('Ev mebeli|Home furniture|Мебель для дома'),
                filters: [
                    f('Otaq|Room|Комната', 'STATIC', ['Qonaq otağı|Living room|Гостиная', 'Yataq otağı|Bedroom|Спальня', 'Mətbəx|Kitchen|Кухня', 'Uşaq otağı|Kids room|Детская', 'Hamam|Bathroom|Ванная']),
                    f('Növ|Type|Тип', 'STATIC', ['Divan|Sofa|Диван', 'Kreslo|Armchair|Кресло', 'Çarpayı|Bed|Кровать', 'Şkaf|Wardrobe|Шкаф', 'Masa|Table|Стол', 'Stul|Chair|Стул', 'Kitabxana|Bookshelf|Стеллаж', 'Künc mebel|Corner set|Угловой набор']),
                    f('Material|Material|Материал', 'STATIC', ['Taxta|Wood|Дерево', 'Laminat|Laminate|Ламинат', 'Metal|Metal|Металл', 'Dəri|Leather|Кожа', 'Parça|Fabric|Ткань'])
                ]
            },
            {
                title: l('Ofis mebeli|Office furniture|Офисная мебель'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['İş masası|Desk|Рабочий стол', 'Ofis kreslosu|Office chair|Офисное кресло', 'Konfrans masası|Conference table|Конференц-стол', 'Şkaf|Cabinet|Шкаф', 'Rəf|Shelf|Полка', 'Locker|Locker|Локер']),
                    f('Material|Material|Материал', 'STATIC', ['Taxta|Wood|Дерево', 'Metal|Metal|Металл', 'Şüşə|Glass|Стекло'])
                ]
            },
            {
                title: l('Qapılar və Pəncərələr|Doors & Windows|Двери и Окна'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Daxili qapı|Interior door|Межкомнатная дверь', 'Giriş qapısı|Entrance door|Входная дверь', 'Pəncərə|Window|Окно', 'Seyf qapı|Safe door|Сейфовая дверь', 'Sürgülü qapı|Sliding door|Раздвижная дверь']),
                    f('Material|Material|Материал', 'STATIC', ['Taxta|Wood|Дерево', 'Plastik|PVC|Пластик', 'Alüminium|Aluminium|Алюминий', 'Dəmir|Steel|Сталь'])
                ]
            },
            {
                title: l('Ev tekstili|Home textiles|Домашний текстиль'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Yataq dəsti|Bedding set|Постельное белье', 'Pərdə|Curtains|Шторы', 'Xalça|Carpet|Ковер', 'Dəsmal|Towel|Полотенце', 'Yorğan|Quilt|Одеяло', 'Yastıq|Pillow|Подушка', 'Halıça|Rug|Коврик']),
                    f('Ölçü|Size|Размер', 'STATIC', ['Tək|Single|Одноместный', 'Cüt|Double|Двуспальный', 'Kral|King|Королевский', 'Standart|Standard|Стандарт'])
                ]
            },
            {
                title: l('Qab-qacaq və mətbəx ləvazimatları|Kitchenware|Посуда и кухня'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Qazan/Tava seti|Cookware set|Набор кастрюль/сковород', 'Bıçaq dəsti|Knife set|Набор ножей', 'Yeməkxana servizi|Dinner set|Сервиз', 'Çay/Qəhvə dəsti|Tea/Coffee set|Чайный/кофейный сервиз', 'Samovar|Samovar|Самовар', 'Blender/Mikserlər|Blenders/Mixers|Блендеры/Миксеры']),
                    f('Material|Material|Материал', 'STATIC', ['Çuqun|Cast iron|Чугун', 'Alüminium|Aluminum|Алюминий', 'Keramika|Ceramic|Керамика', 'Şüşə|Glass|Стекло', 'Polad|Steel|Сталь'])
                ]
            },
            {
                title: l('İşıqlandırma|Lighting|Освещение'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Çilçıraq|Chandelier|Люстра', 'Spot/Gömülü lampa|Recessed light|Точечный светильник', 'Bra|Sconce|Бра', 'Masa lampası|Table lamp|Настольная лампа', 'Döşəmə lampası|Floor lamp|Торшер', 'Büro lampası|Desk lamp|Настольная лампа']),
                    f('Lampa növü|Bulb type|Тип лампы', 'STATIC', ['LED', 'Enerji qənaətli|Energy saving|Энергосберегающая', 'Halogenlər|Halogen|Галоген', 'Adi|Incandescent|Лампа накаливания'])
                ]
            },
            {
                title: l('Təmir və tikinti materialları|Construction materials|Стройматериалы'),
                filters: [
                    f('Növ|Category|Категория', 'STATIC', ['Kərpic/Blok|Brick/Block|Кирпич/Блок', 'Sement/Gips|Cement/Gypsum|Цемент/Гипс', 'Taxta/Lövhə|Wood/Board|Дерево/Доска', 'Polad konstruksiyalar|Steel structures|Металлоконструкции', 'Kafel/Mərmər|Tiles/Marble|Плитка/Мрамор', 'Boya/Lak|Paint/Varnish|Краска/Лак', 'İzolyasiya|Insulation|Утепление', 'Çatı materialları|Roofing|Кровля'])
                ]
            },
            {
                title: l('Santexnika|Plumbing|Сантехника'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Sink/Lavabo|Sink|Раковина', 'Tualet|Toilet|Унитаз', 'Vanna/Duş|Bath/Shower|Ванна/Душ', 'Qəyyum|Radiator|Радиатор', 'Kran/Boru armaturları|Faucets/Fittings|Краны/Фитинги', 'Su isidici|Water heater|Водонагреватель'])
                ]
            },
            {
                title: l('Bağ mebeli və idman|Garden furniture & leisure|Садовая мебель и досуг'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Bağ dəsti|Garden set|Садовый набор', 'Hamak|Hammock|Гамак', 'Barbeküləri|Barbecue/Grill|Барбекю/Гриль', 'Hovuz|Pool|Бассейн', 'Külək gətirəni|Swing|Качель', 'Uşaq oyun meydançası|Kids playground|Детская площадка'])
                ]
            },
            {
                title: l('Ev bitkiləri|Houseplants|Комнатные растения'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Güllər|Flowers|Цветы', 'Kaktus/Sukkulent|Cactus/Succulent|Кактус/Суккулент', 'Palma/Egzotik|Palm/Exotic|Пальма/Экзотика', 'Ağac/Kol|Tree/Shrub|Дерево/Куст', 'Çiçək toxumu|Seeds|Семена'])
                ]
            },
            {
                title: l('Kənd təsərrüfatı avadanlıqları|Agricultural supplies|Сельскохозяйственные товары'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Toxumlar|Seeds|Семена', 'Gübrələr|Fertilizers|Удобрения', 'Bitki mühafizəsi|Pesticides|Средства защиты растений', 'Suvarma sistemi|Irrigation|Орошение', 'Əl alətləri|Hand tools|Ручные инструменты', 'Ot biçən|Lawn mower|Газонокосилка'])
                ]
            }
        ]
    },
    // 5. Geyim və Aksesuarlar
    {
        title: l('Geyim və Aksesuarlar|Clothing & Accessories|Одежда и аксессуары'), icon: 'clothes', filters: [cond, deliv],
        subcategories: [
            {
                title: l('Qadın geyimləri|Women\'s clothing|Женская одежда'),
                filters: [
                    sizeW,
                    f('Növ|Type|Тип', 'STATIC', ['Don/Ətək|Dress/Skirt|Платье/Юбка', 'Üst geyimi|Outerwear|Верхняя одежда', 'Bluze/Köynək|Blouse/Shirt|Блузка/Рубашка', 'Şalvar/Cins|Pants/Jeans|Брюки/Джинсы', 'Kombinezon|Jumpsuit|Комбинезон', 'İdman geyimi|Sportswear|Спортивная одежда', 'Pijama/Gеcəlik|Sleepwear|Пижама']),
                    f('Mövsüm|Season|Сезон', 'STATIC', ['Yay|Summer|Лето', 'Qış|Winter|Зима', 'Mövsümdən asılı olmayan|All-season|Демисезон'])
                ]
            },
            {
                title: l('Qadın ayaqqabıları|Women\'s shoes|Женская обувь'),
                filters: [
                    sizeS,
                    f('Növ|Type|Тип', 'STATIC', ['Tufli|Heels|Туфли', 'Krossovka|Sneakers|Кроссовки', 'Çəkmə|Boots|Сапоги/Ботинки', 'Sapoq|Ankle boots|Полусапоги', 'Sandal|Sandals|Сандалии', 'Bosoножки|Flip-flops|Шлёпки']),
                    f('Daban hündürlüyü|Heel height|Высота каблука', 'STATIC', ['Düz|Flat|Плоский', 'Alçaq (1-4 sm)|Low (1-4 cm)|Низкий', 'Orta (5-7 sm)|Mid (5-7 cm)|Средний', 'Hündür (8+ sm)|High (8+ cm)|Высокий'])
                ]
            },
            {
                title: l('Kişi geyimləri|Men\'s clothing|Мужская одежда'),
                filters: [
                    sizeW,
                    f('Növ|Type|Тип', 'STATIC', ['Köynək/T-shirt|Shirt/T-shirt|Рубашка/Футболка', 'Üst geyimi|Outerwear|Верхняя одежда', 'Şalvar/Cins|Pants/Jeans|Брюки/Джинсы', 'Kostyum|Suit|Костюм', 'İdman geyimi|Sportswear|Спортивная одежда', 'Pijama|Sleepwear|Пижама']),
                    f('Mövsüm|Season|Сезон', 'STATIC', ['Yay|Summer|Лето', 'Qış|Winter|Зима', 'Mövsümdən asılı olmayan|All-season|Демисезон'])
                ]
            },
            {
                title: l('Kişi ayaqqabıları|Men\'s shoes|Мужская обувь'),
                filters: [
                    sizeS,
                    f('Növ|Type|Тип', 'STATIC', ['Klassik|Classic|Классика', 'Krossovka|Sneakers|Кроссовки', 'Çəkmə|Boots|Ботинки', 'Mokasin|Loafers|Мокасины', 'Sandal|Sandals|Сандалии']),
                    f('Material|Material|Материал', 'STATIC', ['Dəri|Leather|Кожа', 'Süni dəri|Faux leather|Искусственная кожа', 'Tekstil|Textile|Текстиль', 'Zamş|Suede|Замша'])
                ]
            },
            {
                title: l('Gəlinliklər və toy aksesuarları|Wedding dresses & accessories|Свадебные платья и аксессуары'),
                filters: [
                    sizeW,
                    f('Stil|Style|Стиль', 'STATIC', ['Klassik|Classic|Классический', 'Şar ətəkli|Ball gown|Пышное', 'Balıq|Mermaid|Рыбка', 'A-silueт|A-line|А-силует', 'Minimalist|Minimalist|Минималистичный']),
                    f('Rəng|Color|Цвет', 'STATIC', ['Ağ|White|Белый', 'Krem|Cream|Кремовый', 'Gümüşü|Silver|Серебристый', 'Qızılı|Gold|Золотой', 'Rəngli|Colored|Цветное'])
                ]
            },
            {
                title: l('Çantalar və Baqaj|Bags & Luggage|Сумки и багаж'),
                filters: [
                    gender,
                    f('Növ|Type|Тип', 'STATIC', ['Çamadan|Suitcase|Чемодан', 'Kürək çantası|Backpack|Рюкзак', 'Qadın çantası|Handbag|Женская сумка', 'Portfel|Briefcase|Портфель', 'Kəmər çantası|Belt bag|Поясная сумка', 'Pul kisəsi|Wallet|Кошелёк', 'Alış çantası|Tote|Шопер']),
                    f('Material|Material|Материал', 'STATIC', ['Dəri|Leather|Кожа', 'Süni dəri|Faux leather|Искусств. кожа', 'Tekstil|Textile|Ткань', 'Plastik|Plastic|Пластик'])
                ]
            },
            {
                title: l('Saatlar|Watches|Часы'),
                filters: [
                    gender,
                    f('Mexanizm|Movement|Механизм', 'STATIC', ['Kvars|Quartz|Кварцевые', 'Mexaniki|Mechanical|Механические', 'Avtomatik|Automatic|Автоматические']),
                    f('Marka|Brand|Марка', 'STATIC', ['Casio', 'Seiko', 'Tissot', 'Citizen', 'Rolex', 'Omega', 'Orient', 'Digər|Other|Другой'])
                ]
            },
            {
                title: l('Zərgərlik məmulatları|Jewelry|Ювелирные изделия'),
                filters: [
                    gender,
                    f('Növ|Type|Тип', 'STATIC', ['Üzük|Ring|Кольцо', 'Sırğa|Earrings|Серьги', 'Boyunbağı|Necklace|Ожерелье', 'Qolbaq|Bracelet|Браслет', 'Dəst|Set|Комплект', 'Sancaq|Brooch|Брошь']),
                    f('Material|Material|Материал', 'STATIC', ['Qızıl|Gold|Золото', 'Gümüş|Silver|Серебро', 'Platin|Platinum|Платина', 'Bijuteriya|Bijouterie|Бижутерия'])
                ]
            },
            {
                title: l('Gözlüklər və Aksesuarlar|Sunglasses & Accessories|Очки и аксессуары'),
                filters: [
                    gender,
                    f('Növ|Type|Тип', 'STATIC', ['Günəş gözlüyü|Sunglasses|Солнцезащитные очки', 'Optik gözlük|Optical glasses|Очки для зрения', 'Başlıq|Hats & Caps|Головные уборы', 'Kəmər|Belt|Ремень', 'Əlcək|Gloves|Перчатки', 'Şərf|Scarf|Шарф'])
                ]
            }
        ]
    },
    // 6. Uşaq aləmi
    {
        title: l('Uşaq aləmi|Kids & Baby|Детский мир'), icon: 'child', filters: [cond, deliv, gender],
        subcategories: [
            {
                title: l('Uşaq geyimləri|Kids clothing|Детская одежда'),
                filters: [
                    f('Yaş|Age|Возраст', 'STATIC', ['0-3 ay|0-3 months|0-3 мес', '3-6 ay|3-6 months|3-6 мес', '6-12 ay|6-12 months|6-12 мес', '1-2 yaş|1-2 years|1-2 года', '2-4 yaş|2-4 years|2-4 года', '4-6 yaş|4-6 years|4-6 лет', '6-10 yaş|6-10 years|6-10 лет', '10-14 yaş|10-14 years|10-14 лет', '14+ yaş|14+ years|14+ лет']),
                    f('Mövsüm|Season|Сезон', 'STATIC', ['Yay|Summer|Лето', 'Qış|Winter|Зима', 'Mövsümdən asılı olmayan|All season|Демисезон'])
                ]
            },
            {
                title: l('Uşaq ayaqqabıları|Kids shoes|Детская обувь'),
                filters: [
                    sizeS,
                    f('Növ|Type|Тип', 'STATIC', ['Krossovka|Sneakers|Кроссовки', 'Sandal|Sandals|Сандалии', 'Çəkmə|Boots|Ботинки', 'Slipper|Slippers|Тапочки'])
                ]
            },
            {
                title: l('Uşaq otağı mebeli|Kids room furniture|Детская мебель'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Uşaq çarpayısı|Kids bed|Детская кровать', 'Körpə beşiyi|Crib|Колыбель', 'Oyun masası|Play table|Игровой стол', 'Stul|Chair|Стул', 'Şkaf|Wardrobe|Шкаф', 'Rəf|Shelf|Полка']),
                    f('Yaş qrupu|Age group|Возрастная группа', 'STATIC', ['0-3 yaş|0-3 years|0-3 лет', '3-7 yaş|3-7 years|3-7 лет', '7-14 yaş|7-14 years|7-14 лет'])
                ]
            },
            {
                title: l('Oyuncaqlar və əyləncə|Toys & games|Игрушки'),
                filters: [
                    f('Yaş|Age|Возраст', 'STATIC', ['0-2|0-2|0-2', '3-5|3-5|3-5', '6-9|6-9|6-9', '9-12|9-12|9-12', '12+|12+|12+']),
                    f('Növ|Type|Тип', 'STATIC', ['Yumşaq oyuncaq|Soft toy|Мягкая игрушка', 'Konstruktor|Constructor/Lego|Конструктор', 'Lövhə oyunu|Board game|Настольная игра', 'Avtomobil/RC|Car/RC toy|Машинки/RC', 'Kukla|Doll|Кукла', 'Tapmaça|Puzzle|Пазл'])
                ]
            },
            {
                title: l('Uşaq arabaları və oturacaqlar|Strollers & Car seats|Коляски и автокресла'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Universal araba|Universal stroller|Универсальная коляска', 'Yüngül araba|Lightweight stroller|Прогулочная коляска', 'Avto oturacaq|Car seat|Автокресло', 'Manej|Playpen|Манеж', 'Xodunok|Walker|Ходунки', 'Booster oturacaq|Booster seat|Бустер']),
                    f('Yaş qrupu|Age group|Возрастная группа', 'STATIC', ['0-6 ay|0-6 months|0-6 мес', '0-4 yaş|0-4 years|0-4 года', '1-3 yaş|1-3 years|1-3 года', '3-12 yaş|3-12 years|3-12 лет'])
                ]
            },
            {
                title: l('Qidalanma və baxım|Feeding & Care products|Питание и уход'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Körpə qidası|Baby food|Детское питание', 'Körpə düsturu|Baby formula|Молочная смесь', 'Sterilizator|Sterilizer|Стерилизатор', 'Körpə pompa|Breast pump|Молокоотсос', 'Bez|Diapers|Подгузники', 'Həmam vasitəsi|Bath products|Средства для купания'])
                ]
            },
            {
                title: l('Məktəbli ləvazimatları|School supplies|Школьные принадлежности'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Kitablar|Books|Учебники', 'Dəftərlər|Notebooks|Тетради', 'Yazı ləvazimatları|Stationery|Канцтовары', 'Məktəb çantası|School bag|Школьный рюкзак', 'Rəsm ləvazimatları|Art supplies|Принадлежности для рисования'])
                ]
            },
            {
                title: l('Uşaq beşikləri və yataq setləri|Cribs & bedding|Детские кроватки и постельное белье'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Beşik|Crib|Кроватка', 'Yataq dəsti|Bedding set|Постельный набор', 'Matlas|Mattress|Матрас', 'Balış|Pillow|Подушка', 'Yorğan|Blanket|Одеяло'])
                ]
            }
        ]
    },
    // 7. Gözəllik və Sağlamlıq
    {
        title: l('Gözəllik və Sağlamlıq|Beauty & Health|Красота и здоровье'), icon: 'beauty', filters: [cond, deliv],
        subcategories: [
            {
                title: l('Parfümeriya|Perfumes|Парфюмерия'),
                filters: [
                    gender,
                    f('Həcm (ml)|Volume (ml)|Объем (мл)', 'STATIC', ['15ml', '30ml', '50ml', '75ml', '100ml', '150ml', '200ml+']),
                    f('Növ|Type|Тип', 'STATIC', ['Parfüm (EDP)|EDP|EDP (парфюмерная вода)', 'Tualet suyu (EDT)|EDT|EDT (туалетная вода)', 'Deo Kolones|EDC|Одеколон'])
                ]
            },
            {
                title: l('Dekorativ kosmetika|Makeup|Декоративная косметика'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Rəng|Foundation|Тональный крем', 'Konsilyant|Concealer|Консилер', 'Qaş qələmi|Eyebrow pencil|Карандаш для бровей', 'Göz kölgəsi|Eyeshadow|Тени для век', 'Tuşlar|Mascara|Тушь', 'Dodaq boyası|Lipstick|Помада', 'Blusher|Blush/Rouge|Румяна', 'Kist dəsti|Brush set|Набор кистей']),
                    f('Marka|Brand|Марка', 'STATIC', ['L\'Oreal', 'Maybelline', 'MAC', 'NYX', 'Revolution', 'Catrice', 'Digər|Other|Другое'])
                ]
            },
            {
                title: l('Üz və bədən baxımı|Face & body care|Уход за лицом и телом'),
                filters: [
                    gender,
                    f('Növ|Type|Тип', 'STATIC', ['Yuzu|Cleanser/Wash|Умывалка', 'Krem|Cream|Крем', 'Serum|Serum|Сыворотка', 'Maska|Mask|Маска', 'Sürtücü|Scrub|Скраб', 'Loyon|Lotion|Лосьон', 'Badan yağı|Body oil|Масло для тела', 'SPF krem|SPF cream|Крем с SPF'])
                ]
            },
            {
                title: l('Saç baxımı|Hair care|Уход за волосами'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Şampun|Shampoo|Шампунь', 'Balzam|Conditioner|Кондиционер', 'Saç maskası|Hair mask|Маска для волос', 'Saç yağı|Hair oil|Масло для волос', 'Üçün laklar|Hair spray|Лак для волос', 'Saç boyası|Hair dye|Краска для волос']),
                    f('Saç tipi|Hair type|Тип волос', 'STATIC', ['Yağlı|Oily|Жирные', 'Quru|Dry|Сухие', 'Normal|Normal|Нормальные', 'Zərli|Damaged|Поврежденные', 'Rənglənmiş|Color-treated|Окрашенные'])
                ]
            },
            {
                title: l('Çəki atmaq və diet|Weight loss & diet|Похудение и диета'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Yağ yandıranlar|Fat burners|Жиросжигатели', 'Protein tozu|Protein powder|Протеин', 'Detoks/Çay|Detox/Tea|Детокс/Чай', 'Vitamin kompleksləri|Vitamin complexes|Витаминные комплексы'])
                ]
            },
            {
                title: l('Dırnaq baxımı və alətləri|Nail care & tools|Маникюр и инструменты'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Dırnaq lakı|Nail polish|Лак для ногтей', 'Dırnaq geli|Gel polish|Гель-лак', 'UV/LED lampa|UV/LED lamp|UV/LED лампа', 'Dırnaq alətləri|Nail tools set|Набор инструментов', 'Yapışdırma dırnaqlar|Nail tips|Накладные ногти'])
                ]
            },
            {
                title: l('Optika|Optics & lenses|Оптика'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Günlük linza|Daily lenses|Однодневные линзы', 'Aylıq linza|Monthly lenses|Месячные линзы', 'Rəngli linza|Color lenses|Цветные линзы', 'Optik gözlük|Optical frames|Оправы']),
                    f('Dioptri|Dioptres|Диоптрии', 'DYNAMIC')
                ]
            },
            {
                title: l('Tibbi vasitələr və aparatlar|Medical supplies & devices|Медицинские товары'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Tonometr|Blood pressure monitor|Тонометр', 'Qlukometre|Glucometer|Глюкометр', 'Nəbzölçən|Pulse oximeter|Пульсоксиметр', 'Massajçı|Massager|Массажер', 'Invakar|Wheelchair|Инвалидное кресло', 'Krujka|Crutches|Костыли', 'Aptechka|First aid kit|Аптечка', 'Bandaj/Ortez|Bandage/Brace|Бандаж/Ортез'])
                ]
            }
        ]
    }
];
