const fs = require('fs');
try {
  // List files in the current directory to debug
  const files = fs.readdirSync('.');
  const distFiles = fs.existsSync('./dist') ? fs.readdirSync('./dist') : 'dist directory not found';
  
  // Try to load the main module
  const server = require('./dist/main');
  module.exports = server;
} catch (error) {
  console.error('Failed to load server:', error);
  module.exports = (req, res) => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'Server initialization failed',
      details: error.message,
      files: files,
      distFiles: distFiles
    }));
  };
}
