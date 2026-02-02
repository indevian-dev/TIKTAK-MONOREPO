import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { S3Client, AbortMultipartUploadCommand } from "@aws-sdk/client-s3";

export const POST = withApiHandler(async (req: NextRequest, { authData, params }: ApiHandlerContext) => {
    if (!authData) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    if (!resolvedParams?.prefix) {
        return NextResponse.json({ error: 'Prefix is required' }, { status: 400 });
    }

    const { uploadId, key } = await req.json();

    if (!uploadId || !key) {
        return NextResponse.json({
            error: 'uploadId and key are required'
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
        const command = new AbortMultipartUploadCommand({
            Bucket: Bun.env.AWS_S3_BUCKET_NAME,
            Key: key,
            UploadId: uploadId,
        });

        await s3Client.send(command);

        return NextResponse.json({
            success: true,
            message: 'Multipart upload aborted',
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            error: 'Failed to abort multipart upload'
        }, { status: 500 });
    }
});

