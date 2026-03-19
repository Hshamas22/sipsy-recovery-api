javascript
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

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

let codeAssignments = {};
let codeUsage = {};

app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'Sipsy Cart Recovery API',
    version: '1.0.0'
  });
});

app.get('/api/assign-code', (req, res) => {
  try {
    const { email, type = 'email2' } = req.query;

    if (!email) {
      return res.status(400).json({ 
        error: 'Email parameter required',
        example: '/api/assign-code?email=customer@example.com&type=email2'
      });
    }

    if (type !== 'email2' && type !== 'email3') {
      return res.status(400).json({ 
        error: 'Type must be "email2" or "email3"'
      });
    }

    const key = `${email}_${type}`;
    if (codeAssignments[key]) {
      const assignment = codeAssignments[key];
      const expiresAt = new Date(assignment.expiresAt);
      
      if (expiresAt > new Date()) {
        return res.json({
          code: assignment.code,
          expiresAt: assignment.expiresAt,
          message: 'Code already assigned to this customer',
          isNew: false
        });
      } else {
        delete codeAssignments[key];
      }
    }

    const batch = type === 'email2' ? EMAIL2_CODES : EMAIL3_CODES;
    
    let availableCode = null;
    for (const code of batch) {
      if (!codeUsage[code] || !codeUsage[code].used) {
        availableCode = code;
        break;
      }
    }

    if (!availableCode) {
      const used = Object.values(codeUsage)
        .filter(c => c.type === type && c.used).length;
      
      return res.status(400).json({
        error: `No available codes in ${type} batch`,
        total: batch.length,
        used: used,
        message: 'Contact support to add more codes'
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
      used: false,
      usedAt: null
    };

    return res.json({
      code: availableCode,
      expiresAt: expiresAt.toISOString(),
      message: 'Code assigned successfully',
      isNew: true
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/mark-used', (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Code parameter required' });
    }

    if (!codeUsage[code]) {
      return res.status(404).json({ error: 'Code not found' });
    }
javascript
   if (codeUsage[code].used) {
      return res.status(400).json({ error: 'Code already used' });
    }

    codeUsage[code].used = true;
    codeUsage[code].usedAt = new Date().toISOString();

    return res.json({
      message: 'Code marked as used',
      code: code
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats', (req, res) => {
  const email2Used = Object.values(codeUsage)
    .filter(c => c.type === 'email2' && c.used).length;
  const email3Used = Object.values(codeUsage)
    .filter(c => c.type === 'email3' && c.used).length;

  const email2Assigned = Object.values(codeAssignments)
    .filter(c => c.type === 'email2').length;
  const email3Assigned = Object.values(codeAssignments)
    .filter(c => c.type === 'email3').length;

  return res.json({
    email2: {
      total: EMAIL2_CODES.length,
      assigned: email2Assigned,
      used: email2Used,
      available: EMAIL2_CODES.length - email2Used
    },
    email3: {
      total: EMAIL3_CODES.length,
      assigned: email3Assigned,
      used: email3Used,
      available: EMAIL3_CODES.length - email3Used
    },
    totalAssignments: Object.keys(codeAssignments).length,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Sipsy Recovery API running on port ${PORT}`);
  console.log(`📊 Visit http://localhost:${PORT}/api/stats to see statistics`);
});
