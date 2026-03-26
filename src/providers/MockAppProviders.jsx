import { AccountProvider } from "../context/AccountContext";
import { AdminProvider } from "../context/AdminContext";
import { MonetizationProvider } from "../context/MonetizationContext";
import { OnboardingProvider } from "../context/OnboardingContext";

export function MockAppProviders({ children }) {
  return (
    <MonetizationProvider>
      <OnboardingProvider>
        <AdminProvider>
          <AccountProvider>{children}</AccountProvider>
        </AdminProvider>
      </OnboardingProvider>
    </MonetizationProvider>
  );
}
