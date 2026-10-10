/**
 * template_client_js.js
 * Reads client_runtime.js and exports CLIENT_JS string
 */

const fs = require('fs');
const path = require('path');

const clientRuntimePath = path.join(__dirname, 'client_runtime.js');
const CLIENT_JS = fs.readFileSync(clientRuntimePath, 'utf8');

module.exports = {
  CLIENT_JS
};
