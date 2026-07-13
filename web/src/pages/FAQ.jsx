import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '@/hooks/useSeo';
import clsx from 'clsx';

const SECTIONS = [
  {
    title: 'Avant la commande',
    items: [
      {
        q: 'Comment se passe une demande de devis ?',
        a: "Vous remplissez le formulaire en 4 étapes (service, détails, coordonnées, récapitulatif). Tounkara reçoit votre demande immédiatement et revient vers vous sous 24h ouvrées avec un devis détaillé en PDF. Vous pouvez ensuite accepter, refuser ou demander une modification depuis votre espace.",
      },
      {
        q: 'Les prix affichés sur le site sont-ils définitifs ?',
        a: "Les fourchettes affichées sur la page Services sont indicatives. Le prix final dépend de la surface réelle, de la complexité, des matériaux choisis et de l'accessibilité du chantier. Seul le devis officiel signé fait foi.",
      },
      {
        q: 'Faut-il payer pour obtenir un devis ?',
        a: "Non, le devis est entièrement gratuit et sans engagement. Vous ne payez qu'après acceptation du devis et signature.",
      },
      {
        q: 'Dans quelles zones intervenez-vous ?',
        a: "Partout au Sénégal : où que soit votre chantier (Dakar, Thiès, Saint-Louis, Touba, Ziguinchor, Mbour ou ailleurs), nous venons. Pour les projets d'envergure, nous nous déplaçons aussi à l'international. D'éventuels frais de déplacement sont toujours indiqués clairement dans le devis.",
      },
    ],
  },
  {
    title: 'Pendant le chantier',
    items: [
      {
        q: 'Combien de temps dure un chantier type ?',
        a: "Cela dépend de la surface et de la complexité : une fresque murale prend 2 à 4 semaines, un plafond décoratif 1 à 3 semaines, un sol mosaïque 4 à 6 semaines. Le devis indique toujours une durée estimée. Nous travaillons à un rythme artisanal pour garantir la qualité.",
      },
      {
        q: 'Quels matériaux utilisez-vous ?',
        a: "Nous travaillons avec des matériaux haut de gamme : acryliques haute couvrance, dorures à la feuille (or 22 carats), zellige cuit, tesselles émaillées, plâtre fin, pigments minéraux. Tous les détails sont précisés dans le devis. Si vous avez une préférence particulière, nous nous adaptons.",
      },
      {
        q: 'Comment se passent les paiements ?',
        a: "40% d'acompte à la signature du devis, 60% à la livraison après validation conjointe. Paiements acceptés : virement bancaire, Wave, Orange Money, espèces (avec reçu).",
      },
      {
        q: 'Que faire si je veux modifier le projet en cours de chantier ?',
        a: "C'est possible. Un avenant est rédigé pour formaliser le changement et son impact sur le prix ou le délai. Nous privilégions toujours le dialogue.",
      },
    ],
  },
  {
    title: 'Après la livraison',
    items: [
      {
        q: 'Quelle garantie offrez-vous ?',
        a: "Chaque réalisation Lartiska bénéficie d'une garantie d'1 an sur les finitions à compter de la date de livraison. En cas de défaut imputable à notre travail (matière, exécution), nous procédons à la retouche sans frais. L'usure normale et les dommages d'un tiers ne sont pas couverts.",
      },
      {
        q: 'Puis-je faire repeindre / retoucher plus tard ?',
        a: "Bien sûr. Tounkara reste disponible pour entretenir ou enrichir une œuvre existante. Un devis dédié sera émis pour ces interventions.",
      },
      {
        q: 'Mes photos peuvent-elles apparaître dans votre portfolio ?',
        a: "Avec votre accord uniquement. Lors de la signature, vous indiquez si vous acceptez la diffusion (anonymisée ou non) de vos photos sur notre site, Instagram et autres canaux. Vous pouvez changer d'avis à tout moment.",
      },
    ],
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="container-art py-16 md:py-24">
      <Seo
        title="FAQ · Tarifs, délais, garanties peinture & carrelage Sénégal — Lartiska"
        description="Tout savoir sur Lartiska au Sénégal : devis gratuit, délais des chantiers (peinture, fresque, plafonnage, carrelage, epoxy résine, menuiserie), paiements (Wave, Orange Money), garantie 1 an. Intervention partout au Sénégal et à l'international."
        path="/faq"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'Comment se passe une demande de devis ?', acceptedAnswer: { '@type': 'Answer', text: 'Vous remplissez le formulaire en 4 étapes. Tounkara revient sous 24h ouvrées avec un devis PDF détaillé. Vous pouvez accepter, refuser ou demander une modification depuis votre espace.' } },
            { '@type': 'Question', name: 'Faut-il payer pour obtenir un devis ?', acceptedAnswer: { '@type': 'Answer', text: 'Non, le devis est entièrement gratuit et sans engagement. Vous ne payez qu\'après acceptation du devis et signature.' } },
            { '@type': 'Question', name: 'Dans quelles zones intervenez-vous ?', acceptedAnswer: { '@type': 'Answer', text: 'Partout au Sénégal, où que soit votre chantier. Pour les projets d\'envergure, Lartiska se déplace aussi à l\'international.' } },
            { '@type': 'Question', name: 'Quelle garantie offrez-vous ?', acceptedAnswer: { '@type': 'Answer', text: 'Chaque réalisation Lartiska bénéficie d\'une garantie d\'1 an sur les finitions. En cas de défaut imputable à notre travail, retouche sans frais.' } },
            { '@type': 'Question', name: 'Comment se passent les paiements ?', acceptedAnswer: { '@type': 'Answer', text: '40 % d\'acompte à la signature, 60 % à la livraison. Paiements acceptés : virement bancaire, Wave, Orange Money, espèces avec reçu.' } },
          ],
        }}
      />

      <header className="max-w-3xl mb-14">
        <p className="eyebrow mb-4">— FAQ</p>
        <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight">
          Questions <em className="gold-em">fréquentes</em>.
        </h1>
        <p className="mt-6 text-fg/85 leading-relaxed">
          On répond aux questions qu'on nous pose le plus souvent. Si la vôtre n'y est pas, écrivez-nous
          ou décrochez le téléphone.
        </p>
      </header>

      <div className="space-y-12 max-w-3xl">
        {SECTIONS.map((section, si) => (
          <section key={section.title}>
            <p className="eyebrow mb-4">{String(si + 1).padStart(2, '0')} — {section.title}</p>
            <div className="divide-y divide-line border-y border-line">
              {section.items.map((item, i) => {
                const id = `${si}-${i}`;
                const isOpen = openId === id;
                return (
                  <div key={id}>
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : id)}
                      className="w-full flex items-center justify-between gap-4 py-5 text-left hover:text-gold transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="font-serif text-lg md:text-xl flex-1">{item.q}</span>
                      <span className={clsx('text-gold text-2xl shrink-0 transition-transform', isOpen && 'rotate-45')}>
                        +
                      </span>
                    </button>
                    {isOpen && (
                      <div className="pb-6 text-fg/85 leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-20 surface-card p-10 text-center max-w-3xl">
        <p className="eyebrow mb-3">Une autre question ?</p>
        <h2 className="font-serif text-2xl md:text-3xl mb-6">On répond toujours sous 24h.</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/contact" className="btn-gold">Nous écrire</Link>
          <Link to="/devis" className="btn-ghost">Demander un devis</Link>
        </div>
      </div>
    </div>
  );
}
