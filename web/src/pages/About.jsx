import { Link } from 'react-router-dom';
import { useSettings } from '@/hooks/useApi';

export default function About() {
  const { data: settings } = useSettings();
  const cities = settings?.['cities.served'] || ['Dakar', 'Thiès', 'Saint-Louis', 'Mbour', 'Banjul', 'Nouakchott'];

  return (
    <div className="container-art py-16 md:py-24">
      <header className="max-w-3xl">
        <p className="eyebrow mb-4">— À propos</p>
        <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight">
          L'art comme <em className="text-gold">manière de vivre</em><br />
          un espace.
        </h1>
        <p className="mt-6 text-fg/75 leading-relaxed text-lg">
          Lartiska est l'entreprise d'un artiste polyvalent, Tounkara — peintre, plafonneur, carreleur et designer d'intérieur. Spécialisée dans les créations uniques et innovantes, elle propose une gamme de prestations qu'on ne trouve nulle part ailleurs sur le marché.
        </p>
      </header>

      <section className="mt-20 grid md:grid-cols-3 gap-10">
        <div>
          <p className="font-serif text-5xl text-gold">01</p>
          <h2 className="font-serif text-2xl mt-3">Vision</h2>
          <p className="mt-3 text-fg/70 leading-relaxed">
            Transformer chaque mur, chaque plafond, chaque carreau en toile. Faire entrer l'art chez chacun, sans concession sur la matière, la couleur ou la finition.
          </p>
        </div>
        <div>
          <p className="font-serif text-5xl text-gold">02</p>
          <h2 className="font-serif text-2xl mt-3">Méthode</h2>
          <p className="mt-3 text-fg/70 leading-relaxed">
            Du croquis à la pose, chaque chantier est traité comme une pièce signature. Matériaux choisis, exécution patiente, finitions impeccables.
          </p>
        </div>
        <div>
          <p className="font-serif text-5xl text-gold">03</p>
          <h2 className="font-serif text-2xl mt-3">Présence</h2>
          <p className="mt-3 text-fg/70 leading-relaxed">
            Lartiska intervient à travers le Sénégal, la Gambie et la Mauritanie — résidences privées, espaces commerciaux, hôtels, restaurants.
          </p>
        </div>
      </section>

      <section className="mt-20 surface-card p-10">
        <p className="eyebrow mb-4">Villes servies</p>
        <ul className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <li key={city} className="px-4 py-2 rounded-full border border-line text-sm text-fg/85">{city}</li>
          ))}
        </ul>
      </section>

      <section className="mt-20 text-center">
        <p className="font-serif text-3xl md:text-4xl max-w-3xl mx-auto leading-tight">
          « Chaque espace mérite d'avoir sa propre <em className="text-gold">œuvre</em>. »
        </p>
        <p className="mt-3 text-fg/55 text-sm uppercase tracking-widest">— Tounkara, fondateur de Lartiska</p>

        <Link to="/devis" className="btn-gold mt-10">Lancer mon projet</Link>
      </section>
    </div>
  );
}
