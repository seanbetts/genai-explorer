#!/usr/bin/env node

/**
 * Convert PNG/JPG images to WebP format using Sharp (Node.js library)
 * This script doesn't rely on system commands, making it suitable for CI environments
 * 
 * Usage: 
 *   node scripts/optimize-images-node.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const sharp = require('sharp');

// Parse arguments from package.json script
const args = process.argv.slice(2);
const options = {
  directory: 'public/images',
  quality: 85,
  delete: false,
  dryrun: false
};

// Parse command line arguments
args.forEach(arg => {
  if (arg.startsWith('--directory=')) {
    options.directory = arg.split('=')[1];
  } else if (arg.startsWith('--quality=')) {
    options.quality = parseInt(arg.split('=')[1], 10);
  } else if (arg === '--delete') {
    options.delete = true;
  } else if (arg === '--dryrun') {
    options.dryrun = true;
  }
});

// Counters for stats
const stats = {
  total: 0,
  converted: 0,
  skipped: 0,
  failed: 0
};

console.log(`
Converting images to WebP format using Node.js
---------------------------------------------
Directory: ${options.directory}
Quality: ${options.quality}
Delete originals: ${options.delete}
Dry run: ${options.dryrun}
`);

// Process all images in directory
(async () => {
  try {
    // Get all image files
    const files = glob.sync(`${options.directory}/**/*.{png,jpg,jpeg}`, {
      nocase: true,
      ignore: ['node_modules/**']
    });
    
    stats.total = files.length;
    
    if (files.length === 0) {
      console.log('No images found to convert.');
      process.exit(0);
    }
    
    console.log(`Found ${files.length} images to process...`);
    
    // Process each file
    for (const file of files) {
      const webpPath = file.substring(0, file.lastIndexOf('.')) + '.webp';
      
      // Check if WebP version already exists
      if (fs.existsSync(webpPath)) {
        console.log(`Skipping ${file} (WebP already exists)`);
        stats.skipped++;
        continue;
      }
      
      if (options.dryrun) {
        console.log(`Would convert: ${file} → ${webpPath}`);
        continue;
      }
      
      try {
        // Convert to WebP using sharp
        await sharp(file)
          .webp({ quality: options.quality })
          .toFile(webpPath);
        
        // Delete original if requested
        if (options.delete) {
          fs.unlinkSync(file);
          console.log(`Converted and deleted: ${file} → ${webpPath}`);
        } else {
          console.log(`Converted: ${file} → ${webpPath}`);
        }
        
        stats.converted++;
      } catch (error) {
        console.error(`Failed to convert ${file}: ${error.message}`);
        stats.failed++;
      }
    }
    
    console.log(`
Conversion complete!
-------------------
Total images found: ${stats.total}
Converted: ${stats.converted}
Skipped (already exists): ${stats.skipped}
Failed: ${stats.failed}
    `);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
})();