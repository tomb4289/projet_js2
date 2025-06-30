export default class Facture {
  constructor(commandeId, utilisateur, commande, inventaire) {
    this.id = `fact-${Date.now()}`;
    this.commandeId = commandeId;
    this.utilisateur = utilisateur;
    this.dateCreation = new Date();
    this.montantTotal = commande.montantTotal;
    this.articles = this.genererDetailsArticles(commande, inventaire);
  }

  // Générer les détails des articles
  genererDetailsArticles = (commande, inventaire) => {
    const details = [];
    commande.articles.forEach((quantite, produitId) => {
      const produit = inventaire.produits.get(produitId);
      if (produit) {
        details.push({
          nom: produit.nom,
          prixUnitaire: produit.prix,
          quantite,
          total: produit.prix * quantite,
        });
      }
    });
    return details;
  };

  // Méthode pour afficher la facture
  afficherFacture = () => {
    return {
      id: this.id,
      client: `${this.utilisateur.nom} (${this.utilisateur.email})`,
      date: this.dateCreation.toLocaleDateString(),
      articles: this.articles,
      total: this.montantTotal,
      tva: parseFloat((this.montantTotal * 0.2).toFixed(2)), // 20% de TVA
      totalTTC: parseFloat((this.montantTotal * 1.2).toFixed(2)),
    };
  };
}
