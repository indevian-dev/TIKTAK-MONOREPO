import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { cards, eq } from '@/db';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
export const PATCH = withApiHandler(async (req: NextRequest, { authData, params , db }: ApiHandlerContext) => {
    if (!authData) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    if (!resolvedParams?.prefix) {
        return NextResponse.json({ error: 'Prefix is required' }, { status: 400 });
    }
    const prefix = Array.isArray(resolvedParams.prefix) ? resolvedParams.prefix[0] : resolvedParams.prefix;

    const { metadata } = await req.json();

    if (!metadata) {
        return NextResponse.json({
            error: 'Metadata is required'
        }, { status: 400 });
    }

    const s3Client = new S3Client({
        region: Bun.env.AWS_REGION || 'global',
        endpoint: Bun.env.AWS_S3_ENDPOINT,
        credentials: {
            accessKeyId: Bun.env.AWS_S3_ACCESS_KEY_ID!,
            secretAccessKey: Bun.env.AWS_S3_SECRET_ACCESS_KEY!,
        },
    });

    const s3Params = {
        Bucket: Bun.env.AWS_S3_BUCKET_NAME,
        Key: `cards/${prefix}/metadata.json`,
        Body: JSON.stringify(metadata, null, 2),
        ContentType: 'application/json',
    };

    try {
        // Update metadata file in S3
        await s3Client.send(new PutObjectCommand(s3Params));

        // Check if this storage_prefix belongs to a card
        const [card] = await db
            .select({ id: cards.id })
            .from(cards)
            .where(eq(cards.storagePrefix, prefix));

        if (card) {
            ConsoleLogger.log('Metadata updated for card storage:', prefix);
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: 'Error updating metadata file'
        }, { status: 500 });
    }
})