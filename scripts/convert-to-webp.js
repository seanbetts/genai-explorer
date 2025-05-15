#!/usr/bin/env node

/**
 * Convert PNG/JPG images to WebP format
 * 
 * Usage: 
 *   node scripts/convert-to-webp.js
 *   
 * Options:
 *   --directory=public/images   Specify directory to process (default: public/images)
 *   --quality=85               WebP quality setting (default: 85)
 *   --delete                   Delete original files after conversion
 *   --dryrun                   Show which files would be converted without converting
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse arguments
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

// Check if cwebp is installed
try {
  execSync('cwebp -version', { stdio: 'ignore' });
} catch (error) {
  // Check if we're running in Netlify environment
  if (process.env.NETLIFY === 'true') {
    console.warn(`
Warning: cwebp command not found but we're in a Netlify environment.
Skipping image conversion to prevent build failure.
`);
    process.exit(0); // Exit gracefully with success code
  } else {
    console.error(`
Error: cwebp command not found. 
Please install WebP tools first:

On Mac:
  brew install webp

On Ubuntu/Debian:
  sudo apt-get install webp

On Windows with Chocolatey:
  choco install webp
  `);
    process.exit(1);
  }
}

// Counters for stats
const stats = {
  total: 0,
  converted: 0,
  skipped: 0,
  failed: 0
};

// Process a directory recursively
function processDirectory(directoryPath) {
  // Read the directory
  const items = fs.readdirSync(directoryPath);
  
  // Process each item
  for (const item of items) {
    const itemPath = path.join(directoryPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // If it's a directory, process it recursively
      processDirectory(itemPath);
    } else if (stat.isFile()) {
      // If it's a file, check if it's an image we want to convert
      const ext = path.extname(itemPath).toLowerCase();
      
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        stats.total++;
        
        // Create WebP filename
        const webpPath = itemPath.substring(0, itemPath.lastIndexOf('.')) + '.webp';
        
        // Check if WebP version already exists
        if (fs.existsSync(webpPath)) {
          console.log(`Skipping ${itemPath} (WebP already exists)`);
          stats.skipped++;
          continue;
        }
        
        if (options.dryrun) {
          console.log(`Would convert: ${itemPath} → ${webpPath}`);
          continue;
        }
        
        try {
          // Create the cwebp command
          const command = `cwebp -q ${options.quality} "${itemPath}" -o "${webpPath}"`;
          
          // Execute the command
          execSync(command, { stdio: 'ignore' });
          
          // Delete original if requested
          if (options.delete) {
            fs.unlinkSync(itemPath);
            console.log(`Converted and deleted: ${itemPath} → ${webpPath}`);
          } else {
            console.log(`Converted: ${itemPath} → ${webpPath}`);
          }
          
          stats.converted++;
        } catch (error) {
          console.error(`Failed to convert ${itemPath}: ${error.message}`);
          stats.failed++;
        }
      }
    }
  }
}

console.log(`
Converting images to WebP format
--------------------------------
Directory: ${options.directory}
Quality: ${options.quality}
Delete originals: ${options.delete}
Dry run: ${options.dryrun}
`);

try {
  processDirectory(options.directory);
  
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