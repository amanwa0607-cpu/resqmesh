import "./App.css";

import EmergencyMap from "./components/map/EmergencyMap";
import CitizenRoute from "./components/map/CitizenRoute";

function App() {
  const isCitizenRoute =
  window.location.hash.startsWith(
    "#/route"
  );

if (isCitizenRoute) {
  return <CitizenRoute />;
}
  return (
    <div className="app">

      {/* =================================
          SIDEBAR
      ================================== */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">
            R
          </div>

          <div>
            <h1>
              ResQMesh
            </h1>

            <span>
              Emergency Network
            </span>
          </div>

        </div>

        <nav className="navigation">

          <button className="nav-item active">
            <span>◈</span>
            Dashboard
          </button>

          <button className="nav-item">
            <span>⌁</span>
            Live Map
          </button>

          <button className="nav-item">
            <span>⚠</span>
            Emergencies
          </button>

          <button className="nav-item">
            <span>↗</span>
            Evacuation Routes
          </button>

          <button className="nav-item">
            <span>⌁</span>
            Network
          </button>

          <button className="nav-item">
            <span>▣</span>
            Shelters
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="system-status">

            <span className="status-dot" />

            <div>
              <strong>
                System Online
              </strong>

              <small>
                All services operational
              </small>
            </div>

          </div>

        </div>

      </aside>


      {/* =================================
          MAIN CONTENT
      ================================== */}

      <main className="main-content">

        {/* TOPBAR */}

        <header className="topbar">

          <div>

            <p className="eyebrow">
              EMERGENCY CONTROL CENTER
            </p>

            <h2>
              Good afternoon, Operator
            </h2>

          </div>


          <div className="topbar-actions">

            <div className="connection-pill">

              <span className="status-dot" />

              Online

            </div>


            <button className="icon-button">
              ☼
            </button>


            <div className="profile">

              <div className="avatar">
                OP
              </div>

              <div>

                <strong>
                  Operator
                </strong>

                <small>
                  Control Center
                </small>

              </div>

            </div>

          </div>

        </header>


        {/* =================================
            KPI CARDS
        ================================== */}

        <section className="kpi-grid">

          <div className="kpi-card">

            <div className="kpi-header">

              <span>
                Active Emergencies
              </span>

              <div className="kpi-icon danger">
                !
              </div>

            </div>

            <h3>
              12
            </h3>

            <p className="trend danger-text">
              ↑ 3 since last hour
            </p>

          </div>


          <div className="kpi-card">

            <div className="kpi-header">

              <span>
                Connected Nodes
              </span>

              <div className="kpi-icon success">
                ⌁
              </div>

            </div>

            <h3>
              74
            </h3>

            <p className="trend success-text">
              92% network availability
            </p>

          </div>


          <div className="kpi-card">

            <div className="kpi-header">

              <span>
                Safe Shelters
              </span>

              <div className="kpi-icon info">
                ⌂
              </div>

            </div>

            <h3>
              18
            </h3>

            <p className="trend">
              4 currently receiving
            </p>

          </div>


          <div className="kpi-card">

            <div className="kpi-header">

              <span>
                Messages Relayed
              </span>

              <div className="kpi-icon purple">
                ↗
              </div>

            </div>

            <h3>
              1,284
            </h3>

            <p className="trend success-text">
              98.4% delivered
            </p>

          </div>

        </section>


        {/* =================================
            MAIN DASHBOARD
        ================================== */}

        <section className="dashboard-grid">


          {/* ================================
              MAP CARD
          ================================= */}

          <div className="map-card">

            <div className="card-header">

              <div>

                <p className="section-label">
                  SITUATIONAL AWARENESS
                </p>

                <h3>
                  Emergency Map
                </h3>

              </div>


              <button className="outline-button">
                Full Screen ↗
              </button>

            </div>


            {/* ACTUAL LEAFLET MAP */}

            <EmergencyMap />


            <div className="map-legend">

              <div>
                <span
                  className="
                    legend-dot
                    danger-bg
                  "
                />
                Emergency
              </div>

              <div>
                <span
                  className="
                    legend-dot
                    warning-bg
                  "
                />
                Hazard
              </div>

              <div>
                <span
                  className="
                    legend-dot
                    success-bg
                  "
                />
                Safe Shelter
              </div>

              <div>
                <span
                  className="
                    legend-dot
                    node-bg
                  "
                />
                Network Node
              </div>

            </div>

          </div>


          {/* ================================
              EMERGENCY QUEUE
          ================================= */}

          <div className="emergency-card">

            <div className="card-header">

              <div>

                <p className="section-label">
                  PRIORITY ALERTS
                </p>

                <h3>
                  Emergency Queue
                </h3>

              </div>

              <span className="alert-count">
                4 New
              </span>

            </div>


            <div className="alert-list">


              <div className="alert-item critical">

                <div className="alert-icon">
                  !
                </div>

                <div className="alert-content">

                  <strong>
                    Critical SOS
                  </strong>

                  <span>
                    Zone A · Node N-023
                  </span>

                  <small>
                    2 minutes ago
                  </small>

                </div>

                <span className="priority">
                  CRITICAL
                </span>

              </div>


              <div className="alert-item warning">

                <div className="alert-icon">
                  !
                </div>

                <div className="alert-content">

                  <strong>
                    Road Blocked
                  </strong>

                  <span>
                    Route R-12 · Zone B
                  </span>

                  <small>
                    5 minutes ago
                  </small>

                </div>

                <span className="priority">
                  HIGH
                </span>

              </div>


              <div className="alert-item normal">

                <div className="alert-icon">
                  ↗
                </div>

                <div className="alert-content">

                  <strong>
                    Route Updated
                  </strong>

                  <span>
                    Shelter S-04 available
                  </span>

                  <small>
                    8 minutes ago
                  </small>

                </div>

                <span className="priority">
                  INFO
                </span>

              </div>

            </div>


            <button className="view-all-button">
              View All Emergencies →
            </button>

          </div>

        </section>


        {/* =================================
            BOTTOM CARDS
        ================================== */}

        <section className="bottom-grid">


          {/* NETWORK */}

          <div className="network-card">

            <div className="card-header">

              <div>

                <p className="section-label">
                  COMMUNICATION
                </p>

                <h3>
                  Network Status
                </h3>

              </div>

              <span className="live-badge">
                ● LIVE
              </span>

            </div>


            <div className="network-stats">

              <div>
                <strong>
                  74
                </strong>

                <span>
                  Online
                </span>
              </div>

              <div>
                <strong>
                  12
                </strong>

                <span>
                  Limited
                </span>
              </div>

              <div>
                <strong>
                  8
                </strong>

                <span>
                  Offline
                </span>
              </div>

            </div>


            <div className="network-progress">

              <div className="progress-fill" />

            </div>


            <p className="network-footer">

              Network availability{" "}

              <strong>
                92%
              </strong>

            </p>

          </div>


          {/* ACTIVE ROUTES */}

          <div className="route-card">

            <div className="card-header">

              <div>

                <p className="section-label">
                  EVACUATION
                </p>

                <h3>
                  Active Routes
                </h3>

              </div>

              <button className="text-button">
                Manage →
              </button>

            </div>


            <div className="route-row">

              <div className="route-number">
                R01
              </div>

              <div className="route-info">

                <strong>
                  Zone A → Shelter S01
                </strong>

                <span>
                  Safest route · 1.8 km
                </span>

              </div>

              <span className="route-status safe">
                SAFE
              </span>

            </div>


            <div className="route-row">

              <div className="route-number">
                R04
              </div>

              <div className="route-info">

                <strong>
                  Zone B → Shelter S03
                </strong>

                <span>
                  Alternative route · 2.4 km
                </span>

              </div>

              <span className="route-status caution">
                CAUTION
              </span>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;