import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";
import { queryClient } from "../lib/queryClient";
import { MockAppProviders } from "./MockAppProviders";

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <MockAppProviders>{children}</MockAppProviders>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
