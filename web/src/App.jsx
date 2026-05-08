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
import NotFound from '@/pages/NotFound';

import Account from '@/pages/account/Account';

import AdminDashboard from '@/pages/admin/Dashboard';
import AdminQuotes from '@/pages/admin/Quotes';
import AdminQuoteDetail from '@/pages/admin/QuoteDetail';
import AdminMessages from '@/pages/admin/Messages';

export default function App() {
  const { status, hydrate } = useAuthStore();

  useEffect(() => {
    if (status === 'idle') hydrate();
  }, [status, hydrate]);

  return (
    <Routes>
      {/* Public routes */}
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

        {/* Client account (auth required) */}
        <Route element={<RequireAuth role="client" />}>
          <Route path="account" element={<Account />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin (auth + role=admin) */}
      <Route element={<RequireAuth role="admin" />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="quotes" element={<AdminQuotes />} />
          <Route path="quotes/:id" element={<AdminQuoteDetail />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
      </Route>
    </Routes>
  );
}
