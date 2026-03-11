import { Navigate, useLocation } from "react-router-dom";
import { getDefaultSignedInPath, getOnboardingEntryPath } from "../auth/authRouting";
import { useAuth } from "../context/AuthContext";
import RouteLoadingScreen from "./RouteLoadingScreen";

export default function ProtectedRoute({ access, children }) {
  const location = useLocation();
  const { hasStoredSession, isAuthenticated, isBootstrapping, user } = useAuth();

  if (!access || access.kind === "public") {
    return children;
  }

  if (isBootstrapping && (hasStoredSession || access.kind !== "public")) {
    return <RouteLoadingScreen />;
  }

  if (access.kind === "guest") {
    if (!isAuthenticated) {
      return children;
    }

    return <Navigate replace to={getDefaultSignedInPath(user)} />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        state={{ from: location }}
        to="/auth"
      />
    );
  }

  if (access.roles?.length && !access.roles.includes(user?.role)) {
    return <Navigate replace to={getDefaultSignedInPath(user)} />;
  }

  const onboardingPath = getOnboardingEntryPath(user);
  const isOnboardingRoute = location.pathname.startsWith("/onboarding");

  if (onboardingPath && !isOnboardingRoute) {
    return <Navigate replace to={onboardingPath} />;
  }

  if (!onboardingPath && isOnboardingRoute) {
    return <Navigate replace to={getDefaultSignedInPath(user)} />;
  }

  return children;
}
