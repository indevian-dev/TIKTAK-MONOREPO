import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { NextRequest } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { okResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const POST = unifiedApiHandler(async (req: NextRequest, { auth, log }) => {
    const accountId = auth?.accountId;
    if (!accountId || accountId === '0') {
        return errorResponse('Account ID is required', 400);
    }

    const { fileType, fileName } = await req.json();

    if (!fileType) {
        return errorResponse('File type is required', 400);
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
        Key: `accounts/${accountId}/${fileName}.${fileType.split('/')[1]}`,
        ContentType: fileType,
    };

    try {
        const command = new PutObjectCommand(s3Params);
        const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 600 });
        return okResponse({ uploadURL, fileName });
    } catch (error) {
        log?.error('S3 upload URL error', error as Error);
        return serverErrorResponse('Error generating pre-signed URL');
    }
});
