import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
    S3Client,
    CreateMultipartUploadCommand
} from "@aws-sdk/client-s3";

export const POST = withApiHandler(async (req: NextRequest, { authData, params }: ApiHandlerContext) => {
    if (!authData) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    if (!resolvedParams?.prefix) {
        return NextResponse.json({
            error: 'Storage prefix is required'
        }, { status: 400 });
    }
    const prefix = resolvedParams.prefix;

    const fileName = `${uuidv4()}.mp4`;
    const s3Key = `cards/${prefix}/video/tmp/${fileName}`;

    const s3Client = new S3Client({
        region: Bun.env.AWS_REGION || 'global',
        endpoint: Bun.env.AWS_S3_ENDPOINT,
        credentials: {
            accessKeyId: Bun.env.AWS_S3_ACCESS_KEY_ID!,
            secretAccessKey: Bun.env.AWS_S3_SECRET_ACCESS_KEY!,
        },
    });

    try {
        const command = new CreateMultipartUploadCommand({
            Bucket: Bun.env.AWS_S3_BUCKET_NAME,
            Key: s3Key,
            ContentType: 'video/mp4',
        });

        const response = await s3Client.send(command);

        return NextResponse.json({
            uploadId: response.UploadId,
            fileName,
            key: s3Key,
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            error: 'Failed to initiate multipart upload'
        }, { status: 500 });
    }
});

