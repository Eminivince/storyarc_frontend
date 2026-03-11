import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchCurrentUser,
  loginAccount,
  logoutAccount,
  refreshAccountSession,
  registerAccount,
  verifyRegistrationCode,
} from "../auth/authApi";
import {
  clearAuthTokens,
  getStoredRefreshToken,
  hasStoredRefreshToken,
  persistAuthTokens,
} from "../auth/authStorage";

const AuthContext = createContext(null);
const currentUserQueryKey = ["auth", "current-user"];

async function hydrateCurrentUser() {
  const refreshToken = getStoredRefreshToken();

  if (!refreshToken) {
    clearAuthTokens();
    return null;
  }

  const refreshResponse = await refreshAccountSession({ refreshToken });

  persistAuthTokens(refreshResponse.tokens);

  const currentUserResponse = await fetchCurrentUser();

  return currentUserResponse.user;
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [hasStoredSession, setHasStoredSession] = useState(hasStoredRefreshToken());
  const bootstrapQuery = useQuery({
    queryKey: currentUserQueryKey,
    queryFn: hydrateCurrentUser,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!bootstrapQuery.isSuccess) {
      return;
    }

    setUser(bootstrapQuery.data ?? null);
    setHasStoredSession(hasStoredRefreshToken());
  }, [bootstrapQuery.data, bootstrapQuery.isSuccess]);

  useEffect(() => {
    if (!bootstrapQuery.isError) {
      return;
    }

    clearAuthTokens();
    setUser(null);
    setHasStoredSession(false);
    queryClient.setQueryData(currentUserQueryKey, null);
  }, [bootstrapQuery.isError, queryClient]);

  const loginMutation = useMutation({
    mutationFn: loginAccount,
  });
  const registerMutation = useMutation({
    mutationFn: registerAccount,
  });
  const verifyRegistrationMutation = useMutation({
    mutationFn: verifyRegistrationCode,
  });
  const logoutMutation = useMutation({
    mutationFn: logoutAccount,
  });

  function updateCurrentUser(nextUser) {
    setUser(nextUser);
    setHasStoredSession(hasStoredRefreshToken());
    queryClient.setQueryData(currentUserQueryKey, nextUser);

    return nextUser;
  }

  async function syncAuthenticatedUser(nextUser, tokens) {
    persistAuthTokens(tokens);
    return updateCurrentUser(nextUser);
  }

  async function register(input) {
    return registerMutation.mutateAsync(input);
  }

  async function verifyRegistration(input) {
    const response = await verifyRegistrationMutation.mutateAsync(input);

    await syncAuthenticatedUser(response.user, response.tokens);

    return response;
  }

  async function login(input) {
    const response = await loginMutation.mutateAsync(input);

    await syncAuthenticatedUser(response.user, response.tokens);

    return response;
  }

  async function logout() {
    try {
      if (user) {
        await logoutMutation.mutateAsync();
      }
    } catch {
      // Clear the local session even if the remote logout request fails.
    } finally {
      clearAuthTokens();
      setUser(null);
      setHasStoredSession(false);
      queryClient.setQueryData(currentUserQueryKey, null);
    }
  }

  async function refreshSession() {
    const nextUser = await hydrateCurrentUser();

    return updateCurrentUser(nextUser);
  }

  async function refetchCurrentUser() {
    const response = await fetchCurrentUser();

    return updateCurrentUser(response.user);
  }

  const value = {
    hasStoredSession,
    isAuthenticated: Boolean(user),
    isBootstrapping: bootstrapQuery.isPending,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRegistering: registerMutation.isPending,
    isVerifyingRegistration: verifyRegistrationMutation.isPending,
    login,
    logout,
    refetchCurrentUser,
    refreshSession,
    register,
    updateCurrentUser,
    verifyRegistration,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
