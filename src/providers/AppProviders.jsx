import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";
import { ToastProvider } from "../context/ToastContext";
import { queryClient } from "../lib/queryClient";
import { MockAppProviders } from "./MockAppProviders";

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <SocketProvider>
            <MockAppProviders>{children}</MockAppProviders>
          </SocketProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
