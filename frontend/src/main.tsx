import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router";
import { CookiesProvider } from "react-cookie";

import ProtectRoute from "./components/ProtectRoute.tsx";
import App from "./App.tsx";
import NotFound from "./pages/NotFound.tsx";
import LoginPage from "./pages/Login.tsx";
import EventRegistrationPage from "./pages/EventRegistration.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <ProtectRoute accessBy="non-authenticated">
                <LoginPage />
              </ProtectRoute>
            }
          />
          <Route path="/" element={<EventRegistrationPage />} />

          {/* Private Routes */}
          <Route
            path="/admin"
            element={
              <ProtectRoute accessBy="authenticated">
                <App />
              </ProtectRoute>
            }
          />

          {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </CookiesProvider>
  </StrictMode>
);
