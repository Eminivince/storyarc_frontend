import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resolvePostLoginPath } from "../auth/authRouting";
import { clearAuthTokens } from "../auth/authStorage";
import PageLoadingSpinner from "../components/PageLoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function normalizeNextPath(value) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value;
}

function getGoogleAuthErrorMessage(errorCode) {
  switch (errorCode) {
    case "google_access_denied":
      return "Google sign-in was cancelled before completion.";
    case "google_account_conflict":
      return "That Google account is already linked to a different TaleStead user.";
    case "google_account_unavailable":
      return "This TaleStead account is currently unavailable.";
    case "google_email_unverified":
      return "Use a Google account with a verified email address.";
    case "google_not_configured":
      return "Google sign-in is not configured yet.";
    case "google_profile_fetch_failed":
      return "We could not load your Google profile.";
    case "google_state_invalid":
      return "This Google sign-in attempt expired. Start again.";
    case "google_token_exchange_failed":
      return "We could not complete the Google sign-in handshake.";
    default:
      return "Google sign-in failed. Please try again.";
  }
}

export default function GoogleAuthCallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { completeOAuthSession } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    let cancelled = false;

    async function finalizeGoogleAuth() {
      const searchParams = new URLSearchParams(location.search);
      const hashParams = new URLSearchParams(
        location.hash.startsWith("#") ? location.hash.slice(1) : location.hash,
      );
      const errorCode = searchParams.get("error");
      const accessToken = hashParams.get("accessToken");
      const refreshToken = hashParams.get("refreshToken");
      const nextPath = normalizeNextPath(hashParams.get("next"));

      if (errorCode || !accessToken || !refreshToken) {
        showToast(getGoogleAuthErrorMessage(errorCode), {
          title: "Google sign-in failed",
          tone: "error",
        });
        navigate("/auth", { replace: true });
        return;
      }

      try {
        const user = await completeOAuthSession({
          accessToken,
          refreshToken,
        });

        if (cancelled) {
          return;
        }

        showToast(`Welcome, ${user.displayName}.`, {
          title: "Signed in with Google",
        });
        navigate(resolvePostLoginPath(user, nextPath), {
          replace: true,
        });
      } catch (error) {
        clearAuthTokens();

        if (cancelled) {
          return;
        }

        showToast(
          error?.message || "Google sign-in failed. Please try again.",
          {
            title: "Google sign-in failed",
            tone: "error",
          },
        );
        navigate("/auth", { replace: true });
      }
    }

    finalizeGoogleAuth();

    return () => {
      cancelled = true;
    };
  }, [completeOAuthSession, location.hash, location.search, navigate, showToast]);

  return <PageLoadingSpinner />;
}
