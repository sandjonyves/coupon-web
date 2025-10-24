// api/index.js
const app = require("../app");

// Export serverless function compatible Vercel
module.exports = (req, res) => app(req, res);
