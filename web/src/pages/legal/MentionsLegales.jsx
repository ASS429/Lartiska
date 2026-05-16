import { Seo } from '@/hooks/useSeo';

export default function MentionsLegales() {
  return (
    <>
      <Seo
        title="Mentions légales"
        description="Mentions légales de Lartiska — éditeur, hébergeur, propriété intellectuelle."
        path="/mentions-legales"
      />
      <h2>Éditeur du site</h2>
      <p>
        <strong>Lartiska</strong> — entreprise artisanale individuelle<br />
        Représentée par : Tounkara, fondateur et artiste<br />
        Adresse : Dakar, Sénégal<br />
        Email : <a href="mailto:contact@lartiska.com">contact@lartiska.com</a><br />
        Téléphone : <a href="tel:+221785446363">+221 78 544 63 63</a>
      </p>

      <h2>Hébergement</h2>
      <p>
        <strong>Site web</strong> : Render Inc. — 525 Brannan St, San Francisco, CA 94107, USA — <a href="https://render.com" target="_blank" rel="noreferrer">render.com</a><br />
        <strong>API / base de données</strong> : Railway Corp. — <a href="https://railway.app" target="_blank" rel="noreferrer">railway.app</a><br />
        <strong>Stockage médias</strong> : Cloudflare R2 — Cloudflare Inc., 101 Townsend St, San Francisco, CA 94107, USA
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus présents sur ce site (textes, photographies, vidéos, design, code source) est la
        propriété exclusive de Lartiska, sauf mention contraire. Toute reproduction, représentation ou exploitation,
        totale ou partielle, sans autorisation écrite préalable est interdite et constitue une contrefaçon sanctionnée
        par les articles L.335-2 et suivants du Code de la propriété intellectuelle français et leurs équivalents
        dans la législation sénégalaise.
      </p>

      <h2>Photographies des réalisations</h2>
      <p>
        Les photographies présentées dans le portfolio sont prises avec l'accord des clients concernés. Les visages
        et éléments permettant l'identification de tiers ont été retirés ou floutés. Si vous reconnaissez un projet
        sur lequel vous avez des droits et souhaitez son retrait, contactez-nous.
      </p>

      <h2>Limitation de responsabilité</h2>
      <p>
        Lartiska met tout en œuvre pour fournir des informations exactes et à jour. Toutefois, l'éditeur ne saurait
        être tenu responsable des inexactitudes ou omissions, ni des dommages directs ou indirects résultant de
        l'utilisation des informations présentes sur le site. Les estimations tarifaires affichées sont indicatives ;
        seul le devis signé fait foi.
      </p>

      <h2>Droit applicable</h2>
      <p>
        Les présentes mentions sont régies par le droit sénégalais. Tout litige sera porté devant les tribunaux
        compétents de Dakar.
      </p>

      <h2>Crédits</h2>
      <p>
        Conception et développement : équipe Lartiska. Typographies : Cormorant Garamond, DM Sans, Bebas Neue
        (Google Fonts). Icônes : Lucide / Ionicons.
      </p>

      <p className="text-fg/55 text-sm mt-12">
        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}.
      </p>
    </>
  );
}
