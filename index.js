```javascript
const http = require('http');
const url = require('url');

// Definir las rutas y sus handlers
const routes = {
  '/': (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      mensaje: 'Bienvenido al servidor HTTP',
      rutas_disponibles: ['/api/usuarios', '/api/productos', '/salud', '/sobre']
    }));
  },
  
  '/api/usuarios': (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      usuarios: [
        { id: 1, nombre: 'Alice', email: 'alice@example.com' },
        { id: 2, nombre: 'Bob', email: 'bob@example.com' },
        { id: 3, nombre: 'Charlie', email: 'charlie@example.com' }
      ]
    }));
  },
  
  '/api/productos': (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      productos: [
        { id: 1, nombre: 'Laptop', precio: 1200, stock: 5 },
        { id: 2, nombre: 'Mouse', precio: 25, stock: 50 },
        { id: 3, nombre: 'Teclado', precio: 75, stock: 30 }
      ]
    }));
  },
  
  '/salud': (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      estado: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }));
  },
  
  '/sobre': (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      nombre: 'Mini Servidor HTTP',
      version: '1.0.0',
      descripcion: 'Servidor HTTP básico con rutas predefinidas',
      autor: 'Ora',
      generacion: 0
    }));
  }
};

// Crear el servidor
const server = http.createServer((req, res) => {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Parsear la URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Registrar la solicitud
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${pathname}`);
  
  // Manejo de OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Solo GET y POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Método no permitido' }));
    return;
  }
  
  // Buscar la ruta
  if (routes[pathname]) {
    routes[pathname](req, res);
  } else {
    // Ruta no encontrada
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      error: 'Ruta no encontrada',
      pathname: pathname,
      rutas_disponibles: Object.keys(routes)
    }));
  }
});

// Configurar puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║   Mini Servidor HTTP - Ora v1.0.0   ║`);
  console.log(`╚════════════════════════════════════════╝\n`);
  console.log(`✓ Servidor ejecutándose en: http://localhost:${PORT}`);
  console.log(`✓ Presiona Ctrl+C para detener\n`);
  console.log(`Rutas disponibles:`);
  console.log(`  GET  /                 - Información del servidor`);
  console.log(`  GET  /api/usuarios     - Lista de usuarios`);
  console.log(`  GET  /api/productos    - Lista de productos`);
  console.log(`  GET  /salud            - Estado del servidor`);
  console.log(`  GET  /sobre            - Información del servidor\n`);
});

// Manejo de errores
server.on('error', (err) => {
  console.error(`Error del servidor: ${err.message}`);
  if (err.code === 'EADDRINUSE') {
    console.error(`Puerto ${PORT} ya está en uso. Intenta con otro puerto:`);
    console.error(`PORT=3001 node index.js`);
  }
  process.exit(1);
});

// Manejo de cierre elegante
process.on('SIGINT', () => {
  console.log('\n\n✓ Servidor detenido correctamente');
  server.close(() => {
    