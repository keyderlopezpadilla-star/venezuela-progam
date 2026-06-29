import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary-server';
import { audit } from '@/lib/audit';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'no_file' }, { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER || 'venezuela-solidaria',
        resource_type: 'auto',
        transformation: [{ quality: 'auto:good', fetch_format: 'auto' }],
      },
      (err, res) => (err ? reject(err) : resolve(res))
    ).end(bytes);
  });

  await audit({
    userId: session.user.id,
    action: 'media.uploaded',
    resource: 'cloudinary',
    resourceId: result.public_id,
  });

  return NextResponse.json({
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  });
}
