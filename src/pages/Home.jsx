import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-bg">
      <div className="overlay">
        <div className="home-content">
          <h1>HarvestIQ</h1>

          <p>
            HarvestIQ is an agricultural risk intelligence platform designed to
            analyze regional risk based on land, weather, and market conditions.
            It gives users a way to review total regional risk, compare regions,
            and better understand where they may want to position themselves.
          </p>

          <Link to="/dashboard" className="main-button">
            Enter Platform
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;