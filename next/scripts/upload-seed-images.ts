/**
 * Upload seed images to Cloudflare R2
 * Path: /cards/{workspaceId}/{cardId}/{filename}
 * 
 * Run: bun run scripts/upload-seed-images.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

// ─── Config ───────────────────────────────────────────────────────────────────
const R2_ENDPOINT = process.env.AWS_S3_ENDPOINT!;
const R2_BUCKET = process.env.AWS_S3_BUCKET_NAME!;
const R2_KEY_ID = process.env.AWS_S3_ACCESS_KEY_ID!;
const R2_SECRET = process.env.AWS_S3_SECRET_ACCESS_KEY!;
const WORKSPACE_ID = 'SEED_STORE_001';

const s3 = new S3Client({
    endpoint: R2_ENDPOINT,
    region: 'auto',
    credentials: { accessKeyId: R2_KEY_ID, secretAccessKey: R2_SECRET },
    forcePathStyle: true,
});

const IMAGES_DIR = path.join(import.meta.dirname, 'data', 'images');

// ─── Card ID ↔ image folder mapping ───────────────────────────────────────────
// Each section of 30 cards gets IDs SEED2_001..030 per category
// Filenames per category folder:
export const CATEGORY_IMAGES: Record<string, string[]> = {
    phones: ['iphone-15-pro.jpg', 'phone-closeup.jpg', 'smartphone-modern.jpg', 'phone-back.jpg', 'phone-screen.jpg'],
    laptops: ['macbook-pro.jpg', 'laptop-desk.jpg', 'gaming-laptop.jpg', 'laptop-open.jpg', 'laptop-side.jpg'],
    cars: ['toyota-camry.jpg', 'mercedes-benz.jpg', 'bmw-side.jpg', 'car-interior.jpg', 'suv-mountain.jpg', 'luxury-car.jpg'],
    apartments: ['apartment-living.jpg', 'apartment-bedroom.jpg', 'apartment-kitchen.jpg', 'house-exterior.jpg', 'baku-view.jpg'],
    clothing: ['womens-fashion.jpg', 'mens-jacket.jpg', 'sneakers-nike.jpg', 'leather-bag.jpg', 'wristwatch.jpg'],
    kids: ['baby-stroller.jpg', 'kids-toys.jpg', 'kids-clothing.jpg', 'baby-bed.jpg'],
    beauty: ['perfume-bottle.jpg', 'makeup-set.jpg', 'skincare-cream.jpg', 'hair-products.jpg'],
    sports: ['bicycle-mountain.jpg', 'guitar-fender.jpg', 'boxing-gloves.jpg', 'camping-tent.jpg', 'gym-equipment.jpg'],
    animals: ['golden-retriever.jpg', 'cat-persian.jpg', 'parrot-colorful.jpg', 'dog-puppy.jpg'],
    services: ['home-repair.jpg', 'photographer.jpg', 'car-wash.jpg'],
    business: ['restaurant-kitchen.jpg', 'industrial-machine.jpg', 'coffee-machine.jpg'],
    digital: ['vip-number.jpg', 'domain-web.jpg', 'gaming-account.jpg'],
};

// ─── Mapping: card ID prefix → folder ─────────────────────────────────────────
export const CARD_CATEGORIES: { prefix: string; numCards: number; folder: string }[] = [
    { prefix: 'SEED2_RE_', numCards: 30, folder: 'apartments' },
    { prefix: 'SEED2_TR_', numCards: 30, folder: 'cars' },
    { prefix: 'SEED2_EL_', numCards: 30, folder: 'phones' },
    { prefix: 'SEED2_HG_', numCards: 30, folder: 'apartments' },
    { prefix: 'SEED2_CL_', numCards: 30, folder: 'clothing' },
    { prefix: 'SEED2_KD_', numCards: 30, folder: 'kids' },
    { prefix: 'SEED2_BE_', numCards: 30, folder: 'beauty' },
    { prefix: 'SEED2_SP_', numCards: 30, folder: 'sports' },
    { prefix: 'SEED2_AN_', numCards: 30, folder: 'animals' },
    { prefix: 'SEED2_SV_', numCards: 30, folder: 'services' },
    { prefix: 'SEED2_BZ_', numCards: 30, folder: 'business' },
    { prefix: 'SEED2_DG_', numCards: 30, folder: 'digital' },
    { prefix: 'SEED2_JS_', numCards: 30, folder: 'services' },
    { prefix: 'SEED2_HB_', numCards: 30, folder: 'sports' },
];

function getMimeType(filename: string): string {
    if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'image/jpeg';
    if (filename.endsWith('.png')) return 'image/png';
    if (filename.endsWith('.webp')) return 'image/webp';
    return 'image/jpeg';
}

async function fileExists(key: string): Promise<boolean> {
    try {
        await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
        return true;
    } catch { return false; }
}

async function uploadFile(localPath: string, s3Key: string): Promise<boolean> {
    try {
        const body = fs.readFileSync(localPath);
        const contentType = getMimeType(path.basename(localPath));
        await s3.send(new PutObjectCommand({
            Bucket: R2_BUCKET,
            Key: s3Key,
            Body: body,
            ContentType: contentType,
        }));
        return true;
    } catch (err: any) {
        console.error(`    ❌ Upload failed for ${s3Key}: ${err.message}`);
        return false;
    }
}

async function main() {
    console.log('🚀 Uploading seed images to Cloudflare R2...\n');
    console.log(`   Endpoint: ${R2_ENDPOINT}`);
    console.log(`   Bucket:   ${R2_BUCKET}`);
    console.log(`   Workspace: ${WORKSPACE_ID}\n`);

    let totalUploaded = 0;
    let totalSkipped = 0;
    let totalFailed = 0;

    const manifest: Record<string, { folder: string; images: string[] }> = {};

    for (const cat of CARD_CATEGORIES) {
        const images = CATEGORY_IMAGES[cat.folder] ?? [];
        if (images.length === 0) {
            console.warn(`  ⚠️  No images for folder "${cat.folder}"`);
            continue;
        }

        console.log(`\n📁 ${cat.prefix} (folder: ${cat.folder}, ${cat.numCards} cards)`);

        // For each card, pick 2-3 images from the pool (cycling)
        for (let i = 1; i <= cat.numCards; i++) {
            const cardId = `${cat.prefix}${String(i).padStart(3, '0')}`;
            const cardImages: string[] = [];

            // Assign 2–3 images per card from pool (cycling)
            const numImages = i % 3 === 0 ? 2 : 3;
            for (let j = 0; j < numImages; j++) {
                const img = images[(i + j - 1) % images.length];
                cardImages.push(img);

                const localPath = path.join(IMAGES_DIR, cat.folder, img);
                if (!fs.existsSync(localPath)) {
                    console.warn(`    ⚠️  Local file missing: ${localPath}`);
                    continue;
                }

                const s3Key = `cards/${WORKSPACE_ID}/${cardId}/${img}`;

                if (await fileExists(s3Key)) {
                    totalSkipped++;
                } else {
                    const ok = await uploadFile(localPath, s3Key);
                    if (ok) totalUploaded++;
                    else totalFailed++;
                }
            }

            manifest[cardId] = { folder: cat.folder, images: cardImages };

            if (i % 10 === 0) {
                console.log(`    ✅ ${i}/${cat.numCards} cards processed (${numImages} images each)...`);
            }
        }
    }

    // Save manifest
    const manifestPath = path.join(import.meta.dirname, 'data', 'seed-images-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log('\n═══════════════════════════════════════════════');
    console.log(`✅ Uploaded: ${totalUploaded}`);
    console.log(`⏭️  Skipped:  ${totalSkipped}`);
    console.log(`❌ Failed:   ${totalFailed}`);
    console.log(`📋 Manifest: ${manifestPath}`);
    console.log('═══════════════════════════════════════════════');

    process.exit(0);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
