import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import {
    S3Client,
    CompleteMultipartUploadCommand
} from "@aws-sdk/client-s3";

export const POST = withApiHandler(async (req: NextRequest, { authData, params }: ApiHandlerContext) => {
    if (!authData) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    if (!resolvedParams?.prefix) {
        return NextResponse.json({ error: 'Prefix is required' }, { status: 400 });
    }

    const { uploadId, key, parts } = await req.json();

    if (!uploadId || !key || !parts || !Array.isArray(parts)) {
        return NextResponse.json({
            error: 'uploadId, key, and parts array are required'
        }, { status: 400 });
    }

    // Validate parts structure
    for (const part of parts) {
        if (!part.ETag || !part.PartNumber) {
            return NextResponse.json({
                error: 'Each part must have ETag and PartNumber'
            }, { status: 400 });
        }
    }

    const s3Client = new S3Client({
        region: Bun.env.AWS_REGION || 'global',
        endpoint: Bun.env.AWS_S3_ENDPOINT,
        credentials: {
            accessKeyId: Bun.env.AWS_S3_ACCESS_KEY_ID!,
            secretAccessKey: Bun.env.AWS_S3_SECRET_ACCESS_KEY!,
        },
    });

    try {
        // Sort parts by PartNumber
        const sortedParts = [...parts].sort((a: any, b: any) => a.PartNumber - b.PartNumber);

        const command = new CompleteMultipartUploadCommand({
            Bucket: Bun.env.AWS_S3_BUCKET_NAME,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: { Parts: sortedParts },
        });

        const response = await s3Client.send(command);

        return NextResponse.json({
            success: true,
            location: response.Location,
            key: response.Key,
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            error: 'Failed to complete multipart upload'
        }, { status: 500 });
    }
});

