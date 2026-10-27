# ⚡ EV Charge Finder

A complete, working modern web application for discovering electric vehicle charging hubs, managing station records, and estimating charging costs. Built with **Angular + TypeScript** for the frontend, **Leaflet + OpenStreetMap** for interactive geospatial mapping, and **Node.js + Express** for demonstration backend APIs.

Station persistence and user preferences operate directly via browser **Local Storage**, providing instant responsiveness, offline capability, and persistence without external databases.

---

## 🚀 Features

### 1. Interactive Map & Station Discovery
- **Interactive Leaflet Map**: Powered by OpenStreetMap / CartoDB tiles with smooth panning, zooming, custom speed-coded markers (Emerald for Ultra-Fast &ge;150 kW, Blue for Fast 50–149 kW, Purple for Level 2 &lt;50 kW), and interactive popups.
- **Side-by-Side Station Records**: Responsive sidebar with real-time station cards displaying network operator, total bays, connector types, charging speed, and pricing per kWh.
- **Search & Filtering**:
  - Full-text search by station name, city, address, or network operator.
  - Connector type filter (All, CCS, Tesla / NACS, CHAdeMO, Type 2).
  - Charging power filter (All Speeds, Ultra-Fast 150+ kW, DC Fast 50–149 kW, Level 2 &lt;50 kW).
  - Favorites toggle filter (view only starred stations).
  - Multi-criteria sorting (Name A–Z, Power highest first, Price lowest first).
- **Persistent Preferences**: Search queries, selected filters, and sorting choices automatically persist in Local Storage (`ev_preferences`).

### 2. Complete Station Management (CRUD)
- **Add Station**: Modal form with strict validation for station name, address, city, GPS coordinates, connector types, charging power (kW), and pricing ($/kWh). Includes a quick "Use SF Coordinates" helper.
- **Edit Station**: Update existing station records; changes update the map and list in real time.
- **Delete Station**: Remove stations with confirmation dialog; cleanly cascades to remove favorited entries.
- **Demonstration Dataset**: Bundled with 16 realistic demonstration stations across major US cities (San Francisco, Palo Alto, Oakland, Berkeley, San Jose, Santa Cruz, Los Angeles, Santa Monica, Seattle, Portland, Denver, Austin, Chicago, New York, Boston).
- **Reset to Demo**: One-click restore button to re-seed original demonstration records at any time.

### 3. EV Charging Cost Calculator
Accurate estimation using the required formulas:
$$\text{Energy Required (kWh)} = \text{Battery Capacity} \times \frac{\text{Target \%} - \text{Current \%}}{100}$$
$$\text{Estimated Cost (\$)} = \text{Energy Required} \times \text{Price per kWh}$$

- **Interactive Inputs**: Battery capacity in kWh, current percentage slider/input, target percentage slider/input, electricity tariff per kWh.
- **Quick EV Presets**: Pre-fill battery sizes for popular EVs (Tesla Model 3 [60 kWh], Tesla Model Y [75 kWh], Hyundai Ioniq 5 [77.4 kWh], Ford Mustang Mach-E [88 kWh], Chevy Bolt [65 kWh]).
- **Station Integration**: One-click "⚡ Cost" button on any station card pre-fills that specific station's pricing directly into the calculator.
- **Visual Progress Bar**: Dual-color charging gauge visualizing current charge level and the added charge delta.
- **Input Validation**: Ensures target percentage strictly exceeds current percentage, battery capacity is positive, and values stay within valid percentage ranges.

### 4. Station Details & Turn-by-Turn Directions
- Detailed breakdown with operator info, port count, coordinates, and pricing.
- **Directions Button**: Opens turn-by-turn routing directly in Google Maps (`https://www.google.com/maps/dir/?api=1&destination=lat,lng`).
- **Static Data Disclaimer**: Clearly informs users that station status and availability are demonstration/static records and not live real-time feeds.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | Angular 22 + TypeScript | Modern standalone components, reactive forms, RxJS observables |
| **Maps** | Leaflet + OpenStreetMap | Interactive dark/voyager map tiles with custom SVG/HTML DivIcon markers |
| **Styling** | Modern Responsive CSS | Responsive dark theme (`#0a0e17` slate/obsidian palette), glassmorphism |
| **Persistence** | Browser Local Storage | `StorageService` managing `ev_stations`, `ev_favorites`, `ev_preferences` |
| **Backend** | Node.js + Express | Lightweight demonstration REST API with CORS support |

---

## 📁 Project Structure

```
ev-charge-finder/
├── backend/
│   ├── data/
│   │   └── stations.json         # 16 demonstration charging station records
│   ├── package.json              # Express and CORS dependencies
│   └── server.js                 # Express server with /api routes
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── calculator/      # Charging cost calculator component
│   │   │   │   ├── map/             # Leaflet map component with markers & popups
│   │   │   │   ├── station-details/ # Station details modal with Google Maps link
│   │   │   │   └── station-modal/   # Add / Edit station form modal
│   │   │   ├── models/
│   │   │   │   └── station.model.ts # TypeScript interfaces & demo station seeds
│   │   │   ├── services/
│   │   │   │   ├── api.service.ts   # Node.js backend integration & health check
│   │   │   │   └── storage.service.ts # LocalStorage service (CRUD, favorites, prefs)
│   │   │   ├── app.ts            # Root application component
│   │   │   ├── app.html          # Main split layout template
│   │   │   ├── app.css           # Responsive dark theme styling
│   │   │   └── app.config.ts     # Angular app configuration (HttpClient provider)
│   │   ├── index.html            # Application entry HTML
│   │   ├── main.ts               # Angular bootstrapper
│   │   └── styles.css            # Global CSS variables & Leaflet dark popup styles
│   ├── angular.json              # Angular CLI configuration
│   ├── package.json              # Frontend dependencies (Angular, Leaflet)
│   └── tsconfig.json             # TypeScript configuration
└── README.md
```

---

## 📦 Installation & Execution

The frontend and backend run **independently**. Open two separate terminal windows or command prompts.

### Prerequisites
- **Node.js** (v18 or higher recommended; tested on v24)
- **npm** (v9 or higher; tested on v11)

---

### Step 1: Start the Node.js Backend Server

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd ev-charge-finder/backend
   ```

2. Install backend dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the Express server:
   ```bash
   npm start
   ```

4. The backend will start on **http://localhost:3000**:
   ```
   ⚡ EV Charge Finder Backend listening on port 3000
      Health check: http://localhost:3000/api/health
      Stations API: http://localhost:3000/api/stations
      App Info:     http://localhost:3000/api/info
   ```

*(Optional: Set a custom port by setting the `PORT` environment variable, e.g. `PORT=3001 npm start`).*

---

### Step 2: Start the Angular Frontend Application

1. Open a **second terminal** and navigate to the `frontend` folder:
   ```bash
   cd ev-charge-finder/frontend
   ```

2. Install frontend dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Launch the Angular development server:
   ```bash
   npm start
   ```
   *(Or run `npx ng serve`)*

4. Open your browser and navigate to:
   ```
   http://localhost:4200
   ```

---

### Step 3: Run Automated Tests

Both the frontend and backend include automated test scripts:

1. **Test the Backend Endpoints**:
   ```bash
   cd ev-charge-finder/backend
   npm test
   ```
   Verifies `GET /api/health`, `GET /api/stations`, `GET /api/stations/:id`, and `GET /api/info` with 13 automated assertions.

2. **Test Frontend Logic & Storage Keys**:
   ```bash
   cd ev-charge-finder/frontend
   npm run test:logic
   ```
   Verifies Local Storage keys (`ev_stations`, `ev_favorites`, `ev_preferences`), sample dataset (16 stations), and calculation formulas.

---

### Step 4: Production Build (Optional)

To verify or generate the optimized production build of the Angular application:
```bash
cd ev-charge-finder/frontend
npm run build
```
Build artifacts are placed in `frontend/dist/frontend`.

---

## 🔌 Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns backend service status, uptime, and current ISO timestamp |
| `GET` | `/api/info` | Returns application metadata, architecture notes, and endpoint catalog |
| `GET` | `/api/stations` | Returns the demonstration dataset (16 charging stations) |
| `GET` | `/api/stations/:id` | Returns a single station by its ID (returns 404 if not found) |

### Backend Health Check Example:
```bash
curl http://localhost:3000/api/health
```
Response:
```json
{
  "status": "ok",
  "service": "ev-charge-finder-backend",
  "uptimeSeconds": 42,
  "timestamp": "2026-10-27T15:35:00.000Z"
}
```

---

## 💾 Local Storage Specifications

All user data modifications and preferences are stored exclusively on the client side using the Angular `StorageService`.

| Key | Type | Description |
|---|---|---|
| `ev_stations` | `Station[]` | Persisted station records (demo data initialized on first run; retains custom additions/edits across refreshes) |
| `ev_favorites` | `string[]` | Array of favorited station IDs |
| `ev_preferences` | `FilterPreferences` | Saved search terms, connector filters, power category, and sort ordering |

### Resilient Initialization Behavior:
1. When launched, `StorageService` checks `localStorage.getItem('ev_stations')`.
2. If the key exists and contains valid JSON, existing user records are loaded and never overwritten on page reload.
3. If no record exists or data is corrupted, the service gracefully initializes with the 16 bundled demonstration stations.
4. Users can manually restore the demonstration dataset at any time via the **"Reset Demo"** button.
