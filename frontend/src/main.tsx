import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { CookiesProvider } from "react-cookie";

import ProtectRoute from "./components/ProtectRoute.tsx";
import App from "./App.tsx";
import NotFound from "./pages/NotFound.tsx";
import LoginPage from "./pages/Login.tsx";
import EventRegistrationPage from "./pages/EventRegistration.tsx";
import QRCodeReader from "./pages/QRCodeReader.tsx";
import Layout from "./components/Layout.tsx";
import CheckedInAttendeesTable from "./pages/CheckedInTable.tsx";
import CheckInSuccess from "./pages/CheckInSuccess.tsx";
import ParticipantDetails from "./pages/ParticipantDetails.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
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
            <Route path="/" element={<Layout admin={false} />}>
              <Route index element={<EventRegistrationPage />} />
              <Route path="/success" element={<CheckInSuccess />} />
            </Route>

            {/* Private Routes */}
            <Route
              path="/admin"
              element={
                <ProtectRoute accessBy="authenticated">
                  <Layout admin={true} />
                </ProtectRoute>
              }
            >
              <Route path="scan" element={<QRCodeReader />} />
              <Route
                path="scan/checked-in/:id"
                element={<ParticipantDetails />}
              />
              <Route
                path="participants"
                element={<CheckedInAttendeesTable />}
              />
              <Route path="register" element={<EventRegistrationPage />} />
              <Route path="register/success" element={<CheckInSuccess />} />
              <Route path="logout" element={<App />} />
            </Route>

            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CookiesProvider>
    </QueryClientProvider>
  </StrictMode>
);
