import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

import { App } from "./app.tsx";

import "./main.css";

hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <App />
  </StrictMode>
);
