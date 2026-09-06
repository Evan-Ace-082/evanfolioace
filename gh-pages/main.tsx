/**
 * Static (GitHub Pages) entry point.
 * Renders the public portfolio page only — no SSR, no server functions, no admin panel.
 * The Lovable/TanStack Start app is untouched and keeps working as before.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route } from "@/routes/index";
import "@/styles.css";

const Portfolio = Route.options.component as React.ComponentType;
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Portfolio />
    </QueryClientProvider>
  </StrictMode>,
);
