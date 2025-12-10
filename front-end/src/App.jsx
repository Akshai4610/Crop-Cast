// - Chooses layout based on user authentication state.
// - Avoids UI code inside App for clean architecture.

import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";      // Import central route manager

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />  {/* All routes handled separately */}
    </BrowserRouter>
  );
}
