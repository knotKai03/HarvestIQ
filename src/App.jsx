import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import "./App.css";

function AppLayout() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/" && <Navbar />}

      <div className={location.pathname === "/" ? "" : "app-container"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;