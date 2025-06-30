export default class Commande {
  constructor(utilisateurId, articles, montantTotal) {
    this.id = `cmd-${Date.now()}`;
    this.utilisateurId = utilisateurId;
    this.articles = articles; // Map { produitId: quantité }
    this.montantTotal = montantTotal;
    this.dateCommande = new Date();
    this.statut = "en traitement"; // 'en traitement', 'expédiée', 'livrée', 'annulée'
  }

  // Mettre à jour le statut
  mettreAJourStatut = (nouveauStatut) => {
    const statutsValides = ["en traitement", "expédiée", "livrée", "annulée"];
    if (statutsValides.includes(nouveauStatut)) {
      this.statut = nouveauStatut;
      return true;
    }
    return false;
  };

  // Générer une facture
  genererFacture = (utilisateur, inventaire) => {
    return new Facture(this.id, utilisateur, this, inventaire);
  };
}
