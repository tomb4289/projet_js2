export default class Inventaire {
  constructor() {
    this.produits = new Map(); // Utilisation d'une Map pour stocker les produits par ID
  }

  // Ajouter un produit
  ajouterProduit = (produit) => {
    this.produits.set(produit.id, produit);
  };

  // Supprimer un produit
  supprimerProduit = (produitId) => {
    this.produits.delete(produitId);
  };

  // Rechercher des produits
  rechercherProduits = (term) => {
    return Array.from(this.produits.values()).filter(
      (produit) =>
        produit.nom.toLowerCase().includes(term.toLowerCase()) ||
        produit.description.toLowerCase().includes(term.toLowerCase())
    );
  };

  // Obtenir les produits disponibles
  getProduitsDisponibles = () => {
    return Array.from(this.produits.values()).filter((p) => p.estDisponible);
  };
}
