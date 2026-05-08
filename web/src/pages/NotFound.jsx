import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-art py-32 text-center">
      <p className="font-serif text-7xl text-gold">404</p>
      <h1 className="font-serif text-3xl mt-4">Cette page est introuvable</h1>
      <p className="mt-4 text-fg/65">Le lien est peut-être obsolète ou la page n'existe plus.</p>
      <Link to="/" className="btn-gold mt-10">← Retour à l'accueil</Link>
    </div>
  );
}
