try {
  const server = require('./dist/main');
  module.exports = server;
} catch (error) {
  console.error('Failed to load server:', error);
  module.exports = (req, res) => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Server initialization failed', details: error.message }));
  };
}
