import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">HarvestIQ</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
}

export default Navbar;