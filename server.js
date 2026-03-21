/**
 * Express Server for Sipsy Cart Recovery + Preference System
 * Deploy to Railway
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Code batches
const EMAIL2_CODES = [
  'SIPSY5-BB12AD', 'SIPSY5-007DA4', 'SIPSY5-96E7A9', 'SIPSY5-9B81CF', 
  'SIPSY5-FE4D8A', 'SIPSY5-A2D8F4', 'SIPSY5-C5E1B2', 'SIPSY5-D7F9E3',
  'SIPSY5-E8A1F2', 'SIPSY5-F3B4C1', 'SIPSY5-G2C5D3', 'SIPSY5-H4D6E2',
  'SIPSY5-I5E7F1', 'SIPSY5-J6F8A0', 'SIPSY5-K7G9B1', 'SIPSY5-L8H0C2',
  'SIPSY5-M9I1D3', 'SIPSY5-N0J2E4', 'SIPSY5-O1K3F5', 'SIPSY5-P2L4G6',
  'SIPSY5-Q3M5H7', 'SIPSY5-R4N6I8', 'SIPSY5-S5O7J9', 'SIPSY5-T6P8K0',
  'SIPSY5-U7Q9L1', 'SIPSY5-V8R0M2', 'SIPSY5-W9S1N3', 'SIPSY5-X0T2O4',
  'SIPSY5-Y1U3P5', 'SIPSY5-Z2V4Q6', 'SIPSY5-A3W5R7', 'SIPSY5-B4X6S8',
  'SIPSY5-C5Y7T9', 'SIPSY5-D6Z8U0', 'SIPSY5-E7A1V1', 'SIPSY5-F8B2W2',
  'SIPSY5-G9C3X3', 'SIPSY5-H0D4Y4', 'SIPSY5-I1E5Z5', 'SIPSY5-J2F6A6',
  'SIPSY5-K3G7B7', 'SIPSY5-L4H8C8', 'SIPSY5-M5I9D9', 'SIPSY5-N6J0E0',
  'SIPSY5-O7K1F1', 'SIPSY5-P8L2G2', 'SIPSY5-Q9M3H3', 'SIPSY5-R0N4I4'
];

const EMAIL3_CODES = [
  'SIPSY5-S1O5J5', 'SIPSY5-T2P6K6', 'SIPSY5-U3Q7L7', 'SIPSY5-V4R8M8',
  'SIPSY5-W5S9N9', 'SIPSY5-X6T0O0', 'SIPSY5-Y7U1P1', 'SIPSY5-Z8V2Q2',
  'SIPSY5-A9W3R3', 'SIPSY5-B0X4S4', 'SIPSY5-C1Y5T5', 'SIPSY5-D2Z6U6'
];

// In-memory store
let codeAssignments = {};
let codeUsage = {};

/**
 * GET /api/assign-code?email=customer@example.com&type=email2
 */
app.get('/api/assign-code', async (req, res) => {
  try {
    const { email, type = 'email2' } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email parameter required' });
    }

    if (type !== 'email2' && type !== 'email3') {
      return res.status(400).json({ error: 'Type must be email2 or email3' });
    }

    const key = `${email}_${type}`;
    if (codeAssignments[key]) {
      const assignment = codeAssignments[key];
      const expiresAt = new Date(assignment.expiresAt);
      
      if (expiresAt > new Date()) {
        return res.status(200).json({
          code: assignment.code,
          expiresAt: assignment.expiresAt,
          message: 'Previously assigned code (still valid)',
          isNew: false
        });
      } else {
        delete codeAssignments[key];
      }
    }

    const batch = type === 'email2' ? EMAIL2_CODES : EMAIL3_CODES;
    
    let availableCode = null;
    for (const code of batch) {
      if (!codeUsage[code]) {
        availableCode = code;
        break;
      }
    }

    if (!availableCode) {
      return res.status(400).json({
        error: `No available codes in ${type} batch`,
        codesRemaining: batch.length,
        codesUsed: Object.keys(codeUsage).filter(c => batch.includes(c)).length
      });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    codeAssignments[key] = {
      code: availableCode,
      email: email,
      type: type,
      assignedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    };

    codeUsage[availableCode] = {
      assignedAt: now.toISOString(),
      email: email,
      type: type,
      used: false
    };

    return res.status(200).json({
      code: availableCode,
      expiresAt: expiresAt.toISOString(),
      message: 'Code assigned successfully',
      isNew: true
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/mark-used?code=SIPSY5-XXXXX
 */
app.post('/api/mark-used', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Code parameter required' });
    }

    if (!codeUsage[code]) {
      return res.status(404).json({ error: 'Code not found' });
    }

    codeUsage[code].used = true;
    codeUsage[code].usedAt = new Date().toISOString();

    return res.status(200).json({
      message: 'Code marked as used',
      code: code
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/stats
 */
app.get('/api/stats', async (req, res) => {
  const totalEmail2 = EMAIL2_CODES.length;
  const totalEmail3 = EMAIL3_CODES.length;
  const email2Used = Object.values(codeUsage).filter(c => c.type === 'email2' && c.used).length;
  const email3Used = Object.values(codeUsage).filter(c => c.type === 'email3' && c.used).length;

  return res.status(200).json({
    email2: {
      total: totalEmail2,
      assigned: Object.values(codeAssignments).filter(c => c.type === 'email2').length,
      used: email2Used,
      available: totalEmail2 - email2Used
    },
    email3: {
      total: totalEmail3,
      assigned: Object.values(codeAssignments).filter(c => c.type === 'email3').length,
      used: email3Used,
      available: totalEmail3 - email3Used
    },
    totalAssignments: Object.keys(codeAssignments).length
  });
});

/**
 * POST /api/update-preferences
 * Update customer preferences and apply Shopify tags
 */
app.post('/api/update-preferences', async (req, res) => {
  try {
    const { email, interests } = req.body;

    if (!email || !Array.isArray(interests)) {
      return res.status(400).json({ 
        error: 'Email and interests array required',
        example: { email: 'user@example.com', interests: ['tequila', 'sales'] }
      });
    }

    // Shopify API credentials
    const SHOPIFY_STORE = process.env.SHOPIFY_STORE || 'by0iv9-hr';
    const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN || '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';

    // Step 1: Find customer by email
    const searchUrl = `https://${SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/customers/search.json?query=email:${encodeURIComponent(email)}`;

    const searchResponse = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (!searchResponse.ok) {
      throw new Error(`Shopify search failed: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    
    if (!searchData.customers || searchData.customers.length === 0) {
      return res.status(404).json({ 
        error: 'Customer not found',
        email: email
      });
    }

    const customer = searchData.customers[0];
    const customerId = customer.id;

    // Step 2: Map interests to Shopify tags
    const interestTagMap = {
      'new-products': 'Pref-New-Products',
      'sales': 'Pref-Sales',
      'tequila': 'Pref-Tequila',
      'whiskey': 'Pref-Whiskey',
      'wine': 'Pref-Wine',
      'champagne': 'Pref-Champagne',
      'sustainable': 'Pref-Sustainable',
      'additive-free': 'Pref-Additive-Free',
      'non-alcoholic': 'Pref-Non-Alcoholic',
      'cocktail-recipes': 'Pref-Cocktail-Recipes'
    };

    const newTags = interests.map(interest => interestTagMap[interest]).filter(Boolean);
    newTags.push('Preference-Collected');

    // Step 3: Update customer tags
    const updateUrl = `https://${SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/customers/${customerId}.json`;

    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer: {
          id: customerId,
          tags: newTags.join(', ')
        }
      })
    });

    if (!updateResponse.ok) {
      throw new Error(`Shopify update failed: ${updateResponse.statusText}`);
    }

    const updateData = await updateResponse.json();

    // Step 4: Send email with discount code
    const emailUrl = `https://${SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/customers/${customerId}/send_email_invite.json`;
    
    const emailBody = `
Hi ${customer.first_name || 'there'},

Thank you for telling us what you love! We've saved your preferences and can't wait to send you updates about what matters to you.

As a thank you, here's your exclusive $5 off code:

**THANKYOU5**

Use this code at checkout to get $5 off your next order. Valid for 1 month.

Happy shopping!
Sipsy Team
    `.trim();

    const emailResponse = await fetch(emailUrl, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer_invite: {
          custom_message: emailBody
        }
      })
    });

    if (!emailResponse.ok) {
      console.warn(`Email send failed: ${emailResponse.statusText}. Continuing anyway.`);
    }

    return res.status(200).json({
      success: true,
      message: 'Preferences saved, customer tagged, and email sent',
      customer: {
        id: customerId,
        email: email,
        name: customer.first_name,
        tags: updateData.customer.tags
      },
      interests: interests,
      discountCode: 'THANKYOU5',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error updating preferences:', error);
    return res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Sipsy Recovery API running on port ${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  GET  /api/assign-code?email=...&type=email2`);
  console.log(`  POST /api/mark-used?code=...`);
  console.log(`  GET  /api/stats`);
  console.log(`  POST /api/update-preferences`);
  console.log(`  GET  /health`);
});

module.exports = app;
