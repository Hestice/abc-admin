const fs = require('fs');

module.exports = (req, res) => {
  try {
    // List files for debugging
    const files = fs.readdirSync('.');
    const distFiles = fs.existsSync('./dist') ? fs.readdirSync('./dist') : 'dist directory not found';
    
    // Try to get nested directories if they exist
    const nestedDirectories = {};
    files.forEach(file => {
      if (fs.statSync(file).isDirectory()) {
        try {
          nestedDirectories[file] = fs.readdirSync(`./${file}`);
        } catch (e) {
          nestedDirectories[file] = `Error reading: ${e.message}`;
        }
      }
    });
    
    // Return diagnostic information
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      message: 'Serverless function debug info',
      files,
      distFiles,
      nestedDirectories,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        // Don't include sensitive DB credentials here
        DB_HOST_EXISTS: !!process.env.DB_HOST,
        DB_PORT_EXISTS: !!process.env.DB_PORT,
        DB_USERNAME_EXISTS: !!process.env.DB_USERNAME,
        DB_PASSWORD_EXISTS: !!process.env.DB_PASSWORD,
        DB_DATABASE_EXISTS: !!process.env.DB_DATABASE
      }
    }));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'Server initialization failed',
      details: error.message
    }));
  }
};
