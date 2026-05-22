const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Shopify API Config (uses env var, NOT hardcoded)
const STORE = 'by0iv9-hr';
const API_VERSION = '2024-01';
const RECOVERY_RULE_ID = '1667947102504'; // Email2 + Email3 shared

// In-memory store for tracking assignments
let codeAssignments = {};

/**
 * Fetch price rule details (including expiration)
 */
function fetchPriceRule(ruleId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${STORE}.myshopify.com`,
      port: 443,
      path: `/admin/api/${API_VERSION}/price_rules/${ruleId}.json`,
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response.price_rule);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Fetch discount codes from Shopify for a price rule
 */
function fetchCodesFromShopify(ruleId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${STORE}.myshopify.com`,
      port: 443,
      path: `/admin/api/${API_VERSION}/price_rules/${ruleId}/discount_codes.json?limit=250`,
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response.discount_codes || []);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// ============ ROUTES ============

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Sipsy Recovery API' });
});

/**
 * MAIN RECOVERY ROUTE
 * Fetches fresh codes from Shopify API
 * GET /api/assign-code?email=customer@example.com&type=email2
 */
app.get('/api/assign-code', async (req, res) => {
  try {
    const { email, type = 'email2' } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email required: ?email=customer@example.com' });
    }

    if (type !== 'email2' && type !== 'email3') {
      return res.status(400).json({ error: 'Type must be email2 or email3' });
    }

    // Check if already assigned and not expired
    const key = `${email}_${type}`;
    if (codeAssignments[key]) {
      const assignment = codeAssignments[key];
      const expiresAt = new Date(assignment.expiresAt);
      
      if (expiresAt > new Date()) {
        return res.status(200).json({
          code: assignment.code,
          expiresAt: assignment.expiresAt,
          message: 'Code already assigned to this customer',
          isNew: false
        });
      } else {
        delete codeAssignments[key];
      }
    }

    // Fetch all codes and rule details from Shopify
    const [allCodes, priceRule] = await Promise.all([
      fetchCodesFromShopify(RECOVERY_RULE_ID),
      fetchPriceRule(RECOVERY_RULE_ID)
    ]);
    
    if (!allCodes || allCodes.length === 0) {
      return res.status(503).json({
        error: 'No discount codes available. Please try again later.'
      });
    }

    // Find first unused code
    const usedCodes = Object.values(codeAssignments).map(a => a.code);
    let availableCode = null;
    
    for (const codeObj of allCodes) {
      if (!usedCodes.includes(codeObj.code)) {
        availableCode = codeObj;
        break;
      }
    }

    if (!availableCode) {
javascript
     return res.status(503).json({
        error: 'No available codes at this time. All codes in use.',
        available: allCodes.length,
        used: usedCodes.length
      });
    }

    // Assign code
    const now = new Date();
    const expiresAt = priceRule && priceRule.ends_at 
      ? new Date(priceRule.ends_at) 
      : new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    codeAssignments[key] = {
      code: availableCode.code,
      email: email,
      type: type,
      assignedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      ruleId: RECOVERY_RULE_ID
    };

    return res.status(200).json({
      code: availableCode.code,
      expiresAt: expiresAt.toISOString(),
      message: 'Code assigned successfully',
      isNew: true
    });

  } catch (error) {
    console.error('Error in assign-code:', error);
    return res.status(500).json({ 
      error: 'Failed to assign code',
      details: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => console.log(`API running on port ${PORT}`));