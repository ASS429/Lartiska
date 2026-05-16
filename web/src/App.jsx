import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AdminLayout } from '@/components/admin/AdminLayout';
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
import FAQ from '@/pages/FAQ';
import NotFound from '@/pages/NotFound';

import { LegalLayout } from '@/pages/legal/LegalLayout';
import MentionsLegales from '@/pages/legal/MentionsLegales';
import Confidentialite from '@/pages/legal/Confidentialite';
import CGU from '@/pages/legal/CGU';
import Cookies from '@/pages/legal/Cookies';

import Account from '@/pages/account/Account';
import AccountQuoteDetail from '@/pages/account/QuoteDetail';

import AdminDashboard from '@/pages/admin/Dashboard';
import AdminQuotes from '@/pages/admin/Quotes';
import AdminQuoteDetail from '@/pages/admin/QuoteDetail';
import AdminMessages from '@/pages/admin/Messages';
import AdminProjects from '@/pages/admin/Projects';
import AdminProjectForm from '@/pages/admin/ProjectForm';
import AdminServices from '@/pages/admin/Services';
import AdminTestimonials from '@/pages/admin/Testimonials';
import AdminSettings from '@/pages/admin/Settings';

export default function App() {
  const { status, hydrate } = useAuthStore();

  useEffect(() => {
    if (status === 'idle') hydrate();
  }, [status, hydrate]);

  return (
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
  );
}
