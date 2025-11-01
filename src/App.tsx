
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import PreDeployment from './pages/PreDeployment';
import PropertyDetails from './pages/PropertyDetails';
import PropertySearch from './pages/PropertySearch';
import Questionnaire from './pages/Questionnaire';
import Subscription from './pages/Subscription';
import PasswordRecovery from './pages/PasswordRecovery';
import ProfileSettings from './pages/ProfileSettings';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import EmailPreferences from './pages/EmailPreferences';
import AIGuardian from './pages/AIGuardian';
import Property from './pages/Property';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';
import ServerError from './pages/ServerError';
import Navbar from './components/common/navbar/Navbar';
import Footer from './components/common/Footer';
import CookieConsent from './components/common/CookieConsent';
import ScrollToTop from './components/common/ScrollToTop';
import SiteTracking from './pages/SiteTracking';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Create a version of Dashboard that doesn't check for authentication
const PublicDashboard = () => <Dashboard />;
const PublicAdminDashboard = () => <AdminDashboard />;

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<PublicDashboard />} />
          <Route path="/admin" element={<PublicAdminDashboard />} />
          <Route path="/pre-deployment" element={<PreDeployment />} />
          <Route path="/site-tracking" element={<SiteTracking />} />
          <Route path="/property-search" element={<PropertySearch />} />
          <Route path="/search" element={<PropertySearch />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/property" element={<Property />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/password-recovery" element={<PasswordRecovery />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/email-preferences" element={<EmailPreferences />} />
          <Route path="/ai-guardian" element={<AIGuardian />} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="/server-error" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      <Toaster />
      <CookieConsent />
      <ScrollToTop />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <AppContent />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
