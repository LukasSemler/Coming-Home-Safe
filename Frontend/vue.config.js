const path = require('path');
module.exports = {
  devServer: {
    port: 8081, // CHANGE YOUR PORT HERE!
  },
  transpileDependencies: ['vuetify'],
  outputDir: path.resolve(__dirname, '../Backend/public'),
};
