import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { useAuthStore } from '@/store/auth';

import Home from '@/pages/Home';
import Services from '@/pages/Services';
import Portfolio from '@/pages/Portfolio';
import ProjectDetail from '@/pages/ProjectDetail';
import Devis from '@/pages/Devis';
import Contact from '@/pages/Contact';
import About from '@/pages/About';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import FAQ from '@/pages/FAQ';
import NotFound from '@/pages/NotFound';

// ── Code-splitting : un visiteur public ne télécharge ni le back-office
//    ni les pages légales — chunks séparés chargés à la demande.
const LegalLayout = lazy(() => import('@/pages/legal/LegalLayout').then((m) => ({ default: m.LegalLayout })));
const MentionsLegales = lazy(() => import('@/pages/legal/MentionsLegales'));
const Confidentialite = lazy(() => import('@/pages/legal/Confidentialite'));
const CGU = lazy(() => import('@/pages/legal/CGU'));
const Cookies = lazy(() => import('@/pages/legal/Cookies'));

const Account = lazy(() => import('@/pages/account/Account'));
const AccountQuoteDetail = lazy(() => import('@/pages/account/QuoteDetail'));

const AdminLayout = lazy(() => import('@/components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminQuotes = lazy(() => import('@/pages/admin/Quotes'));
const AdminQuoteDetail = lazy(() => import('@/pages/admin/QuoteDetail'));
const AdminMessages = lazy(() => import('@/pages/admin/Messages'));
const AdminProjects = lazy(() => import('@/pages/admin/Projects'));
const AdminProjectForm = lazy(() => import('@/pages/admin/ProjectForm'));
const AdminServices = lazy(() => import('@/pages/admin/Services'));
const AdminTestimonials = lazy(() => import('@/pages/admin/Testimonials'));
const AdminSettings = lazy(() => import('@/pages/admin/Settings'));

function PageFallback() {
  return (
    <div className="min-h-[40vh] grid place-items-center">
      <p className="text-fg/55 text-sm tracking-widest uppercase animate-pulse">Chargement…</p>
    </div>
  );
}

export default function App() {
  const { status, hydrate } = useAuthStore();

  useEffect(() => {
    if (status === 'idle') hydrate();
  }, [status, hydrate]);

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/:slug" element={<ProjectDetail />} />
          <Route path="devis" element={<Devis />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="faq" element={<FAQ />} />

          {/* Pages légales (sous /legal-layout, mais URL directes) */}
          <Route element={<LegalLayout />}>
            <Route path="mentions-legales" element={<MentionsLegales />} />
            <Route path="confidentialite" element={<Confidentialite />} />
            <Route path="cgu" element={<CGU />} />
            <Route path="cookies" element={<Cookies />} />
          </Route>

          <Route element={<RequireAuth role="client" />}>
            <Route path="account" element={<Account />} />
            <Route path="account/quotes/:id" element={<AccountQuoteDetail />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<RequireAuth role="admin" />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="projects/new" element={<AdminProjectForm />} />
            <Route path="projects/:id" element={<AdminProjectForm />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="quotes" element={<AdminQuotes />} />
            <Route path="quotes/:id" element={<AdminQuoteDetail />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
