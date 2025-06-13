import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Common Imports
import Start from './Components/Start';
import Login from './Components/Tables/Login';
import ForgotPassword from './Components/Tables/ForgotPassword';
import ResetPassword from './Components/Tables/ResetPassword';
import Dashboard from './Components/Dash/Dashboard';
import StudentDashboard from './Components/Dash/StudentHome';



function AppRoutes() {
  const { roleId, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Role9Wrapper> <Start /> </Role9Wrapper>} />
      <Route path="/adminlogin" element={<Role9Wrapper> <Login /> </Role9Wrapper>} />
      <Route path="/forgot-password" element={ <Role9Wrapper> <ForgotPassword /> </Role9Wrapper>} />
      <Route path="/reset-password" element={<Role9Wrapper> <ResetPassword /> </Role9Wrapper>} />
      <Route path="/unauthorized" element={<Role9Wrapper> <Login /> </Role9Wrapper>} />

      {/* Consolidated Dashboard Route */}
<Route
  path="/dashboard"
  element={
    <ProtectedRoute allowedRoles={[1, 2, 8, 9]}>
      <Role9Wrapper>
        <Dashboard />
      </Role9Wrapper>
    </ProtectedRoute>
  }
>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/adminlogin" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;