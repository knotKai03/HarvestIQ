import { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./Dashboard.css";

// ── API connection ─────────────────────────────────────────────────────────────
const API = "https://harvestiq-production.up.railway.app";

async function apiFetch(path) {
  const res = await fetch(API + path);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// ── Region colors and list ─────────────────────────────────────────────────────
const REGION_COLORS = {
  Northwest: "#d6b33b",
  Northeast: "#8fd0df",
  Central:   "#7dbb62",
  Southwest: "#d9aa55",
  Southeast: "#d986b6",
};

const REGION_LIST = ["Northwest", "Northeast", "Central", "Southwest", "Southeast"];
const YEARS = [2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024];

// ── Info card component ────────────────────────────────────────────────────────
function InfoCard({ title, value, subtitle, accent }) {
  return (
    <div className={`info-card ${accent}`}>
      <div className="info-card-title">{title}</div>
      <div className="info-card-value">
        {value ?? "—"}
        <span>/99</span>
      </div>
      <div className="info-card-subtitle">{subtitle}</div>
    </div>
  );
}

// ── Custom chart tooltip ───────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-year">Year: {label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey}>
          <span>{entry.name}:</span> {entry.value}/99
        </p>
      ))}
    </div>
  );
}

// ── Kansas SVG map ─────────────────────────────────────────────────────────────
function KansasMap({ selectedRegion, onRegionSelect }) {
  return (
    <svg className="regional-svg" viewBox="0 0 900 430" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="softNoiseKansas">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer><feFuncA type="table" tableValues="0 0.08" /></feComponentTransfer>
        </filter>
      </defs>
      <path d="M70 70 L700 70 L735 92 L775 92 L792 110 L782 128 L762 145 L775 162 L793 173 L793 355 L70 355 Z" className="state-outline" />
      <g onClick={() => onRegionSelect("Northwest")} className="map-region-group">
        <path d="M85 85 L285 85 L285 175 L85 175 Z" fill={REGION_COLORS.Northwest} className={`region-fill ${selectedRegion === "Northwest" ? "active" : ""}`} />
        <path d="M85 85 L285 85 L285 175 L85 175 Z" className="region-border" />
        <text x="185" y="136" className="region-label">Northwest</text>
      </g>
      <g onClick={() => onRegionSelect("Central")} className="map-region-group">
        <path d="M285 85 L465 85 L465 118 L486 118 L486 236 L305 236 L305 175 L285 175 Z" fill={REGION_COLORS.Central} className={`region-fill ${selectedRegion === "Central" ? "active" : ""}`} />
        <path d="M285 85 L465 85 L465 118 L486 118 L486 236 L305 236 L305 175 L285 175 Z" className="region-border" />
        <text x="385" y="148" className="region-label">Central</text>
      </g>
      <g onClick={() => onRegionSelect("Northeast")} className="map-region-group">
        <path d="M465 85 L700 85 L725 100 L756 100 L772 114 L760 132 L741 146 L753 163 L793 163 L793 225 L486 225 L486 118 L465 118 Z" fill={REGION_COLORS.Northeast} className={`region-fill ${selectedRegion === "Northeast" ? "active" : ""}`} />
        <path d="M465 85 L700 85 L725 100 L756 100 L772 114 L760 132 L741 146 L753 163 L793 163 L793 225 L486 225 L486 118 L465 118 Z" className="region-border" />
        <text x="620" y="135" className="region-label">Northeast</text>
      </g>
      <g onClick={() => onRegionSelect("Southwest")} className="map-region-group">
        <path d="M85 175 L305 175 L305 236 L365 236 L365 355 L85 355 Z" fill={REGION_COLORS.Southwest} className={`region-fill ${selectedRegion === "Southwest" ? "active" : ""}`} />
        <path d="M85 175 L305 175 L305 236 L365 236 L365 355 L85 355 Z" className="region-border" />
        <text x="200" y="270" className="region-label">Southwest</text>
      </g>
      <g onClick={() => onRegionSelect("Southeast")} className="map-region-group">
        <path d="M365 236 L525 236 L525 290 L793 290 L793 355 L365 355 Z" fill={REGION_COLORS.Southeast} className={`region-fill ${selectedRegion === "Southeast" ? "active" : ""}`} />
        <path d="M365 236 L525 236 L525 290 L793 290 L793 355 L365 355 Z" className="region-border" />
        <text x="615" y="300" className="region-label">Southeast</text>
      </g>
      <rect x="85" y="85" width="708" height="270" filter="url(#softNoiseKansas)" className="texture-overlay" />
      <path d="M70 70 L700 70 L735 92 L775 92 L792 110 L782 128 L762 145 L775 162 L793 173 L793 355 L70 355 Z" className="state-outline top-layer" />
    </svg>
  );
}

// ── Iowa SVG map ───────────────────────────────────────────────────────────────
function IowaMap({ selectedRegion, onRegionSelect }) {
  return (
    <svg className="regional-svg" viewBox="0 0 900 430" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="softNoiseIowa">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer><feFuncA type="table" tableValues="0 0.08" /></feComponentTransfer>
        </filter>
      </defs>
      <path d="M125 75 L250 75 L320 70 L535 70 L650 70 L725 82 L760 82 L780 102 L772 118 L758 130 L768 145 L790 162 L805 188 L805 242 L785 257 L785 305 L770 318 L770 355 L754 368 L730 368 L718 386 L694 394 L675 383 L675 355 L292 355 L140 355 L130 318 L123 285 L115 205 L110 155 L116 118 L125 95 Z" className="state-outline" />
      <g onClick={() => onRegionSelect("Northwest")} className="map-region-group">
        <path d="M135 85 L310 85 L310 210 L150 210 L118 210 L114 156 L120 120 L128 96 Z" fill={REGION_COLORS.Northwest} className={`region-fill ${selectedRegion === "Northwest" ? "active" : ""}`} />
        <path d="M135 85 L310 85 L310 210 L150 210 L118 210 L114 156 L120 120 L128 96 Z" className="region-border" />
        <text x="220" y="150" className="region-label">Northwest</text>
      </g>
      <g onClick={() => onRegionSelect("Central")} className="map-region-group">
        <path d="M310 85 L520 85 L520 120 L542 120 L542 238 L470 238 L470 200 L310 200 Z" fill={REGION_COLORS.Central} className={`region-fill ${selectedRegion === "Central" ? "active" : ""}`} />
        <path d="M310 85 L520 85 L520 120 L542 120 L542 238 L470 238 L470 200 L310 200 Z" className="region-border" />
        <text x="420" y="150" className="region-label">Central</text>
      </g>
      <g onClick={() => onRegionSelect("Northeast")} className="map-region-group">
        <path d="M520 85 L650 85 L725 95 L760 95 L778 110 L768 126 L755 138 L764 151 L785 168 L792 184 L792 252 L758 252 L758 275 L542 275 L542 120 L520 120 Z" fill={REGION_COLORS.Northeast} className={`region-fill ${selectedRegion === "Northeast" ? "active" : ""}`} />
        <path d="M520 85 L650 85 L725 95 L760 95 L778 110 L768 126 L755 138 L764 151 L785 168 L792 184 L792 252 L758 252 L758 275 L542 275 L542 120 L520 120 Z" className="region-border" />
        <text x="650" y="185" className="region-label">Northeast</text>
      </g>
      <g onClick={() => onRegionSelect("Southwest")} className="map-region-group">
        <path d="M150 210 L310 210 L310 255 L360 255 L360 355 L140 355 L132 320 L123 284 L118 210 Z" fill={REGION_COLORS.Southwest} className={`region-fill ${selectedRegion === "Southwest" ? "active" : ""}`} />
        <path d="M150 210 L310 210 L310 255 L360 255 L360 355 L140 355 L132 320 L123 284 L118 210 Z" className="region-border" />
        <text x="235" y="285" className="region-label">Southwest</text>
      </g>
      <g onClick={() => onRegionSelect("Southeast")} className="map-region-group">
        <path d="M360 255 L542 255 L542 275 L758 275 L758 355 L742 370 L720 370 L709 386 L691 377 L691 355 L360 355 Z" fill={REGION_COLORS.Southeast} className={`region-fill ${selectedRegion === "Southeast" ? "active" : ""}`} />
        <path d="M360 255 L542 255 L542 275 L758 275 L758 355 L742 370 L720 370 L709 386 L691 377 L691 355 L360 355 Z" className="region-border" />
        <text x="585" y="305" className="region-label">Southeast</text>
      </g>
      <rect x="118" y="85" width="674" height="302" filter="url(#softNoiseIowa)" className="texture-overlay" />
      <path d="M125 75 L250 75 L320 70 L535 70 L650 70 L725 82 L760 82 L780 102 L772 118 L758 130 L768 145 L790 162 L805 188 L805 242 L785 257 L785 305 L770 318 L770 355 L754 368 L730 368 L718 386 L694 394 L675 383 L675 355 L292 355 L140 355 L130 318 L123 285 L115 205 L110 155 L116 118 L125 95 Z" className="state-outline top-layer" />
    </svg>
  );
}

// ── Regional map card ──────────────────────────────────────────────────────────
function RegionalMapCard({ selectedState, selectedRegion, onRegionSelect, selectedYear }) {
  return (
    <div className="regional-map-card">
      <div className="map-card-header">
        <div>
          <h2>{selectedState} Regional Map</h2>
          <p>
            Use the map or the region buttons below to update the dashboard and
            review agricultural risk for the selected state.
          </p>
        </div>
      </div>
      <div className="map-and-summary">
        <div className="map-frame">
          {selectedState === "Kansas" ? (
            <KansasMap selectedRegion={selectedRegion} onRegionSelect={onRegionSelect} />
          ) : (
            <IowaMap selectedRegion={selectedRegion} onRegionSelect={onRegionSelect} />
          )}
        </div>
        <div className="embedded-map-summary">
          <h3>{selectedState} Regional Map</h3>
          <p><strong>State:</strong> {selectedState}</p>
          <p><strong>Region:</strong> {selectedRegion}</p>
          <p><strong>Year:</strong> {selectedYear}</p>
          <p className="embedded-note">
            This dashboard shows historical risk scores and components
            for the selected region from 2014 to 2024.
          </p>
        </div>
      </div>
      <div className="region-button-row">
        {REGION_LIST.map((region) => (
          <button
            key={region}
            className={`region-button ${selectedRegion === region ? "active" : ""}`}
            style={{ backgroundColor: REGION_COLORS[region] }}
            onClick={() => onRegionSelect(region)}
          >
            {region} Region
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [selectedState,  setSelectedState]  = useState("Kansas");
  const [selectedRegion, setSelectedRegion] = useState("Central");
  const [selectedYear,   setSelectedYear]   = useState(2024);

  // ── Live API state ───────────────────────────────────────────────────────────
  const [history,    setHistory]    = useState([]);
  const [aiSummary,  setAiSummary]  = useState("");
  const [aiLoading,  setAiLoading]  = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  // ── Fetch data when region or state changes ──────────────────────────────────
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      setAiSummary("");
      setHistory([]);

      try {
        let rows = [];

        if (selectedState === "Kansas") {
          const res = await apiFetch(`/risk/${selectedRegion}/history`);
          rows = res.history || [];
        } else {
          // Iowa — uses new endpoint
          const res = await apiFetch(`/iowa/${selectedRegion}/history`);
          rows = res.history || [];
        }

        // Ensure sorted ascending by year
        rows.sort((a, b) => a.year - b.year);
        setHistory(rows);

        // Fire AI summary using most recent year
        if (rows.length > 0) {
          loadAiSummary(rows, selectedState, selectedRegion);
        }
      } catch (e) {
        setError("Could not load data. Is the API running?");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedRegion, selectedState]);

  async function loadAiSummary(hist, state, region) {
  setAiLoading(true);
  try {
    const latest = hist[hist.length - 1];
    const oldest = hist[0];

    const res = await fetch(`${API}/ai/explain`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        explanation_type: "region",
        region_data: {
          region_standard:      region,
          predicted_risk_score: latest?.risk_score,
          risk_level:           latest?.risk_level,
          risk_info:            latest?.risk_description || "",
          region_rank:          null,
          rank_label:           null,
          state:                state,
        },
        history: hist,
      }),
    });
    const json = await res.json();
    setAiSummary(json.explanation || "");
  } catch (e) {
    setAiSummary("AI summary unavailable.");
  } finally {
    setAiLoading(false);
  }
}

  // ── Get selected year's data ────────────────────────────────────────────────
  const selectedYearData = useMemo(() => {
    return history.find((item) => item.year === selectedYear) || null;
  }, [history, selectedYear]);

  // ── Chart data ──────────────────────────────────────────────────────────────
  const chartData = history.map((item) => {
    if (selectedState === "Iowa") {
      return {
        year:    item.year,
        total:   item.risk_score,
        weather: item.weather_score,
        market:  item.market_score,
        land:    item.land_score,
      };
    }
    // Kansas — total from Snowflake, factors still mock until ML tables ready
    return {
      year:    item.year,
      total:   item.risk_score,
    };
  });

  // ── Score card values for selected year ─────────────────────────────────────
  const displayTotal   = selectedYearData?.risk_score   ?? null;
  const displayWeather = selectedYearData?.weather_score ?? null;
  const displayMarket  = selectedYearData?.market_score  ?? null;
  const displayLand    = selectedYearData?.land_score    ?? null;

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero">
        <h1>Historical Risk Dashboard</h1>
        <p>
          Review regional agricultural risk trends across Kansas and Iowa
          using historical data from 2014 to 2024.
        </p>
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-left-panel">
          <RegionalMapCard
            selectedState={selectedState}
            selectedRegion={selectedRegion}
            onRegionSelect={setSelectedRegion}
            selectedYear={selectedYear}
          />
        </div>

        <div className="dashboard-right-panel">
          <div className="control-panel">
            <div className="dashboard-control-group">
              <label htmlFor="state-select">State</label>
              <select
                id="state-select"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedRegion("Central");
                }}
              >
                <option value="Kansas">Kansas</option>
                <option value="Iowa">Iowa</option>
              </select>
            </div>

            <div className="dashboard-control-group">
              <label htmlFor="year-select">Data Year</label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {loading && (
            <div className="dashboard-summary-card">
              <p>Loading {selectedRegion} {selectedState} data...</p>
            </div>
          )}

          {error && (
            <div className="dashboard-summary-card">
              <p style={{ color: "red" }}>{error}</p>
            </div>
          )}

          {!loading && (
            <>
              <div className="dashboard-summary-card">
                <h3>Selected Region Summary</h3>
                <p><strong>State:</strong> {selectedState}</p>
                <p><strong>Region:</strong> {selectedRegion}</p>
                <p><strong>Year:</strong> {selectedYear}</p>
                {selectedYearData ? (
                  <>
                    <p><strong>Risk Score:</strong> {selectedYearData.risk_score ?? "—"}</p>
                    <p><strong>Risk Level:</strong> {selectedYearData.risk_level ?? "—"}</p>
                  </>
                ) : (
                  <p style={{ color: "#888", fontStyle: "italic" }}>
                    No data available for {selectedYear}.
                  </p>
                )}
              </div>

              <div className="cards-grid">
                <InfoCard
                  title="Total Risk"
                  value={displayTotal}
                  subtitle={`Composite risk for ${selectedRegion} in ${selectedYear}.`}
                  accent="accent-total"
                />
                <InfoCard
                  title="Weather Risk"
                  value={displayWeather}
                  subtitle="Climate and environmental pressure."
                  accent="accent-weather"
                />
                <InfoCard
                  title="Market Risk"
                  value={displayMarket}
                  subtitle={selectedState === "Iowa" ? "Statewide market pressure." : "Commodity and pricing pressure."}
                  accent="accent-market"
                />
                <InfoCard
                  title="Land Risk"
                  value={displayLand}
                  subtitle="Land value pressure."
                  accent="accent-land"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* AI Summary — full width centered */}
      {!loading && (
        <div className="dashboard-summary-card ai-panel" style={{ marginTop: "24px" }}>
          <h3 style={{ textAlign: "center", marginBottom: "12px" }}>⚡ AI Analysis</h3>
          {aiLoading
            ? <p style={{ textAlign: "center" }}>Analyzing with Claude...</p>
            : <p style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
                {aiSummary || "AI summary will appear here after data loads."}
              </p>
          }
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="chart-section">
          <div className="chart-card">
            <div className="chart-card-header">
              <h3>Historical Risk Trend</h3>
              <p>2014–2024 risk score history for {selectedRegion}, {selectedState}</p>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d9e2d9" />
                  <XAxis dataKey="year" stroke="#374151" />
                  <YAxis domain={[0, 99]} stroke="#374151" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="total"   stroke="#1f2937" strokeWidth={3} name="Total Risk"   dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  {selectedState === "Iowa" && <>
                    <Line type="monotone" dataKey="weather" stroke="#2f6f52" strokeWidth={2} name="Weather Risk" dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="market"  stroke="#c07b2c" strokeWidth={2} name="Market Risk"  dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="land"    stroke="#7f63b8" strokeWidth={2} name="Land Risk"    dot={{ r: 3 }} />
                  </>}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}