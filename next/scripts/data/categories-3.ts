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
const jobExp = f('Təcrübə|Experience|Опыт', 'STATIC', ['Təcrübəsiz|No experience|Без опыта', '1 ildən az|< 1 year|Менее 1 года', '1-3 il|1-3 years|1-3 года', '3-5 il|3-5 years|3-5 лет', '5+ il|> 5 years|Более 5 лет']);
const jobType = f('İş qrafiki|Schedule|График работы', 'STATIC', ['Tam iş günü|Full-time|Полный рабочий день', 'Yarım iş günü|Part-time|Неполный рабочий день', 'Sərbəst qrafik|Freelance|Свободный график', 'Növbəli|Shift|Сменный', 'Məsafədən|Remote|Удаленная']);

export const categoriesData3: RootCategory[] = [
    // 8. Hobbi, İdman və Əyləncə
    {
        title: l('Hobbi, İdman və Əyləncə|Hobbies, Sports & Leisure|Хобби, спорт и досуг'), icon: 'sport', filters: [cond, deliv],
        subcategories: [
            {
                title: l('İdman geyimləri və ayaqqabıları|Sports apparel & shoes|Спортивная одежда и обувь'),
                filters: [
                    gender,
                    f('Marka|Brand|Марка', 'STATIC', ['Nike', 'Adidas', 'Puma', 'Under Armour', 'Reebok', 'New Balance', 'Digər|Other|Другое']),
                    f('Növ|Type|Тип', 'STATIC', ['Üst geyimi|Tops|Футболки/Топы', 'Şalvar|Pants/Shorts|Штаны/Шорты', 'Krossovka|Sneakers|Кроссовки', 'Kompressiya geyimi|Compression wear|Компрессионная одежда'])
                ]
            },
            {
                title: l('İdman qidalanması|Sports nutrition|Спортивное питание'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Protein tozu|Protein powder|Протеин', 'Kreatinlər|Creatine|Креатин', 'BCAA', 'Gainerlər|Gainer|Гейнер', 'Vitaminlər|Vitamins|Витамины', 'Yağ yandıranlar|Fat burners|Жиросжигатели', 'Zolaqlar/İçkilər|Bars/Drinks|Батончики/Напитки'])
                ]
            },
            {
                title: l('Fitnes trenajorları və ləvazimatları|Fitness equipment|Фитнес тренажеры'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Qaçış aparatı|Treadmill|Беговая дорожка', 'Velotrenajor|Exercise bike|Велотренажер', 'Elliptik trenajor|Elliptical|Эллиптический', 'Güc trenajoru|Strength machine|Силовой тренажер', 'Qantellər/Ştanq|Dumbbells/Barbell|Гантели/Штанга', 'Pilates çubuğu|Exercise mat|Коврик/Пилатес'])
                ]
            },
            {
                title: l('Boks və döyüş sənəti|Boxing & martial arts|Бокс и единоборства'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Boks əlcəkləri|Boxing gloves|Боксёрские перчатки', 'Boks kisəsi|Punching bag|Груша', 'Kask|Headgear|Шлем', 'Kixote|Shin guards|Захисний щиток', 'Кimоno|Kimono/Gi|Кимоно', 'MMA avadanlığı|MMA gear|Экипировка MMA']),
                    f('İdman növü|Sport type|Вид спорта', 'STATIC', ['Boks|Boxing|Бокс', 'Karate|Karate|Карате', 'Cüdo|Judo|Дзюдо', 'Taekwondo|Taekwondo|Тхэквондо', 'MMA|MMA|ММА', 'Mübarizə|Wrestling|Борьба'])
                ]
            },
            {
                title: l('Velosipedlər və aksesuarlar|Bicycles & accessories|Велосипеды'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Dağ|Mountain|Горный', 'Şəhər|City|Городской', 'BMX|BMX|BMX', 'Uşaq|Kids|Детский', 'Elektrik|Electric|Электрический', 'Yarış|Road|Шоссейный']),
                    f('Çərçivə ölçüsü|Frame size|Размер рамы', 'STATIC', ['13"|13"|13"', '15"|15"|15"', '17"|17"|17"', '19"|19"|19"', '21"|21"|21"']),
                    f('Disk sayı|Speeds|Количество скоростей', 'STATIC', ['1 sürət|1 speed|1 скорость', '7 sürət|7 speeds|7 скоростей', '18 sürət|18 speeds|18 скоростей', '21 sürət|21 speeds|21 скорость', '24+ sürət|24+ speeds|24+ скоростей'])
                ]
            },
            {
                title: l('Rollerlər, Skeytbordlar və Skuterlər|Rollers, Skates & Scooters|Ролики, скейты и самокаты'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Rollerlər|Roller skates|Ролики', 'İnlayn rollerlər|Inline skates|Роликовые коньки', 'Skeytbord|Skateboard|Скейтборд', 'Skuter|Scooter|Самокат', 'Elektrik skuter|Electric scooter|Электросамокат'])
                ]
            },
            {
                title: l('Çadırlar və Kembing|Tents & Camping|Палатки и кемпинг'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Çadır|Tent|Палатка', 'Yataq kisəsi|Sleeping bag|Спальный мешок', 'Turistik mat|Camping mat|Туристический коврик', 'Lanternalar|Lanterns|Фонари', 'Portativ ocaq|Portable stove|Портативная плита']),
                    f('Mövsüm|Season|Сезон', 'STATIC', ['3 mövsüm|3-season|3-сезонная', '4 mövsüm|4-season|4-сезонная', 'Yay|Summer|Летняя'])
                ]
            },
            {
                title: l('Qış idman növləri|Winter sports|Зимние виды спорта'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Xizəklər|Ski|Лыжи', 'Snowboard', 'Buzda sürüşmə|Ice skates|Коньки', 'Xizək geyimi|Ski apparel|Горнолыжная одежда', 'Xizək çəkməsi|Ski boots|Горнолыжные ботинки', 'Kask/Eynək|Helmet/Goggles|Шлем/Маска'])
                ]
            },
            {
                title: l('Ovçuluq və Balıqçılıq|Hunting & Fishing|Охота и рыбалка'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Balıq otu/Qarmaq|Fishing rod/Hook|Удочка/Крючок', 'Qayıq|Boat|Лодка', 'Xəz/Yem|Lure/Bait|Приманка/Наживка', 'Balıqçı geyimi|Fishing clothing|Рыболовная одежда', 'Ovçuluq üçün|Hunting equipment|Охотничье снаряжение'])
                ]
            },
            {
                title: l('Musiqi alətləri|Musical instruments|Музыкальные инструменты'),
                filters: [
                    cond,
                    f('Növ|Type|Тип', 'STATIC', ['Gitara|Guitar|Гитара', 'Bas gitara|Bass guitar|Бас-гитара', 'Pianino/Sintezator|Piano/Synth|Пианино/Синтезатор', 'Barabanlər|Drums|Ударные', 'Nəfəsli|Wind|Духовые', 'Skripka|Violin|Скрипка', 'Tar/Saz|Tar/Saz|Тар/Саз', 'Zurna|Zurna|Зурна', 'Studiya avadanlığı|Studio equipment|Студ. оборудование']),
                    f('Marka|Brand|Марка', 'STATIC', ['Yamaha', 'Fender', 'Gibson', 'Roland', 'Casio', 'Digər|Other|Другое'])
                ]
            },
            {
                title: l('Kitablar və jurnallar|Books & Magazines|Книги и журналы'),
                filters: [
                    f('Dil|Language|Язык', 'STATIC', ['Azərbaycan|Azerbaijani|Азербайджанский', 'Rus|Russian|Русский', 'İngilis|English|Английский', 'Türk|Turkish|Турецкий']),
                    f('Janr|Genre|Жанр', 'STATIC', ['Bədii ədəbiyyat|Fiction|Художественная литература', 'Uşaqlar üçün|Kids|Для детей', 'Elmi populyar|Popular Science|Научпоп', 'Tarixi|History|История', 'Biznes|Business|Бизнес', 'Şeir|Poetry|Поэзия', 'Dərslik|Textbook|Учебник', 'Jurnal|Magazine|Журнал'])
                ]
            },
            {
                title: l('Kolleksiya və antikvar|Antiques & collectibles|Антиквариат'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Sikkələr|Coins|Монеты', 'Markalar|Stamps|Марки', 'Əskinaslar|Banknotes|Банкноты', 'Antikvar əşyalar|Antiques|Антиквариат', 'Kolleksioner oyuncaqlar|Collectible toys|Коллекционные игрушки', 'Şəkillər/Rəsmlər|Art/Paintings|Картины']),
                    f('Dövrü|Era|Период', 'STATIC', ['Sovet dövrü|Soviet era|Советская эпоха', 'Çar dövrü|Tsarist era|Царская эпоха', 'Müasir|Modern|Современный'])
                ]
            },
            {
                title: l('Biletlər və Səyahət|Tickets & Travel|Билеты и путешествия'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Konsert/Hadisə|Concert/Event|Концерт/Ивент', 'Kino|Cinema|Кино', 'İdman oyunu|Sports match|Спортивный матч', 'Turizm paketi|Travel package|Тур. пакет', 'Otel|Hotel|Отель'])
                ]
            }
        ]
    },
    // 9. Heyvanlar
    {
        title: l('Heyvanlar|Animals|Животные'), icon: 'paw', filters: [deliv],
        subcategories: [
            {
                title: l('İtlər|Dogs|Собаки'),
                filters: [
                    f('Cins|Breed|Порода', 'DYNAMIC'),
                    f('Yaş|Age|Возраст', 'STATIC', ['Balaca (0-6 ay)|Puppy (0-6 mo)|Щенок (0-6 мес)', '6 ay - 1 il|6 mo - 1 yr|6 мес - 1 год', '1-3 il|1-3 years|1-3 года', '3-7 il|3-7 years|3-7 лет', '7+ il|7+ years|7+ лет']),
                    f('Cins növü|Breed size|Размер', 'STATIC', ['Kiçik|Small|Маленький', 'Orta|Medium|Средний', 'Böyük|Large|Крупный'])
                ]
            },
            {
                title: l('Pişiklər|Cats|Кошки'),
                filters: [
                    f('Cins|Breed|Порода', 'DYNAMIC'),
                    f('Yaş|Age|Возраст', 'STATIC', ['Balaca (0-6 ay)|Kitten (0-6 mo)|Котёнок (0-6 мес)', '6 ay - 1 il|6 mo - 1 yr|6 мес - 1 год', '1-5 il|1-5 years|1-5 лет', '5+ il|5+ years|5+ лет'])
                ]
            },
            {
                title: l('Quşlar|Birds|Птицы'),
                filters: [
                    f('Növ|Species|Вид', 'STATIC', ['Tutuquşu|Parrot|Попугай', 'Kanar|Canary|Канарейка', 'Göyərçin|Pigeon|Голубь', 'Finç|Finch|Зяблик', 'Qızılquş|Eagle/Hawk|Орёл/Ястреб', 'Digər|Other|Другие'])
                ]
            },
            {
                title: l('Kənd təsərrüfatı heyvanları|Farm animals|Сельскохозяйственные животные'),
                filters: [
                    f('Növ|Species|Вид', 'STATIC', ['İnək/Düyə|Cow/Heifer|Корова/Тёлка', 'Qoyun/Keçi|Sheep/Goat|Овца/Коза', 'Donuz|Pig|Свинья', 'At|Horse|Лошадь', 'Ev quşları|Poultry|Птица', 'Arı ailəsi|Bee colony|Пчелосемья'])
                ]
            },
            {
                title: l('Akvarium balıqları və bitkilər|Aquarium fish & plants|Аквариумные рыбки'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Balıqlar|Fish|Рыбки', 'Su bitkiləri|Aquatic plants|Водные растения', 'Akvarium|Aquarium tank|Аквариум', 'Filtr/Nasoslar|Filter/Pumps|Фильтр/Насос'])
                ]
            },
            {
                title: l('Sürünənlər və digərləri|Reptiles & others|Рептилии и прочие'),
                filters: [
                    f('Növ|Species|Вид', 'STATIC', ['Kərtənkələ|Lizard|Ящерица', 'İlan|Snake|Змея', 'Tısbağa|Turtle|Черепаха', 'Xamelon|Chameleon|Хамелеон', 'Əqrəb|Scorpion|Скорпион', 'Digər|Other|Другие'])
                ]
            },
            {
                title: l('Heyvanlar üçün qida|Pet food|Корм для животных'),
                filters: [
                    f('Heyvan növü|Pet type|Тип питомца', 'STATIC', ['İt|Dog|Собака', 'Pişik|Cat|Кошка', 'Quş|Bird|Птица', 'Balıq|Fish|Рыба', 'Digər|Other|Другие']),
                    f('Qida forması|Food format|Форма корма', 'STATIC', ['Quru|Dry|Сухой', 'Yaş/Konserv|Wet/Canned|Влажный/Консервы', 'Xörək|Natural/Raw|Натуральный'])
                ]
            },
            {
                title: l('Heyvan aksesuarları və ləvazimatlar|Pet accessories|Зоотовары и аксессуары'),
                filters: [
                    f('Heyvan növü|Pet type|Тип питомца', 'STATIC', ['İt|Dog|Собака', 'Pişik|Cat|Кошка', 'Quş|Bird|Птица', 'Digər|Other|Другие']),
                    f('Növ|Type|Тип', 'STATIC', ['Daşıyıcı|Carrier/Crate|Переноска', 'Yataq/Yuvası|Bed/House|Лежак/Домик', 'Tasma/Yular|Leash/Collar|Поводок/Ошейник', 'Oyuncaqlar|Toys|Игрушки', 'Qroominq|Grooming|Груминг'])
                ]
            },
            {
                title: l('Baytarlıq preparatları|Veterinary medicines|Ветеринарные препараты'),
                filters: [
                    f('Heyvan növü|Pet type|Тип питомца', 'STATIC', ['İt|Dog|Собака', 'Pişik|Cat|Кошка', 'Quş|Bird|Птица', 'Digər|Other|Другие']),
                    f('Növ|Type|Тип', 'STATIC', ['Parazitlərə qarşı|Antiparasitic|Противопаразитарные', 'Vitaminlər|Vitamins|Витамины', 'Vaksinlər|Vaccines|Вакцины', 'Antibiotiklər|Antibiotics|Антибиотики'])
                ]
            }
        ]
    },
    // 10. İş və Xidmətlər
    {
        title: l('İş və Xidmətlər|Jobs & Services|Работа и услуги'), icon: 'briefcase', filters: [],
        subcategories: [
            {
                title: l('İş elanları (Vakansiyalar)|Job vacancies|Вакансии'),
                filters: [
                    f('Sahə|Industry|Сфера', 'STATIC', ['IT, Proqramlaşdırma|IT, Programming|IT, Программирование', 'Satış / Marketinq|Sales/Marketing|Продажи/Маркетинг', 'Maliyyə/Mühasibat|Finance/Accounting|Финансы/Бухгалтерия', 'Təhsil/Elm|Education|Образование', 'Tibb/Əczaçılıq|Medicine/Pharmacy|Медицина/Фармация', 'Logistika/Sürücü|Logistics/Driver|Логистика/Водитель', 'İnşaat|Construction|Строительство', 'Turizm/Otelçilik|Tourism/Hospitality|Туризм/Гостиничн.', 'İnzibatçılıq|Admin/Office|Административная', 'İstehsalat|Manufacturing|Производство']),
                    jobExp, jobType,
                    f('Maaş (AZN)|Salary (AZN)|Зарплата (AZN)', 'DYNAMIC')
                ]
            },
            {
                title: l('İş axtarıram (Resümelər)|Looking for job (CVs)|Ищу работу'),
                filters: [
                    f('Sahə|Industry|Сфера', 'STATIC', ['IT, Proqramlaşdırma|IT|IT', 'Satış/Marketinq|Sales/Marketing|Продажи/Маркетинг', 'Maliyyə|Finance|Финансы', 'Təhsil|Education|Образование', 'Tibb|Medicine|Медицина', 'Logistika/Sürücü|Logistics|Логистика', 'İnşaat|Construction|Строительство', 'Digər|Other|Другое']),
                    jobExp, jobType
                ]
            },
            {
                title: l('Təmir və Tikinti xidmətləri|Repair & Construction services|Ремонт и строительство'),
                filters: [
                    f('Növ|Service type|Вид услуги', 'STATIC', ['Açar təslimi|Turnkey repair|Ремонт под ключ', 'Santexnik|Plumber|Сантехник', 'Elektrik|Electrician|Электрик', 'Malyar/Rəngsaz|Painter|Маляр', 'Kafel/Metlax|Tiler|Укладка плитки', 'Alçı/Gips|Plastering|Штукатурка/Гипс', 'Qapı/Pəncərə|Door/Window install|Монтаж дверей/окон', 'Bağçalıq|Landscaping|Ландшафтный дизайн'])
                ]
            },
            {
                title: l('Usta xidmətləri|Handyman services|Услуги мастера'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Mebel yığma|Furniture assembly|Сборка мебели', 'Cihaz quraşdırma|Appliance installation|Монтаж техники', 'Kondisioner|AC installation|Установка кондиционера', 'TV asma|TV mounting|Крепление ТВ', 'Çilingər|Locksmith|Слесарные работы'])
                ]
            },
            {
                title: l('Avtomobil təmiri xidmətləri|Auto repair services|Автосервис'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Mühərrik təmiri|Engine repair|Ремонт двигателя', 'Bəlaqabekçi|Body work|Кузовной ремонт', 'Elektrik diagnostika|Electrical diagnostics|Диагностика электрики', 'Şin dəyişdirmə|Tire change|Шиномонтаж', 'Yağ dəyişdirmə|Oil change|Замена масла', 'Toning|Tinting|Тонировка'])
                ]
            },
            {
                title: l('Elektronika və Məişət texnikası təmiri|Electronics repair|Ремонт электроники'),
                filters: [
                    f('Cihaz növü|Device type|Тип устройства', 'STATIC', ['Telefon|Phone|Телефон', 'Noutbuk|Laptop|Ноутбук', 'Planşet|Tablet|Планшет', 'Televizor|TV|Телевизор', 'Paltaryuyan|Washing machine|Стиральная машина', 'Soyuducu|Refrigerator|Холодильник', 'Kondisioner|AC|Кондиционер'])
                ]
            },
            {
                title: l('Nəqliyyat və Logistika|Transport & Moving|Транспорт и логистика'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Yükdaşıma|Freight/Moving|Грузоперевозки/Переезд', 'Taksi/Transfer|Taxi/Transfer|Такси/Трансфер', 'Evakuator|Tow truck|Эвакуатор', 'Avtoicarə|Car rental|Аренда авто', 'Kuryer/Çatdırılma|Courier/Delivery|Курьер/Доставка'])
                ]
            },
            {
                title: l('Təmizlik və Ev xidmətləri|Cleaning services|Клининг'),
                filters: [
                    f('Xidmət növü|Service type|Тип услуги', 'STATIC', ['Ümumi təmizlik|General cleaning|Генеральная уборка', 'Gündəlik təmizlik|Regular cleaning|Регулярная уборка', 'Pəncərə yuma|Window cleaning|Мытьё окон', 'Xalça yuma|Carpet cleaning|Чистка ковров', 'Ofis təmizliyi|Office cleaning|Уборка офиса', 'Sobasının Qazancısı|Chimney/Sewer|Прочистка труб'])
                ]
            },
            {
                title: l('Fotostudiya və Videoçəkiliş|Photo & Video filming|Фото и Видеосъемка'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Toy/Ad günü|Wedding/Birthday|Свадьба/День рождения', 'Reklam/Korporativ|Commercial/Corporate|Реклама/Корпоратив', 'Airbrush/Foto|Portrait/Airstudio|Портрет/Студия', 'Drone/Hava çəkilişi|Drone/Aerial|Дрон/Аэросъемка'])
                ]
            },
            {
                title: l('Təhsil, Kurslar və Rəpətitorluq|Education & Tutoring|Образование и курсы'),
                filters: [
                    f('Sahə|Subject|Предмет', 'STATIC', ['Dil kursları|Language courses|Языковые курсы', 'Riyaziyyat/Fizika|Math/Physics|Математика/Физика', 'IT/Proqramlaşdırma|IT/Programming|IT/Программирование', 'Məktəb fənləri|School subjects|Школьные предметы', 'Musiqi/Rəqs|Music/Dance|Музыка/Танцы', 'Marketinq/Biznes|Marketing/Business|Маркетинг/Бизнес']),
                    f('Format|Format|Формат', 'STATIC', ['Onlayn|Online|Онлайн', 'Offline|Offline|Оффлайн', 'Hər ikisi|Both|Оба'])
                ]
            },
            {
                title: l('Gözəllik və Sağlamlıq xidmətləri|Beauty & Salon services|Услуги красоты'),
                filters: [
                    f('Növ|Service|Услуга', 'STATIC', ['Saç kəsimi/Rəngləmə|Haircut/Coloring|Стрижка/Окрашивание', 'Manikür/Pedikür|Manicure/Pedicure|Маникюр/Педикюр', 'Kirpik-Qaş|Lash/Brow|Брови/Ресницы', 'Massaj|Massage|Массаж', 'Kosmetologiya|Cosmetology|Косметология', 'Makiyaj|Makeup|Макияж'])
                ]
            },
            {
                title: l('Ticarət və Hüquqi xidmətlər|Business & Legal services|Юридические услуги'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Hüquq məsləhəti|Legal advice|Юридическая консультация', 'Mühasibat|Accounting|Бухгалтерия', 'Notariat|Notary|Нотариус', 'Müqavilə hazırlanması|Contract drafting|Составление договора', 'Biznes qeydiyyatı|Business registration|Регистрация бизнеса'])
                ]
            },
            {
                title: l('Təşkilati və Əyləncə xidmətləri|Event organization|Организация мероприятий'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Toy/Ad günü|Wedding/Birthday|Свадьба/День рождения', 'Korporativ|Corporate event|Корпоратив', 'Uşaq tədbirləri|Kids party|Детские праздники', 'Animatçı|Animator|Аниматор', 'Karaoke/DJ|Karaoke/DJ|Karaoke/DJ'])
                ]
            }
        ]
    },
    // 11. Biznes və Avadanlıq
    {
        title: l('Biznes və Avadanlıq|Business & Equipment|Бизнес и оборудование'), icon: 'factory', filters: [cond, deliv],
        subcategories: [
            {
                title: l('Restoran və kafe avadanlıqları|Restaurant & Cafe equipment|Оборудование ресторанов'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Mütfaq avadanlığı|Kitchen equipment|Кухонное оборудование', 'Qəhvə maşını|Coffee machine|Кофемашина', 'Soyuducu Vitrin|Display fridge|Витринный холодильник', 'Pul kassası|POS system/Cash register|Касса/POS', 'Mətbəx havalandırması|Kitchen hood|Вытяжка', 'Frituryalar|Deep fryer|Фритюрница', 'Çörək sobası|Bakery oven|Хлебопекарная печь']),
                    f('Vəziyyəti|Condition|Состояние', 'STATIC', ['Yeni|New|Новый', 'İşlənmiş|Used|Б/у'])
                ]
            },
            {
                title: l('Mağaza avadanlıqları|Shop & Retail equipment|Торговое оборудование'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Ticarət rəfləri|Retail shelves|Торговые стеллажи', 'Manekenlər|Mannequins|Манекены', 'Soyuducu vitrin|Display fridge|Витринный холодильник', 'Pul kassası/POS|Cash register/POS|Касса', 'Əşyalar qabı|Display case|Витрина', 'Geyim asqısı|Clothing rack|Вешалка для одежды'])
                ]
            },
            {
                title: l('Gözəllik salonu avadanlıqları|Beauty salon equipment|Оборудование салонов красоты'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Kresl|Salon chair|Кресло', 'UV/LED lampa|UV/LED lamp|UFO/LED лампа', 'Manikür masası|Nail table|Маникюрный стол', 'Saç kuruducu|Hair dryer|Фен/Сушуар', 'Lazer/Epilasiya aparatı|Laser epilator|Лазер/Эпилятор', 'Massaj masası|Massage table|Массажный стол'])
                ]
            },
            {
                title: l('Tibbi və Kosmetoloji avadanlıqlar|Medical & Cosmetological equipment|Медицинское оборудование'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Stomatoloji kreslo|Dental chair|Стоматологическое кресло', 'UZİ aparatı|Ultrasound machine|УЗИ аппарат', 'Rentgen|X-ray|Рентген', 'Lazer kosmetoloji|Laser cosmetology|Лазерная косметология', 'Massaj aparatı|Medical massager|Медицинский массажёр', 'Tibbi çarpayı|Medical bed|Медицинская кровать'])
                ]
            },
            {
                title: l('Sənaye və Mühəndislik avadanlıqları|Industrial machinery|Промышленное оборудование'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Generator|Generator|Генератор', 'Kompresor|Compressor|Компрессор', 'Qaynaq aparatı|Welding machine|Сварочный аппарат', 'Metal-kəsmə dəzgahı|Metal cutting machine|Станок', 'Konveyer|Conveyor|Конвейер', 'Pompa|Pump|Насос']),
                    f('Güc (kVt)|Power (kW)|Мощность (кВт)', 'DYNAMIC')
                ]
            },
            {
                title: l('Tikinti və Kənd Təsərrüfatı avadanlıqları|Construction & Agricultural equipment|Строительное/с.х. оборудование'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Traktor|Tractor|Трактор', 'Kombain|Combine|Комбайн', 'Ekskavator|Excavator|Экскаватор', 'Buruq maşın|Drilling machine|Бурильная машина', 'Beton qarışdırıcı|Concrete mixer|Бетономешалка', 'Kran|Crane|Кран', 'Buldozer|Bulldozer|Бульдозер'])
                ]
            }
        ]
    },
    // 12. Rəqəmsal və Qeydiyyat
    {
        title: l('Rəqəmsal və Qeydiyyat|Digital & Registration|Реквизиты и номера'), icon: 'monitor', filters: [],
        subcategories: [
            {
                title: l('Avtomobil qeydiyyat nişanları (VIP)|Car VIP plates|ВИП авто номера'),
                filters: [
                    f('Format|Format|Формат', 'STATIC', ['00-AA-000', '00-00-AAA', '11-11-111', '00-01-111', 'Xüsusi|Custom|Спецномер']),
                    f('Region kodu|Region code|Код региона', 'DYNAMIC')
                ]
            },
            {
                title: l('Mobil nömrələr (VIP)|Mobile VIP numbers|ВИП моб. номера'),
                filters: [
                    f('Operator|Operator|Оператор', 'STATIC', ['Azercell', 'Bakcell', 'Nar', 'Naxtel']),
                    f('Növ|Number type|Тип номера', 'STATIC', ['Qızıl|Gold|Золотой', 'Gümüşü|Silver|Серебряный', 'Bürünc|Bronze|Бронзовый', 'Xüsusi kombinasiya|Special combo|Спец. номер'])
                ]
            },
            {
                title: l('Domenlər|Domains|Домены'),
                filters: [
                    f('Uzantı|Extension|Зона', 'STATIC', ['.az|.az|.az', '.com|.com|.com', '.net|.net|.net', '.org|.org|.org', '.info|.info|.info', '.io|.io|.io', 'Digər|Other|Другая']),
                    f('Növ|Type|Тип', 'STATIC', ['Premium/Qısa|Premium/Short|Премиум/Короткий', 'Brendin adı|Brand name|Брендовый', 'Açar söz|Keyword|Ключевое слово', 'Adi|Regular|Обычный'])
                ]
            },
            {
                title: l('Hazır Veb-saytlar və Tətbiqlər|Ready websites & apps|Готовые сайты'),
                filters: [
                    f('Növ|Type|Тип', 'STATIC', ['Veb-sayt|Website|Сайт', 'Mobil tətbiq|Mobile app|Мобильное приложение', 'E-ticarət|E-commerce|Интернет-магазин', 'Bloq|Blog|Блог']),
                    f('Monetizasiya|Monetization|Монетизация', 'STATIC', ['Aktiv gəlir var|Active income|Активный доход', 'Gəlirsiz/Yeni|No income/New|Без дохода/Новый'])
                ]
            },
            {
                title: l('Hesablar və Oyun profilləri|Gaming accounts|Игровые аккаунты'),
                filters: [
                    f('Platforma|Platform|Платформа', 'STATIC', ['Steam', 'Epic Games', 'PlayStation', 'Xbox', 'Riot Games (LoL/Valorant)', 'Mobil|Mobile|Мобайл', 'Sosial Mediya|Social Media|Соц. сети'])
                ]
            }
        ]
    }
];
