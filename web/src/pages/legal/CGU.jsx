import { Seo } from '@/hooks/useSeo';

export default function CGU() {
  return (
    <>
      <Seo
        title="Conditions générales d'utilisation"
        description="Conditions d'utilisation du site Lartiska et des services proposés."
        path="/cgu"
      />
      <h2>1. Objet</h2>
      <p>
        Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du site
        <strong> lartiska.com</strong> ainsi que des services proposés par Lartiska (demande de devis,
        consultation portfolio, espace client). En accédant au site, vous acceptez sans réserve les présentes CGU.
      </p>

      <h2>2. Description des services</h2>
      <p>Le site Lartiska propose :</p>
      <ul>
        <li>Une vitrine présentant les réalisations et services de Lartiska</li>
        <li>Un formulaire de demande de devis en ligne</li>
        <li>Un espace client pour suivre ses demandes et accepter/refuser les devis</li>
        <li>Un contact direct WhatsApp / téléphone / email</li>
      </ul>

      <h2>3. Création de compte</h2>
      <p>
        L'inscription au site est gratuite. Pour créer un compte vous devez :
      </p>
      <ul>
        <li>Être majeur ou avoir l'autorisation d'un représentant légal</li>
        <li>Fournir des informations exactes et à jour</li>
        <li>Choisir un mot de passe d'au moins 8 caractères</li>
        <li>Conserver vos identifiants confidentiels</li>
      </ul>
      <p>
        Vous êtes responsable de toute activité réalisée sous votre compte. En cas d'usage frauduleux,
        contactez-nous immédiatement.
      </p>

      <h2>4. Demandes de devis</h2>
      <p>
        Les estimations affichées sur le site (fourchettes de prix par service) sont <strong>indicatives</strong> et
        ne constituent pas un engagement contractuel. Seul le devis officiel signé entre les parties fait foi.
      </p>
      <p>
        Un devis émis par Lartiska est <strong>valable 30 jours</strong> à compter de sa date d'émission. Passé ce
        délai, les conditions tarifaires peuvent être révisées.
      </p>
      <p>
        Un acompte de 40% du montant total est demandé à la signature, le solde étant dû à la livraison du chantier.
      </p>

      <h2>5. Garanties Lartiska</h2>
      <p>
        Chaque réalisation bénéficie d'une garantie d'un an sur les finitions à compter de la date de livraison.
        En cas de défaut imputable à Lartiska (matière, exécution), nous procédons à la retouche sans frais.
      </p>
      <p>
        Sont exclus de la garantie : l'usure normale, les dommages causés par un tiers, les modifications apportées
        par le client après livraison, et les événements de force majeure (incendie, inondation, etc.).
      </p>

      <h2>6. Propriété intellectuelle</h2>
      <p>
        Les œuvres réalisées par Lartiska (fresques, mosaïques, designs originaux) restent la <strong>propriété
        intellectuelle de l'artiste Tounkara</strong>. Le client acquiert le droit d'usage et de jouissance de
        l'œuvre dans son espace, mais ne peut la reproduire à des fins commerciales sans autorisation écrite.
      </p>
      <p>
        Lartiska conserve le droit de photographier et de diffuser les réalisations dans son portfolio et ses
        communications, sauf demande contraire explicite du client.
      </p>

      <h2>7. Comportement de l'utilisateur</h2>
      <p>
        Il est interdit d'utiliser le site pour :
      </p>
      <ul>
        <li>Soumettre de fausses demandes ou tester abusivement le formulaire</li>
        <li>Tenter d'accéder à des espaces réservés sans autorisation</li>
        <li>Reproduire ou copier le design, le code source ou les contenus du site</li>
        <li>Téléverser des contenus illégaux, offensants ou contraires aux bonnes mœurs</li>
      </ul>

      <h2>8. Disponibilité du service</h2>
      <p>
        Nous nous efforçons d'assurer la disponibilité du site 24h/24, mais ne pouvons garantir une absence totale
        d'interruption (maintenance, panne d'hébergeur, etc.). Aucune compensation ne peut être réclamée en cas
        d'indisponibilité temporaire.
      </p>

      <h2>9. Modification des CGU</h2>
      <p>
        Lartiska se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs sont invités
        à les consulter régulièrement. La date de dernière mise à jour figure en bas de page.
      </p>

      <h2>10. Droit applicable</h2>
      <p>
        Les présentes CGU sont régies par le droit sénégalais. Tout litige relatif à leur interprétation ou leur
        exécution relève de la compétence exclusive des tribunaux de Dakar, sauf disposition impérative contraire.
      </p>

      <p className="text-fg/55 text-sm mt-12">
        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}.
      </p>
    </>
  );
}
