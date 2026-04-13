import { useMemo, useState } from "react";
import KansasMap from "../components/KansasMap";
import RiskTrendChart from "../components/RiskTrendChart";

const yearlyRiskData = {
  Northwest: [
    { year: 2014, market: 49, weather: 58, land: 44 },
    { year: 2015, market: 51, weather: 56, land: 45 },
    { year: 2016, market: 48, weather: 60, land: 46 },
    { year: 2017, market: 53, weather: 63, land: 47 },
    { year: 2018, market: 55, weather: 61, land: 48 },
    { year: 2019, market: 57, weather: 64, land: 49 },
    { year: 2020, market: 60, weather: 67, land: 50 },
    { year: 2021, market: 58, weather: 65, land: 51 },
    { year: 2022, market: 61, weather: 69, land: 53 },
    { year: 2023, market: 63, weather: 71, land: 54 },
    { year: 2024, market: 64, weather: 72, land: 55 },
  ],
  Northeast: [
    { year: 2014, market: 44, weather: 47, land: 52 },
    { year: 2015, market: 45, weather: 48, land: 53 },
    { year: 2016, market: 46, weather: 49, land: 54 },
    { year: 2017, market: 48, weather: 51, land: 55 },
    { year: 2018, market: 50, weather: 52, land: 56 },
    { year: 2019, market: 51, weather: 53, land: 57 },
    { year: 2020, market: 54, weather: 55, land: 58 },
    { year: 2021, market: 52, weather: 56, land: 59 },
    { year: 2022, market: 55, weather: 58, land: 60 },
    { year: 2023, market: 56, weather: 59, land: 61 },
    { year: 2024, market: 57, weather: 60, land: 62 },
  ],
  Central: [
    { year: 2014, market: 46, weather: 50, land: 48 },
    { year: 2015, market: 47, weather: 52, land: 49 },
    { year: 2016, market: 49, weather: 53, land: 50 },
    { year: 2017, market: 50, weather: 54, land: 51 },
    { year: 2018, market: 52, weather: 56, land: 52 },
    { year: 2019, market: 53, weather: 57, land: 53 },
    { year: 2020, market: 55, weather: 59, land: 54 },
    { year: 2021, market: 54, weather: 58, land: 55 },
    { year: 2022, market: 56, weather: 60, land: 56 },
    { year: 2023, market: 58, weather: 62, land: 57 },
    { year: 2024, market: 59, weather: 63, land: 58 },
  ],
  Southwest: [
    { year: 2014, market: 52, weather: 62, land: 41 },
    { year: 2015, market: 53, weather: 63, land: 42 },
    { year: 2016, market: 55, weather: 64, land: 43 },
    { year: 2017, market: 57, weather: 66, land: 44 },
    { year: 2018, market: 58, weather: 67, land: 45 },
    { year: 2019, market: 60, weather: 68, land: 46 },
    { year: 2020, market: 61, weather: 70, land: 47 },
    { year: 2021, market: 60, weather: 69, land: 48 },
    { year: 2022, market: 63, weather: 72, land: 49 },
    { year: 2023, market: 64, weather: 73, land: 50 },
    { year: 2024, market: 66, weather: 75, land: 51 },
  ],
  Southeast: [
    { year: 2014, market: 43, weather: 46, land: 50 },
    { year: 2015, market: 44, weather: 47, land: 51 },
    { year: 2016, market: 46, weather: 48, land: 52 },
    { year: 2017, market: 47, weather: 50, land: 53 },
    { year: 2018, market: 49, weather: 51, land: 54 },
    { year: 2019, market: 50, weather: 52, land: 55 },
    { year: 2020, market: 52, weather: 54, land: 56 },
    { year: 2021, market: 51, weather: 55, land: 57 },
    { year: 2022, market: 53, weather: 57, land: 58 },
    { year: 2023, market: 54, weather: 58, land: 59 },
    { year: 2024, market: 55, weather: 59, land: 60 },
  ],
};

const regionDescriptions = {
  Northwest:
    "Northwest Kansas shows elevated weather-related risk because of stronger drought exposure and climate variability across large agricultural areas.",
  Northeast:
    "Northeast Kansas benefits from more stable weather conditions, though land value pressure remains more noticeable in the region.",
  Central:
    "Central Kansas maintains a relatively balanced agricultural risk profile and serves as a useful benchmark for statewide comparison.",
  Southwest:
    "Southwest Kansas carries one of the highest total risk levels due to weather volatility, irrigation dependence, and commodity sensitivity.",
  Southeast:
    "Southeast Kansas trends lower in total agricultural risk, though market shifts and land-related changes still affect long-term planning.",
};

function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState("Central");

  const latestData =
    yearlyRiskData[selectedRegion][yearlyRiskData[selectedRegion].length - 1];

  const totalRisk = useMemo(() => {
    return Math.round(
      latestData.market * 0.4 + latestData.weather * 0.35 + latestData.land * 0.25
    );
  }, [latestData]);

  const chartData = yearlyRiskData[selectedRegion].map((item) => ({
    ...item,
    total: Math.round(item.market * 0.4 + item.weather * 0.35 + item.land * 0.25),
  }));

  const highestContributor =
    latestData.weather >= latestData.market && latestData.weather >= latestData.land
      ? "Weather Risk"
      : latestData.market >= latestData.land
      ? "Market Risk"
      : "Land Risk";

  return (
    <div className="page-container">
      <section className="content-section">
        <div className="section-heading left">
          <h3>Historical Dashboard</h3>
          <p>
            This dashboard presents historical agricultural risk information for
            Kansas from 2014 through 2024. These values represent the platform’s
            historical data view and are separate from the predictive outlook shown
            on the Comparative Analysis page.
          </p>
        </div>
      </section>

      <section className="dashboard-grid">
        <KansasMap
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
        />

        <div className="dashboard-side-card">
          <h3>Dashboard Summary</h3>
          <p>
            This section summarizes the latest historical agricultural risk result
            for the selected Kansas region and highlights the most influential
            contributor to the overall score.
          </p>

          <div className="summary-list">
            <div className="summary-item">
              <strong>Selected Region:</strong> {selectedRegion}
            </div>
            <div className="summary-item">
              <strong>Total Historical Risk Score:</strong> {totalRisk}
            </div>
            <div className="summary-item">
              <strong>Highest Contributor:</strong> {highestContributor}
            </div>
            <div className="summary-item">
              <strong>Historical Data Window:</strong> 2014–2024
            </div>
            <div className="summary-item">
              <strong>Score Range:</strong> 0–99
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-main-card">
        <div className="dashboard-card-header">
          <div>
            <p className="mini-label">Selected Region</p>
            <h3>{selectedRegion}</h3>
          </div>

          <div className="score-badge">
            <span>{totalRisk}</span>
            <p>Historical Risk</p>
          </div>
        </div>

        <p className="dashboard-description">{regionDescriptions[selectedRegion]}</p>

        <div className="stat-grid">
          <div className="stat-card">
            <p>Market Risk</p>
            <h4>{latestData.market}</h4>
          </div>

          <div className="stat-card">
            <p>Weather Risk</p>
            <h4>{latestData.weather}</h4>
          </div>

          <div className="stat-card">
            <p>Land Risk</p>
            <h4>{latestData.land}</h4>
          </div>

          <div className="stat-card">
            <p>Latest Historical Year</p>
            <h4>{latestData.year}</h4>
          </div>
        </div>
      </section>

      <RiskTrendChart data={chartData} />
    </div>
  );
}

export default Dashboard;