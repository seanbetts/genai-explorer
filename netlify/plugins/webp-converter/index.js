// Netlify plugin to convert images to WebP format using Node libraries
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const sharp = require('sharp');

// Main plugin function
module.exports = {
  onPreBuild: async ({ utils }) => {
    try {
      utils.status.show({
        title: 'WebP Converter',
        summary: 'Converting images to WebP format'
      });

      // Find all image files in the public directory
      const imageFiles = await glob('public/images/**/*.{png,jpg,jpeg}');
      
      if (imageFiles.length === 0) {
        utils.status.show({
          title: 'WebP Converter',
          summary: 'No images found to convert'
        });
        return;
      }
      
      utils.status.show({
        title: 'WebP Converter',
        summary: `Found ${imageFiles.length} images to potentially convert`
      });

      let converted = 0;
      let skipped = 0;
      
      // Process each image
      await Promise.all(imageFiles.map(async (imagePath) => {
        const webpPath = imagePath.substring(0, imagePath.lastIndexOf('.')) + '.webp';
        
        // Skip if WebP already exists
        if (fs.existsSync(webpPath)) {
          skipped++;
          return;
        }
        
        try {
          // Convert to WebP using sharp
          await sharp(imagePath)
            .webp({ quality: 85 })
            .toFile(webpPath);
            
          // Delete original if successfully converted
          fs.unlinkSync(imagePath);
          converted++;
        } catch (error) {
          utils.build.failPlugin(`Error converting ${imagePath}: ${error.message}`);
        }
      }));
      
      utils.status.show({
        title: 'WebP Converter',
        summary: `Converted ${converted} images to WebP format. Skipped ${skipped} images.`
      });
    } catch (error) {
      // Don't fail the build if the plugin fails
      utils.status.show({
        title: 'WebP Converter',
        summary: `Error: ${error.message}`,
        text: 'Continuing build without WebP conversion'
      });
    }
  }
};