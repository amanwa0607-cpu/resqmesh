ResQMesh

Offline-First Emergency Evacuation Communication System

ResQMesh is a software-based emergency communication and evacuation routing prototype designed for situations where conventional internet or communication infrastructure is unavailable or unreliable.

The system enables emergency operators to prepare compact evacuation routes and share critical evacuation information with citizens using QR-based transfer, while the citizen-side Progressive Web App (PWA) stores the received information locally for offline access.

---

 Problem Statement

During disasters and emergency situations, conventional communication infrastructure such as mobile internet and centralized services can become unavailable or unreliable.

This creates several critical problems:

- Citizens may not receive updated evacuation routes.
- Emergency responders may struggle to distribute route information rapidly.
- Large data requirements can make emergency communication inefficient.
- Network outages can make cloud-dependent applications unusable.
- Critical location information may become inaccessible when connectivity is lost.

ResQMesh addresses these challenges through a lightweight, offline-first communication approach.

---
 Solution

ResQMesh provides an emergency evacuation platform where an operator can:

1. Select an emergency map.
2. Identify an active hazard.
3. Select a safe evacuation shelter.
4. Calculate an evacuation route.
5. Generate a compact route payload.
6. Share the route through a QR code.
7. Allow citizens to scan the QR code.
8. Store the received route locally.
9. Display the evacuation route even when the network becomes unavailable.

Core Flow

Operator Dashboard
        │
        ▼
   Select Emergency Map
        │
        ▼
   Select Hazard
        │
        ▼
   Select Shelter
        │
        ▼
 Calculate Evacuation Route
        │
        ▼
 Compact RM2 Payload
        │
        ▼
      QR Code
        │
        ▼
 Citizen Scans QR
        │
        ▼
 Route Decoded Locally
        │
        ▼
    IndexedDB Storage
        │
        ▼
 Offline Evacuation Map

---

✨ Key Features

1. Multi-Map Emergency System

ResQMesh supports multiple fictional emergency maps.

Each map can contain:

- Emergency locations
- Shelters
- Roads
- Blocked roads
- Caution roads
- Risk zones
- Network nodes
- Hospitals

Example:

MAP-01 → Central Emergency Zone
MAP-02 → Industrial Emergency Zone
MAP-03 → Residential Emergency Zone

The architecture allows additional maps to be added without rebuilding the entire application.

---

2. Evacuation Route Calculation

The operator can select:

Hazard → Shelter

The route engine calculates:

- Recommended route
- Distance
- Blocked roads avoided
- Route path
- Route nodes
- Route safety status

Example:

HZ-01 Chemical Fire
        ↓
Recommended Route
        ↓
S-01 Central Shelter

---

3. Compact RM2 Route Protocol

ResQMesh uses a lightweight route representation called RM2.

Example structure:

RM2|HZ-01|S-01|680|3|encoded-path

The payload contains only essential evacuation information.

This minimizes the amount of data that needs to be transferred.

RM2 contains:

Field| Description
RM2| Protocol version
Hazard ID| Emergency source
Shelter ID| Destination
Distance| Route distance
Blocked Roads| Number of blocked roads avoided
Encoded Path| Route coordinates

---

📱 QR Route Transfer

The operator can generate a QR code containing the evacuation route share URL.

The citizen can scan the QR code using a phone camera.

Operator
   │
   ▼
Generate QR
   │
   ▼
Phone Camera
   │
   ▼
ResQMesh Citizen Route
   │
   ▼
Decode Route
   │
   ▼
Display Offline Map

QR transfer is currently the primary working transfer mechanism of the prototype.

---

📴 Offline-First Architecture

ResQMesh is designed to continue functioning when connectivity becomes unreliable.

The application uses:

- PWA
- Service Worker
- IndexedDB
- Local route storage
- Local map snapshots
- Client-side route decoding

When the live server is unavailable, ResQMesh attempts to load the previously saved emergency map from local storage.

Internet Available
       │
       ▼
   Backend API
       │
       ▼
  Emergency Data
       │
       ▼
 IndexedDB Snapshot
       │
       ▼
 Offline Backup

If the network becomes unavailable:

Network Lost
     │
     ▼
IndexedDB
     │
     ▼
Saved Map
     │
     ▼
Evacuation Route

---

🌐 Progressive Web App

ResQMesh is implemented as a Progressive Web App.

The PWA provides:

- Installable web application
- Service Worker
- Offline asset caching
- Offline application loading
- Web App Manifest
- Local emergency data storage

The PWA configuration is implemented using:

vite-plugin-pwa

---

🗺️ Fictional Emergency Map

The project intentionally uses a fictional map environment instead of relying on a real-world mapping service.

This makes the prototype:

- Self-contained
- Lightweight
- Demonstration-friendly
- Independent of external map APIs
- Suitable for offline operation

The map is implemented using:

Leaflet
+
Leaflet CRS.Simple

The coordinate system represents a fictional emergency environment rather than real geographic coordinates.

---

🧭 Map Components

The emergency map can display:

Hazards

Examples:

HZ-01 → Chemical Fire
HZ-02 → Structural Damage

Shelters

Examples:

S-01 → Central Shelter
S-02 → North Shelter

Network Nodes

Examples:

N-01
N-02
N-03

Roads

Roads can have three states:

OPEN
CAUTION
BLOCKED

Risk Zones

HIGH
MEDIUM
SAFE

---

🏗️ System Architecture

                    RESQMESH
                       │
              ┌────────┴────────┐
              │                 │
        Operator UI        Citizen PWA
              │                 │
              ▼                 ▼
       Emergency Map       QR Scanner
              │                 │
              ▼                 ▼
       Route Engine        Route Decoder
              │                 │
              ▼                 ▼
        RM2 Payload       IndexedDB
              │                 │
              └────────┬────────┘
                       ▼
                Offline Map

---

🛠️ Technology Stack

Frontend

- React
- TypeScript
- Vite
- Leaflet
- React Leaflet
- IndexedDB
- Vite PWA
- HTML5 QR Code
- QRCode

Backend

- Node.js
- Express.js
- MongoDB
- MongoDB Atlas
- REST API

Development

- Git
- GitHub
- VS Code
- npm

---

📁 Project Structure

resqmesh/
│
├── frontend/
│   │
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── icons.svg
│   │   ├── pwa-192x192.svg
│   │   └── pwa-512x512.svg
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │   ├── communicationStatus.tsx
│   │   │   │
│   │   │   └── map/
│   │   │       ├── EmergencyMap.tsx
│   │   │       ├── MapLegend.tsx
│   │   │       ├── MapMarker.tsx
│   │   │       ├── RouteSharePanel.tsx
│   │   │       ├── RouteScannerPanel.tsx
│   │   │       ├── CitizenRoute.tsx
│   │   │       └── CitizenRouteMap.tsx
│   │   │
│   │   ├── data/
│   │   │   ├── mapData.ts
│   │   │   └── mapRegistry.ts
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── offlineStorage.ts
│   │   │   ├── routeEngine.ts
│   │   │   └── routeShare.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   │
│   ├── .env
│   └── package.json
│
├── shared/
│
├── .gitignore
└── README.md

---

🔌 Backend API

The backend exposes REST endpoints for emergency data.

Health

GET /api/health

Emergencies

GET /api/emergencies

Shelters

GET /api/shelters

Roads

GET /api/roads

The frontend normalizes backend data before using it inside the fictional emergency map.

---

⚙️ Installation

1. Clone the repository

git clone <your-repository-url>
cd resqmesh

---

2. Install frontend dependencies

cd frontend
npm install

---

3. Install backend dependencies

Open another terminal:

cd backend
npm install

---
 Environment Variables

Backend environment variables are stored in:

backend/.env

Example:

PORT=5000
MONGODB_URI=your_mongodb_connection_string

Do not commit real credentials to GitHub.

---

▶️ Running the Project

Start Backend

From:

resqmesh/backend

run:

npm run dev

Backend:

http://localhost:5000

---

Start Frontend

From:

resqmesh/frontend

run:

npm run dev

Frontend:

http://localhost:5175

For LAN testing:

npm run dev -- --host 0.0.0.0

---

Production Build

From the frontend directory:

npm run build

The production files are generated inside:

frontend/dist/

To preview the production build:

npm run preview -- --host 0.0.0.0

---

Offline Testing

To test the offline functionality:

1. Start the frontend.
2. Open ResQMesh.
3. Allow the application to load the emergency map.
4. Let the application save the map snapshot.
5. Open the production PWA.
6. Disconnect the network.
7. Refresh the application.

ResQMesh should load the cached application and previously stored emergency map.

---

QR Testing

Operator

Select Map
    ↓
Select Hazard
    ↓
Select Shelter
    ↓
Calculate Route
    ↓
Share Route
    ↓
Generate QR

Citizen

Scan QR
   ↓
Open ResQMesh
   ↓
Decode Route
   ↓
Display Emergency Map
   ↓
Highlight Evacuation Route

---
Data Handling

The route payload is processed locally by the browser.

The citizen route does not require a continuous connection to the backend after the route has been received.

The route can be stored in:

IndexedDB

and accessed later while offline.

---

📡 Communication Strategy

ResQMesh prioritizes lightweight communication mechanisms.

Primary

QR Code

Used for reliable transfer of compact evacuation information.

Local Storage

IndexedDB

Used for persistent offline emergency data.

PWA

Service Worker

Used to cache the application and support offline loading.

Bluetooth

A browser BLE adapter can be considered as an extension point.

However, standard browser Web Bluetooth does not provide a reliable general-purpose phone-to-phone communication channel, so the current prototype does not falsely claim direct phone-to-phone Bluetooth transfer.

---

Cost Consideration

ResQMesh is primarily software-based.

No dedicated emergency hardware is required for the prototype.

The architecture minimizes dependency on:

- Dedicated servers at the citizen end
- Large data transfers
- External map APIs
- Continuous internet connectivity
- Specialized communication hardware

---
Expected Outcome

The prototype demonstrates that essential evacuation information can be exchanged using a compact payload and accessed offline after transfer.

The system demonstrates:

- Emergency map visualization
- Hazard identification
- Shelter selection
- Route calculation
- Compact route encoding
- QR route transfer
- Offline map storage
- Offline route access
- PWA-based resilience
- Multi-map architecture

---
Future Enhancements

Potential future improvements include:

- Direct device-to-device BLE adapters where platform support permits
- Mesh networking integrations
- WebRTC-based local communication
- Digital signatures for route authenticity
- Route expiration and versioning
- Priority-based emergency messages
- Multi-operator synchronization
- GPS integration when connectivity/location services are available
- Real-world GIS data integration
- Advanced dynamic route optimization
- Emergency responder authentication
- Disaster-specific map packages
- Multi-language citizen interface

---

⚠️ Prototype Limitations

ResQMesh is currently a hackathon/prototype implementation.

Important limitations include:

- The map environment is fictional.
- QR is the primary tested route-transfer mechanism.
- Browser Bluetooth capabilities are platform-dependent.
- The system does not guarantee communication when the device itself has no supported transfer mechanism.
- Backend availability is not required for already cached emergency information, but initial live synchronization requires connectivity.
- Production deployment would require stronger security, authentication, validation and operational testing.

---

🧪 Project Status

Frontend                 ✅
React + TypeScript       ✅
Vite                     ✅
Fictional Emergency Map  ✅
Multi-Map Architecture   ✅
Route Calculation        ✅
RM2 Compact Payload      ✅
QR Generation            ✅
QR Scanning              ✅
Citizen Route View       ✅
IndexedDB Offline Store  ✅
PWA                      ✅
Backend API              ✅
MongoDB Atlas            ✅
Offline Map Loading      ✅
Bluetooth Adapter        🔄 Future Extension

---

👥 Project

Project Name: ResQMesh

Category: Emergency Communication & Evacuation

Type: Software Prototype

Architecture: Offline-First Web/PWA

Primary Transfer: QR Code

Map: Fictional Emergency Environment
