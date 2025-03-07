
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import Questionnaire from "./pages/Questionnaire";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import TermsAndConditions from "./pages/TermsAndConditions";
import PropertyDetails from "./pages/PropertyDetails";
import Subscription from "./pages/Subscription";
import AIGuardian from "./pages/AIGuardian";
import EmailPreferences from "./pages/EmailPreferences";
import ProfileSettings from "./pages/ProfileSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <Helmet>
          <title>SunnyHomeFinder | Find Your Dream Property in Spain</title>
          <meta name="description" content="AI-powered property search and relocation assistance for Spain" />
        </Helmet>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/questionnaire" element={<Questionnaire />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/ai-guardian" element={<AIGuardian />} />
              <Route path="/email-preferences" element={<EmailPreferences />} />
              <Route path="/profile-settings" element={<ProfileSettings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
