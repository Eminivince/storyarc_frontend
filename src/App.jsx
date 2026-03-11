import { motion } from "framer-motion";
import { Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { getRouteAccess } from "./auth/authRouting";
import ProtectedRoute from "./components/ProtectedRoute";
import RouteLoadingScreen from "./components/RouteLoadingScreen";
import { appRoutes } from "./config/appRoutes";

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

export default function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteLoadingScreen />}>
        <Routes key={location.pathname} location={location}>
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
