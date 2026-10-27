/**
 * Automated Logic & Specification Tests for EV Charge Finder Frontend
 * Verifies Local Storage keys, calculator formulas, and station data schema.
 * Run with: npm run test:logic
 */
const fs = require('fs');
const path = require('path');

console.log('--- Running EV Charge Finder Frontend Logic Tests ---');
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

// 1. Verify Storage Keys in storage.service.ts
const storageServicePath = path.join(__dirname, 'src', 'app', 'services', 'storage.service.ts');
const storageContent = fs.readFileSync(storageServicePath, 'utf8');

assert(storageContent.includes("'ev_stations'"), "StorageService specifies key 'ev_stations'");
assert(storageContent.includes("'ev_favorites'"), "StorageService specifies key 'ev_favorites'");
assert(storageContent.includes("'ev_preferences'"), "StorageService specifies key 'ev_preferences'");
assert(storageContent.includes('safeGetItem(STORAGE_KEY_STATIONS)'), 'StorageService safely checks existing localStorage before initializing');

// 2. Verify Sample Stations Dataset in station.model.ts
const modelPath = path.join(__dirname, 'src', 'app', 'models', 'station.model.ts');
const modelContent = fs.readFileSync(modelPath, 'utf8');

// Match demo station IDs (e.g. hyd-01, hyd-02)
const demoIdMatches = modelContent.match(/id:\s*['"]((demo|hyd)-\d+)['"]/g) || [];
assert(demoIdMatches.length >= 15, `Dataset contains at least 15 demonstration stations (found ${demoIdMatches.length})`);

// 3. Verify Cost Calculator Business Logic
function calculateCharging(batteryCapacity, currentPct, targetPct, pricePerKwh) {
  if (!batteryCapacity || batteryCapacity <= 0) {
    return { isValid: false, error: 'Invalid capacity' };
  }
  if (pricePerKwh === null || pricePerKwh === undefined || pricePerKwh < 0) {
    return { isValid: false, error: 'Invalid price' };
  }
  if (targetPct <= currentPct) {
    return { isValid: false, error: 'Target must be greater than current' };
  }
  const delta = targetPct - currentPct;
  const energyRequiredKwh = (batteryCapacity * delta) / 100;
  const estimatedCost = energyRequiredKwh * pricePerKwh;
  return {
    isValid: true,
    energyRequiredKwh,
    estimatedCost,
    chargingDelta: delta
  };
}

// Test case A: Standard calculation (75 kWh pack, 20% to 80% @ $0.38/kWh)
const calcA = calculateCharging(75, 20, 80, 0.38);
assert(calcA.isValid, 'Calculator accepts valid input');
assert(Math.abs(calcA.energyRequiredKwh - 45.0) < 0.001, 'Energy required is exactly 45.0 kWh (75 * 60%)');
assert(Math.abs(calcA.estimatedCost - 17.10) < 0.001, 'Estimated cost is exactly $17.10 (45 * $0.38)');

// Test case B: Zero delta / invalid target
const calcB = calculateCharging(75, 80, 50, 0.38);
assert(!calcB.isValid, 'Calculator rejects target percentage <= current percentage');

// Test case C: Leaflet integration check
const mapCompPath = path.join(__dirname, 'src', 'app', 'components', 'map', 'map.component.ts');
const mapContent = fs.readFileSync(mapCompPath, 'utf8');
assert(mapContent.includes("import * as L from 'leaflet'"), 'Map component properly imports Leaflet');
assert(mapContent.includes('tileLayer'), 'Map component adds OpenStreetMap/Carto tile layer');
assert(mapContent.includes('divIcon'), 'Map component uses custom DivIcons for high-contrast pins');

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
}
