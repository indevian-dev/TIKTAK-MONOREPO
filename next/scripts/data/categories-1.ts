export type LocalizedText = { az: string; en: string; ru: string };
export type FilterOption = { title: LocalizedText };
export type Filter = { title: LocalizedText; type: 'STATIC' | 'DYNAMIC'; options?: FilterOption[] };
export type SubCategory = { title: LocalizedText; filters: Filter[] };
export type RootCategory = { title: LocalizedText; icon?: string; filters: Filter[]; subcategories: SubCategory[] };

function l(text: string): LocalizedText {
    const p = text.split('|');
    return { az: p[0], en: p[1] || p[0], ru: p[2] || p[0] };
}

function f(titleStr: string, type: 'STATIC' | 'DYNAMIC', opts?: string[]): Filter {
    return { title: l(titleStr), type, options: opts?.map(o => ({ title: l(o) })) };
}

// 1. Common Filters
const cond = f('Vəziyyəti|Condition|Состояние', 'STATIC', ['Yeni|New|Новый', 'İşlənmiş|Used|Б/у']);
const deliv = f('Çatdırılma|Delivery|Доставка', 'STATIC', ['Pulsuz|Free|Бесплатно', 'Ödənişli|Paid|Платно', 'Yoxdur|No|Нет']);
const gender = f('Cins|Gender|Пол', 'STATIC', ['Kişi|Men|Мужской', 'Qadın|Women|Женский', 'Uniseks|Unisex|Унисекс']);
const barter = f('Barter|Barter|Бартер', 'STATIC', ['Mümkündür|Possible|Возможен', 'Xeyr|No|Нет']);
const credit = f('Kredit|Credit|Кредит', 'STATIC', ['Var|Yes|Есть', 'Yoxdur|No|Нет']);
const guar = f('Zəmanət|Guarantee|Гарантия', 'STATIC', ['Var|Yes|Есть', 'Yoxdur|No|Нет']);

// 2. Real Estate Filters
const deal = f('Əməliyyat növü|Deal Type|Тип сделки', 'STATIC', ['Satış|Sale|Продажа', 'Kirayə|Rent|Аренда', 'Günlük kirayə|Daily rent|Посуточная аренда']);
const rooms = f('Otaq sayı|Rooms|Количество комнат', 'STATIC', ['1|1|1', '2|2|2', '3|3|3', '4|4|4', '5|5|5', '6+|6+|6+']);
const doc = f('Kupça|Document|Купчая', 'STATIC', ['Var|Yes|Есть', 'Yoxdur|No|Нет']);
const repair = f('Təmir|Repair|Ремонт', 'STATIC', ['Təmirsiz|No repair|Без ремонта', 'Zəif|Poor|Слабый', 'Orta|Medium|Средний', 'Yaxşı|Good|Хороший', 'Əla|Excellent|Отличный']);
const project = f('Layihə|Project|Проект', 'STATIC', ['Kiyev|Kiyev|Киевский', 'Xruşşov|Khruşşov|Хрущевка', 'Stalinka|Stalinka|Сталинка', 'Lelinqrad|Leningrad|Ленинградский', 'Minsk|Minsk|Минский', 'Yeni tikili|New|Новостройка']);

// 3. Car Filters
const carBrands = f('Marka|Brand|Марка', 'STATIC', ['BMW|BMW|BMW', 'Mercedes|Mercedes|Mercedes', 'Toyota|Toyota|Toyota', 'Hyundai|Hyundai|Hyundai', 'Kia|Kia|Kia', 'Lada|Lada|Lada', 'Chevrolet|Chevrolet|Chevrolet', 'Audi|Audi|Audi', 'Ford|Ford|Ford', 'Nissan|Nissan|Nissan', 'Opel|Opel|Opel', 'Porsche|Porsche|Porsche', 'Land Rover|Land Rover|Land Rover', 'Lexus|Lexus|Lexus', 'Volkswagen|Volkswagen|Volkswagen', 'Mazda|Mazda|Mazda', 'Mitsubishi|Mitsubishi|Mitsubishi', 'Honda|Honda|Honda', 'Renault|Renault|Renault', 'Skoda|Skoda|Skoda']);
const fuel = f('Yanacaq|Fuel|Топливо', 'STATIC', ['Benzin|Petrol|Бензин', 'Dizel|Diesel|Дизель', 'Qaz|Gas|Газ', 'Elektrik|Electric|Электро', 'Hibrid|Hybrid|Гибрид']);
const gb = f('Sürətlər qutusu|Gearbox|Коробка передач', 'STATIC', ['Avtomat|Automatic|Автомат', 'Mexaniki|Manual|Механика', 'Robot|Robot|Робот', 'Variator|CVT|Вариатор']);
const drive = f('Ötürücü|Drive|Привод', 'STATIC', ['Ön|Front|Передний', 'Arxa|Rear|Задний', 'Tam|AWD|Полный']);
const color = f('Rəng|Color|Цвет', 'STATIC', ['Qara|Black|Черный', 'Ağ|White|Белый', 'Gümüşü|Silver|Серебристый', 'Boz|Gray|Серый', 'Qırmızı|Red|Красный', 'Mavi|Blue|Синий', 'Yaşıl|Green|Зеленый', 'Sarı|Yellow|Желтый', 'Qəhvəyi|Brown|Коричневый']);
const origin = f('Hansı bazar|Market|Какой рынок', 'STATIC', ['Rəsmi Diler|Official Dealer|Официальный дилер', 'Avropa|Europe|Европа', 'Amerika|America|Америка', 'Koreya|Korea|Корея', 'Yaponiya|Japan|Япония', 'Dubay|Dubai|Дубай']);
const yesno = f('Vuruğu var|Crashed|Битый', 'STATIC', ['Bəli|Yes|Да', 'Xeyr|No|Нет']);

// 4. Electronic Filters
const phoneBr = f('Marka|Brand|Марка', 'STATIC', ['Apple', 'Samsung', 'Xiaomi', 'Honor', 'Huawei', 'Google', 'OnePlus', 'Nokia', 'Poco', 'Sony']);
// Phone storage/RAM (starts from 16GB/2GB)
const mem = f('Yaddaş|Storage|Память', 'STATIC', ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB']);
const ram = f('RAM|RAM|ОЗУ', 'STATIC', ['2GB', '4GB', '6GB', '8GB', '12GB', '16GB', '32GB']);
// Laptop storage/RAM (starts from 256GB/8GB — phones and laptops have different standard ranges)
const lapMem = f('Yaddaş|Storage|Память', 'STATIC', ['256GB|256GB|256ГБ', '512GB|512GB|512ГБ', '1TB|1TB|1ТБ', '2TB|2TB|2ТБ', '4TB+|4TB+|4ТБ+']);
const lapRam = f('RAM|RAM|ОЗУ', 'STATIC', ['8GB|8GB|8ГБ', '16GB|16GB|16ГБ', '24GB|24GB|24ГБ', '32GB|32GB|32ГБ', '64GB+|64GB+|64ГБ+']);
const lapBr = f('Marka|Brand|Марка', 'STATIC', ['Apple', 'Asus', 'HP', 'Lenovo', 'Dell', 'Acer', 'MSI']);
const cpu = f('Prosessor|CPU|Процессор', 'STATIC', ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'Apple M1/M2', 'Apple M3/M4']);

// 5. Clothes Filters
const sizeW = f('Ölçü (Geyim)|Size|Размер', 'STATIC', ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL+', 'Standart']);
const sizeS = f('Ölçü (Ayaqqabı)|Shoe Size|Размер обуви', 'STATIC', ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46+']);

// 6. Job Filters
const jobExp = f('Təcrübə|Experience|Опыт', 'STATIC', ['Təcrübəsiz|No experience|Без опыта', '1 ildən az|< 1 year|Менее 1 года', '1-3 il|1-3 years|1-3 года', '3-5 il|3-5 years|3-5 лет', '5+ il|> 5 years|Более 5 лет']);
const jobType = f('İş qrafiki|Schedule|График работы', 'STATIC', ['Tam iş günü|Full-time|Полный рабочий день', 'Yarım iş günü|Part-time|Неполный рабочий день', 'Sərbəst qrafik|Freelance|Свободный график', 'Növbəli|Shift|Сменный график', 'Məsafədən|Remote|Удаленная работа']);

export const categoriesData: RootCategory[] = [
    {
        title: l('Daşınmaz əmlak|Real Estate|Недвижимость'), icon: 'estate', filters: [],
        subcategories: [
            { title: l('Mənzillər|Apartments|Квартиры'), filters: [deal, rooms, repair, doc, project, f('Sahə (m²)|Area (m²)|Площадь (м²)', 'DYNAMIC'), f('Mərtəbə|Floor|Этаж', 'DYNAMIC'), f('Binanın mərtəbə sayı|Total floors|Этажность здания', 'DYNAMIC')] },
            { title: l('Yeni tikililər|New buildings|Новостройки'), filters: [deal, rooms, repair, doc, f('Sahə (m²)|Area (m²)|Площадь (м²)', 'DYNAMIC'), f('Mərtəbə|Floor|Этаж', 'DYNAMIC')] },
            { title: l('Evlər və villalar|Houses & Villas|Дома и виллы'), filters: [deal, rooms, repair, doc, f('Həyətyanı sahə (sot)|Land area (sot)|Участок (сот)', 'DYNAMIC'), f('Evin sahəsi (m²)|House area (m²)|Площадь (м²)', 'DYNAMIC')] },
            { title: l('Torpaq sahələri|Land plots|Земельные участки'), filters: [deal, doc, f('Sahə (sot)|Area (sot)|Площадь (сот)', 'DYNAMIC'), f('Təyinatı|Purpose|Назначение', 'STATIC', ['Yaşayış|Residential|Жилое', 'Kənd təsərrüfatı|Agricultural|Сельскохозяйственное', 'Kommersiya|Commercial|Коммерческое', 'Sənaye|Industrial|Промышленное'])] },
            { title: l('Kommersiya əmlakı|Commercial property|Коммерческая недвижимость'), filters: [deal, repair, doc, f('Sahə (m²)|Area (m²)|Площадь (м²)', 'DYNAMIC'), f('Növ|Type|Тип', 'STATIC', ['Ofis|Office|Офис', 'Mağaza|Shop|Магазин', 'Obyekt|Facility|Объект', 'Anbar|Warehouse|Склад', 'Zavod|Factory|Завод'])] },
            { title: l('Qarajlar|Garages|Гаражи'), filters: [deal, f('Sahə (m²)|Area (m²)|Площадь (м²)', 'DYNAMIC')] }
        ]
    },
    {
        title: l('Nəqliyyat|Transport|Транспорт'), icon: 'car', filters: [cond, barter, credit],
        subcategories: [
            { title: l('Minik avtomobilləri|Cars|Легковые автомобили'), filters: [carBrands, f('Model|Model|Модель', 'DYNAMIC'), fuel, gb, drive, color, origin, yesno, f('Mühərrikin həcmi (sm³)|Engine volume (cc)|Объем двигателя (см³)', 'DYNAMIC'), f('Mühərrikin gücü (a.g.)|Engine power (hp)|Мощность (л.с.)', 'DYNAMIC'), f('Yürüş (km)|Mileage (km)|Пробег (км)', 'DYNAMIC'), f('Buraxılış ili|Year|Год выпуска', 'DYNAMIC'), f('Ban növü|Body type|Тип кузова', 'STATIC', ['Sedan|Sedan|Седан', 'Hetchbek|Hatchback|Хэтчбек', 'Universal|Universal|Универсал', 'Kupe|Coupe|Купе', 'Yolsuzluq|SUV|Внедорожник', 'Krossover|Crossover|Кроссовер', 'Minivan|Minivan|Минивэн', 'Pikap|Pickup|Пикап', 'Kabriolet|Cabriolet|Кабриолет'])] },
            { title: l('Yük maşınları|Trucks|Грузовики'), filters: [fuel, gb, f('Yük tutumu (ton)|Capacity (tons)|Грузоподъемность (тонн)', 'DYNAMIC'), f('Buraxılış ili|Year|Год выпуска', 'DYNAMIC')] },
            { title: l('Motosikletlər və Mopedlər|Motorcycles & Mopeds|Мотоциклы и Мопеды'), filters: [f('Mühərrikin həcmi (sm³)|Engine volume (cc)|Объем двигателя (см³)', 'DYNAMIC'), f('Buraxılış ili|Year|Год выпуска', 'DYNAMIC')] },
            { title: l('Avtobuslar|Buses|Автобусы'), filters: [f('Sərnişin tutumu|Passenger capacity|Вместимость пассажиров', 'DYNAMIC'), f('Buraxılış ili|Year|Год выпуска', 'DYNAMIC')] },
            { title: l('Ehtiyat hissələri və aksesuarlar|Auto parts & accessories|Запчасти и аксессуары'), filters: [f('Növ|Type|Тип', 'STATIC', ['Ehtiyat hissəsi|Mühərrik, transmissiya, asqı|Запчасть', 'Aksesuar|Çexol, ayaqaltı, baqaj|Аксессуар', 'Audio, Video, Naviqasiya|Audio, Video|Аудио, Видео, Навигация', 'Şinlər, disklər|Tires, wheels|Шины, диски', 'Avtokimya|Car chemistry|Автохимия'])] },
            { title: l('Su nəqliyyatı|Water transport|Водный транспорт'), filters: [] },
            { title: l('Xüsusi texnika|Special equipment|Спецтехника'), filters: [] }
        ]
    },
    {
        title: l('Elektronika|Electronics|Электроника'), icon: 'smartphone', filters: [cond, deliv, guar],
        subcategories: [
            { title: l('Mobil telefonlar|Mobile phones|Мобильные телефоны'), filters: [phoneBr, mem, ram, f('Rəng|Color|Цвет', 'STATIC', ['Qara|Black|Черный', 'Ağ|White|Белый', 'Gümüşü|Silver|Серебристый', 'Boz|Gray|Серый', 'Qırmızı|Red|Красный', 'Mavi|Blue|Синий', 'Qrafit|Graphite|Графитовый', 'Qızılı|Gold|Золотой', 'Bənövşəyi|Purple|Фиолетовый']), f('SIM kart sayı|SIM cards|Количество SIM-карт', 'STATIC', ['1|1|1', '2|2|2'])] },
            { title: l('Noutbuklar|Laptops|Ноутбуки'), filters: [lapBr, cpu, lapRam, lapMem, f('Ekran ölçüsü|Screen size|Диагональ экрана', 'STATIC', ['11"', '12"', '13"', '14"', '15"', '16"', '17"'])] },
            { title: l('Məişət texnikası|Home appliances|Бытовая техника'), filters: [f('Növ|Type|Тип', 'STATIC', ['Soyuducular|Refrigerators|Холодильники', 'Paltaryuyanlar|Washing machines|Стиральные машины', 'Sobalar və qaz peçləri|Ovens|Печи и духовки', 'Qabyuyanlar|Dishwashers|Посудомоечные машины', 'Tozsoranlar|Vacuum cleaners|Пылесосы', 'Mikrodalğalı fırınlar|Microwaves|Микроволновки'])] },
            { title: l('İqlim texnikası|Climate control|Климатическое оборудование'), filters: [f('Növ|Type|Тип', 'STATIC', ['Kondisionerlər|Air conditioners|Кондиционеры', 'İsidicilər|Heaters|Обогреватели', 'Kombilər|Combi boilers|Комби', 'Ventilyatorlar|Fans|Вентиляторы'])] },
            { title: l('TV, Video və Audio|TV, Video & Audio|ТВ, Видео и Аудио'), filters: [f('Növ|Type|Тип', 'STATIC', ['Televizorlar|Televisions|Телевизоры', 'Proyektorlar|Projectors|Проекторы', 'Ev sineması|Home cinema|Домашние кинотеатры', 'Dinamiklər|Speakers|Акустика', 'Qulaqlıqlar|Headphones|Наушники'])] },
            { title: l('Kompüter və ehtiyat hissələri|Computers & components|Компьютеры и комплектующие'), filters: [f('Növ|Type|Тип', 'STATIC', ['Masaüstü kompüterlər|Destkops|Настольные ПК', 'Monitorlar|Monitors|Мониторы', 'Ana platalar|Motherboards|Материнские платы', 'Prosessorlar|CPUs|Процессоры', 'Videokartlar|GPUs|Видеокарты', 'RAM yaddaş|RAM|Оперативная память'])] },
            { title: l('Oyun aparatları və konsollar|Game consoles|Игровые приставки'), filters: [f('Platforma|Platform|Платформа', 'STATIC', ['PlayStation 5|PlayStation 5|PlayStation 5', 'PlayStation 4|PlayStation 4|PlayStation 4', 'Xbox Series X/S|Xbox Series X/S|Xbox Series X/S', 'Xbox One|Xbox One|Xbox One', 'Nintendo Switch|Nintendo Switch|Nintendo Switch'])] },
            { title: l('Smart saatlar və qolbaqlar|Smartwatches & bands|Умные часы и браслеты'), filters: [f('Marka|Brand|Марка', 'STATIC', ['Apple Watch', 'Samsung Galaxy Watch', 'Xiaomi', 'Huawei', 'Garmin', 'Digər|Other|Другой'])] },
            { title: l('Planşetlər|Tablets|Планшеты'), filters: [f('Marka|Brand|Марка', 'STATIC', ['Apple iPad', 'Samsung Galaxy Tab', 'Xiaomi Pad', 'Lenovo', 'Huawei'])] }
        ]
    }
];
