import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Login Page */}
        <Route
          path="/login"
          element={<Login />}
        />


        {/* Signup Page */}
        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* Protected Student Dashboard */}
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />


        {/* Default Page */}
        <Route
          path="*"
          element={<Navigate to="/login" />}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;