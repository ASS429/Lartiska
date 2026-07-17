import { Link } from 'react-router-dom';
import { useSettings } from '@/hooks/useApi';
import { PushBell } from '@/components/ui/PushBell';

export function Footer() {
  const { data: settings } = useSettings();

  return (
    <footer className="lartiska-footer relative mt-20 border-t border-line">
      <div className="container-art py-16 md:py-20 grid gap-12 md:gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <Link to="/" className="font-serif text-4xl md:text-5xl tracking-tight leading-none inline-block">
            <span className="text-fg">Lartis</span>
            <span className="gold-em">Ka</span>
          </Link>
          <p className="mt-5 text-base md:text-[17px] text-fg leading-[1.7] font-medium max-w-md">
            <em className="gold-em font-serif">L'art qui transforme vos espaces.</em>
            <br />
            <span className="text-fg/95">
              Second œuvre &amp; finitions d'art — peinture, menuiserie, carrelage, plafonnage.
              <br />
              Partout au Sénégal · et à l'international.
            </span>
          </p>
        </div>

        <div>
          <p className="footer-col-title">— Plateforme</p>
          <ul className="space-y-3 text-[15px]">
            <li><Link to="/services" className="footer-link">Services</Link></li>
            <li><Link to="/portfolio" className="footer-link">Portfolio</Link></li>
            <li><Link to="/devis" className="footer-link">Demander un devis</Link></li>
            <li><Link to="/about" className="footer-link">À propos</Link></li>
            <li><Link to="/faq" className="footer-link">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <p className="footer-col-title">— Légal</p>
          <ul className="space-y-3 text-[15px]">
            <li><Link to="/mentions-legales" className="footer-link">Mentions légales</Link></li>
            <li><Link to="/confidentialite" className="footer-link">Confidentialité</Link></li>
            <li><Link to="/cgu" className="footer-link">CGU</Link></li>
            <li><Link to="/cookies" className="footer-link">Cookies</Link></li>
          </ul>
        </div>

        <div>
          <p className="footer-col-title">— Contact</p>
          <ul className="space-y-3 text-[15px]">
            <li>
              <a
                href={`tel:${settings?.['contact.phone'] || '+221785446363'}`}
                className="footer-link tabular-nums tracking-tight"
              >
                {settings?.['contact.phone'] || '+221 78 544 63 63'}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${settings?.['contact.email'] || 'contact@lartiska.com'}`}
                className="footer-link break-all"
              >
                {settings?.['contact.email'] || 'contact@lartiska.com'}
              </a>
            </li>
            <li className="text-fg/90 font-medium">{settings?.['contact.address'] || 'Dakar, Sénégal'}</li>
          </ul>

          <div className="mt-6 flex gap-3">
            {settings?.['social.instagram'] && (
              <a href={settings['social.instagram']} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-10 h-10 grid place-items-center rounded-full border border-line text-fg hover:border-gold hover:text-gold transition-colors">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="18" cy="6" r="1" fill="currentColor" /></svg>
              </a>
            )}
            {settings?.['social.tiktok'] && (
              <a href={settings['social.tiktok']} target="_blank" rel="noreferrer" aria-label="TikTok" className="w-10 h-10 grid place-items-center rounded-full border border-line text-fg hover:border-gold hover:text-gold transition-colors">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.84a8.16 8.16 0 0 0 4.77 1.52V6.92a4.85 4.85 0 0 1-1.84-.23z" /></svg>
              </a>
            )}
            {settings?.['social.facebook'] && (
              <a href={settings['social.facebook']} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-10 h-10 grid place-items-center rounded-full border border-line text-fg hover:border-gold hover:text-gold transition-colors">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
            )}
            {settings?.['social.youtube'] && (
              <a href={settings['social.youtube']} target="_blank" rel="noreferrer" aria-label="YouTube" className="w-10 h-10 grid place-items-center rounded-full border border-line text-fg hover:border-gold hover:text-gold transition-colors">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><path d="m9.75 15.02 5.75-3.27-5.75-3.27z" fill="currentColor" stroke="none" /></svg>
              </a>
            )}
          </div>

          <div className="mt-5">
            <PushBell />
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-art py-6 text-[13px] text-fg flex flex-col md:flex-row justify-between gap-2 font-medium">
          <p className="text-fg/90">© {new Date().getFullYear()} <span className="text-fg font-semibold">Lartiska</span> — Tous droits réservés.</p>
          <p><em className="gold-em font-serif">L'art qui transforme vos espaces.</em></p>
        </div>
      </div>
    </footer>
  );
}
