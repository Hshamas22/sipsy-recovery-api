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

const BATCHES = {
  email3: { name: 'Email3 Recovery', variants: ['cart', 'checkout'], expiration_hours: 48, discount_value: -5 },
  email2: { name: 'Email2 Recovery', variants: ['cart', 'checkout'], expiration_hours: 48, discount_value: -5 },
  signup: { name: 'Email Signup Welcome', variants: ['welcome'], expiration_hours: 336, discount_value: -5 }
};

const WORKSPACE = '/home/hshamas/.openclaw/workspace';
const LOG_DIR = `${WORKSPACE}/logs`;

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${STORE}.myshopify.com`,
      port: 443,
      path: `/admin/api/${API_VERSION}${path}`,
      method,
      headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: body ? JSON.parse(body) : null });
        } catch (e) {
          resolve({ status: res.statusCode, body, error: e.message });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function getOrCreatePriceRule(batchKey, config) {
  const ruleTitle = `[Sipsy] ${config.name}`;
  const response = await request('GET', '/price_rules.json');
  
  if (response.status !== 200) throw new Error(`Failed to fetch price rules: ${response.status}`);

  const existing = response.body.price_rules.find(r => r.title === ruleTitle);
  if (existing) {
    console.log(`   ✓ Using existing price rule: ${existing.id}`);
    return existing.id;
  }

  const expiresAt = new Date(Date.now() + config.expiration_hours * 3600000);
  const priceRuleData = {
    price_rule: {
      title: ruleTitle,
      target_type: 'line_item',
      target_selection: 'all',
      allocation_method: 'across',
      customer_selection: 'all',
      value_type: 'fixed_amount',
      value: config.discount_value,
      prerequisite_subtotal_range: { greater_than_or_equal_to: '0.01' },
      starts_at: new Date().toISOString(),
      ends_at: expiresAt.toISOString(),
      once_per_customer: false
    }
  };

  const createResponse = await request('POST', '/price_rules.json', priceRuleData);
  if (createResponse.status !== 201) throw new Error(`Failed to create price rule: ${createResponse.status}`);

  const priceRuleId = createResponse.body.price_rule.id;
  console.log(`   ✓ Created price rule: ${priceRuleId}`);
  return priceRuleId;
}

function generateCodeString(prefix, index) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randomPart = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${prefix}_${String(index).padStart(3, '0')}_${randomPart}`;
}

async function createDiscountCode(priceRuleId, code, retries = 0) {
  const response = await request('POST', `/price_rules/${priceRuleId}/discount_codes.json`, { discount_code: { code } });
  
  if (response.status === 201 && response.body.discount_code) {
    return { success: true, code: response.body.discount_code };
  } else if (response.status === 429 && retries < 3) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return createDiscountCode(priceRuleId, code, retries + 1);
  } else {
    return { success: false, error: `HTTP ${response.status}`, details: response.body };
  }
}

async function generateBatch(batchKey, count = 50) {
  const config = BATCHES[batchKey];
  if (!config) throw new Error(`Unknown batch: ${batchKey}`);

  console.log(`\n📝 GENERATING ${batchKey.toUpperCase()} BATCH (${count} codes per variant)`);
  console.log(`   Discount: $${Math.abs(config.discount_value)} USD`);
  console.log(`   Expiration: ${config.expiration_hours}h\n`);

  const results = { batchKey, config, timestamp: new Date().toISOString(), variants: {} };
  const priceRuleId = await getOrCreatePriceRule(batchKey, config);
  console.log('');

  for (const variant of config.variants) {
    console.log(`   → ${variant.toUpperCase()} variant:`);
    const variantResults = { created: [], failed: [] };

    for (let i = 1; i <= count; i++) {
      const code = generateCodeString(`${batchKey}_${variant}`, i);
      try {
        const result = await createDiscountCode(priceRuleId, code);
        if (result.success) {
          variantResults.created.push({ code, id: result.code.id });
        } else {
          variantResults.failed.push({ code, error: result.error });
        }
        if (i % 10 === 0) process.stdout.write('.');
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        variantResults.failed.push({ code, error: e.message });
      }
    }

    results.variants[variant] = variantResults;
    console.log(`\n      ${variantResults.created.length} created, ${variantResults.failed.length} failed`);
  }

  return results;
}

async function main() {
  const args = process.argv.slice(2);
  let batch = 'email3', count = 50;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--batch' && i + 1 < args.length) batch = args[++i];
    if (args[i] === '--count' && i + 1 < args.length) count = parseInt(args[++i], 10);
  }

  try {
    console.log(`\n[${new Date().toLocaleString()}] Starting code generation\n`);
    const results = await generateBatch(batch, count);
    
    let totalCreated = 0, totalFailed = 0;
    Object.values(results.variants).forEach(v => {
      totalCreated += v.created.length;
      totalFailed += v.failed.length;
    });

    const logFile = path.join(LOG_DIR, `code-generation-${batch}-${Date.now()}.json`);
    fs.writeFileSync(logFile, JSON.stringify(results, null, 2));

    console.log(`\n✅ COMPLETE: ${totalCreated} created, ${totalFailed} failed\n`);
    if (totalFailed > 0) process.exit(1);
  } catch (error) {
    console.error(`\n❌ ERROR: ${error.message}\n`);
    process.exit(1);
  }
}

main();
