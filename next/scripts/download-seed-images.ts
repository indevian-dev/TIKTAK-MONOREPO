/**
 * Download seed images from Unsplash for all category types.
 * Run: bun run scripts/download-seed-images.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const BASE_DIR = path.join(import.meta.dirname, 'data', 'images');

// Unsplash source images (direct download links - 800px wide, no auth needed)
const IMAGES: { folder: string; filename: string; url: string }[] = [
    // PHONES
    { folder: 'phones', filename: 'iphone-15-pro.jpg', url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80&fm=jpg' },
    { folder: 'phones', filename: 'samsung-s24.jpg', url: 'https://images.unsplash.com/photo-1706096959960-52a46bd4c9e6?w=800&q=80&fm=jpg' },
    { folder: 'phones', filename: 'phone-closeup.jpg', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80&fm=jpg' },
    { folder: 'phones', filename: 'smartphone-modern.jpg', url: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&q=80&fm=jpg' },
    { folder: 'phones', filename: 'phone-back.jpg', url: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80&fm=jpg' },
    { folder: 'phones', filename: 'phone-screen.jpg', url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80&fm=jpg' },

    // LAPTOPS
    { folder: 'laptops', filename: 'macbook-pro.jpg', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80&fm=jpg' },
    { folder: 'laptops', filename: 'laptop-desk.jpg', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80&fm=jpg' },
    { folder: 'laptops', filename: 'gaming-laptop.jpg', url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80&fm=jpg' },
    { folder: 'laptops', filename: 'laptop-open.jpg', url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80&fm=jpg' },
    { folder: 'laptops', filename: 'laptop-side.jpg', url: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&q=80&fm=jpg' },

    // CARS
    { folder: 'cars', filename: 'toyota-camry.jpg', url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80&fm=jpg' },
    { folder: 'cars', filename: 'mercedes-benz.jpg', url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80&fm=jpg' },
    { folder: 'cars', filename: 'bmw-side.jpg', url: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&q=80&fm=jpg' },
    { folder: 'cars', filename: 'car-interior.jpg', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&fm=jpg' },
    { folder: 'cars', filename: 'suv-mountain.jpg', url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80&fm=jpg' },
    { folder: 'cars', filename: 'luxury-car.jpg', url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80&fm=jpg' },

    // APARTMENTS
    { folder: 'apartments', filename: 'apartment-living.jpg', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&fm=jpg' },
    { folder: 'apartments', filename: 'apartment-bedroom.jpg', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80&fm=jpg' },
    { folder: 'apartments', filename: 'apartment-kitchen.jpg', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&fm=jpg' },
    { folder: 'apartments', filename: 'house-exterior.jpg', url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80&fm=jpg' },
    { folder: 'apartments', filename: 'baku-view.jpg', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fm=jpg' },

    // CLOTHING
    { folder: 'clothing', filename: 'womens-fashion.jpg', url: 'https://images.unsplash.com/photo-1485125639709-a60c3a500bf1?w=800&q=80&fm=jpg' },
    { folder: 'clothing', filename: 'mens-jacket.jpg', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&fm=jpg' },
    { folder: 'clothing', filename: 'sneakers-nike.jpg', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&fm=jpg' },
    { folder: 'clothing', filename: 'leather-bag.jpg', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80&fm=jpg' },
    { folder: 'clothing', filename: 'wristwatch.jpg', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&fm=jpg' },

    // KIDS
    { folder: 'kids', filename: 'baby-stroller.jpg', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80&fm=jpg' },
    { folder: 'kids', filename: 'kids-toys.jpg', url: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80&fm=jpg' },
    { folder: 'kids', filename: 'kids-clothing.jpg', url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&q=80&fm=jpg' },
    { folder: 'kids', filename: 'baby-bed.jpg', url: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80&fm=jpg' },

    // BEAUTY
    { folder: 'beauty', filename: 'perfume-bottle.jpg', url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80&fm=jpg' },
    { folder: 'beauty', filename: 'makeup-set.jpg', url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80&fm=jpg' },
    { folder: 'beauty', filename: 'skincare-cream.jpg', url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80&fm=jpg' },
    { folder: 'beauty', filename: 'hair-products.jpg', url: 'https://images.unsplash.com/photo-1607008829749-c0f284a49fc4?w=800&q=80&fm=jpg' },

    // SPORTS
    { folder: 'sports', filename: 'bicycle-mountain.jpg', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fm=jpg' },
    { folder: 'sports', filename: 'guitar-fender.jpg', url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80&fm=jpg' },
    { folder: 'sports', filename: 'boxing-gloves.jpg', url: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80&fm=jpg' },
    { folder: 'sports', filename: 'camping-tent.jpg', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80&fm=jpg' },
    { folder: 'sports', filename: 'gym-equipment.jpg', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&fm=jpg' },

    // ANIMALS
    { folder: 'animals', filename: 'golden-retriever.jpg', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80&fm=jpg' },
    { folder: 'animals', filename: 'cat-persian.jpg', url: 'https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=800&q=80&fm=jpg' },
    { folder: 'animals', filename: 'parrot-colorful.jpg', url: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&q=80&fm=jpg' },
    { folder: 'animals', filename: 'dog-puppy.jpg', url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&fm=jpg' },

    // SERVICES
    { folder: 'services', filename: 'home-repair.jpg', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80&fm=jpg' },
    { folder: 'services', filename: 'photographer.jpg', url: 'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=800&q=80&fm=jpg' },
    { folder: 'services', filename: 'car-wash.jpg', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fm=jpg' },

    // BUSINESS
    { folder: 'business', filename: 'restaurant-kitchen.jpg', url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80&fm=jpg' },
    { folder: 'business', filename: 'industrial-machine.jpg', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80&fm=jpg' },
    { folder: 'business', filename: 'coffee-machine.jpg', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&fm=jpg' },

    // DIGITAL
    { folder: 'digital', filename: 'vip-number.jpg', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80&fm=jpg' },
    { folder: 'digital', filename: 'domain-web.jpg', url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80&fm=jpg' },
    { folder: 'digital', filename: 'gaming-account.jpg', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80&fm=jpg' },
];

async function downloadImage(url: string, dest: string): Promise<boolean> {
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const res = await fetch(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 TikTakSeedScript/1.0' },
                signal: AbortSignal.timeout(30000),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const buffer = await res.arrayBuffer();
            fs.writeFileSync(dest, Buffer.from(buffer));
            return true;
        } catch (err: any) {
            if (attempt < maxRetries) {
                console.log(`    Retrying (${attempt}/${maxRetries})...`);
                await new Promise(r => setTimeout(r, 1000 * attempt));
            } else {
                console.error(`    ❌ Failed after ${maxRetries} attempts: ${err.message}`);
                return false;
            }
        }
    }
    return false;
}

async function main() {
    console.log('🖼️  Downloading seed images...\n');
    let ok = 0;
    let fail = 0;

    for (const img of IMAGES) {
        const dir = path.join(BASE_DIR, img.folder);
        const dest = path.join(dir, img.filename);

        if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
            console.log(`  ⏭️  Already exists: ${img.folder}/${img.filename}`);
            ok++;
            continue;
        }

        process.stdout.write(`  ⬇️  ${img.folder}/${img.filename} ...`);
        const success = await downloadImage(img.url, dest);
        if (success) {
            const size = Math.round(fs.statSync(dest).size / 1024);
            console.log(` ✅ (${size}KB)`);
            ok++;
        } else {
            fail++;
        }
    }

    console.log(`\n✅ Done! ${ok} downloaded, ${fail} failed.`);
    process.exit(0);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
