import { withApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types/next';
import { NextResponse } from 'next/server';
import { S3Client, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
export const POST = withApiHandler(async (req: NextRequest, { authData, params }: ApiHandlerContext) => {
  if (!authData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { filename, filePath } = await req.json();

  if (!filename || !filePath) {
    return NextResponse.json({
      error: 'Filename and filePath are required'
    }, { status: 400 });
  }

  ConsoleLogger.log('Received request to delete:', { filename, filePath });

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
    const deleteParams = {
      Bucket: Bun.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    ConsoleLogger.log('Attempting to delete:', deleteParams);

    // Delete the file from S3
    const deleteCommand = new DeleteObjectCommand(deleteParams);
    await s3Client.send(deleteCommand);
    ConsoleLogger.log('Delete command sent');

    // Verify deletion
    try {
      const headCommand = new HeadObjectCommand(deleteParams);
      await s3Client.send(headCommand);
      return NextResponse.json({
        error: 'File could not be deleted'
      }, { status: 500 });
    } catch (headErr: unknown) {
      const error = headErr as { name?: string };
      if (error.name === 'NotFound') {
        ConsoleLogger.log('File successfully deleted');
        return NextResponse.json({
          message: 'File deleted successfully'
        }, { status: 200 });
      }
      throw headErr;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      error: 'An error occurred while deleting the file',
      details: errorMessage
    }, { status: 500 });
  }
})
