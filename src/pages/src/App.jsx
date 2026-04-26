import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ComparativeAnalysis from "./pages/ComparativeAnalysis";
import FAQ from "./pages/FAQ";
import About from "./pages/About";

function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="page-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/comparative-analysis" element={<ComparativeAnalysis />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>HarvestIQ | Kansas Agricultural Risk Intelligence Platform</p>
      </footer>
    </div>
  );
}

export default App;