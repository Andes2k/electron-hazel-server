const http = require('http');
const hazel = require('./lib/index');

const {
  PORT = 3000,
  INTERVAL: interval,
  ACCOUNT: account,
  REPOSITORY: repository,
  PRE: pre,
  TOKEN: token,
  URL: url
} = process.env;

// Validation des variables obligatoires
if (!account || !repository) {
  console.error('❌ ERROR: ACCOUNT and REPOSITORY environment variables are required!');
  console.error('Current values:');
  console.error('  ACCOUNT:', account || 'NOT SET');
  console.error('  REPOSITORY:', repository || 'NOT SET');
  process.exit(1);
}

console.log('🚀 Starting Hazel server...');
console.log(`📦 Repository: ${account}/${repository}`);
console.log(`🔗 URL: ${url || 'not configured'}`);
console.log(`⏱️  Cache refresh interval: ${interval || 15} minutes`);
console.log(`🔐 Token: ${token ? 'configured' : 'not configured (public repos only)'}`);
console.log(`⚙️  Port: ${PORT}`);

// Créer le handler Hazel
const handler = hazel({
  interval,
  account,
  repository,
  pre,
  token,
  url
});

// Créer et démarrer le serveur HTTP
const server = http.createServer(handler);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Hazel server successfully started!`);
  console.log(`🌐 Listening on http://0.0.0.0:${PORT}`);
  console.log(`📡 Ready to serve updates for ${account}/${repository}`);
});

// Gestion des erreurs
server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('📴 Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('👋 Server closed');
    process.exit(0);
  });
});