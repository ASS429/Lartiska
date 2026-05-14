import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppButton } from './WhatsAppButton';
import { PaintDrops } from './PaintDrops';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <PaintDrops />
      <Navbar />
      <main className="flex-1 pt-20 relative z-[2]">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
