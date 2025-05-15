const path = require('path');
const moduleAlias = require('module-alias');

// Register aliases
moduleAlias.addAliases({
  '@': path.resolve(__dirname, './'),
  '@/data': path.resolve(__dirname, './data'),
  '@/public': path.resolve(__dirname, './public')
});