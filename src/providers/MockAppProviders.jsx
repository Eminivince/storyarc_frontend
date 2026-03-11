import { AccountProvider } from "../context/AccountContext";
import { AdminProvider } from "../context/AdminContext";
import { CreatorProvider } from "../context/CreatorContext";
import { MonetizationProvider } from "../context/MonetizationContext";
import { OnboardingProvider } from "../context/OnboardingContext";

export function MockAppProviders({ children }) {
  return (
    <MonetizationProvider>
      <OnboardingProvider>
        <CreatorProvider>
          <AdminProvider>
            <AccountProvider>{children}</AccountProvider>
          </AdminProvider>
        </CreatorProvider>
      </OnboardingProvider>
    </MonetizationProvider>
  );
}
