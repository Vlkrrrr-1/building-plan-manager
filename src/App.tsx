import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PlanPage from "./pages/PlanPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { getCurrentUserId } from "./utils/auth";

function App() {
  const userId = getCurrentUserId();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            userId ? <Navigate to="/plan" replace /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/plan"
          element={
            <ProtectedRoute>
              <PlanPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
