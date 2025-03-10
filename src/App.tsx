import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import AuthForm from "./components/auth/AuthForm";
import AuthLayout from "./components/auth/AuthLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthProvider from "./context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import routes from "tempo-routes";

// Lazy load route components
const Meals = lazy(() => import("./routes/meals"));
const Progress = lazy(() => import("./routes/progress"));

function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <>
          <Routes>
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/meals" element={<Meals />} />
              <Route path="/progress" element={<Progress />} />
            </Route>

            {/* Auth routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<AuthForm />} />
              <Route path="signup" element={<AuthForm />} />
              <Route index element={<Navigate to="/auth/login" replace />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

          {/* Global toast container for notifications */}
          <Toaster />
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
