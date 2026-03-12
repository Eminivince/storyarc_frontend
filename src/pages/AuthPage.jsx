import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { buildGoogleAuthStartUrl } from "../auth/authApi";
import { persistPendingVerification } from "../auth/authFlowStorage";
import { resolvePostLoginPath } from "../auth/authRouting";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Reveal from "../components/Reveal";

function getErrorMessage(error) {
  return error?.message || "Something went wrong. Please try again.";
}

function getRequestedPath(requestedLocation) {
  if (!requestedLocation) {
    return null;
  }

  if (typeof requestedLocation === "string") {
    return requestedLocation.startsWith("/") &&
      !requestedLocation.startsWith("//")
      ? requestedLocation
      : null;
  }

  const pathname =
    typeof requestedLocation.pathname === "string"
      ? requestedLocation.pathname
      : null;

  if (!pathname || !pathname.startsWith("/") || pathname.startsWith("//")) {
    return null;
  }

  const search =
    typeof requestedLocation.search === "string" ? requestedLocation.search : "";
  const hash =
    typeof requestedLocation.hash === "string" ? requestedLocation.hash : "";

  return `${pathname}${search}${hash}`;
}

function useAuthFormModel() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, isLoggingIn, isRegistering } = useAuth();
  const { showToast } = useToast();
  const [mode, setMode] = useState("signin");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isGoogleRedirecting, setIsGoogleRedirecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isSignIn = mode === "signin";
  const isPending = isSignIn ? isLoggingIn : isRegistering;

  useEffect(() => {
    if (location.state?.mode === "signup" || location.state?.mode === "signin") {
      setMode(location.state.mode);
    }

    if (typeof location.state?.email === "string") {
      setEmail(location.state.email);
    }
  }, [location.state]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!isSignIn && password !== confirmPassword) {
      const msg = "Passwords do not match.";
      setError(msg);
      showToast(msg, {
        tone: "error",
        title: "Check your password",
      });
      return;
    }

    try {
      if (isSignIn) {
        const response = await login({
          email,
          password,
        });

        showToast(`Welcome back, ${response.user.displayName}.`, {
          title: "Signed in",
        });
        navigate(resolvePostLoginPath(response.user, location.state?.from), {
          replace: true,
        });
        return;
      }

      await register({
        displayName,
        email,
        password,
      });

      persistPendingVerification({
        email,
        flow: "register",
      });

      showToast("We sent a verification code to your email.", {
        title: "Verify your account",
      });
      navigate("/auth/verify-code", {
        replace: true,
        state: {
          email,
          flow: "register",
        },
      });
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      showToast(msg, {
        tone: "error",
        title: isSignIn ? "Sign-in failed" : "Account creation failed",
      });
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError(null);
  }

  function continueWithGoogle() {
    const nextPath = getRequestedPath(location.state?.from);

    setIsGoogleRedirecting(true);
    window.location.assign(buildGoogleAuthStartUrl(nextPath));
  }

  return {
    confirmPassword,
    continueWithGoogle,
    displayName,
    email,
    error,
    handleSubmit,
    isGoogleRedirecting,
    isPending,
    isSignIn,
    mode,
    password,
    setConfirmPassword,
    setDisplayName,
    setEmail,
    setPassword,
    setShowConfirmPassword,
    setShowPassword,
    showConfirmPassword,
    showPassword,
    switchMode,
  };
}

function DesktopAuth() {
  const {
    confirmPassword,
    displayName,
    email,
    error,
    handleSubmit,
    continueWithGoogle,
    isGoogleRedirecting,
    isPending,
    isSignIn,
    password,
    setConfirmPassword,
    setDisplayName,
    setEmail,
    setPassword,
    setShowConfirmPassword,
    setShowPassword,
    showConfirmPassword,
    showPassword,
    switchMode,
  } = useAuthFormModel();

  return (
    <div className="hidden min-h-screen flex-col bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:flex">
      <header className="flex items-center justify-between border-b border-primary/20 bg-background-light px-6 py-4 dark:bg-background-dark md:px-10">
        <Link className="flex items-center gap-4 text-primary" to="/">
          <div className="size-6">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            StoryArc
          </span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <a className="text-sm font-medium transition-colors hover:text-primary" href="#">
            Browse
          </a>
          <a className="text-sm font-medium transition-colors hover:text-primary" href="#">
            Library
          </a>
          <a className="text-sm font-medium transition-colors hover:text-primary" href="#">
            Community
          </a>
        </div>
      </header>

      <main className="relative flex flex-1 items-center justify-center overflow-hidden p-4 md:p-8">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
          <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
          <div
            className="h-full w-full bg-cover bg-center opacity-10 grayscale"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuADE-lO6P_OtZjs75s6VnWDkeyOUgAbMSoiNmVdRtGY5bfbuRTI92CADYuHYsHgbpgzttc0wyYMlrfBbIxBaEPiSABft_kZQlmOywT5bNusNtPm2qrOhj7XRjQlxOVTJrZmPqb1M49pSik1f2tnEqAYn-C_nDG6hzeCLaSR_-LpjvWC_xWLuOUyb2fMcmvxv47R00-LCaHul5KgIvEsDn6iCfsU7c4k0b1vGxlKN73JxKWo63buCcqwmfq188hX_HN-KijYnaoQKrg')",
            }}
          />
        </div>

        <Reveal className="relative z-10 flex w-full max-w-[1000px] flex-col overflow-hidden rounded-xl border border-primary/10 bg-background-light shadow-2xl dark:bg-background-dark md:flex-row">
          <div className="hidden w-1/2 flex-col justify-center border-r border-primary/10 bg-primary/5 p-12 md:flex">
            <div className="mb-8">
              <span className="mb-4 inline-block rounded-lg bg-primary/20 p-3 text-primary">
                <span className="material-symbols-outlined text-4xl">auto_stories</span>
              </span>
              <h2 className="mb-4 text-3xl font-bold">Your next adventure begins here.</h2>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                Join thousands of readers and writers. Discover exclusive webnovels,
                track your progress, and support your favorite creators.
              </p>
            </div>
            <div className="space-y-4">
              {[
                "Personalized recommendations",
                "Offline reading mode",
                "Early access to new chapters",
              ].map((item) => (
                <div className="flex items-center gap-3" key={item}>
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 p-8 md:p-12">
            <div className="mx-auto max-w-md">
              <div className="mb-8 flex rounded-lg bg-slate-200 p-1 dark:bg-primary/10">
                <button
                  className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
                    isSignIn
                      ? "bg-white text-slate-900 shadow-sm dark:bg-primary dark:text-background-dark"
                      : "text-slate-600 hover:text-primary dark:text-slate-400"
                  }`}
                  onClick={() => switchMode("signin")}
                  type="button"
                >
                  Sign In
                </button>
                <button
                  className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
                    !isSignIn
                      ? "bg-white text-slate-900 shadow-sm dark:bg-primary dark:text-background-dark"
                      : "text-slate-600 hover:text-primary dark:text-slate-400"
                  }`}
                  onClick={() => switchMode("signup")}
                  type="button"
                >
                  Create Account
                </button>
              </div>

              <motion.div
                animate={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: 12 }}
                key={isSignIn ? "signin" : "signup"}
                transition={{ duration: 0.25 }}
              >
                <h1 className="mb-2 text-2xl font-bold">
                  {isSignIn ? "Welcome Back" : "Create your account"}
                </h1>
                <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
                  {isSignIn
                    ? "Enter your credentials to access your library."
                    : "Start reading, writing, and building your StoryArc identity."}
                </p>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {error && (
                    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
                      <span className="material-symbols-outlined shrink-0 text-xl">error</span>
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}
                  {!isSignIn && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Display Name</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                          person
                        </span>
                        <input
                          className="w-full rounded-lg border border-slate-200 bg-slate-100 py-3.5 pl-12 pr-4 text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary dark:border-primary/20 dark:bg-primary/5 dark:text-white"
                          onChange={(event) => setDisplayName(event.target.value)}
                          placeholder="Alex Thorne"
                          required
                          type="text"
                          value={displayName}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Email Address</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                        mail
                      </span>
                      <input
                        className="w-full rounded-lg border border-slate-200 bg-slate-100 py-3.5 pl-12 pr-4 text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary dark:border-primary/20 dark:bg-primary/5 dark:text-white"
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="name@example.com"
                        required
                        type="email"
                        value={email}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium">Password</label>
                      {isSignIn && (
                        <Link
                          className="text-xs font-medium text-primary hover:underline"
                          to="/auth/forgot-password"
                        >
                          Forgot Password?
                        </Link>
                      )}
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                        lock
                      </span>
                      <input
                        className="w-full rounded-lg border border-slate-200 bg-slate-100 py-3.5 pl-12 pr-12 text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary dark:border-primary/20 dark:bg-primary/5 dark:text-white"
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="••••••••"
                        required
                        type={showPassword ? "text" : "password"}
                        value={password}
                      />
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-primary"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {!isSignIn && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Confirm Password</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                          verified
                        </span>
                        <input
                          className="w-full rounded-lg border border-slate-200 bg-slate-100 py-3.5 pl-12 pr-12 text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary dark:border-primary/20 dark:bg-primary/5 dark:text-white"
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          placeholder="••••••••"
                          required
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                        />
                        <button
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-primary"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          type="button"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          <span className="material-symbols-outlined text-xl">
                            {showConfirmPassword ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  <motion.button
                    className="w-full rounded-lg bg-primary py-4 font-bold text-background-dark shadow-lg shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isPending}
                    type="submit"
                    whileHover={isPending ? undefined : { scale: 1.01 }}
                    whileTap={isPending ? undefined : { scale: 0.98 }}
                  >
                    {isPending
                      ? isSignIn
                        ? "Signing In..."
                        : "Creating Account..."
                      : isSignIn
                        ? "Sign In to StoryArc"
                        : "Create StoryArc Account"}
                  </motion.button>
                </form>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-primary/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background-light px-4 font-medium tracking-widest text-slate-500 dark:bg-background-dark">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 px-4 py-3 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-primary/20 dark:hover:bg-primary/5"
                  disabled={isGoogleRedirecting}
                  onClick={continueWithGoogle}
                  type="button"
                >
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="text-sm font-semibold">
                    {isGoogleRedirecting
                      ? "Redirecting to Google..."
                      : "Continue with Google"}
                  </span>
                </button>

                <p className="mt-10 text-center text-xs leading-relaxed text-slate-500">
                  By continuing, you agree to StoryArc&apos;s{" "}
                  <a className="text-primary hover:underline" href="#">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a className="text-primary hover:underline" href="#">
                    Privacy Policy
                  </a>
                  .
                </p>
              </motion.div>
            </div>
          </div>
        </Reveal>
      </main>

      <footer className="flex flex-col items-center justify-between gap-4 border-t border-primary/10 bg-background-light px-10 py-6 text-sm text-slate-500 dark:bg-background-dark md:flex-row">
        <p>© 2024 StoryArc Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <a className="transition-colors hover:text-primary" href="#">
            Help Center
          </a>
          <a className="transition-colors hover:text-primary" href="#">
            Contact
          </a>
          <a className="transition-colors hover:text-primary" href="#">
            English (US)
          </a>
        </div>
      </footer>
    </div>
  );
}

function MobileAuth() {
  const {
    confirmPassword,
    displayName,
    email,
    error,
    handleSubmit,
    continueWithGoogle,
    isGoogleRedirecting,
    isPending,
    isSignIn,
    password,
    setConfirmPassword,
    setDisplayName,
    setEmail,
    setPassword,
    setShowConfirmPassword,
    setShowPassword,
    showConfirmPassword,
    showPassword,
    switchMode,
  } = useAuthFormModel();

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden overflow-y-auto bg-background-light dark:bg-background-dark">
        <header className="flex shrink-0 items-center justify-between border-b border-primary/10 px-4 py-3">
          <Link
            className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-primary/20"
            to="/"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </Link>
          <span className="text-lg font-bold tracking-tight">StoryArc</span>
          <div className="w-9" />
        </header>

        <div className="mx-4 mt-4 flex h-10 shrink-0 items-center rounded-lg border border-primary/10 bg-slate-200/50 p-1 dark:bg-primary/10">
          <button
            className={`flex h-full flex-1 items-center justify-center rounded-md text-sm font-semibold transition-all ${
              isSignIn ? "bg-primary text-background-dark shadow-sm" : "text-slate-600 dark:text-slate-400"
            }`}
            onClick={() => switchMode("signin")}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`flex h-full flex-1 items-center justify-center rounded-md text-sm font-semibold transition-all ${
              !isSignIn ? "bg-primary text-background-dark shadow-sm" : "text-slate-600 dark:text-slate-400"
            }`}
            onClick={() => switchMode("signup")}
            type="button"
          >
            Create Account
          </button>
        </div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 px-4 py-4"
          initial={{ opacity: 0, y: 8 }}
          key={isSignIn ? "signin-mobile" : "signup-mobile"}
          transition={{ duration: 0.2 }}
        >
          <div className="rounded-xl border border-primary/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h1 className="text-xl font-bold">
              {isSignIn ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {isSignIn ? "Sign in to continue" : "Join StoryArc to start reading"}
            </p>

            <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
                  <span className="material-symbols-outlined shrink-0 text-lg">error</span>
                  <p className="text-xs font-medium">{error}</p>
                </div>
              )}
              {!isSignIn && (
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Display Name</span>
                  <input
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30 dark:border-primary/20 dark:bg-primary/5 dark:text-slate-100"
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Alex Thorne"
                    required
                    type="text"
                    value={displayName}
                  />
                </label>
              )}
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Email</span>
                <input
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30 dark:border-primary/20 dark:bg-primary/5 dark:text-slate-100"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  type="email"
                  value={email}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Password</span>
                <div className="relative">
                  <input
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30 dark:border-primary/20 dark:bg-primary/5 dark:text-slate-100"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                  />
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </label>
              {!isSignIn && (
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Confirm Password</span>
                  <div className="relative">
                    <input
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30 dark:border-primary/20 dark:bg-primary/5 dark:text-slate-100"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                    />
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-primary"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      type="button"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showConfirmPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </label>
              )}
              {isSignIn && (
                <div className="flex justify-end">
                  <Link className="text-xs font-medium text-primary hover:underline" to="/auth/forgot-password">
                    Forgot password?
                  </Link>
                </div>
              )}
              <motion.button
                className="mt-1 h-10 rounded-lg bg-primary font-semibold text-background-dark transition-all disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isPending}
                type="submit"
                whileHover={isPending ? undefined : { scale: 1.01 }}
                whileTap={isPending ? undefined : { scale: 0.98 }}
              >
                {isPending
                  ? isSignIn ? "Signing In..." : "Creating Account..."
                  : isSignIn ? "Sign In" : "Create Account"}
              </motion.button>
            </form>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-primary/20" />
            </div>
            <span className="relative flex justify-center">
              <span className="bg-background-light px-3 text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:bg-background-dark">
                or
              </span>
            </span>
          </div>

          <button
            className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-900 shadow-sm disabled:opacity-60 dark:border-primary/20 dark:bg-white/5 dark:text-slate-100"
            disabled={isGoogleRedirecting}
            onClick={continueWithGoogle}
            type="button"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>
              {isGoogleRedirecting ? "Redirecting..." : "Continue with Google"}
            </span>
          </button>
        </motion.div>

        <div className="mt-auto shrink-0 px-4 py-5 text-center">
          <p className="text-xs text-slate-500">
            By continuing, you agree to StoryArc&apos;s{" "}
            <a className="text-primary underline" href="#">
              Terms of Service
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="#">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const location = useLocation();
  const { showToast } = useToast();
  const [hasShownRedirectNotice, setHasShownRedirectNotice] = useState(false);

  useEffect(() => {
    if (!location.state?.from || hasShownRedirectNotice) {
      return;
    }

    showToast("Sign in to continue.", {
      tone: "info",
      title: "Authentication required",
    });
    setHasShownRedirectNotice(true);
  }, [hasShownRedirectNotice, location.state, showToast]);

  return (
    <>
      <DesktopAuth />
      <MobileAuth />
    </>
  );
}
