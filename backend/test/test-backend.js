process.env.NODE_ENV = 'test';
import 'dotenv/config';
process.env.NODE_ENV = 'test';
import assert from 'assert';
import http from 'http';
import app from '../src/server.js';
import store from '../src/models/store.js';
import razorpayService from '../src/services/razorpayService.js';

const PIPE_PATH = `\\\\.\\pipe\\tedx-test-${Date.now()}`;
let server;

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        socketPath: PIPE_PATH,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
          ...headers,
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = raw;
          }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('   RUNNING COMPREHENSIVE BACKEND TEST SUITE        ');
  console.log('====================================================\n');

  // Start test server on named pipe
  await new Promise((resolve) => {
    server = app.listen(PIPE_PATH, () => {
      console.log(`[Test Server] Listening on pipe: ${PIPE_PATH}\n`);
      resolve();
    });
  });

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ [FAIL] ${name}`);
      console.error(`    -> ${err.message}`);
      failed++;
    }
  }

  // 1. Health check
  await test('GET /api/health returns 200 and ok status', async () => {
    const res = await makeRequest('GET', '/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ok');
  });

  // 2. Pass pricing verification
  await test('GET /api/delegates/passes returns Student (₹100) and Professional (₹200) passes', async () => {
    const res = await makeRequest('GET', '/api/delegates/passes');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(Array.isArray(res.body.data), true);

    const studentPass = res.body.data.find((p) => p.id === 'student');
    const proPass = res.body.data.find((p) => p.id === 'professional');

    assert(studentPass, 'Student pass must be listed');
    assert.strictEqual(studentPass.price, 100, 'Student pass price must be 100');
    assert.strictEqual(studentPass.currency, 'INR');

    assert(proPass, 'Professional pass must be listed');
    assert.strictEqual(proPass.price, 200, 'Professional pass price must be 200');
    assert.strictEqual(proPass.currency, 'INR');
  });

  // 3. Validation: Missing Name
  await test('POST /api/delegates/register rejects missing name', async () => {
    const res = await makeRequest('POST', '/api/delegates/register', {
      email: 'sanjith@example.com',
      phone: '9876543210',
      passType: 'student',
      declaration: true,
      collegeName: 'CIT',
      department: 'CSE',
      yearOfStudy: '3rd Year',
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error, 'VALIDATION_ERROR');
  });

  // 4. Validation: Invalid Email
  await test('POST /api/delegates/register rejects invalid email', async () => {
    const res = await makeRequest('POST', '/api/delegates/register', {
      name: 'Sanjith',
      email: 'invalid-email',
      phone: '9876543210',
      passType: 'student',
      declaration: true,
      collegeName: 'CIT',
      department: 'CSE',
      yearOfStudy: '3rd Year',
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  // 5. Validation: Missing Declaration
  await test('POST /api/delegates/register rejects unconfirmed declaration', async () => {
    const res = await makeRequest('POST', '/api/delegates/register', {
      name: 'Sanjith',
      email: 'sanjith@example.com',
      phone: '9876543210',
      passType: 'student',
      declaration: false,
      collegeName: 'CIT',
      department: 'CSE',
      yearOfStudy: '3rd Year',
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'DECLARATION_REQUIRED');
  });

  // 6. Validation: Invalid Pass Type
  await test('POST /api/delegates/register rejects unknown pass type', async () => {
    const res = await makeRequest('POST', '/api/delegates/register', {
      name: 'Sanjith',
      email: 'sanjith@example.com',
      phone: '9876543210',
      passType: 'vip_gold_pass',
      declaration: true,
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'INVALID_PASS_TYPE');
  });

  // 7. Student Pass Order Creation (₹100 = 10000 paise) with all required student fields
  let studentOrderId;
  let studentRegId;
  await test('POST /api/delegates/register creates Student Pass Order for ₹100 (10000 paise)', async () => {
    const res = await makeRequest('POST', '/api/delegates/register', {
      name: 'Sanjith Kumar',
      email: 'sanjith.cit@example.com',
      phone: '+919876543210',
      linkedin: 'https://linkedin.com/in/sanjith',
      passType: 'student',
      collegeName: 'Chennai Institute of Technology',
      department: 'Computer Science and Engineering',
      yearOfStudy: '3rd Year',
      section: 'A',
      attendedBefore: 'No',
      heardAbout: 'Campus Posters / Banners',
      declaration: true,
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.amount, 10000, 'Amount must be 10000 paise');
    assert.strictEqual(res.body.data.amountInRupees, 100, 'Rupee amount must be 100');
    assert.strictEqual(res.body.data.currency, 'INR');
    assert(res.body.data.orderId, 'Razorpay orderId must be generated');
    assert(res.body.data.registrationId, 'registrationId must be returned');

    studentOrderId = res.body.data.orderId;
    studentRegId = res.body.data.registrationId;
  });

  // 8. Professional Pass Order Creation (₹200 = 20000 paise) with all required professional fields
  let proOrderId;
  let proRegId;
  await test('POST /api/delegates/register creates Professional Pass Order for ₹200 (20000 paise)', async () => {
    const res = await makeRequest('POST', '/api/delegates/register', {
      name: 'Dr. Venkatesh R',
      email: 'venkatesh.prof@example.com',
      phone: '+919840123456',
      linkedin: 'https://linkedin.com/in/drvenkatesh',
      passType: 'professional',
      organisationName: 'Tech Corp India',
      jobDesignation: 'Senior Architect',
      industryDomain: 'Information Technology',
      experienceYears: '6 - 10 years',
      attendedBefore: 'Yes',
      heardAbout: 'Professional Network / Colleagues',
      declaration: true,
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.amount, 20000, 'Amount must be 20000 paise');
    assert.strictEqual(res.body.data.amountInRupees, 200, 'Rupee amount must be 200');
    assert(res.body.data.orderId);

    proOrderId = res.body.data.orderId;
    proRegId = res.body.data.registrationId;
  });

  // 9. Payment Verification: Reject Tampered / Forged Signature
  await test('POST /api/delegates/verify-payment rejects forged signature', async () => {
    const res = await makeRequest('POST', '/api/delegates/verify-payment', {
      razorpay_order_id: studentOrderId,
      razorpay_payment_id: 'pay_tampered_123',
      razorpay_signature: 'fake_tampered_signature_99999',
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error, 'PAYMENT_VERIFICATION_FAILED');
  });

  // 10. Payment Verification: Valid Signature Flow
  await test('POST /api/delegates/verify-payment accepts authentic payment and confirms ticket', async () => {
    const testPaymentId = 'pay_test_' + Date.now();
    const validSignature = razorpayService.generateSignature(
      studentOrderId,
      testPaymentId,
      process.env.RAZORPAY_KEY_SECRET || 'mock_secret'
    );

    const res = await makeRequest('POST', '/api/delegates/verify-payment', {
      razorpay_order_id: studentOrderId,
      razorpay_payment_id: testPaymentId,
      razorpay_signature: validSignature,
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'PAID');
    assert.strictEqual(res.body.data.paymentId, testPaymentId);
    assert.strictEqual(res.body.data.amountPaid, 100);
    assert.strictEqual(res.body.data.attendee.collegeName, 'Chennai Institute of Technology');
    assert(res.body.data.confirmedAt);
  });

  // 11. Registration Lookup: By ID
  await test('GET /api/delegates/registration/:id returns confirmed status with accurate fields', async () => {
    const res = await makeRequest('GET', `/api/delegates/registration/${studentRegId}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'PAID');
    assert.strictEqual(res.body.data.email, 'sanjith.cit@example.com');
    assert.strictEqual(res.body.data.section, 'A');
    assert.strictEqual(res.body.data.yearOfStudy, '3rd Year');
  });

  // 12. Registration Lookup: By Order ID
  await test('GET /api/delegates/registration/:orderId returns matching record', async () => {
    const res = await makeRequest('GET', `/api/delegates/registration/${studentOrderId}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.id, studentRegId);
  });

  // 13. Payment Alias Route: POST /api/payment/create-order
  await test('POST /api/payment/create-order route alias works identically', async () => {
    const res = await makeRequest('POST', '/api/payment/create-order', {
      name: 'Alias Test Attendee',
      email: 'alias@example.com',
      phone: '9876543210',
      passType: 'student',
      collegeName: 'CIT',
      department: 'ECE',
      yearOfStudy: '2nd Year',
      declaration: true,
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.data.amount, 10000);
  });

  // 14. Standard Razorpay Checkout: POST /api/create-order with amount < 100 rejected
  await test('POST /api/create-order rejects amount < 100 paise with 400', async () => {
    const res = await makeRequest('POST', '/api/create-order', {
      amount: 50,
      currency: 'INR',
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'INVALID_AMOUNT');
  });

  // 15. Standard Razorpay Checkout: POST /api/create-order creates order with order_id, amount, currency
  let standardOrderId;
  await test('POST /api/create-order creates order and returns order_id, amount, currency, key_id', async () => {
    const res = await makeRequest('POST', '/api/create-order', {
      amount: 10000,
      currency: 'INR',
      receipt: 'test_rcpt_std_1',
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert(res.body.order_id, 'Must return order_id');
    assert.strictEqual(res.body.amount, 10000);
    assert.strictEqual(res.body.currency, 'INR');
    assert(res.body.key_id, 'Must return key_id');
    standardOrderId = res.body.order_id;
  });

  // 16. Standard Razorpay Checkout: POST /api/verify-payment rejects missing fields
  await test('POST /api/verify-payment rejects request missing required fields with 400', async () => {
    const res = await makeRequest('POST', '/api/verify-payment', {
      razorpay_order_id: standardOrderId,
      // missing razorpay_payment_id and razorpay_signature
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'MISSING_FIELDS');
  });

  // 17. Standard Razorpay Checkout: POST /api/verify-payment rejects tampered signature
  await test('POST /api/verify-payment rejects invalid/tampered signature with 400 SIGNATURE_MISMATCH', async () => {
    const res = await makeRequest('POST', '/api/verify-payment', {
      razorpay_order_id: standardOrderId,
      razorpay_payment_id: 'pay_test_tampered_789',
      razorpay_signature: 'fake_tampered_signature_hex_000',
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'SIGNATURE_MISMATCH');
  });

  // 18. Standard Razorpay Checkout: POST /api/verify-payment validates HMAC-SHA256 signature
  await test('POST /api/verify-payment validates HMAC-SHA256 signature and returns success', async () => {
    const testPaymentId = 'pay_test_std_' + Date.now();
    const validSignature = razorpayService.generateSignature(
      standardOrderId,
      testPaymentId,
      process.env.RAZORPAY_KEY_SECRET || 'mock_secret'
    );

    const res = await makeRequest('POST', '/api/verify-payment', {
      razorpay_order_id: standardOrderId,
      razorpay_payment_id: testPaymentId,
      razorpay_signature: validSignature,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.order_id, standardOrderId);
    assert.strictEqual(res.body.payment_id, testPaymentId);
  });

  // 19. Speaker Application
  await test('POST /api/speakers/apply submits application successfully', async () => {
    const res = await makeRequest('POST', '/api/speakers/apply', {
      name: 'Dr. Jane Doe',
      email: 'jane@example.com',
      talkTitle: 'The Future of Neural Computing',
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert(res.body.data.id);
  });

  // 20. Student Speaker Application
  await test('POST /api/student-speakers/apply submits application successfully', async () => {
    const res = await makeRequest('POST', '/api/student-speakers/apply', {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      college: 'Chennai Institute of Technology',
      talkIdea: 'Sustainable Tech in Agriculture',
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert(res.body.data.id);
  });

  // Cleanup
  await new Promise((resolve) => server.close(resolve));

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  if (server) server.close();
  process.exit(1);
});
