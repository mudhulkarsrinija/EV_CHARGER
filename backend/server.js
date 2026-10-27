const express = require('express');
const cors = require('cors');
const path = require('path');
const stationsData = require('./data/stations.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for local development
app.use(cors());
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/**
 * GET /api/health
 * Returns backend service status, uptime, and timestamp
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'ev-charge-finder-backend',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/info
 * Returns application information and architecture notes
 */
app.get('/api/info', (req, res) => {
  res.status(200).json({
    name: 'EV Charge Finder API',
    version: '1.0.0',
    description: 'Lightweight demonstration backend for EV Charge Finder',
    technology: {
      backend: 'Node.js + Express',
      frontend: 'Angular + TypeScript',
      storage: 'Browser Local Storage (Primary persistence)',
      maps: 'Leaflet + OpenStreetMap'
    },
    demonstrationStationsCount: stationsData.length,
    endpoints: [
      { method: 'GET', path: '/api/health', description: 'Server health check' },
      { method: 'GET', path: '/api/stations', description: 'Returns all demonstration charging stations' },
      { method: 'GET', path: '/api/stations/:id', description: 'Returns a specific station by id' },
      { method: 'GET', path: '/api/info', description: 'Application metadata and instructions' }
    ],
    persistenceNote: 'Demonstration data is served from this API. All user additions, updates, deletions, and favorites are persisted directly in the browser via Angular StorageService (ev_stations, ev_favorites, ev_preferences).'
  });
});

/**
 * GET /api/stations
 * Returns demonstration station data
 */
app.get('/api/stations', (req, res) => {
  res.status(200).json(stationsData);
});

/**
 * GET /api/stations/:id
 * Returns one station by id
 */
app.get('/api/stations/:id', (req, res) => {
  const stationId = req.params.id;
  const station = stationsData.find(s => s.id === stationId);

  if (!station) {
    return res.status(404).json({
      error: 'StationNotFound',
      message: `Station with ID '${stationId}' was not found in demonstration dataset.`
    });
  }

  res.status(200).json(station);
});

// 404 handler for unrecognized routes
app.use((req, res) => {
  res.status(404).json({
    error: 'NotFound',
    message: `Endpoint ${req.method} ${req.url} does not exist.`
  });
});

// Start listening if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`⚡ EV Charge Finder Backend listening on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
    console.log(`   Stations API: http://localhost:${PORT}/api/stations`);
    console.log(`   App Info:     http://localhost:${PORT}/api/info`);
    console.log(`===============================================`);
  });
}

module.exports = app;
