import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Force this API route to use the Node.js runtime (so fs and path work)
export const runtime = 'nodejs';

/**
 * GET /api/images/:company/:model
 * Returns a JSON array of all image URLs found in public/images/companies/{company}/example_images/{model}
 */
export async function GET(
  _: Request,
  { params }: { params: { company: string; model: string } }
) {
  // Make sure we await the params correctly to resolve the Next.js warning
  const paramsObj = await Promise.resolve(params);
  const { company, model } = paramsObj;
  // Directory under the public folder
  const imagesDir = path.join(
    process.cwd(),
    'public',
    'images',
    'companies',
    company,
    'example_images',
    model
  );
  try {
    // Read all files in the directory
    const files = await fs.readdir(imagesDir);
    // Keep only common image extensions
    const imageFiles = files.filter((file) => /\.(png|jpe?g|gif|webp|svg)$/i.test(file));
    // Sort so numeric filenames appear in order
    imageFiles.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    // Build public URLs
    const urls = imageFiles.map((file) =>
      `/images/companies/${company}/example_images/${model}/${file}`
    );
    return NextResponse.json(urls);
  } catch (err) {
    console.error(`Error listing images at ${imagesDir}:`, err);
    // On error (e.g. directory missing), return empty array
    return NextResponse.json([]);
  }
}