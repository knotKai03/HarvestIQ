import { useEffect, useMemo, useState } from "react";
import KansasMap from "../components/KansasMap";
import RiskTrendChart from "../components/RiskTrendChart";

const historicalRiskData = {
  Kansas: {
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
  },
  Iowa: {
    Northwest: [
      { year: 2014, market: 47, weather: 49, land: 57 },
      { year: 2015, market: 48, weather: 50, land: 58 },
      { year: 2016, market: 49, weather: 51, land: 59 },
      { year: 2017, market: 50, weather: 52, land: 60 },
      { year: 2018, market: 52, weather: 54, land: 61 },
      { year: 2019, market: 53, weather: 55, land: 62 },
      { year: 2020, market: 55, weather: 57, land: 63 },
      { year: 2021, market: 54, weather: 56, land: 64 },
      { year: 2022, market: 56, weather: 58, land: 65 },
      { year: 2023, market: 57, weather: 59, land: 66 },
      { year: 2024, market: 58, weather: 60, land: 67 },
    ],
    Northeast: [
      { year: 2014, market: 45, weather: 47, land: 60 },
      { year: 2015, market: 46, weather: 48, land: 61 },
      { year: 2016, market: 47, weather: 49, land: 62 },
      { year: 2017, market: 48, weather: 50, land: 63 },
      { year: 2018, market: 49, weather: 52, land: 64 },
      { year: 2019, market: 50, weather: 53, land: 65 },
      { year: 2020, market: 52, weather: 54, land: 66 },
      { year: 2021, market: 51, weather: 55, land: 67 },
      { year: 2022, market: 53, weather: 56, land: 68 },
      { year: 2023, market: 54, weather: 57, land: 69 },
      { year: 2024, market: 55, weather: 58, land: 70 },
    ],
    Central: [
      { year: 2014, market: 46, weather: 48, land: 59 },
      { year: 2015, market: 47, weather: 49, land: 60 },
      { year: 2016, market: 48, weather: 50, land: 61 },
      { year: 2017, market: 49, weather: 51, land: 62 },
      { year: 2018, market: 50, weather: 53, land: 63 },
      { year: 2019, market: 51, weather: 54, land: 64 },
      { year: 2020, market: 53, weather: 55, land: 65 },
      { year: 2021, market: 52, weather: 56, land: 66 },
      { year: 2022, market: 54, weather: 57, land: 67 },
      { year: 2023, market: 55, weather: 58, land: 68 },
      { year: 2024, market: 56, weather: 59, land: 69 },
    ],
    Southwest: [
      { year: 2014, market: 48, weather: 50, land: 56 },
      { year: 2015, market: 49, weather: 51, land: 57 },
      { year: 2016, market: 50, weather: 52, land: 58 },
      { year: 2017, market: 51, weather: 53, land: 59 },
      { year: 2018, market: 53, weather: 55, land: 60 },
      { year: 2019, market: 54, weather: 56, land: 61 },
      { year: 2020, market: 56, weather: 57, land: 62 },
      { year: 2021, market: 55, weather: 58, land: 63 },
      { year: 2022, market: 57, weather: 59, land: 64 },
      { year: 2023, market: 58, weather: 60, land: 65 },
      { year: 2024, market: 59, weather: 61, land: 66 },
    ],
    Southeast: [
      { year: 2014, market: 44, weather: 49, land: 58 },
      { year: 2015, market: 45, weather: 50, land: 59 },
      { year: 2016, market: 46, weather: 51, land: 60 },
      { year: 2017, market: 47, weather: 52, land: 61 },
      { year: 2018, market: 49, weather: 54, land: 62 },
      { year: 2019, market: 50, weather: 55, land: 63 },
      { year: 2020, market: 52, weather: 56, land: 64 },
      { year: 2021, market: 51, weather: 57, land: 65 },
      { year: 2022, market: 53, weather: 58, land: 66 },
      { year: 2023, market: 54, weather: 59, land: 67 },
      { year: 2024, market: 55, weather: 60, land: 68 },
    ],
  },
};

const regionDescriptions = {
  Kansas: {
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
  },
  Iowa: {
    Northwest:
      "Northwest Iowa shows a relatively balanced historical profile, with land values contributing a larger share of total agricultural pressure.",
    Northeast:
      "Northeast Iowa trends slightly lower in weather volatility, though land-related pressure remains consistently strong across the historical period.",
    Central:
      "Central Iowa presents a steady historical pattern that reflects balanced market, weather, and land conditions over time.",
    Southwest:
      "Southwest Iowa shows moderate agricultural pressure, with gradual increases across market and land conditions shaping the overall score.",
    Southeast:
      "Southeast Iowa remains comparatively stable, though weather and land-related changes still influence long-term agricultural planning.",
  },
};

function Dashboard() {
  const [selectedState, setSelectedState] = useState("Kansas");
  const [selectedRegion, setSelectedRegion] = useState("Central");
  const [selectedYear, setSelectedYear] = useState(2024);

  const availableRegions = Object.keys(historicalRiskData[selectedState]);
  const availableYears = historicalRiskData[selectedState][selectedRegion].map((item) => item.year);

  useEffect(() => {
    setSelectedRegion("Central");
    setSelectedYear(2024);
  }, [selectedState]);

  const selectedYearData = historicalRiskData[selectedState][selectedRegion].find(
    (item) => item.year === Number(selectedYear)
  );

  const totalRisk = useMemo(() => {
    return Math.round(
      selectedYearData.market * 0.4 +
        selectedYearData.weather * 0.35 +
        selectedYearData.land * 0.25
    );
  }, [selectedYearData]);

  const chartData = historicalRiskData[selectedState][selectedRegion].map((item) => ({
    ...item,
    total: Math.round(item.market * 0.4 + item.weather * 0.35 + item.land * 0.25),
  }));

  const highestContributor =
    selectedYearData.weather >= selectedYearData.market &&
    selectedYearData.weather >= selectedYearData.land
      ? "Weather Risk"
      : selectedYearData.market >= selectedYearData.land
      ? "Market Risk"
      : "Land Risk";

  return (
    <div className="page-container">
      <section className="content-section">
        <div className="section-heading left">
          <h3>Historical Dashboard</h3>
          <p>
            This dashboard presents historical agricultural risk information for the
            selected state from 2014 through 2024. Use the filters below to choose a
            state, region, and year while keeping the full historical trend visible.
          </p>
        </div>

        <div className="comparison-controls">
          <div className="control-block">
            <label>State</label>
            <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
              <option value="Kansas">Kansas</option>
              <option value="Iowa">Iowa</option>
            </select>
          </div>

          <div className="control-block">
            <label>Region</label>
            <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
              {availableRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div className="control-block">
            <label>Historical Year</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <KansasMap
          selectedState={selectedState}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
        />

        <div className="dashboard-side-card">
          <h3>Dashboard Summary</h3>
          <p>
            This section summarizes the selected historical result and identifies
            the strongest contributor to the total agricultural risk score.
          </p>

          <div className="summary-list">
            <div className="summary-item">
              <strong>Selected State:</strong> {selectedState}
            </div>
            <div className="summary-item">
              <strong>Selected Region:</strong> {selectedRegion}
            </div>
            <div className="summary-item">
              <strong>Selected Year:</strong> {selectedYear}
            </div>
            <div className="summary-item">
              <strong>Total Historical Risk Score:</strong> {totalRisk}
            </div>
            <div className="summary-item">
              <strong>Highest Contributor:</strong> {highestContributor}
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-main-card">
        <div className="dashboard-card-header">
          <div>
            <p className="mini-label">Selected View</p>
            <h3>
              {selectedRegion}, {selectedState}
            </h3>
          </div>

          <div className="score-badge">
            <span>{totalRisk}</span>
            <p>{selectedYear} Risk</p>
          </div>
        </div>

        <p className="dashboard-description">
          {regionDescriptions[selectedState][selectedRegion]}
        </p>

        <div className="stat-grid">
          <div className="stat-card">
            <p>Market Risk</p>
            <h4>{selectedYearData.market}</h4>
          </div>

          <div className="stat-card">
            <p>Weather Risk</p>
            <h4>{selectedYearData.weather}</h4>
          </div>

          <div className="stat-card">
            <p>Land Risk</p>
            <h4>{selectedYearData.land}</h4>
          </div>

          <div className="stat-card">
            <p>Historical Year</p>
            <h4>{selectedYearData.year}</h4>
          </div>
        </div>
      </section>

      <RiskTrendChart
        data={chartData}
        selectedState={selectedState}
        selectedRegion={selectedRegion}
      />
    </div>
  );
}

export default Dashboard;