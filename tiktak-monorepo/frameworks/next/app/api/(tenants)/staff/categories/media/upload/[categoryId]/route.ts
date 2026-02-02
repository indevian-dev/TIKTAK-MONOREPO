import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { categories, eq } from '@/db';
import { requireIntParam } from '@/lib/utils/paramsHelper';

export const POST = withApiHandler(async (req: NextRequest, { authData, params , db }: ApiHandlerContext) => {
    try {
        if (!authData) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const resolvedParams = await params;
        if (!resolvedParams?.categoryId) {
            return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
        }
        const categoryId = requireIntParam(resolvedParams.categoryId, 'Category ID');

        // Verify category exists
        const [category] = await db
            .select({ id: categories.id })
            .from(categories)
            .where(eq(categories.id, categoryId));

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        // Generate unique filename
        const fileName = uuidv4();

        // Create S3 client
        const s3Client = new S3Client({
            region: Bun.env.AWS_REGION || 'global',
            endpoint: Bun.env.AWS_S3_ENDPOINT,
            credentials: {
                accessKeyId: Bun.env.AWS_S3_ACCESS_KEY_ID!,
                secretAccessKey: Bun.env.AWS_S3_SECRET_ACCESS_KEY!,
            },
        });

        // S3 parameters for category icon
        const s3Params = {
            Bucket: Bun.env.AWS_S3_BUCKET_NAME,
            Key: `categories/${categoryId}/${fileName}.webp`,
        };

        // Generate presigned URL
        const command = new PutObjectCommand(s3Params);
        const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 600 });

        return NextResponse.json({
            uploadURL,
            fileName: `${fileName}.webp`,
            categoryId: categoryId
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Error generating presigned URL' }, { status: 500 });
    }
})
