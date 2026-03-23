#!/usr/bin/env node

/**
 * Code Inventory Checker
 * Runs every 3 days to check code levels and generate more if running low
 * 
 * Usage: node check-code-inventory.js
 */

const fs = require('fs');
const path = require('path');

const API_URL = 'https://sipsy-recovery-api-production.up.railway.app';
const LOW_THRESHOLD = 100; // Alert if fewer than 100 codes available

/**
 * Fetch current code stats from API
 */
async function getCodeStats() {
  try {
    const response = await fetch(`${API_URL}/api/stats`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch code stats:', error.message);
    return null;
  }
}

/**
 * Generate unique discount codes
 */
function generateCodes(prefix, count, startNum = 1) {
  const codes = [];
  for (let i = startNum; i < startNum + count; i++) {
    codes.push(`${prefix}${String(i).padStart(3, '0')}`);
  }
  return codes;
}

/**
 * Update server.js with new signup codes
 */
function addNewSignupCodes(newCodes) {
  const serverPath = path.join(__dirname, 'server.js');
  let content = fs.readFileSync(serverPath, 'utf8');

  // Find the SIGNUP_CODES array closing bracket
  const oldMatch = content.match(/const SIGNUP_CODES = \[([\s\S]*?)\];/);
  if (!oldMatch) {
    console.error('Could not find SIGNUP_CODES array in server.js');
    return false;
  }

  // Create new codes array with existing + new codes
  const existingCodes = oldMatch[1]
    .split(',')
    .map(c => c.trim().replace(/'/g, ''))
    .filter(c => c);

  const allCodes = [...existingCodes, ...newCodes];
  
  // Format as JavaScript array
  const formattedCodes = allCodes
    .map((code, i) => `'${code}'${(i + 1) % 5 === 0 ? '\n  ' : ', '}`)
    .join('')
    .trim();

  const newCodeArrayString = `const SIGNUP_CODES = [\n  ${formattedCodes}\n];`;

  content = content.replace(/const SIGNUP_CODES = \[([\s\S]*?)\];/, newCodeArrayString);

  fs.writeFileSync(serverPath, content, 'utf8');
  console.log(`✅ Added ${newCodes.length} new codes to server.js`);
  return true;
}

/**
 * Commit and push changes to GitHub
 */
async function commitAndDeploy() {
  const { execSync } = require('child_process');
  
  try {
    execSync('git add server.js', { cwd: __dirname });
    execSync(`git commit -m "Auto-generate new signup codes - inventory replenishment"`, { cwd: __dirname });
    execSync('git push origin master', { cwd: __dirname });
    console.log('✅ Changes committed and pushed to GitHub');
    console.log('📦 Railway will auto-deploy within 2 minutes');
    return true;
  } catch (error) {
    console.error('Git error:', error.message);
    return false;
  }
}

/**
 * Notify user (would integrate with messaging)
 */
function notifyUser(message) {
  const timestamp = new Date().toISOString();
  console.log(`\n🔔 NOTIFICATION [${timestamp}]`);
  console.log(message);
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Checking code inventory...\n');

  const stats = await getCodeStats();
  if (!stats) {
    console.error('Could not retrieve code stats. Aborting.');
    process.exit(1);
  }

  console.log('📊 Current Inventory:');
  console.log(`  Cart Recovery (email2): ${stats.email2.available}/${stats.email2.total} available`);
  console.log(`  Checkout Recovery (email3): ${stats.email3.available}/${stats.email3.total} available`);
  console.log(`  Signup Welcome: ${stats.signup.available}/${stats.signup.total} available\n`);

  // Check for low inventory
  let needsReplenishment = false;
  let alerts = [];

  if (stats.email2.available < LOW_THRESHOLD) {
    needsReplenishment = true;
    alerts.push(`⚠️ Cart Recovery codes LOW: ${stats.email2.available} remaining (threshold: ${LOW_THRESHOLD})`);
  }

  if (stats.email3.available < LOW_THRESHOLD) {
    needsReplenishment = true;
    alerts.push(`⚠️ Checkout Recovery codes LOW: ${stats.email3.available} remaining (threshold: ${LOW_THRESHOLD})`);
  }

  if (stats.signup.available < LOW_THRESHOLD) {
    needsReplenishment = true;
    alerts.push(`⚠️ Signup Welcome codes LOW: ${stats.signup.available} remaining (threshold: ${LOW_THRESHOLD})`);
  }

  if (alerts.length > 0) {
    alerts.forEach(alert => console.log(alert));
    console.log('\n🚀 Generating new codes...\n');

    // Generate 300 new signup codes (if needed)
    if (stats.signup.available < LOW_THRESHOLD) {
      const nextNum = stats.signup.total + 1;
      const newCodes = generateCodes('WELCOME5-', 300, nextNum);
      
      console.log(`Generated 300 new signup codes (WELCOME5-${String(nextNum).padStart(3, '0')} to WELCOME5-${String(nextNum + 299).padStart(3, '0')})`);
      
      if (addNewSignupCodes(newCodes)) {
        if (await commitAndDeploy()) {
          notifyUser(`✅ Code replenishment successful!\n\nNew codes deployed:\n- Signup Welcome: +300 codes\n\nNew total: ${stats.signup.total + 300} codes\nAvailable: ${stats.signup.available + 300}`);
        } else {
          notifyUser(`⚠️ Codes generated but Git push failed. Manual deploy needed.`);
        }
      }
    }
  } else {
    console.log('✅ All code inventories are healthy!');
    console.log('\nNext check: in 3 days');
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
