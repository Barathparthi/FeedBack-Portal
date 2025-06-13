import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, roleId, loading } = useContext(AuthContext);

  console.log("ProtectedRoute: Checking authentication...");
  console.log("ProtectedRoute: isAuthenticated:", isAuthenticated);
  console.log("ProtectedRoute: roleId:", roleId);
  console.log("ProtectedRoute: loading:", loading);
  console.log("ProtectedRoute: allowedRoles:", allowedRoles);

  if (loading) {
    console.log("ProtectedRoute: Loading state");
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log(
      "ProtectedRoute: Not authenticated, redirecting to /adminlogin"
    );
    return <Navigate to="/adminlogin" />;
  }

  const numericRoleId = Number(roleId);
  if (allowedRoles && !allowedRoles.includes(numericRoleId)) {
    console.log(
      `ProtectedRoute: Role ${roleId} not in allowedRoles ${allowedRoles}, redirecting to /unauthorized`
    );
    return <Navigate to="/unauthorized" />;
  }

  console.log(`ProtectedRoute: Access granted for role ${roleId} to route`);
  return children;
};

export default ProtectedRoute;
