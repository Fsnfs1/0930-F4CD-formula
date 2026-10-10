/**
 * verify_e2e.js - End-to-End Verification Runner
 * Delegates to comprehensive verification suite verify_exam.js
 */

const { runVerificationSuite } = require('./verify_exam');

if (require.main === module) {
  runVerificationSuite().catch(err => {
    console.error('驗證失敗：', err);
    process.exit(1);
  });
}

module.exports = { runVerificationSuite };
