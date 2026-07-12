import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEST_PORT = 5001;
const API_URL = `http://localhost:${TEST_PORT}`;

console.log('🚀 Starting Integration Flow Tests for SAVI\'S Collection Store...');

// Spawn the backend server on a test port
const serverProcess = spawn('node', ['backend/index.js'], {
  cwd: __dirname,
  env: { ...process.env, PORT: TEST_PORT.toString() }
});

let serverOutput = '';
serverProcess.stdout.on('data', (data) => {
  serverOutput += data.toString();
  console.log(`[Server] ${data.toString().trim()}`);
});

serverProcess.stderr.on('data', (data) => {
  console.error(`[Server Error] ${data.toString().trim()}`);
});

// Helper to wait
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  // Wait for server to boot up
  console.log('⏳ Waiting for server to initialize on port 5001...');
  await delay(3000);

  const stats = { passed: 0, failed: 0 };
  let createdOrderId = '';

  const assert = (condition, message) => {
    if (condition) {
      console.log(`✅ [PASS] - ${message}`);
      stats.passed++;
    } else {
      console.error(`❌ [FAIL] - ${message}`);
      stats.failed++;
    }
  };

  try {
    // Test 1: Fetch products catalog
    console.log('\n--- Test 1: Fetching Products Catalog ---');
    const prodRes = await fetch(`${API_URL}/api/products`);
    assert(prodRes.ok, `GET /api/products response status should be 200 (got ${prodRes.status})`);
    if (prodRes.ok) {
      const products = await prodRes.json();
      assert(Array.isArray(products), 'GET /api/products response should be a JSON array');
      assert(products.length > 0, `Store catalog should have at least 1 product (found ${products.length})`);
    }

    // Test 2: Register a new customer account
    console.log('\n--- Test 2: Customer Registration ---');
    const testUser = {
      name: 'Tester Arasu',
      email: `tester_${Date.now()}@test.com`,
      phone: '9876543210',
      address: 'No 12, Main Street, Erode, Tamil Nadu'
    };
    const userRes = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    assert(userRes.ok, `POST /api/users response status should be 200/201 (got ${userRes.status})`);
    if (userRes.ok) {
      const createdUser = await userRes.json();
      assert(createdUser.id && createdUser.id.startsWith('USR-'), `User ID should start with USR- (got ${createdUser.id})`);
      assert(createdUser.email === testUser.email, 'Registered email should match input');
    }

    // Test 3: Checkout and Order placement flow
    console.log('\n--- Test 3: Checkout and Order Placement ---');
    const mockOrder = {
      customerName: testUser.name,
      email: testUser.email,
      phone: testUser.phone,
      address: testUser.address,
      items: [
        {
          id: 'prod-saree-1782238436155-6',
          name: 'Bengal Tant Cotton Saree - Ivory & Red',
          price: 1199,
          quantity: 1,
          size: 'Free Size',
          color: 'Default'
        }
      ],
      totalAmount: 1199
    };
    const orderRes = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockOrder)
    });
    assert(orderRes.ok, `POST /api/orders response status should be 200/201 (got ${orderRes.status})`);
    if (orderRes.ok) {
      const createdOrder = await orderRes.json();
      assert(createdOrder.id && createdOrder.id.startsWith('ORD-'), `Order ID should start with ORD- (got ${createdOrder.id})`);
      createdOrderId = createdOrder.id;
      assert(createdOrder.customerName === testUser.name, 'Order customer name should match');
      assert(createdOrder.status === 'Pending', `Initial order status should be Pending (got ${createdOrder.status})`);
    }

    // Test 4: Track placed order
    console.log('\n--- Test 4: Order Tracking ---');
    if (createdOrderId) {
      const trackRes = await fetch(`${API_URL}/api/orders/track/${createdOrderId}`);
      assert(trackRes.ok, `GET /api/orders/track/${createdOrderId} response status should be 200 (got ${trackRes.status})`);
      if (trackRes.ok) {
        const trackedOrder = await trackRes.json();
        assert(trackedOrder.id === createdOrderId, 'Tracked order ID should match the requested order ID');
        assert(trackedOrder.status === 'Pending', 'Tracked status should be Pending');
      }
    } else {
      assert(false, 'Skipping tracking test since order was not created.');
    }

    // Test 5: Submit contact inquiry message
    console.log('\n--- Test 5: Submit Inquiry message ---');
    const mockInquiry = {
      name: 'Inquirer Mukil',
      email: 'mukil@test.com',
      phone: '9876543219',
      subject: 'Bulk Order Query',
      message: 'Hello, I would like to make a bulk purchase of co-ords. Please contact me.'
    };
    const inqRes = await fetch(`${API_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockInquiry)
    });
    assert(inqRes.ok, `POST /api/inquiries response status should be 200/201 (got ${inqRes.status})`);
    if (inqRes.ok) {
      const createdInq = await inqRes.json();
      assert(createdInq.id && createdInq.id.startsWith('INQ-'), `Inquiry ID should start with INQ- (got ${createdInq.id})`);
      assert(createdInq.message === mockInquiry.message, 'Submitted message content should match');
    }

  } catch (err) {
    console.error('💥 Test execution threw an unexpected error:', err);
    stats.failed++;
  } finally {
    // Kill backend process
    console.log('\n🛑 Stopping test server...');
    serverProcess.kill();
    await delay(1000);

    console.log('\n==============================================');
    console.log('                TEST REPORT SUMMARY           ');
    console.log('==============================================');
    console.log(` Passed tests:  \x1b[32m${stats.passed}\x1b[0m`);
    console.log(` Failed tests:  \x1b[31m${stats.failed}\x1b[0m`);
    console.log('==============================================');

    process.exit(stats.failed > 0 ? 1 : 0);
  }
}

runTests();
