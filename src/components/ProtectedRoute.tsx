import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUserId } from "../utils/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const userId = getCurrentUserId();

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
