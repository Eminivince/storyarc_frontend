import { motion } from "framer-motion";
import { Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { getRouteAccess, isUnauthenticatedRoute } from "./auth/authRouting";
import OfflineBanner from "./components/OfflineBanner";
import ProtectedRoute from "./components/ProtectedRoute";
import PageLoadingSpinner from "./components/PageLoadingSpinner";
import RouteLoadingScreen from "./components/RouteLoadingScreen";
import SwUpdatePrompt from "./components/SwUpdatePrompt";
import { appRoutes } from "./config/appRoutes";
import { useAuth } from "./context/AuthContext";
import { useCreator } from "./context/CreatorContext";
import {
  resolveModeFromPath,
  resolveNeutralModeRedirectPath,
} from "./lib/appMode";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return null;
}

function PageTransition({ children, routeKey }) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen"
      initial={{ opacity: 0, y: 18 }}
      key={routeKey}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function RouteElement({ access, Component, routeKey }) {
  return (
    <ProtectedRoute access={access}>
      <PageTransition routeKey={routeKey}>
        <Component />
      </PageTransition>
    </ProtectedRoute>
  );
}

function AppModeCoordinator() {
  const location = useLocation();
  const { isAuthenticated, isBootstrapping, user } = useAuth();
  const { creatorMode, syncCreatorMode } = useCreator();
  const redirectPath =
    !isBootstrapping && isAuthenticated
      ? resolveNeutralModeRedirectPath(location.pathname, user)
      : null;

  useEffect(() => {
    if (isBootstrapping || !isAuthenticated || redirectPath) {
      return;
    }

    const routeMode = resolveModeFromPath(location.pathname);

    if (!routeMode || routeMode === creatorMode) {
      return;
    }

    syncCreatorMode(routeMode);
  }, [
    creatorMode,
    isAuthenticated,
    isBootstrapping,
    location.pathname,
    redirectPath,
    syncCreatorMode,
  ]);

  if (redirectPath && redirectPath !== location.pathname) {
    return <Navigate replace to={redirectPath} />;
  }

  return null;
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <OfflineBanner />
      <SwUpdatePrompt />
      <ScrollToTop />
      <AppModeCoordinator />
      <Suspense
        fallback={
          isUnauthenticatedRoute(location.pathname) ? (
            <PageLoadingSpinner />
          ) : (
            <RouteLoadingScreen />
          )
        }
      >
        <Routes location={location}>
          {appRoutes.map(({ component: Component, path }) => (
            <Route
              element={
                <RouteElement
                  access={getRouteAccess(path)}
                  Component={Component}
                  routeKey={location.pathname}
                />
              }
              key={path}
              path={path}
            />
          ))}
        </Routes>
      </Suspense>
    </>
  );
}
