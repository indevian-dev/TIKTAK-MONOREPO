import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const POST = withApiHandler(async (req: NextRequest, { authData, params }: ApiHandlerContext) => {
  if (!authData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;
  if (!resolvedParams?.id) {
    return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
  }
  const id = resolvedParams.id;

  const { fileType, fileName } = await req.json();

  if (!fileType) {
    return NextResponse.json({
      error: 'File type is required'
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
    Key: `products/${id}/${fileName}.${fileType.split('/')[1]}`,
    ContentType: fileType,
  };

  try {
    const command = new PutObjectCommand(s3Params);
    const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 600 });
    return NextResponse.json({ uploadURL, fileName }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: 'Error generating pre-signed URL'
    }, { status: 500 });
  }
})
