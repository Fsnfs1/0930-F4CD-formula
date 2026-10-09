/**
 * mock_server.js - Pure Node.js Mock Server for Science Testing System
 * 
 * Features:
 * 1. Zero external npm dependencies (uses built-in: http, fs, path, url).
 * 2. Emulates GAS Webhook for Base64 image upload (/api/gas-upload and /gas-upload).
 * 3. Emulates Google Form submission endpoint (/api/form-submit and /formResponse).
 * 4. Provides query endpoint (/api/submissions) for test inspection.
 * 5. Serves static files from current directory, defaulting / to advance_test.html.
 * 6. Supports configurable port via command-line arg, environment variable, or programmatic call.
 * 7. Full CORS support (GET, POST, OPTIONS, preflight headers).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const BASE_DIR = __dirname;
const UPLOAD_DIR = path.join(BASE_DIR, 'mock_uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// In-memory audit log for automated verification and inspection
const state = {
  uploads: [],
  formSubmissions: []
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.gs': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Safety limit: 25MB
      if (body.length > 25 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', err => {
      reject(err);
    });
  });
}

function parsePayload(rawBody, contentType) {
  const ct = (contentType || '').toLowerCase();
  if (ct.includes('application/json') || rawBody.trim().startsWith('{')) {
    try {
      return JSON.parse(rawBody);
    } catch (e) {
      // fallback
    }
  }

  // Handle URL-encoded form data
  const result = {};
  try {
    const params = new URLSearchParams(rawBody);
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
  } catch (e) {
    // ignore
  }

  return Object.keys(result).length > 0 ? result : { raw: rawBody };
}

function createServer() {
  const server = http.createServer(async (req, res) => {
    setCorsHeaders(res);

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    try {
      // -------------------------------------------------------------
      // 1. Mock GAS Webhook Endpoint (/api/gas-upload or /gas-upload)
      // -------------------------------------------------------------
      if (req.method === 'POST' && (pathname === '/api/gas-upload' || pathname === '/gas-upload' || pathname.includes('/exec'))) {
        const rawBody = await parseBody(req);
        const data = parsePayload(rawBody, req.headers['content-type']);

        const studentId = data.studentId || data.student_id || 'unknown_id';
        const studentName = data.studentName || data.student_name || 'unknown_name';
        const imageBase64 = data.imageBase64 || data.image || data.data;

        if (!imageBase64 || typeof imageBase64 !== 'string') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: 'error',
            message: '缺少 imageBase64 圖片數據'
          }));
          return;
        }

        // Decode Base64
        let base64Content = imageBase64;
        let mime = 'image/jpeg';
        let ext = 'jpg';

        if (imageBase64.includes(';base64,')) {
          const parts = imageBase64.split(';base64,');
          base64Content = parts[1];
          if (parts[0].includes('image/png')) {
            mime = 'image/png';
            ext = 'png';
          }
        }

        const buffer = Buffer.from(base64Content, 'base64');
        const fileId = `mock_drive_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const safeStudent = `${studentId}_${encodeURIComponent(studentName).replace(/%/g, '_')}`;
        const filename = `大測解答_${safeStudent}_${Date.now()}.${ext}`;
        const filePath = path.join(UPLOAD_DIR, filename);

        // Save image file
        fs.writeFileSync(filePath, buffer);

        // Generate Drive-compatible view URL
        const fileUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
        const localDownloadUrl = `/mock_uploads/${filename}`;

        const uploadRecord = {
          fileId,
          filename,
          fileUrl,
          localDownloadUrl,
          bytes: buffer.length,
          studentId,
          studentName,
          timestamp: new Date().toISOString()
        };
        state.uploads.push(uploadRecord);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'success',
          fileId,
          fileUrl,
          filename,
          localDownloadUrl,
          message: '圖片已成功上傳並儲存於 Google Drive'
        }));
        return;
      }

      // -------------------------------------------------------------
      // 2. Mock Google Form Endpoint (/api/form-submit or /formResponse)
      // -------------------------------------------------------------
      if (req.method === 'POST' && (pathname === '/api/form-submit' || pathname === '/formResponse' || pathname.endsWith('/formResponse'))) {
        const rawBody = await parseBody(req);
        const data = parsePayload(rawBody, req.headers['content-type']);

        const submission = {
          id: `resp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          receivedAt: new Date().toISOString(),
          headers: req.headers,
          data: data,
          rawBody: rawBody.length < 2000 ? rawBody : rawBody.substring(0, 2000) + '...[truncated]'
        };
        state.formSubmissions.push(submission);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'success',
          message: 'Google Form response recorded successfully',
          responseId: submission.id,
          recordedEntries: data
        }));
        return;
      }

      // -------------------------------------------------------------
      // 3. API Query/State Endpoint (/api/submissions)
      // -------------------------------------------------------------
      if (req.method === 'GET' && pathname === '/api/submissions') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'success',
          uploadCount: state.uploads.length,
          uploads: state.uploads,
          formSubmissionCount: state.formSubmissions.length,
          formSubmissions: state.formSubmissions
        }));
        return;
      }

      // Reset state for testing
      if (req.method === 'POST' && pathname === '/api/reset-state') {
        state.uploads = [];
        state.formSubmissions = [];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success', message: 'Mock state reset' }));
        return;
      }

      // -------------------------------------------------------------
      // 4. Static File Server
      // -------------------------------------------------------------
      if (req.method === 'GET' || req.method === 'HEAD') {
        let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, '');
        if (safePath === '/' || safePath === '\\') {
          safePath = '/advance_test.html';
        }

        const filePath = path.join(BASE_DIR, safePath);

        // Security check: ensure path is within BASE_DIR
        if (!filePath.startsWith(BASE_DIR)) {
          res.writeHead(403, { 'Content-Type': 'text/plain' });
          res.end('403 Forbidden');
          return;
        }

        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          const contentType = MIME_TYPES[ext] || 'application/octet-stream';
          const fileData = fs.readFileSync(filePath);

          res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': fileData.length
          });

          if (req.method === 'HEAD') {
            res.end();
          } else {
            res.end(fileData);
          }
          return;
        }

        // File not found
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`404 Not Found: ${pathname}`);
        return;
      }

      // Unhandled method
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('405 Method Not Allowed');

    } catch (err) {
      console.error('[Mock Server Error]', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'error',
        message: err.message
      }));
    }
  });

  return { server, state };
}

function startServer(port = DEFAULT_PORT) {
  return new Promise((resolve, reject) => {
    const { server, state } = createServer();
    server.listen(port, () => {
      const actualPort = server.address().port;
      console.log(`[Mock Server] Running at http://localhost:${actualPort}`);
      console.log(`[Mock Server] Endpoints:`);
      console.log(`  - Webpage:       http://localhost:${actualPort}/advance_test.html`);
      console.log(`  - GAS Webhook:   http://localhost:${actualPort}/api/gas-upload (POST)`);
      console.log(`  - Google Form:   http://localhost:${actualPort}/api/form-submit (POST)`);
      console.log(`  - State Audit:   http://localhost:${actualPort}/api/submissions (GET)`);
      resolve({ server, port: actualPort, state });
    });
    server.on('error', reject);
  });
}

// If executed directly from command line
if (require.main === module) {
  const targetPort = process.argv[2] ? parseInt(process.argv[2], 10) : DEFAULT_PORT;
  startServer(targetPort).catch(err => {
    console.error('Failed to start mock server:', err);
    process.exit(1);
  });
}

module.exports = {
  createServer,
  startServer,
  state,
  DEFAULT_PORT,
  UPLOAD_DIR
};
