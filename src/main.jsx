import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource-variable/material-symbols-outlined/full.css";
import App from "./App";
import "./index.css";
import { AppProviders } from "./providers/AppProviders";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    window.__talesteadUpdateSw = updateSW;
    globalThis.dispatchEvent(new CustomEvent("talestead:sw-update-available"));
  },
  onOfflineReady() {
    globalThis.dispatchEvent(new CustomEvent("talestead:sw-offline-ready"));
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProviders>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProviders>
  </React.StrictMode>,
);
