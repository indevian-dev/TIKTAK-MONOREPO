BEGIN;

-- ==========================================
-- Rəqəmsal və Qeydiyyat / Digital & Registration / Реквизиты и номера
-- ==========================================
INSERT INTO categories (id, title, is_active, parent_id, has_options, type) VALUES ('01KJB9Q9YXFE9G8M', '{"az":"Rəqəmsal və Qeydiyyat","en":"Digital & Registration","ru":"Реквизиты и номера"}', true, NULL, false, 'normal');
INSERT INTO categories (id, title, is_active, parent_id, has_options, type) VALUES ('01KJB9Q9YXYH4TZC', '{"az":"Avtomobil qeydiyyat nişanları (VIP)","en":"Car VIP plates","ru":"ВИП авто номера"}', true, '01KJB9Q9YXFE9G8M', true, 'normal');
INSERT INTO category_filters (id, category_id, title, type, "order") VALUES ('01KJB9Q9YXFH0Q57', '01KJB9Q9YXYH4TZC', '{"az":"Format","en":"Format","ru":"Формат"}', 'STATIC', 0);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YXHTGET0', '01KJB9Q9YXFH0Q57', '{"az":"00-AA-000","en":"00-AA-000","ru":"00-AA-000"}', 0);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YXZGF085', '01KJB9Q9YXFH0Q57', '{"az":"00-00-AAA","en":"00-00-AAA","ru":"00-00-AAA"}', 1);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YXD7N15V', '01KJB9Q9YXFH0Q57', '{"az":"11-11-111","en":"11-11-111","ru":"11-11-111"}', 2);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YX5DTA0Q', '01KJB9Q9YXFH0Q57', '{"az":"00-01-111","en":"00-01-111","ru":"00-01-111"}', 3);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YXRG2T94', '01KJB9Q9YXFH0Q57', '{"az":"Xüsusi","en":"Custom","ru":"Спецномер"}', 4);
INSERT INTO category_filters (id, category_id, title, type, "order") VALUES ('01KJB9Q9YXWKJHQN', '01KJB9Q9YXYH4TZC', '{"az":"Region kodu","en":"Region code","ru":"Код региона"}', 'DYNAMIC', 1);
INSERT INTO categories (id, title, is_active, parent_id, has_options, type) VALUES ('01KJB9Q9YXBW1BFX', '{"az":"Mobil nömrələr (VIP)","en":"Mobile VIP numbers","ru":"ВИП моб. номера"}', true, '01KJB9Q9YXFE9G8M', true, 'normal');
INSERT INTO category_filters (id, category_id, title, type, "order") VALUES ('01KJB9Q9YXGX94QM', '01KJB9Q9YXBW1BFX', '{"az":"Operator","en":"Operator","ru":"Оператор"}', 'STATIC', 0);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YXH7W0HN', '01KJB9Q9YXGX94QM', '{"az":"Azercell","en":"Azercell","ru":"Azercell"}', 0);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YX9B768Q', '01KJB9Q9YXGX94QM', '{"az":"Bakcell","en":"Bakcell","ru":"Bakcell"}', 1);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YXSCSC4N', '01KJB9Q9YXGX94QM', '{"az":"Nar","en":"Nar","ru":"Nar"}', 2);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YX0EH8D5', '01KJB9Q9YXGX94QM', '{"az":"Naxtel","en":"Naxtel","ru":"Naxtel"}', 3);
INSERT INTO category_filters (id, category_id, title, type, "order") VALUES ('01KJB9Q9YXN7EWHF', '01KJB9Q9YXBW1BFX', '{"az":"Növ","en":"Number type","ru":"Тип номера"}', 'STATIC', 1);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YXK5P8AC', '01KJB9Q9YXN7EWHF', '{"az":"Qızıl","en":"Gold","ru":"Золотой"}', 0);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YXZ647JM', '01KJB9Q9YXN7EWHF', '{"az":"Gümüşü","en":"Silver","ru":"Серебряный"}', 1);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YX10WPXR', '01KJB9Q9YXN7EWHF', '{"az":"Bürünc","en":"Bronze","ru":"Бронзовый"}', 2);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YXS1YJ95', '01KJB9Q9YXN7EWHF', '{"az":"Xüsusi kombinasiya","en":"Special combo","ru":"Спец. номер"}', 3);
INSERT INTO categories (id, title, is_active, parent_id, has_options, type) VALUES ('01KJB9Q9YXHVMFDQ', '{"az":"Domenlər","en":"Domains","ru":"Домены"}', true, '01KJB9Q9YXFE9G8M', true, 'normal');
INSERT INTO category_filters (id, category_id, title, type, "order") VALUES ('01KJB9Q9YXJJAB1K', '01KJB9Q9YXHVMFDQ', '{"az":"Uzantı","en":"Extension","ru":"Зона"}', 'STATIC', 0);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YXJHTHAS', '01KJB9Q9YXJJAB1K', '{"az":".az","en":".az","ru":".az"}', 0);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YX61B9SJ', '01KJB9Q9YXJJAB1K', '{"az":".com","en":".com","ru":".com"}', 1);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YXVD4Z43', '01KJB9Q9YXJJAB1K', '{"az":".net","en":".net","ru":".net"}', 2);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YXZ4NM8S', '01KJB9Q9YXJJAB1K', '{"az":".org","en":".org","ru":".org"}', 3);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YXJJVT85', '01KJB9Q9YXJJAB1K', '{"az":".info","en":".info","ru":".info"}', 4);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YX2PS484', '01KJB9Q9YXJJAB1K', '{"az":".io","en":".io","ru":".io"}', 5);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YX7P4RV7', '01KJB9Q9YXJJAB1K', '{"az":"Digər","en":"Other","ru":"Другая"}', 6);
INSERT INTO category_filters (id, category_id, title, type, "order") VALUES ('01KJB9Q9YXY5DHNT', '01KJB9Q9YXHVMFDQ', '{"az":"Növ","en":"Type","ru":"Тип"}', 'STATIC', 1);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YXHA47WD', '01KJB9Q9YXY5DHNT', '{"az":"Premium/Qısa","en":"Premium/Short","ru":"Премиум/Короткий"}', 0);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YXM42SFS', '01KJB9Q9YXY5DHNT', '{"az":"Brendin adı","en":"Brand name","ru":"Брендовый"}', 1);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YX47TQCD', '01KJB9Q9YXY5DHNT', '{"az":"Açar söz","en":"Keyword","ru":"Ключевое слово"}', 2);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YX2TC6M5', '01KJB9Q9YXY5DHNT', '{"az":"Adi","en":"Regular","ru":"Обычный"}', 3);
INSERT INTO categories (id, title, is_active, parent_id, has_options, type) VALUES ('01KJB9Q9YXTHGT44', '{"az":"Hazır Veb-saytlar və Tətbiqlər","en":"Ready websites & apps","ru":"Готовые сайты"}', true, '01KJB9Q9YXFE9G8M', true, 'normal');
INSERT INTO category_filters (id, category_id, title, type, "order") VALUES ('01KJB9Q9YXD483BE', '01KJB9Q9YXTHGT44', '{"az":"Növ","en":"Type","ru":"Тип"}', 'STATIC', 0);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YXNNXT3K', '01KJB9Q9YXD483BE', '{"az":"Veb-sayt","en":"Website","ru":"Сайт"}', 0);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YXCD9YQB', '01KJB9Q9YXD483BE', '{"az":"Mobil tətbiq","en":"Mobile app","ru":"Мобильное приложение"}', 1);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YXZJG3GJ', '01KJB9Q9YXD483BE', '{"az":"E-ticarət","en":"E-commerce","ru":"Интернет-магазин"}', 2);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YXS75P0S', '01KJB9Q9YXD483BE', '{"az":"Bloq","en":"Blog","ru":"Блог"}', 3);
INSERT INTO category_filters (id, category_id, title, type, "order") VALUES ('01KJB9Q9YX9E9CA6', '01KJB9Q9YXTHGT44', '{"az":"Monetizasiya","en":"Monetization","ru":"Монетизация"}', 'STATIC', 1);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YX8BZHSG', '01KJB9Q9YX9E9CA6', '{"az":"Aktiv gəlir var","en":"Active income","ru":"Активный доход"}', 0);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YX8CA0HM', '01KJB9Q9YX9E9CA6', '{"az":"Gəlirsiz/Yeni","en":"No income/New","ru":"Без дохода/Новый"}', 1);
INSERT INTO categories (id, title, is_active, parent_id, has_options, type) VALUES ('01KJB9Q9YYW4YNM6', '{"az":"Hesablar və Oyun profilləri","en":"Gaming accounts","ru":"Игровые аккаунты"}', true, '01KJB9Q9YXFE9G8M', true, 'normal');
INSERT INTO category_filters (id, category_id, title, type, "order") VALUES ('01KJB9Q9YYRJM45J', '01KJB9Q9YYW4YNM6', '{"az":"Platforma","en":"Platform","ru":"Платформа"}', 'STATIC', 0);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YYQ0SDAN', '01KJB9Q9YYRJM45J', '{"az":"Steam","en":"Steam","ru":"Steam"}', 0);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YY7VAVYT', '01KJB9Q9YYRJM45J', '{"az":"Epic Games","en":"Epic Games","ru":"Epic Games"}', 1);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YYSTTTRS', '01KJB9Q9YYRJM45J', '{"az":"PlayStation","en":"PlayStation","ru":"PlayStation"}', 2);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YYM37JEH', '01KJB9Q9YYRJM45J', '{"az":"Xbox","en":"Xbox","ru":"Xbox"}', 3);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YY77R3HG', '01KJB9Q9YYRJM45J', '{"az":"Riot Games (LoL/Valorant)","en":"Riot Games (LoL/Valorant)","ru":"Riot Games (LoL/Valorant)"}', 4);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YY5W6FRK', '01KJB9Q9YYRJM45J', '{"az":"Mobil","en":"Mobile","ru":"Мобайл"}', 5);
INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('01KJB9Q9YYNGVS3J', '01KJB9Q9YYRJM45J', '{"az":"Sosial Mediya","en":"Social Media","ru":"Соц. сети"}', 6);

COMMIT;
