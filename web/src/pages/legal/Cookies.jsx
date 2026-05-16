import { Seo } from '@/hooks/useSeo';

export default function Cookies() {
  return (
    <>
      <Seo
        title="Politique des cookies"
        description="Comment Lartiska utilise les cookies et le stockage local."
        path="/cookies"
      />
      <h2>Qu'est-ce qu'un cookie ?</h2>
      <p>
        Un cookie est un petit fichier texte déposé sur votre appareil par les sites que vous visitez. Il permet
        de vous reconnaître lors de visites suivantes, de mémoriser vos préférences ou de mesurer l'audience.
        Lartiska utilise très peu de cookies et aucun à des fins publicitaires.
      </p>

      <h2>Cookies et stockage local utilisés</h2>

      <h3>Strictement nécessaires</h3>
      <p>
        Ces données techniques sont indispensables au fonctionnement du site. Aucun consentement n'est requis
        pour leur usage car ils ne servent qu'à vous fournir le service demandé.
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.3)' }}>
            <th style={{ textAlign: 'left', padding: '8px 4px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#D4AF37' }}>Nom</th>
            <th style={{ textAlign: 'left', padding: '8px 4px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#D4AF37' }}>Type</th>
            <th style={{ textAlign: 'left', padding: '8px 4px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#D4AF37' }}>Durée</th>
            <th style={{ textAlign: 'left', padding: '8px 4px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#D4AF37' }}>But</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
            <td style={{ padding: '10px 4px', fontFamily: 'monospace', fontSize: '12px' }}>lartiska_token</td>
            <td style={{ padding: '10px 4px' }}>localStorage</td>
            <td style={{ padding: '10px 4px' }}>Session</td>
            <td style={{ padding: '10px 4px' }}>Vous maintenir connecté à votre espace</td>
          </tr>
          <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
            <td style={{ padding: '10px 4px', fontFamily: 'monospace', fontSize: '12px' }}>lartiska_theme</td>
            <td style={{ padding: '10px 4px' }}>localStorage</td>
            <td style={{ padding: '10px 4px' }}>Permanent</td>
            <td style={{ padding: '10px 4px' }}>Mémoriser votre préférence clair/sombre</td>
          </tr>
          <tr>
            <td style={{ padding: '10px 4px', fontFamily: 'monospace', fontSize: '12px' }}>lartiska_claim_message</td>
            <td style={{ padding: '10px 4px' }}>sessionStorage</td>
            <td style={{ padding: '10px 4px' }}>Onglet ouvert</td>
            <td style={{ padding: '10px 4px' }}>Notification temporaire après inscription</td>
          </tr>
        </tbody>
      </table>

      <h3>Mesure d'audience</h3>
      <p>
        Lartiska n'utilise <strong>aucun</strong> outil de tracking publicitaire (Google Analytics, Facebook Pixel,
        etc.). Si une mesure d'audience est mise en place plus tard, elle sera anonymisée et fera l'objet d'un
        consentement explicite.
      </p>

      <h2>Comment refuser ou supprimer ces données</h2>
      <p>
        Vous pouvez à tout moment :
      </p>
      <ul>
        <li>Vous déconnecter de votre espace (supprime le token)</li>
        <li>Vider le localStorage et les cookies de votre navigateur (Paramètres → Confidentialité)</li>
        <li>Naviguer en mode privé / incognito (aucune donnée n'est conservée à la fermeture)</li>
      </ul>
      <p>
        Note : sans le token de session, vous serez déconnecté à chaque visite. La perte des préférences de thème
        n'affecte pas le fonctionnement du site.
      </p>

      <h2>Services tiers</h2>
      <p>
        Certaines actions sur le site déclenchent une ouverture vers des services externes qui ont leur propre
        politique de cookies :
      </p>
      <ul>
        <li><strong>WhatsApp</strong> (wa.me) — quand vous cliquez sur un lien WhatsApp</li>
        <li><strong>Google Fonts</strong> — chargement des polices Cormorant Garamond et DM Sans (sans cookies)</li>
        <li><strong>api.qrserver.com</strong> — génération du QR code WhatsApp affiché sur la page Contact</li>
      </ul>

      <p className="text-fg/55 text-sm mt-12">
        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}.
      </p>
    </>
  );
}
