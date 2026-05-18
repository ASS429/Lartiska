import { Link } from 'react-router-dom';
import { Seo } from '@/hooks/useSeo';

export default function NotFound() {
  return (
    <div className="container-art min-h-[70vh] py-24 grid place-items-center">
      <Seo title="Page introuvable" description="Cette page n'existe pas ou plus." path="/404" />

      <div className="text-center max-w-xl">
        <p className="font-serif text-[88px] sm:text-[120px] md:text-[180px] leading-none gold-em" style={{ letterSpacing: '-0.05em' }}>
          404
        </p>
        <p className="eyebrow-deco mt-4">
          <span className="text-gold">✦</span> Page perdue dans l'atelier <span className="text-gold">✦</span>
        </p>
        <h1 className="font-serif text-3xl md:text-5xl font-light leading-tight mt-6">
          Cette toile n'existe <em className="gold-em">plus.</em>
        </h1>
        <p className="mt-5 text-fg/85 leading-relaxed">
          Le lien que vous avez suivi est peut-être obsolète, ou la page a été déplacée pendant nos travaux.
          Reprenez le chemin par l'accueil ou explorez nos réalisations.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-gold">Retour à l'accueil</Link>
          <Link to="/portfolio" className="btn-ghost">Voir le portfolio →</Link>
        </div>
      </div>
    </div>
  );
}
