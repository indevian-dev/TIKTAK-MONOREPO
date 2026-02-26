import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { NextRequest } from 'next/server';
import { S3Client, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { errorResponse, serverErrorResponse, messageResponse } from '@/lib/middleware/Response.Api.middleware';

export const POST = unifiedApiHandler(async (req: NextRequest, { log }) => {
    const { filename, filePath } = await req.json();

    if (!filename || !filePath) {
        return errorResponse('Filename and filePath are required', 400);
    }

    try {
        const s3Client = new S3Client({
            region: Bun.env.AWS_REGION || 'global',
            endpoint: Bun.env.AWS_S3_ENDPOINT,
            credentials: {
                accessKeyId: Bun.env.AWS_S3_ACCESS_KEY_ID!,
                secretAccessKey: Bun.env.AWS_S3_SECRET_ACCESS_KEY!,
            },
        });

        const key = `${filePath}/${filename}`;
        const deleteParams = { Bucket: Bun.env.AWS_S3_BUCKET_NAME, Key: key };

        await s3Client.send(new DeleteObjectCommand(deleteParams));

        // Verify deletion
        try {
            await s3Client.send(new HeadObjectCommand(deleteParams));
            return serverErrorResponse('File could not be deleted');
        } catch (headErr: unknown) {
            const error = headErr as { name?: string };
            if (error.name === 'NotFound') {
                return messageResponse('File deleted successfully');
            }
            throw headErr;
        }
    } catch (error) {
        log?.error('S3 delete error', error as Error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return serverErrorResponse('An error occurred while deleting the file');
    }
});
