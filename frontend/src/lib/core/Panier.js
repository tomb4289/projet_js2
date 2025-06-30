export default class Panier {
  constructor(utilisateurId) {
    this.utilisateurId = utilisateurId;
    this.articles = new Map(); // { produitId: quantité }
    this.dateCreation = new Date();
    this.estActif = true;
  }

  // Ajouter un article
  ajouterArticle = (produit, quantite = 1) => {
    if (!produit.estDisponible || quantite > produit.stock) {
      console.log(
        `Produit ${produit.nom} non disponible en quantité suffisante`
      );
      return false;
    }

    const quantiteActuelle = this.articles.get(produit.id) || 0;
    this.articles.set(produit.id, quantiteActuelle + quantite);
    console.log(`${quantite} ${produit.nom} ajouté(s) au panier`);
    return true;
  };

  // Supprimer un article
  supprimerArticle = (produitId, quantite = 1) => {
    if (!this.articles.has(produitId)) return;

    const quantiteActuelle = this.articles.get(produitId);
    const nouvelleQuantite = quantiteActuelle - quantite;

    if (nouvelleQuantite <= 0) {
      this.articles.delete(produitId);
    } else {
      this.articles.set(produitId, nouvelleQuantite);
    }
  };

  // Vider le panier
  viderPanier = () => {
    this.articles.clear();
  };

  // Calculer le total
  calculerTotal = (inventaire) => {
    let total = 0;
    this.articles.forEach((quantite, produitId) => {
      const produit = inventaire.produits.get(produitId);
      if (produit) {
        total += produit.prix * quantite;
      }
    });
    return parseFloat(total.toFixed(2));
  };

  // Passer la commande
  passerCommande = (utilisateur, inventaire) => {
    const commande = new Commande(
      this.utilisateurId,
      new Map(this.articles), // Copie des articles
      this.calculerTotal(inventaire)
    );

    // Mettre à jour les stocks
    this.articles.forEach((quantite, produitId) => {
      const produit = inventaire.produits.get(produitId);
      if (produit) {
        produit.mettreAJourStock(-quantite);
      }
    });

    this.viderPanier();
    return commande;
  };

  toJSON() {
    return {
      _type: "Panier",
      utilisateurId: this.utilisateurId,
      articles: Array.from(this.articles.entries()), // Convertir Map en Array
      dateCreation: this.dateCreation.toISOString(),
      estActif: this.estActif,
    };
  }
}
