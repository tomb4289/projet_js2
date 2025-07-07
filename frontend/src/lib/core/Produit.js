export default class Produit {
  constructor(id, nom, maison, image, prix, description, stock = 0) {
    this.id = id;
    this.nom = nom;
    this.maison = maison;
    this.image = image;
    this.prix = prix;
    this.description = description;
    this.stock = stock;
    this.dateCreation = new Date();
    this.estDisponible = stock > 0;
  }

  // Mettre à jour le stock
  mettreAJourStock = (quantite) => {
    this.stock += quantite;
    this.estDisponible = this.stock > 0;
    console.log(`Stock de ${this.nom} mis à jour: ${this.stock}`);
  };

  // Appliquer une réduction
  appliquerReduction = (pourcentage) => {
    const nouveauPrix = this.prix * (1 - pourcentage / 100);
    this.prix = parseFloat(nouveauPrix.toFixed(2));
    console.log(
      `Réduction appliquée à ${this.nom}. Nouveau prix: ${this.prix}$`
    );
  };

  toJSON() {
    return {
      _type: "Produit",
      id: this.id,
      nom: this.nom,
      maison: this.maison,
      image: this.image,
      prix: this.prix,
      description: this.description,
      stock: this.stock,
      estDisponible: this.estDisponible,
      dateCreation: this.dateCreation.toISOString(),
    };
  }
}
