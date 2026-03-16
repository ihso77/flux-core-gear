import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCartSync } from "@/hooks/useCartSync";
import { usePresenceTracker } from "@/hooks/useOnlineUsers";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AIChatWidget from "@/components/AIChatWidget";
import Index from "./pages/Index.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Profile from "./pages/Profile.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import About from "./pages/About.tsx";
import Collections from "./pages/Collections.tsx";
import Admin from "./pages/Admin.tsx";

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();
  const { user } = useAuth();
  
  // Track user presence for online users feature
  usePresenceTracker(user?.id);
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/admin" element={<Admin />} />
        {/* Product route - uses numeric ID */}
        <Route path="/product/:id" element={<ProductDetail />} />
        {/* 404 for all other routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AIChatWidget />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
