import { Seo } from '@/hooks/useSeo';

export default function Confidentialite() {
  return (
    <>
      <Seo
        title="Politique de confidentialité"
        description="Comment Lartiska collecte, utilise et protège vos données personnelles."
        path="/confidentialite"
      />
      <h2>Quelles données nous collectons</h2>
      <p>
        Lartiska collecte uniquement les données strictement nécessaires à la gestion de votre demande et au suivi
        de votre projet :
      </p>
      <ul>
        <li><strong>Identité</strong> : nom, prénom</li>
        <li><strong>Contact</strong> : email, téléphone, ville</li>
        <li><strong>Projet</strong> : description, surface, budget, adresse du chantier, photos de référence</li>
        <li><strong>Compte (si inscription)</strong> : email, téléphone, mot de passe (haché bcrypt)</li>
        <li><strong>Techniques</strong> : adresse IP, navigateur, événements admin (création/modification de devis)</li>
      </ul>

      <h2>Pourquoi nous les collectons</h2>
      <ul>
        <li>Traiter votre demande de devis et y répondre</li>
        <li>Vous envoyer le devis officiel par email</li>
        <li>Vous permettre d'accepter, refuser ou demander une modification depuis votre espace</li>
        <li>Améliorer la qualité du service (analyse anonyme de l'usage)</li>
        <li>Respecter nos obligations légales et comptables</li>
      </ul>

      <h2>Qui peut y accéder</h2>
      <p>
        Vos données sont accessibles à :
      </p>
      <ul>
        <li><strong>Tounkara</strong> et son équipe Lartiska, pour le traitement de votre projet</li>
        <li>
          <strong>Nos prestataires techniques</strong> qui hébergent les serveurs et le stockage :
          Render (hébergement web), Railway (API + base de données), Cloudflare (stockage des médias et PDF)
        </li>
      </ul>
      <p>
        Nous ne vendons ni ne louons jamais vos données à des tiers à des fins commerciales.
      </p>

      <h2>Combien de temps nous les gardons</h2>
      <ul>
        <li><strong>Demandes de devis non transformées</strong> : 3 ans</li>
        <li><strong>Devis acceptés / contrats</strong> : 10 ans (obligation comptable)</li>
        <li><strong>Compte client inactif</strong> : suppression après 5 ans sans connexion</li>
        <li><strong>Logs techniques</strong> : 6 mois maximum</li>
      </ul>

      <h2>Vos droits</h2>
      <p>
        Conformément à la loi sénégalaise sur la protection des données personnelles n° 2008-12 et au RGPD européen
        (si vous êtes citoyen de l'UE), vous disposez des droits suivants :
      </p>
      <ul>
        <li><strong>Accès</strong> : obtenir une copie de vos données</li>
        <li><strong>Rectification</strong> : corriger des données inexactes</li>
        <li><strong>Suppression</strong> : demander l'effacement de vos données</li>
        <li><strong>Portabilité</strong> : récupérer vos données dans un format lisible</li>
        <li><strong>Opposition</strong> : refuser certains traitements</li>
      </ul>
      <p>
        Pour exercer ces droits, contactez-nous à <a href="mailto:contact@lartiska.com">contact@lartiska.com</a>.
        Nous vous répondrons sous 30 jours.
      </p>

      <h2>Sécurité</h2>
      <p>
        Nous mettons en œuvre les mesures techniques et organisationnelles raisonnables pour protéger vos données :
      </p>
      <ul>
        <li>Chiffrement HTTPS de toutes les communications</li>
        <li>Mots de passe hachés en base de données (bcrypt)</li>
        <li>Fichiers privés (PDFs, photos chantier) stockés avec accès restreint et URLs signées</li>
        <li>Accès admin protégé par authentification forte</li>
        <li>Sauvegardes régulières</li>
      </ul>

      <h2>Cookies et traceurs</h2>
      <p>
        Voir notre <a href="/cookies">politique des cookies</a> dédiée.
      </p>

      <p className="text-fg/55 text-sm mt-12">
        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}.
      </p>
    </>
  );
}
