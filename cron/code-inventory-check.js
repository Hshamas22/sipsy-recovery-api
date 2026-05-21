#!/usr/bin/env node
const https = require('https');
const fs = require('fs');
const path = require('path');

const STORE = 'by0iv9-hr';
const TOKEN = process.env.SHOPIFY_TOKEN;
const API_VERSION = '2024-01';

if (!TOKEN) {
  console.error('ERROR: SHOPIFY_TOKEN environment variable not set');
  process.exit(1);
}

const THRESHOLDS = {
  email3: { min: 200, description: 'Email3 Recovery (cart + checkout)' },
  email2: { min: 200, description: 'Email2 Recovery (cart + checkout)' },
  signup: { min: 150, description: 'Email Signup Welcome' }
};

const WORKSPACE = '/home/hshamas/.openclaw/workspace';
const LOG_DIR = `${WORKSPACE}/logs`;

function fetchAllCodes() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${STORE}.myshopify.com`,
      port: 443,
      path: `/admin/api/${API_VERSION}/discount_codes.json`,
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

function countCodes(allCodes) {
  const batches = { email3: [], email2: [], signup: [] };
  allCodes.forEach(code => {
    if (code.code.includes('EMAIL3')) batches.email3.push(code);
    else if (code.code.includes('EMAIL2')) batches.email2.push(code);
    else if (code.code.includes('SIGNUP') || code.code === 'THANKYOU5') batches.signup.push(code);
  });
  return batches;
}

async function checkInventory() {
  console.log(`\n📊 CODE INVENTORY CHECK\n`);
  try {
    const allCodes = await fetchAllCodes();
    const batches = countCodes(allCodes);
    const alerts = [];
    const status = [];

    Object.entries(THRESHOLDS).forEach(([batch, config]) => {
      const count = batches[batch].length;
      const isOk = count >= config.min;
      const icon = isOk ? '✅' : '🚨';
      status.push(`${icon} ${config.description}: ${count}/${config.min}`);
      if (!isOk) alerts.push({ batch, current: count, threshold: config.min, deficit: config.min - count, description: config.description });
    });

    status.forEach(line => console.log(`   ${line}`));
    if (alerts.length > 0) {
      console.log(`\n⚠️  ALERTS: ${alerts.length} batch(es) below threshold\n`);
      alerts.forEach(alert => {
        console.log(`   🚨 ${alert.description}`);
        console.log(`      Current: ${alert.current} | Minimum: ${alert.threshold} | Deficit: ${alert.deficit}\n`);
      });
      const alertFile = path.join(LOG_DIR, `inventory-alert-${Date.now()}.json`);
      fs.writeFileSync(alertFile, JSON.stringify({ timestamp: new Date().toISOString(), alerts }, null, 2));
      return { ok: false, alerts };
    } else {
      console.log('\n✅ All batches healthy.\n');
      return { ok: true, alerts: [] };
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    throw error;
  }
}

checkInventory().then(result => { if (!result.ok) process.exit(1); }).catch(() => process.exit(2));
