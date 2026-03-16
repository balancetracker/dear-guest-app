import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WeddingDataProvider } from "@/contexts/WeddingDataContext";
import InvitationPage from "./pages/InvitationPage";
import AdminDashboard from "./pages/AdminDashboard";
import AuthGuard from "./components/AuthGuard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <WeddingDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<InvitationPage />} />
            <Route path="/admin" element={<AuthGuard><AdminDashboard /></AuthGuard>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WeddingDataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
