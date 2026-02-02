import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { S3Client, UploadPartCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const POST = withApiHandler(async (req: NextRequest, { authData, params }: ApiHandlerContext) => {
    if (!authData) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    if (!resolvedParams?.prefix) {
        return NextResponse.json({ error: 'Prefix is required' }, { status: 400 });
    }

    const { uploadId, key, partNumber } = await req.json();

    if (!uploadId || !key || !partNumber) {
        return NextResponse.json({
            error: 'uploadId, key, and partNumber are required'
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

    try {
        const command = new UploadPartCommand({
            Bucket: Bun.env.AWS_S3_BUCKET_NAME,
            Key: key,
            UploadId: uploadId,
            PartNumber: partNumber,
        });

        // 15 minute expiration for each part
        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

        return NextResponse.json({ presignedUrl }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            error: 'Failed to generate presigned URL'
        }, { status: 500 });
    }
});

