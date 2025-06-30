export default class Admin extends User {
  constructor(id, nom, email) {
    super(id, nom, email, "admin");
    this.permissions = [
      "gérer_utilisateurs",
      "modifier_produits",
      "voir_statistiques",
    ];
  }

  // Méthode pour ajouter un produit
  ajouterProduit = (inventaire, produit) => {
    inventaire.ajouterProduit(produit);
    console.log(`${this.nom} a ajouté un nouveau produit: ${produit.nom}`);
  };

  // Méthode pour supprimer un produit
  supprimerProduit = (inventaire, produitId) => {
    inventaire.supprimerProduit(produitId);
    console.log(`${this.nom} a supprimé le produit ID: ${produitId}`);
  };
}
