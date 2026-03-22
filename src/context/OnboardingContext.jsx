import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  DEFAULT_READING_THEME_LABEL,
  getStoredReadingTheme,
  persistReadingTheme,
} from "../lib/readingTheme";
import {
  saveOnboardingGenres,
  saveOnboardingPreferences,
  uploadOnboardingProfilePicture as uploadOnboardingProfilePictureRequest,
} from "../onboarding/onboardingApi";

const defaultReadingStyle = "Daily Reads";
const defaultReadingTheme = DEFAULT_READING_THEME_LABEL;
const OnboardingContext = createContext(null);

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.readAsDataURL(file);
  });
}

export function OnboardingProvider({ children }) {
  const { updateCurrentUser, user } = useAuth();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [readingStyle, setReadingStyle] = useState(defaultReadingStyle);
  const [readingTheme, setReadingTheme] = useState(
    getStoredReadingTheme() ? getStoredReadingTheme().charAt(0).toUpperCase() + getStoredReadingTheme().slice(1) : defaultReadingTheme,
  );
  const saveGenresMutation = useMutation({
    mutationFn: saveOnboardingGenres,
  });
  const savePreferencesMutation = useMutation({
    mutationFn: saveOnboardingPreferences,
  });
  const uploadProfilePictureMutation = useMutation({
    mutationFn: uploadOnboardingProfilePictureRequest,
  });

  useEffect(() => {
    setSelectedGenres(user?.onboarding?.selectedGenres ?? []);
    setReadingStyle(user?.onboarding?.readingStyle ?? defaultReadingStyle);
    const nextTheme = user?.onboarding?.readingTheme ?? defaultReadingTheme;
    setReadingTheme(nextTheme);
    persistReadingTheme(nextTheme);
  }, [
    user?.id,
    user?.onboarding?.readingStyle,
    user?.onboarding?.readingTheme,
    user?.onboarding?.selectedGenres,
  ]);

  function updateReadingTheme(nextTheme) {
    setReadingTheme(nextTheme);
    persistReadingTheme(nextTheme);
  }

  function toggleGenre(genre) {
    setSelectedGenres((current) => {
      if (current.includes(genre)) {
        return current.filter((item) => item !== genre);
      }

      return [...current, genre];
    });
  }

  async function persistGenres(nextGenres = selectedGenres) {
    const response = await saveGenresMutation.mutateAsync({
      genres: nextGenres,
    });

    updateCurrentUser(response.user);

    return response.user;
  }

  async function persistPreferences(input = {}) {
    const response = await savePreferencesMutation.mutateAsync({
      readingStyle: input.readingStyle ?? readingStyle,
      readingTheme: input.readingTheme ?? readingTheme,
    });

    updateCurrentUser(response.user);

    return response.user;
  }

  async function uploadProfilePicture(file) {
    if (!file) {
      return null;
    }

    const dataUrl = await readFileAsDataUrl(file);
    const [, base64 = ""] = dataUrl.split(",", 2);
    const response = await uploadProfilePictureMutation.mutateAsync({
      base64,
      contentType: file.type || "image/png",
      filename: file.name || "profile-picture.png",
    });

    updateCurrentUser(response.user);

    return response.user?.avatarUrl ?? null;
  }

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingComplete: Boolean(user?.onboarding?.isComplete),
        isSavingGenres: saveGenresMutation.isPending,
        isSavingPreferences: savePreferencesMutation.isPending,
        isUploadingProfilePicture: uploadProfilePictureMutation.isPending,
        onboardingStep: user?.onboarding?.step ?? "genres",
        persistGenres,
        persistPreferences,
        readingStyle,
        readingTheme,
        selectedGenres,
        setReadingStyle,
        setReadingTheme: updateReadingTheme,
        toggleGenre,
        uploadProfilePicture,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }

  return context;
}
