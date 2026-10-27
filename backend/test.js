/**
 * Simple automated test for EV Charge Finder backend endpoints
 * Runs with: npm test
 */
const app = require('./server');

function mockRequest(method, url) {
  return new Promise((resolve, reject) => {
    const req = {
      method,
      url,
      headers: {},
      params: {}
    };

    const res = {
      statusCode: 200,
      headers: {},
      setHeader(k, v) { this.headers[k] = v; },
      status(code) { this.statusCode = code; return this; },
      json(data) {
        this.body = data;
        resolve(this);
      },
      send(data) {
        this.body = data;
        resolve(this);
      }
    };

    try {
      app(req, res);
    } catch (err) {
      reject(err);
    }
  });
}

async function runTests() {
  console.log('--- Running EV Charge Finder Backend Tests ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  PASS: ${message}`);
      passed++;
    } else {
      console.error(`  FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Test GET /api/health
  const healthRes = await mockRequest('GET', '/api/health');
  assert(healthRes.statusCode === 200, 'GET /api/health returns HTTP 200');
  assert(healthRes.body && healthRes.body.status === 'ok', 'GET /api/health body.status is "ok"');
  assert(typeof healthRes.body.uptimeSeconds === 'number', 'GET /api/health includes uptimeSeconds');

  // 2. Test GET /api/info
  const infoRes = await mockRequest('GET', '/api/info');
  assert(infoRes.statusCode === 200, 'GET /api/info returns HTTP 200');
  assert(infoRes.body && infoRes.body.name === 'EV Charge Finder API', 'GET /api/info returns application name');
  assert(infoRes.body.demonstrationStationsCount >= 15, 'GET /api/info reports at least 15 demonstration stations');

  // 3. Test GET /api/stations
  const stationsRes = await mockRequest('GET', '/api/stations');
  assert(stationsRes.statusCode === 200, 'GET /api/stations returns HTTP 200');
  assert(Array.isArray(stationsRes.body), 'GET /api/stations returns an array');
  assert(stationsRes.body.length >= 15, `GET /api/stations returns at least 15 stations (found ${stationsRes.body.length})`);

  // Verify fields on stations
  const first = stationsRes.body[0];
  assert(first.name && first.address && first.connectorTypes && first.powerKw && first.pricingPerKwh !== undefined,
    'Station item contains name, address, connectorTypes, powerKw, and pricingPerKwh');

  // 4. Test GET /api/stations/:id (existing)
  const singleRes = await mockRequest('GET', '/api/stations/demo-01');
  assert(singleRes.statusCode === 200, 'GET /api/stations/demo-01 returns HTTP 200');
  assert(singleRes.body.id === 'demo-01', 'GET /api/stations/demo-01 returns correct station id');

  // 5. Test GET /api/stations/:id (not found)
  const notFoundRes = await mockRequest('GET', '/api/stations/non-existent-id');
  assert(notFoundRes.statusCode === 404, 'GET /api/stations/:id with invalid ID returns HTTP 404');

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
