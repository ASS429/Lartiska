import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppButton } from './WhatsAppButton';
import { PaintDrops } from './PaintDrops';
import { PageEnterWipe } from './PageEnterWipe';
import { BusinessSchema } from '@/components/seo/BusinessSchema';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* JSON-LD sitewide LocalBusiness pour Google */}
      <BusinessSchema />
      <PaintDrops />
      <Navbar />
      <main className="flex-1 pt-20 relative z-[2]">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <PageEnterWipe />
    </div>
  );
}
