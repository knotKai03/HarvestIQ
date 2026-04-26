import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand-block">
          <h1 className="brand-title">HarvestIQ</h1>
          <p className="brand-subtitle">Agricultural Risk Intelligence Platform</p>
        </div>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/comparative-analysis">Predictive Analysis</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;