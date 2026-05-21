#!/bin/bash
if [ -z "$SHOPIFY_TOKEN" ]; then
  echo "ERROR: SHOPIFY_TOKEN environment variable not set"
  exit 1
fi

node << 'NODEOF'
const https = require('https');

const store = 'by0iv9-hr';
const token = process.env.SHOPIFY_TOKEN;
const now = new Date();

function fetchCodes() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${store}.myshopify.com`,
      port: 443,
      path: '/admin/api/2024-01/discount_codes.json',
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function deleteCode(codeId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${store}.myshopify.com`,
      port: 443,
      path: `/admin/api/2024-01/discount_codes/${codeId}.json`,
      method: 'DELETE',
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.end();
  });
}

(async () => {
  try {
    const response = await fetchCodes();
    const codes = response.discount_codes || [];
    
    const expired = codes.filter(code => {
      if (!code.ends_at) return false;
      return new Date(code.ends_at) < now;
    });

    if (expired.length > 0) {
      console.log(`Found ${expired.length} expired codes. Removing...`);
      for (const code of expired) {
        await deleteCode(code.id);
        console.log(`Deleted: ${code.code}`);
      }
      console.log(`Cleanup complete. Removed ${expired.length} expired codes.`);
    } else {
      console.log(`No expired codes found.`);
    }
  } catch (error) {
    console.error(`Error:`, error.message);
  }
})();
NODEOF
