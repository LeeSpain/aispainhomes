
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import PreDeployment from './pages/PreDeployment';
import PropertyDetails from './pages/PropertyDetails';
import Questionnaire from './pages/Questionnaire';
import Subscription from './pages/Subscription';
import PasswordRecovery from './pages/PasswordRecovery';
import ProfileSettings from './pages/ProfileSettings';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import EmailPreferences from './pages/EmailPreferences';
import AIGuardian from './pages/AIGuardian';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';
import ServerError from './pages/ServerError';
import Navbar from './components/common/navbar/Navbar';
import Footer from './components/common/Footer';
import CookieConsent from './components/common/CookieConsent';
import ScrollToTop from './components/common/ScrollToTop';
import SiteTracking from './pages/SiteTracking';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/pre-deployment" element={<PreDeployment />} />
              <Route path="/site-tracking" element={<SiteTracking />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
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
          <Footer />
          <Toaster />
          <CookieConsent />
          <ScrollToTop />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
