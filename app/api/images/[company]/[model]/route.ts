import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Force this API route to use the Node.js runtime (so fs and path work)
export const runtime = 'nodejs';

/**
 * GET /api/images/:company/:model
 * Returns a JSON array of all image URLs found in public/images/companies/{company}/example_images/{model}
 */
type ImageParams = {
  company: string;
  model: string;
};

export async function GET(
  request: Request,
  context: { params: ImageParams }
) {
  const { company, model } = context.params;
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
    // Check if directory exists first to avoid noisy errors
    try {
      await fs.access(imagesDir);
    } catch (accessErr) {
      // Directory doesn't exist, quietly return empty array
      return NextResponse.json([]);
    }
    
    // Directory exists, read files
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
    // Only log unexpected errors, not missing directories
    if (!(err instanceof Error) || (err as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error(`Error processing images at ${imagesDir}:`, err);
    }
    // On error, return empty array
    return NextResponse.json([]);
  }
}