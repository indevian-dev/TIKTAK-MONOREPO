/**
 * Seed 30 cards: Elektronika (Electronics)
 * Parent: 01KJB9Q9Y3WMNWJ7
 * Mobile: 01KJB9Q9Y3JXGFRS | Laptop: 01KJB9Q9Y3J27P1J
 * HomeAppliances: 01KJB9Q9Y458367Q | GameConsoles: 01KJB9Q9Y4K46KKG
 * SmartWatches: 01KJB9Q9Y4CNTX2R | Tablets: 01KJB9Q9Y4VTC6B3
 * Run: bun run scripts/seed-cards-elektronika.ts
 */
import { db } from '../lib/database';
import { sql } from 'drizzle-orm';

const WORKSPACE_ID = 'SEED_STORE_001';
const ACCOUNT_ID = '01KJ7KW0AZDSJD7A';
const PREFIX = 'SEED2_EL_';
const PARENT = '01KJB9Q9Y3WMNWJ7';
const PHONE_IMGS = ['iphone-15-pro.jpg', 'phone-closeup.jpg', 'smartphone-modern.jpg', 'phone-back.jpg', 'phone-screen.jpg'];
const LAPTOP_IMGS = ['macbook-pro.jpg', 'laptop-desk.jpg', 'gaming-laptop.jpg', 'laptop-open.jpg', 'laptop-side.jpg'];
const img = (i: number, pool: string[], n = 3) => Array.from({ length: n }, (_, j) => pool[(i + j) % pool.length]);

const LOCS = [
    { lat: 40.4093, lng: 49.8671 }, { lat: 40.4219, lng: 49.8530 }, { lat: 40.3790, lng: 49.8490 },
    { lat: 40.4350, lng: 49.8750 }, { lat: 40.4150, lng: 49.9020 }, { lat: 40.3950, lng: 49.8820 },
];
const loc = (i: number) => LOCS[i % LOCS.length];
const f = (og: string, o: string) => ({ type: 'STATIC', option_id: o, option_group_id: og });

// Mobile filters (01KJB9Q9Y3JXGFRS):
// Brand 01KJB9Q9Y3GN2SC2: Apple=01KJB9Q9Y3WQM6P3 Samsung=01KJB9Q9Y3XH7JFR Xiaomi=01KJB9Q9Y3X6YGCP Honor=01KJB9Q9Y3JE8J06
// Storage 01KJB9Q9Y3M3VFMD: 128GB=01KJB9Q9Y36J8FB8 256GB=01KJB9Q9Y3W7W9CD 512GB=01KJB9Q9Y33KD7W4
// RAM 01KJB9Q9Y3V1207G: 4GB=01KJB9Q9Y3CJB58P 6GB=01KJB9Q9Y3D5BJPZ 8GB=01KJB9Q9Y3G237BQ 12GB=01KJB9Q9Y37SADF9
// Color 01KJB9Q9Y3DNT8G0: Black=01KJB9Q9Y33XT8QW White=01KJB9Q9Y3WQ9FS8 Gold=01KJB9Q9Y33DY2WJ
// Condition(parent) 01KJB9Q9Y3813MR9: New=01KJB9Q9Y3A6GKTM Used=01KJB9Q9Y3E6HW4J
// Delivery(parent) 01KJB9Q9Y36P5EWG: Free=01KJB9Q9Y3JMWKAE  Paid=01KJB9Q9Y3DW3VJX

// Laptop filters (01KJB9Q9Y3J27P1J):
// Brand 01KJB9Q9Y36P8NST: Apple=01KJB9Q9Y3CDH4AM Dell=01KJB9Q9Y3W74JM8 Asus=01KJB9Q9Y3MYP5FQ Lenovo=01KJB9Q9Y36JTB0C
// CPU 01KJB9Q9Y3ET642Y: i5=01KJB9Q9Y4V7DDG3 i7=01KJB9Q9Y44XD0MB M3=01KJB9Q9Y4K7VMYQ Ryzen7=01KJB9Q9Y4WMK0XH
// RAM 01KJB9Q9Y4626D80: 8GB=01KJB9Q9Y4GCH47M 16GB=01KJB9Q9Y4P7AMKF 32GB=01KJB9Q9Y42G8RX6
// Storage 01KJB9Q9Y4TFSK61: 256GB=01KJB9Q9Y4AAMED2 512GB=01KJB9Q9Y4SB9ZK2 1TB=01KJB9Q9Y48XTG8B
// Screen 01KJB9Q9Y4P5104P: 14=01KJB9Q9Y46Q1EVP 15=01KJB9Q9Y4K03Y6V 16=01KJB9Q9Y4CTT44V

const PHONES = [
    { id: `${PREFIX}001`, title: 'iPhone 15 Pro Max 256GB Titanium', body: 'Apple iPhone 15 Pro Max, A17 Pro çip, 48MP kamera, titanium dizayn, yeni.', price: 2899, cat: '01KJB9Q9Y3JXGFRS', filters: [f('01KJB9Q9Y3GN2SC2', '01KJB9Q9Y3WQM6P3'), f('01KJB9Q9Y3M3VFMD', '01KJB9Q9Y3W7W9CD'), f('01KJB9Q9Y3V1207G', '01KJB9Q9Y37SADF9'), f('01KJB9Q9Y3DNT8G0', '01KJB9Q9Y33XT8QW'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM'), f('01KJB9Q9Y36P5EWG', '01KJB9Q9Y3JMWKAE')] },
    { id: `${PREFIX}002`, title: 'Samsung Galaxy S24 Ultra 512GB', body: 'Samsung S24 Ultra, S Pen, 200MP, titanium gray, yeni, zəmanətli.', price: 2499, cat: '01KJB9Q9Y3JXGFRS', filters: [f('01KJB9Q9Y3GN2SC2', '01KJB9Q9Y3XH7JFR'), f('01KJB9Q9Y3M3VFMD', '01KJB9Q9Y33KD7W4'), f('01KJB9Q9Y3V1207G', '01KJB9Q9Y37SADF9'), f('01KJB9Q9Y3DNT8G0', '01KJB9Q9Y33XT8QW'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM'), f('01KJB9Q9Y36P5EWG', '01KJB9Q9Y3JMWKAE')] },
    { id: `${PREFIX}003`, title: 'Xiaomi 14 Ultra - Leica Kamera', body: 'Xiaomi 14 Ultra, Leica 1" kamera, Snapdragon 8 Gen 3, 512GB, yeni.', price: 1799, cat: '01KJB9Q9Y3JXGFRS', filters: [f('01KJB9Q9Y3GN2SC2', '01KJB9Q9Y3X6YGCP'), f('01KJB9Q9Y3M3VFMD', '01KJB9Q9Y33KD7W4'), f('01KJB9Q9Y3V1207G', '01KJB9Q9Y37SADF9'), f('01KJB9Q9Y3DNT8G0', '01KJB9Q9Y33XT8QW'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM')] },
    { id: `${PREFIX}004`, title: 'iPhone 14 Pro 128GB Deep Purple', body: 'iPhone 14 Pro, 128GB, Deep Purple, Dynamic Island, işlənmiş əla vəziyyət.', price: 1399, cat: '01KJB9Q9Y3JXGFRS', filters: [f('01KJB9Q9Y3GN2SC2', '01KJB9Q9Y3WQM6P3'), f('01KJB9Q9Y3M3VFMD', '01KJB9Q9Y36J8FB8'), f('01KJB9Q9Y3V1207G', '01KJB9Q9Y3G237BQ'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3E6HW4J')] },
    { id: `${PREFIX}005`, title: 'Samsung Galaxy A55 5G 256GB', body: 'Samsung A55 5G, AMOLED, 50MP, 5000mAh, yeni, zəmanətli.', price: 599, cat: '01KJB9Q9Y3JXGFRS', filters: [f('01KJB9Q9Y3GN2SC2', '01KJB9Q9Y3XH7JFR'), f('01KJB9Q9Y3M3VFMD', '01KJB9Q9Y3W7W9CD'), f('01KJB9Q9Y3V1207G', '01KJB9Q9Y3G237BQ'), f('01KJB9Q9Y3DNT8G0', '01KJB9Q9Y3WQ9FS8'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM')] },
    { id: `${PREFIX}006`, title: 'iPhone 13 128GB White', body: 'iPhone 13, ağ, 128GB, şarj aleti daxil yeni qutuda.', price: 799, cat: '01KJB9Q9Y3JXGFRS', filters: [f('01KJB9Q9Y3GN2SC2', '01KJB9Q9Y3WQM6P3'), f('01KJB9Q9Y3M3VFMD', '01KJB9Q9Y36J8FB8'), f('01KJB9Q9Y3V1207G', '01KJB9Q9Y3CJB58P'), f('01KJB9Q9Y3DNT8G0', '01KJB9Q9Y3WQ9FS8'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3E6HW4J')] },
    { id: `${PREFIX}007`, title: 'Xiaomi Redmi Note 13 Pro Plus', body: 'Xiaomi 200MP, 120W şarj, AMOLED, 256GB, yeni.', price: 449, cat: '01KJB9Q9Y3JXGFRS', filters: [f('01KJB9Q9Y3GN2SC2', '01KJB9Q9Y3X6YGCP'), f('01KJB9Q9Y3M3VFMD', '01KJB9Q9Y3W7W9CD'), f('01KJB9Q9Y3V1207G', '01KJB9Q9Y3G237BQ'), f('01KJB9Q9Y3DNT8G0', '01KJB9Q9Y33XT8QW'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM'), f('01KJB9Q9Y36P5EWG', '01KJB9Q9Y3JMWKAE')] },
    { id: `${PREFIX}008`, title: 'Honor Magic6 Pro 512GB', body: 'Honor Magic6 Pro, 180MP periskop, 5800mAh, yeni.', price: 1299, cat: '01KJB9Q9Y3JXGFRS', filters: [f('01KJB9Q9Y3GN2SC2', '01KJB9Q9Y3JE8J06'), f('01KJB9Q9Y3M3VFMD', '01KJB9Q9Y33KD7W4'), f('01KJB9Q9Y3V1207G', '01KJB9Q9Y37SADF9'), f('01KJB9Q9Y3DNT8G0', '01KJB9Q9Y33XT8QW'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM')] },
    { id: `${PREFIX}009`, title: 'Samsung S23 FE 256GB', body: 'Samsung S23 FE, 50MP, 4500mAh, işlənmiş yaxşı vəziyyət.', price: 649, cat: '01KJB9Q9Y3JXGFRS', filters: [f('01KJB9Q9Y3GN2SC2', '01KJB9Q9Y3XH7JFR'), f('01KJB9Q9Y3M3VFMD', '01KJB9Q9Y3W7W9CD'), f('01KJB9Q9Y3V1207G', '01KJB9Q9Y3G237BQ'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3E6HW4J')] },
    { id: `${PREFIX}010`, title: 'iPhone 15 128GB Black', body: 'iPhone 15, Dynamic Island, USB-C, 48MP, qara, yeni.', price: 1299, cat: '01KJB9Q9Y3JXGFRS', filters: [f('01KJB9Q9Y3GN2SC2', '01KJB9Q9Y3WQM6P3'), f('01KJB9Q9Y3M3VFMD', '01KJB9Q9Y36J8FB8'), f('01KJB9Q9Y3V1207G', '01KJB9Q9Y3D5BJPZ'), f('01KJB9Q9Y3DNT8G0', '01KJB9Q9Y33XT8QW'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM'), f('01KJB9Q9Y36P5EWG', '01KJB9Q9Y3JMWKAE')] },
];

const LAPTOPS = [
    { id: `${PREFIX}011`, title: 'MacBook Pro M3 Pro 14" 512GB', body: 'Apple MacBook Pro, M3 Pro çip, 18GB RAM, 512GB SSD, Space Black, yeni.', price: 3200, cat: '01KJB9Q9Y3J27P1J', filters: [f('01KJB9Q9Y36P8NST', '01KJB9Q9Y3CDH4AM'), f('01KJB9Q9Y3ET642Y', '01KJB9Q9Y4K7VMYQ'), f('01KJB9Q9Y4626D80', '01KJB9Q9Y4P7AMKF'), f('01KJB9Q9Y4TFSK61', '01KJB9Q9Y4SB9ZK2'), f('01KJB9Q9Y4P5104P', '01KJB9Q9Y46Q1EVP'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM')] },
    { id: `${PREFIX}012`, title: 'MacBook Air M2 15" 256GB', body: 'MacBook Air 15", M2 çip, 8GB RAM, 256GB SSD, Midnight, yeni.', price: 1899, cat: '01KJB9Q9Y3J27P1J', filters: [f('01KJB9Q9Y36P8NST', '01KJB9Q9Y3CDH4AM'), f('01KJB9Q9Y3ET642Y', '01KJB9Q9Y4K7VMYQ'), f('01KJB9Q9Y4626D80', '01KJB9Q9Y4GCH47M'), f('01KJB9Q9Y4TFSK61', '01KJB9Q9Y4AAMED2'), f('01KJB9Q9Y4P5104P', '01KJB9Q9Y4K03Y6V'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM')] },
    { id: `${PREFIX}013`, title: 'Dell XPS 15 i7 OLED 512GB', body: 'Dell XPS 15, i7-13700H, 16GB RAM, 512GB SSD, OLED ekran, yeni.', price: 2499, cat: '01KJB9Q9Y3J27P1J', filters: [f('01KJB9Q9Y36P8NST', '01KJB9Q9Y3W74JM8'), f('01KJB9Q9Y3ET642Y', '01KJB9Q9Y44XD0MB'), f('01KJB9Q9Y4626D80', '01KJB9Q9Y4P7AMKF'), f('01KJB9Q9Y4TFSK61', '01KJB9Q9Y4SB9ZK2'), f('01KJB9Q9Y4P5104P', '01KJB9Q9Y4K03Y6V'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM')] },
    { id: `${PREFIX}014`, title: 'ASUS ROG Strix G16 RTX4060', body: 'ASUS ROG Strix G16, RTX 4060, i7-13650HX, 16GB, 512GB, gaming noutbuk.', price: 2199, cat: '01KJB9Q9Y3J27P1J', filters: [f('01KJB9Q9Y36P8NST', '01KJB9Q9Y3MYP5FQ'), f('01KJB9Q9Y3ET642Y', '01KJB9Q9Y44XD0MB'), f('01KJB9Q9Y4626D80', '01KJB9Q9Y4P7AMKF'), f('01KJB9Q9Y4TFSK61', '01KJB9Q9Y4SB9ZK2'), f('01KJB9Q9Y4P5104P', '01KJB9Q9Y4CTT44V'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM')] },
    { id: `${PREFIX}015`, title: 'Lenovo ThinkPad X1 Carbon G11', body: 'ThinkPad X1 Carbon, i7, 16GB, 512GB, 14" 2.8K OLED, yeni.', price: 2799, cat: '01KJB9Q9Y3J27P1J', filters: [f('01KJB9Q9Y36P8NST', '01KJB9Q9Y36JTB0C'), f('01KJB9Q9Y3ET642Y', '01KJB9Q9Y44XD0MB'), f('01KJB9Q9Y4626D80', '01KJB9Q9Y4P7AMKF'), f('01KJB9Q9Y4TFSK61', '01KJB9Q9Y4SB9ZK2'), f('01KJB9Q9Y4P5104P', '01KJB9Q9Y46Q1EVP'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM')] },
    { id: `${PREFIX}016`, title: 'MacBook Pro M3 16" 1TB', body: 'MacBook Pro 16", M3 Max, 36GB RAM, 1TB SSD, Space Black.', price: 4500, cat: '01KJB9Q9Y3J27P1J', filters: [f('01KJB9Q9Y36P8NST', '01KJB9Q9Y3CDH4AM'), f('01KJB9Q9Y3ET642Y', '01KJB9Q9Y4K7VMYQ'), f('01KJB9Q9Y4626D80', '01KJB9Q9Y42G8RX6'), f('01KJB9Q9Y4TFSK61', '01KJB9Q9Y48XTG8B'), f('01KJB9Q9Y4P5104P', '01KJB9Q9Y4CTT44V'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM')] },
    { id: `${PREFIX}017`, title: 'HP Pavilion 15 Ryzen5 8GB', body: 'HP Pavilion 15, Ryzen 5, 8GB RAM, 256GB SSD, ağ, Windows 11.', price: 799, cat: '01KJB9Q9Y3J27P1J', filters: [f('01KJB9Q9Y36P8NST', '01KJB9Q9Y331S5BN'), f('01KJB9Q9Y3ET642Y', '01KJB9Q9Y4NC21WF'), f('01KJB9Q9Y4626D80', '01KJB9Q9Y4GCH47M'), f('01KJB9Q9Y4TFSK61', '01KJB9Q9Y4AAMED2'), f('01KJB9Q9Y4P5104P', '01KJB9Q9Y4K03Y6V'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM')] },
    { id: `${PREFIX}018`, title: 'Dell Inspiron 15 i5 512GB', body: 'Dell Inspiron 15, i5-13th, 16GB, 512GB SSD, işlənmiş əla.', price: 899, cat: '01KJB9Q9Y3J27P1J', filters: [f('01KJB9Q9Y36P8NST', '01KJB9Q9Y3W74JM8'), f('01KJB9Q9Y3ET642Y', '01KJB9Q9Y4V7DDG3'), f('01KJB9Q9Y4626D80', '01KJB9Q9Y4P7AMKF'), f('01KJB9Q9Y4TFSK61', '01KJB9Q9Y4SB9ZK2'), f('01KJB9Q9Y4P5104P', '01KJB9Q9Y4K03Y6V'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3E6HW4J')] },
];

const APPLIANCES = [
    { id: `${PREFIX}019`, title: 'Samsung 65" QD-OLED 4K TV', body: 'Samsung QD-OLED 65", 4K, 144Hz, Dolby Atmos, Smart TV, yeni.', price: 2899, cat: '01KJB9Q9Y4JRSBM4', filters: [f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM'), f('01KJB9Q9Y36P5EWG', '01KJB9Q9Y3JMWKAE')] },
    { id: `${PREFIX}020`, title: 'Sony PlayStation 5 Disk Version', body: 'PS5, disk versiyası, 2 DualSense, 3 oyun daxildir, yeni.', price: 999, cat: '01KJB9Q9Y4K46KKG', filters: [f('01KJB9Q9Y4Q8AGAT', '01KJB9Q9Y4KM1739'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM')] },
    { id: `${PREFIX}021`, title: 'Apple Watch Ultra 2 49mm', body: 'Apple Watch Ultra 2, Titanium, 49mm, GPS+Cellular, çöl idmanı.', price: 1199, cat: '01KJB9Q9Y4CNTX2R', filters: [f('01KJB9Q9Y4F5JKXD', '01KJB9Q9Y4V41Z5S'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM')] },
    { id: `${PREFIX}022`, title: 'Samsung Galaxy Watch 6 Classic', body: 'Samsung Galaxy Watch 6 Classic, 47mm, əla fitness izləmə.', price: 549, cat: '01KJB9Q9Y4CNTX2R', filters: [f('01KJB9Q9Y4F5JKXD', '01KJB9Q9Y4KWXC59'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM')] },
    { id: `${PREFIX}023`, title: 'Garmin Fenix 7X Solar', body: 'Garmin Fenix 7X, Titanium, solar şarj, 37 gün batareya, maps.', price: 1099, cat: '01KJB9Q9Y4CNTX2R', filters: [f('01KJB9Q9Y4F5JKXD', '01KJB9Q9Y4W8M13Y'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM')] },
    { id: `${PREFIX}024`, title: 'iPad Pro M4 13" 256GB WiFi', body: 'Apple iPad Pro 13", M4 çip, 256GB, WiFi+5G, nano-texture.', price: 1899, cat: '01KJB9Q9Y4VTC6B3', filters: [f('01KJB9Q9Y42QBRCQ', '01KJB9Q9Y40NP6QJ'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM')] },
    { id: `${PREFIX}025`, title: 'Samsung Galaxy Tab S9 Ultra', body: 'Samsung Tab S9 Ultra, 14.6", AMOLED, S Pen daxil, 256GB.', price: 1299, cat: '01KJB9Q9Y4VTC6B3', filters: [f('01KJB9Q9Y42QBRCQ', '01KJB9Q9Y4BY1BWQ'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM')] },
    { id: `${PREFIX}026`, title: 'Xbox Series X + 3 Oyun', body: 'Xbox Series X, 3 oyun daxil, işlənmiş əla vəziyyətdə.', price: 899, cat: '01KJB9Q9Y4K46KKG', filters: [f('01KJB9Q9Y4Q8AGAT', '01KJB9Q9Y41ZE25Z'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3E6HW4J')] },
    { id: `${PREFIX}027`, title: 'Dyson V15 Detect Tozsoran', body: 'Dyson V15 Detect, lazer texnologiyası, LCD ekran, 60 dəq batareya.', price: 1150, cat: '01KJB9Q9Y458367Q', filters: [f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM'), f('01KJB9Q9Y36P5EWG', '01KJB9Q9Y3JMWKAE')] },
    { id: `${PREFIX}028`, title: 'Nintendo Switch OLED', body: 'Nintendo Switch OLED, ağ, 64GB, 2 Joy-Con, yeni.', price: 499, cat: '01KJB9Q9Y4K46KKG', filters: [f('01KJB9Q9Y4Q8AGAT', '01KJB9Q9Y4YRSK37'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM')] },
    { id: `${PREFIX}029`, title: 'Huawei MatePad Pro 13.2"', body: 'Huawei MatePad Pro 13.2", 2.5K OLED, M-Pencil daxil, 256GB.', price: 999, cat: '01KJB9Q9Y4VTC6B3', filters: [f('01KJB9Q9Y42QBRCQ', '01KJB9Q9Y4YX5JCG'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM')] },
    { id: `${PREFIX}030`, title: 'Xiaomi Pad 6 Pro 256GB', body: 'Xiaomi Pad 6 Pro, Snapdragon 8+ Gen 1, 12GB RAM, 256GB.', price: 699, cat: '01KJB9Q9Y4VTC6B3', filters: [f('01KJB9Q9Y42QBRCQ', '01KJB9Q9Y4D3GJ6G'), f('01KJB9Q9Y3813MR9', '01KJB9Q9Y3A6GKTM')] },
];

const ALL = [...PHONES, ...LAPTOPS, ...APPLIANCES];

async function main() {
    console.log('📱 Seeding Electronics cards (30)...');
    let ok = 0;
    for (let i = 0; i < ALL.length; i++) {
        const card = ALL[i];
        const pool = i < 10 ? PHONE_IMGS : LAPTOP_IMGS;
        const images = img(i, pool);
        const cover = images[0];
        try {
            await db.execute(sql`
        INSERT INTO cards (id, created_at, title, is_approved, price, body, account_id, location, images, cover, video, filters_options, categories, workspace_id)
        VALUES (
          ${card.id}, NOW(), ${card.title}, true, ${card.price}, ${card.body},
          ${ACCOUNT_ID}, ${JSON.stringify(loc(i))}::json,
          ${JSON.stringify(images)}::json, ${cover}, null,
          ${JSON.stringify(card.filters)}::jsonb,
          ${JSON.stringify([PARENT, card.cat])}::jsonb,
          ${WORKSPACE_ID}
        )
        ON CONFLICT (id) DO UPDATE SET
          title=EXCLUDED.title, price=EXCLUDED.price, body=EXCLUDED.body,
          images=EXCLUDED.images, cover=EXCLUDED.cover,
          filters_options=EXCLUDED.filters_options, categories=EXCLUDED.categories,
          workspace_id=EXCLUDED.workspace_id, is_approved=true, updated_at=NOW()
      `);
            ok++;
        } catch (e: any) { console.error(`❌ ${card.id}:`, e.message); }
    }
    console.log(`✅ Done: ${ok}/30 Electronics cards inserted.`);
    process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
