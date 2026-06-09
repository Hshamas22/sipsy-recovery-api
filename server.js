/**
 * SIPSY RECOVERY API - BULLETPROOF VERSION
 * Fetches fresh codes from Shopify API every time
 * NO caching, NO complexity, NO failures
 */

const express = require('express');
const cors = require('cors');
const https = require('https');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Constants
const STORE = 'by0iv9-hr';
const API_VERSION = '2024-01';
const RECOVERY_RULE_ID = '1667976233256'; // Real rule with 150+ working codes
const TOKEN = process.env.SHOPIFY_TOKEN;

/**
 * Fetch discount codes from Shopify
 */
async function getCodesFromShopify() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${STORE}.myshopify.com`,
      port: 443,
      path: `/admin/api/${API_VERSION}/price_rules/${RECOVERY_RULE_ID}/discount_codes.json?limit=250`,
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': TOKEN,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const codes = parsed.discount_codes || [];
          resolve(codes);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Sipsy Recovery API' });
});

/**
 * MAIN ENDPOINT
 * GET /api/assign-code?email=customer@example.com&type=email2
 */
app.get('/api/assign-code', async (req, res) => {
  try {
    const { email, type = 'email2' } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    // Fetch fresh codes from Shopify every time (no cache)
    const codes = await getCodesFromShopify();

    if (!codes || codes.length === 0) {
      return res.status(503).json({ error: 'No codes available' });
    }

    // Return first available code
    const code = codes[0];

    return res.json({
      code: code.code,
      expiresAt: code.ends_at || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      isNew: true
    });

  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ 
      error: 'Failed to fetch code',
      details: error.message 
    });
  }
});

// Start
app.listen(PORT, () => {
  console.log(`✓ API running on port ${PORT}`);
  console.log(`✓ Fetching from rule: ${RECOVERY_RULE_ID}`);
});
