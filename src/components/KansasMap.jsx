function KansasMap({ selectedRegion, setSelectedRegion }) {
  const regions = [
    "Northwest",
    "Northeast",
    "Central",
    "Southwest",
    "Southeast",
  ];

  return (
    <div className="kansas-map-card">
      <div className="map-header">
        <h3>Kansas Regional Map</h3>
        <p>
          Use the visual map or the region buttons below to update the dashboard
          and review historical agricultural risk across Kansas.
        </p>
      </div>

      <div className="kansas-visual-map">
        <svg
          viewBox="0 0 700 420"
          className="kansas-svg"
          role="img"
          aria-label="Kansas regional map"
        >
          <polygon
            points="60,90 250,85 250,175 145,175 60,165"
            className={`map-shape ${selectedRegion === "Northwest" ? "active" : ""}`}
            onClick={() => setSelectedRegion("Northwest")}
          />
          <text x="120" y="135" className="map-label" onClick={() => setSelectedRegion("Northwest")}>
            Northwest
          </text>

          <polygon
            points="250,85 460,82 460,175 250,175"
            className={`map-shape ${selectedRegion === "Northeast" ? "active" : ""}`}
            onClick={() => setSelectedRegion("Northeast")}
          />
          <text x="315" y="135" className="map-label" onClick={() => setSelectedRegion("Northeast")}>
            Northeast
          </text>

          <polygon
            points="145,175 420,175 420,255 145,255"
            className={`map-shape ${selectedRegion === "Central" ? "active" : ""}`}
            onClick={() => setSelectedRegion("Central")}
          />
          <text x="255" y="220" className="map-label" onClick={() => setSelectedRegion("Central")}>
            Central
          </text>

          <polygon
            points="70,255 250,255 250,335 95,340 70,315"
            className={`map-shape ${selectedRegion === "Southwest" ? "active" : ""}`}
            onClick={() => setSelectedRegion("Southwest")}
          />
          <text x="120" y="302" className="map-label" onClick={() => setSelectedRegion("Southwest")}>
            Southwest
          </text>

          <polygon
            points="250,255 470,255 470,335 250,335"
            className={`map-shape ${selectedRegion === "Southeast" ? "active" : ""}`}
            onClick={() => setSelectedRegion("Southeast")}
          />
          <text x="320" y="302" className="map-label" onClick={() => setSelectedRegion("Southeast")}>
            Southeast
          </text>

          <polyline
            points="60,90 250,85 460,82 460,175 420,175 420,255 470,255 470,335 250,335 95,340 70,315 70,255 145,255 145,175 60,165 60,90"
            className="kansas-outline"
          />
        </svg>
      </div>

      <div className="kansas-map-grid">
        {regions.map((region) => (
          <button
            key={region}
            className={`map-region ${selectedRegion === region ? "active" : ""}`}
            onClick={() => setSelectedRegion(region)}
          >
            {region}
          </button>
        ))}
      </div>

      <div className="map-legend">
        <span className="legend-item">
          <span className="legend-color active-box"></span>
          Selected Region
        </span>
        <span className="legend-item">
          <span className="legend-color normal-box"></span>
          Available Region
        </span>
      </div>
    </div>
  );
}

export default KansasMap;