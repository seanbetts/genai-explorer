// Simple Netlify plugin for WebP image handling
const { execSync } = require('child_process');

// Main plugin function
module.exports = {
  onPreBuild: async ({ utils }) => {
    try {
      utils.status.show({
        title: 'WebP Converter',
        summary: 'Running Node.js WebP optimization'
      });

      // Run the Node.js optimization script that's part of the main project
      try {
        // Install required packages for the script
        execSync('npm install --no-save sharp glob', { stdio: 'inherit' });
        
        // Run the optimization script
        execSync('node scripts/optimize-images-node.js --directory=public/images --quality=85 --delete', { 
          stdio: 'inherit' 
        });
        
        utils.status.show({
          title: 'WebP Converter',
          summary: 'Successfully converted images to WebP format'
        });
      } catch (error) {
        utils.status.show({
          title: 'WebP Converter',
          summary: 'WebP conversion failed, but continuing build',
          text: `Error: ${error.message}`
        });
      }
    } catch (error) {
      // Don't fail the build if the plugin fails
      utils.status.show({
        title: 'WebP Converter',
        summary: 'Plugin encountered an error, continuing build',
        text: `Error: ${error.message}`
      });
    }
  }
};