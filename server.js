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

// Email signup welcome codes (300 unique codes, 7-day expiration)
const SIGNUP_CODES = [
  'WELCOME5-001', 'WELCOME5-002', 'WELCOME5-003', 'WELCOME5-004', 'WELCOME5-005',
  'WELCOME5-006', 'WELCOME5-007', 'WELCOME5-008', 'WELCOME5-009', 'WELCOME5-010',
  'WELCOME5-011', 'WELCOME5-012', 'WELCOME5-013', 'WELCOME5-014', 'WELCOME5-015',
  'WELCOME5-016', 'WELCOME5-017', 'WELCOME5-018', 'WELCOME5-019', 'WELCOME5-020',
  'WELCOME5-021', 'WELCOME5-022', 'WELCOME5-023', 'WELCOME5-024', 'WELCOME5-025',
  'WELCOME5-026', 'WELCOME5-027', 'WELCOME5-028', 'WELCOME5-029', 'WELCOME5-030',
  'WELCOME5-031', 'WELCOME5-032', 'WELCOME5-033', 'WELCOME5-034', 'WELCOME5-035',
  'WELCOME5-036', 'WELCOME5-037', 'WELCOME5-038', 'WELCOME5-039', 'WELCOME5-040',
  'WELCOME5-041', 'WELCOME5-042', 'WELCOME5-043', 'WELCOME5-044', 'WELCOME5-045',
  'WELCOME5-046', 'WELCOME5-047', 'WELCOME5-048', 'WELCOME5-049', 'WELCOME5-050',
  'WELCOME5-051', 'WELCOME5-052', 'WELCOME5-053', 'WELCOME5-054', 'WELCOME5-055',
  'WELCOME5-056', 'WELCOME5-057', 'WELCOME5-058', 'WELCOME5-059', 'WELCOME5-060',
  'WELCOME5-061', 'WELCOME5-062', 'WELCOME5-063', 'WELCOME5-064', 'WELCOME5-065',
  'WELCOME5-066', 'WELCOME5-067', 'WELCOME5-068', 'WELCOME5-069', 'WELCOME5-070',
  'WELCOME5-071', 'WELCOME5-072', 'WELCOME5-073', 'WELCOME5-074', 'WELCOME5-075',
  'WELCOME5-076', 'WELCOME5-077', 'WELCOME5-078', 'WELCOME5-079', 'WELCOME5-080',
  'WELCOME5-081', 'WELCOME5-082', 'WELCOME5-083', 'WELCOME5-084', 'WELCOME5-085',
  'WELCOME5-086', 'WELCOME5-087', 'WELCOME5-088', 'WELCOME5-089', 'WELCOME5-090',
  'WELCOME5-091', 'WELCOME5-092', 'WELCOME5-093', 'WELCOME5-094', 'WELCOME5-095',
  'WELCOME5-096', 'WELCOME5-097', 'WELCOME5-098', 'WELCOME5-099', 'WELCOME5-100',
  'WELCOME5-101', 'WELCOME5-102', 'WELCOME5-103', 'WELCOME5-104', 'WELCOME5-105',
  'WELCOME5-106', 'WELCOME5-107', 'WELCOME5-108', 'WELCOME5-109', 'WELCOME5-110',
  'WELCOME5-111', 'WELCOME5-112', 'WELCOME5-113', 'WELCOME5-114', 'WELCOME5-115',
  'WELCOME5-116', 'WELCOME5-117', 'WELCOME5-118', 'WELCOME5-119', 'WELCOME5-120',
  'WELCOME5-121', 'WELCOME5-122', 'WELCOME5-123', 'WELCOME5-124', 'WELCOME5-125',
  'WELCOME5-126', 'WELCOME5-127', 'WELCOME5-128', 'WELCOME5-129', 'WELCOME5-130',
  'WELCOME5-131', 'WELCOME5-132', 'WELCOME5-133', 'WELCOME5-134', 'WELCOME5-135',
  'WELCOME5-136', 'WELCOME5-137', 'WELCOME5-138', 'WELCOME5-139', 'WELCOME5-140',
  'WELCOME5-141', 'WELCOME5-142', 'WELCOME5-143', 'WELCOME5-144', 'WELCOME5-145',
  'WELCOME5-146', 'WELCOME5-147', 'WELCOME5-148', 'WELCOME5-149', 'WELCOME5-150',
  'WELCOME5-151', 'WELCOME5-152', 'WELCOME5-153', 'WELCOME5-154', 'WELCOME5-155',
  'WELCOME5-156', 'WELCOME5-157', 'WELCOME5-158', 'WELCOME5-159', 'WELCOME5-160',
  'WELCOME5-161', 'WELCOME5-162', 'WELCOME5-163', 'WELCOME5-164', 'WELCOME5-165',
  'WELCOME5-166', 'WELCOME5-167', 'WELCOME5-168', 'WELCOME5-169', 'WELCOME5-170',
  'WELCOME5-171', 'WELCOME5-172', 'WELCOME5-173', 'WELCOME5-174', 'WELCOME5-175',
  'WELCOME5-176', 'WELCOME5-177', 'WELCOME5-178', 'WELCOME5-179', 'WELCOME5-180',
  'WELCOME5-181', 'WELCOME5-182', 'WELCOME5-183', 'WELCOME5-184', 'WELCOME5-185',
  'WELCOME5-186', 'WELCOME5-187', 'WELCOME5-188', 'WELCOME5-189', 'WELCOME5-190',
  'WELCOME5-191', 'WELCOME5-192', 'WELCOME5-193', 'WELCOME5-194', 'WELCOME5-195',
  'WELCOME5-196', 'WELCOME5-197', 'WELCOME5-198', 'WELCOME5-199', 'WELCOME5-200',
  'WELCOME5-201', 'WELCOME5-202', 'WELCOME5-203', 'WELCOME5-204', 'WELCOME5-205',
  'WELCOME5-206', 'WELCOME5-207', 'WELCOME5-208', 'WELCOME5-209', 'WELCOME5-210',
  'WELCOME5-211', 'WELCOME5-212', 'WELCOME5-213', 'WELCOME5-214', 'WELCOME5-215',
  'WELCOME5-216', 'WELCOME5-217', 'WELCOME5-218', 'WELCOME5-219', 'WELCOME5-220',
  'WELCOME5-221', 'WELCOME5-222', 'WELCOME5-223', 'WELCOME5-224', 'WELCOME5-225',
  'WELCOME5-226', 'WELCOME5-227', 'WELCOME5-228', 'WELCOME5-229', 'WELCOME5-230',
  'WELCOME5-231', 'WELCOME5-232', 'WELCOME5-233', 'WELCOME5-234', 'WELCOME5-235',
  'WELCOME5-236', 'WELCOME5-237', 'WELCOME5-238', 'WELCOME5-239', 'WELCOME5-240',
  'WELCOME5-241', 'WELCOME5-242', 'WELCOME5-243', 'WELCOME5-244', 'WELCOME5-245',
  'WELCOME5-246', 'WELCOME5-247', 'WELCOME5-248', 'WELCOME5-249', 'WELCOME5-250',
  'WELCOME5-251', 'WELCOME5-252', 'WELCOME5-253', 'WELCOME5-254', 'WELCOME5-255',
  'WELCOME5-256', 'WELCOME5-257', 'WELCOME5-258', 'WELCOME5-259', 'WELCOME5-260',
  'WELCOME5-261', 'WELCOME5-262', 'WELCOME5-263', 'WELCOME5-264', 'WELCOME5-265',
  'WELCOME5-266', 'WELCOME5-267', 'WELCOME5-268', 'WELCOME5-269', 'WELCOME5-270',
  'WELCOME5-271', 'WELCOME5-272', 'WELCOME5-273', 'WELCOME5-274', 'WELCOME5-275',
  'WELCOME5-276', 'WELCOME5-277', 'WELCOME5-278', 'WELCOME5-279', 'WELCOME5-280',
  'WELCOME5-281', 'WELCOME5-282', 'WELCOME5-283', 'WELCOME5-284', 'WELCOME5-285',
  'WELCOME5-286', 'WELCOME5-287', 'WELCOME5-288', 'WELCOME5-289', 'WELCOME5-290',
  'WELCOME5-291', 'WELCOME5-292', 'WELCOME5-293', 'WELCOME5-294', 'WELCOME5-295',
  'WELCOME5-296', 'WELCOME5-297', 'WELCOME5-298', 'WELCOME5-299', 'WELCOME5-300'
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

    if (type !== 'email2' && type !== 'email3' && type !== 'signup') {
      return res.status(400).json({ error: 'Type must be email2, email3, or signup' });
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

    let batch;
    if (type === 'email2') {
      batch = EMAIL2_CODES;
    } else if (type === 'email3') {
      batch = EMAIL3_CODES;
    } else {
      batch = SIGNUP_CODES;
    }
    
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
    // Signup codes expire in 7 days, cart/checkout expire in 48 hours
    const expirationMs = type === 'signup' 
      ? 7 * 24 * 60 * 60 * 1000  // 7 days
      : 48 * 60 * 60 * 1000;     // 48 hours
    const expiresAt = new Date(now.getTime() + expirationMs);

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

    // Shopify API credentials (from environment variables)
    const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
    const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;

    if (!SHOPIFY_STORE || !SHOPIFY_TOKEN) {
      return res.status(500).json({ 
        error: 'Shopify credentials not configured in environment variables',
        required: ['SHOPIFY_STORE', 'SHOPIFY_TOKEN']
      });
    }

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
