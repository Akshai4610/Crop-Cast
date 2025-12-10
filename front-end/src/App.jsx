import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "./section/HomeSection";

// App component
function App() {
  return (
    <Router>
      {/* Routing for public pages */}
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
