import { createContext } from "react";

/** Separate module so every importer shares one context instance (avoids duplicate-context / HMR issues). */
export const CreatorContext = createContext(null);
