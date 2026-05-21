#!/usr/bin/env node
const fs = require('fs');
const https = require('https');
const path = require('path');

const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;
const PERPLEXITY_KEY = process.env.PERPLEXITY_API_KEY;
const SHOPIFY_STORE = 'by0iv9-hr.myshopify.com';
const WORKSPACE = '/home/hshamas/.openclaw/workspace';
const MASTER_FILE = `${WORKSPACE}/sipsy_competitive_pricing_MASTER.csv`;
const OUTPUT_FILE = `${WORKSPACE}/COMPETITOR_PRICING_MONDAY.csv`;
const SEARCH_TIMEOUT = 30000;

if (!SHOPIFY_TOKEN || !PERPLEXITY_KEY) {
  console.error('ERROR: SHOPIFY_TOKEN and PERPLEXITY_API_KEY environment variables required');
  process.exit(1);
}

const logDir = `${WORKSPACE}/logs`;
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const logFile = `${logDir}/monday-pricing-${new Date().toISOString().split('T')[0]}.log`;
const log = (msg) => {
  console.log(msg);
  fs.appendFileSync(logFile, msg + '\n');
};

async function httpRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs))
  ]);
}

async function loadProducts() {
  log('📦 Loading products from master list...');
  const csv = fs.readFileSync(MASTER_FILE, 'utf8');
  const lines = csv.trim().split('\n');
  const products = [];
  
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    const name = parts[0]?.replace(/"/g, '').trim();
    const sku = parts[1]?.replace(/"/g, '').trim();
    const collection = parts[2]?.replace(/"/g, '').trim();
    if (name) products.push({ name, sku, collection });
  }
  
  log(`✓ Loaded ${products.length} products`);
  return products;
}

async function fetchShopifyPrices(products) {
  log('💰 Fetching Sipsy prices from Shopify...');
  const pricesByTitle = {}, pricesBySku = {};
  let hasNextPage = true, cursor = null, pageCount = 0;
  
  while (hasNextPage) {
    pageCount++;
    const afterClause = cursor ? `, after: "${cursor}"` : '';
    const query = `{ products(first: 250${afterClause}) { edges { node { id title variants(first: 1) { edges { node { sku price } } } } } pageInfo { hasNextPage endCursor } } }`;
    
    try {
      const res = await httpRequest({
        hostname: SHOPIFY_STORE,
        path: '/admin/api/2024-01/graphql.json',
        method: 'POST',
        headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN, 'Content-Type': 'application/json' }
      }, { query });
      
      if (res.body.data?.products?.edges) {
        res.body.data.products.edges.forEach(edge => {
          const title = edge.node.title?.trim() || '';
          const variant = edge.node.variants.edges[0]?.node;
          if (variant?.price) {
            const price = parseFloat(variant.price);
            pricesByTitle[title] = price;
            if (variant.sku) pricesBySku[variant.sku] = price;
          }
        });
        hasNextPage = res.body.data.products.pageInfo.hasNextPage;
        cursor = res.body.data.products.pageInfo.endCursor;
        log(`  Page ${pageCount}: Fetched ${res.body.data.products.edges.length} products`);
      } else {
        hasNextPage = false;
      }
    } catch (e) {
      log(`⚠️ Shopify fetch error: ${e.message}`);
      hasNextPage = false;
    }
    if (hasNextPage) await new Promise(r => setTimeout(r, 500));
  }
  
  const sipsyPrices = {};
  products.forEach(product => {
    if (pricesByTitle[product.name]) sipsyPrices[product.sku] = pricesByTitle[product.name];
    else if (pricesBySku[product.sku]) sipsyPrices[product.sku] = pricesBySku[product.sku];
  });
  
  log(`✓ Matched ${Object.keys(sipsyPrices).length}/${products.length} products`);
  return sipsyPrices;
}

async function searchCompetitorPrice(productName) {
  const query = `Find the current retail price for "${productName}" on Total Wine & Spirits, Amazon, or Vivino. Return ONLY JSON: {"product":"${productName}","low_price":XX.XX,"source":"store"}. If not found: {"product":"${productName}","low_price":null,"source":"not found"}`;
  
  try {
    const result = await withTimeout(
      httpRequest({
        hostname: 'api.perplexity.ai',
        path: '/chat/completions',
        method: 'POST',
        headers: { 'Authorization': `Bearer ${PERPLEXITY_KEY}`, 'Content-Type': 'application/json' }
      }, { model: "sonar-pro", messages: [{ role: "user", content: query }] }),
      SEARCH_TIMEOUT
    );

    if (result.body.choices?.[0]?.message?.content) {
      const content = result.body.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    log(`  ⚠️ Search failed for "${productName}": ${e.message}`);
  }
  
  return { product: productName, low_price: null, source: "failed" };
}

async function generateReport(products) {
  log('\n📊 GENERATING REPORT...\n');
  const sipsyPrices = await fetchShopifyPrices(products);
  
  log(`🔍 Searching competitor pricing (${products.length} products)...\n`);
  const results = [];
  let successCount = 0, failureCount = 0;
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    process.stdout.write(`\r[${i + 1}/${products.length}] (✓ ${successCount} | ✗ ${failureCount})`);
    
    const competitorData = await searchCompetitorPrice(product.name);
    if (competitorData.low_price !== null && competitorData.source !== "failed") successCount++;
    else failureCount++;
    results.push(competitorData);
    
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log(`\n✓ Complete: ${successCount} found, ${failureCount} skipped\n`);
  
  const headers = ['Product Name', 'SKU', 'Collection', 'Sipsy Price', 'Competitor Low Price', 'Competitor Source', 'Price Difference', 'Price Positioning'];
  const competitorMap = {};
  results.forEach(r => {
    const key = r.product?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
    competitorMap[key] = r;
  });
  
  let csv = headers.map(h => `"${h}"`).join(',') + '\n';
  let withPricingCount = 0;
  
  products.forEach(product => {
    const key = product.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const comp = competitorMap[key];
    const sipsyPrice = sipsyPrices[product.sku] || '';
    const competitorLow = comp?.low_price || '';
    const competitorSource = comp?.source || 'N/A';
    
    let priceDiff = '', positioning = '';
    if (sipsyPrice && competitorLow) {
      priceDiff = (sipsyPrice - competitorLow).toFixed(2);
      const pct = ((sipsyPrice - competitorLow) / competitorLow * 100).toFixed(1);
      positioning = pct > 0 ? `Premium (+${pct}%)` : `Competitive (${pct}%)`;
      withPricingCount++;
    }
    
    const row = [product.name, product.sku, product.collection, sipsyPrice, competitorLow, competitorSource, priceDiff, positioning];
    csv += row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',') + '\n';
  });
  
  fs.writeFileSync(OUTPUT_FILE, csv);
  log(`✓ Generated CSV: ${OUTPUT_FILE}`);
  log(`✓ ${withPricingCount} with competitor pricing\n`);
  return OUTPUT_FILE;
}

async function main() {
  try {
    log('='.repeat(50));
    log('MONDAY COMPETITOR PRICING REPORT');
    log(`Started: ${new Date().toLocaleString()}`);
    log('='.repeat(50) + '\n');
    
    const products = await loadProducts();
    await generateReport(products);
    log('✅ COMPLETE\n');
  } catch (e) {
    log(`❌ ERROR: ${e.message}`);
    process.exit(1);
  }
}

main();
