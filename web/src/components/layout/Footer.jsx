import { Link } from 'react-router-dom';
import { useSettings } from '@/hooks/useApi';

export function Footer() {
  const { data: settings } = useSettings();

  return (
    <footer className="relative mt-20 border-t border-line bg-ink/60">
      <div className="container-art py-16 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <Link to="/" className="font-serif text-3xl">
            <span className="text-fg">Lartis</span>
            <span className="text-gold italic">Ka</span>
          </Link>
          <p className="mt-4 text-sm text-fg/85 max-w-md leading-relaxed">
            {settings?.['company.tagline'] || "L'art qui transforme vos espaces."} Peinture, plafonnage, carrelage et décoration artistique. Sénégal · Gambie · Mauritanie.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4">Plateforme</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services" className="text-fg/85 hover:text-gold transition-colors">Services</Link></li>
            <li><Link to="/portfolio" className="text-fg/85 hover:text-gold transition-colors">Portfolio</Link></li>
            <li><Link to="/devis" className="text-fg/85 hover:text-gold transition-colors">Demander un devis</Link></li>
            <li><Link to="/about" className="text-fg/85 hover:text-gold transition-colors">À propos</Link></li>
            <li><Link to="/faq" className="text-fg/85 hover:text-gold transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Légal</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/mentions-legales" className="text-fg/85 hover:text-gold transition-colors">Mentions légales</Link></li>
            <li><Link to="/confidentialite" className="text-fg/85 hover:text-gold transition-colors">Confidentialité</Link></li>
            <li><Link to="/cgu" className="text-fg/85 hover:text-gold transition-colors">CGU</Link></li>
            <li><Link to="/cookies" className="text-fg/85 hover:text-gold transition-colors">Cookies</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Contact</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={`tel:${settings?.['contact.phone'] || '+221785446363'}`} className="text-fg/85 hover:text-gold transition-colors">
                {settings?.['contact.phone'] || '+221 78 544 63 63'}
              </a>
            </li>
            <li>
              <a href={`mailto:${settings?.['contact.email'] || 'contact@lartiska.com'}`} className="text-fg/85 hover:text-gold transition-colors">
                {settings?.['contact.email'] || 'contact@lartiska.com'}
              </a>
            </li>
            <li className="text-fg/75">{settings?.['contact.address'] || 'Dakar, Sénégal'}</li>
          </ul>

          <div className="mt-5 flex gap-3">
            {settings?.['social.instagram'] && (
              <a href={settings['social.instagram']} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-9 h-9 grid place-items-center rounded-full border border-line hover:border-gold hover:text-gold transition-colors">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="18" cy="6" r="1" fill="currentColor" /></svg>
              </a>
            )}
            {settings?.['social.tiktok'] && (
              <a href={settings['social.tiktok']} target="_blank" rel="noreferrer" aria-label="TikTok" className="w-9 h-9 grid place-items-center rounded-full border border-line hover:border-gold hover:text-gold transition-colors">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.84a8.16 8.16 0 0 0 4.77 1.52V6.92a4.85 4.85 0 0 1-1.84-.23z" /></svg>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-art py-5 text-xs text-fg/55 flex flex-col md:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} Lartiska — Tous droits réservés.</p>
          <p className="font-serif italic">L'art qui transforme vos espaces.</p>
        </div>
      </div>
    </footer>
  );
}
