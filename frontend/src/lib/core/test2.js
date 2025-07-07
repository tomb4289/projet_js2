// Création et utilisation du système
const monMagasin = new ECommerce();

// Ajout de données
const admin = monMagasin.inscrireUtilisateur(
  "Admin",
  "admin@boutique.com",
  "admin"
);
const produit = new Produit(
  "prod-1",
  "Ordinateur",
  999.99,
  "PC performant",
  10
);
admin.ajouterProduit(monMagasin.inventaire, produit);

// Sauvegarde
const sauvegardeJSON = monMagasin.sauvegarderEtat();
console.log(sauvegardeJSON);

// Pour sauvegarder dans localStorage
localStorage.setItem("ecommerce_sauvegarde", sauvegardeJSON);

// Pour charger plus tard
const sauvegardeChargee = localStorage.getItem("ecommerce_sauvegarde");
if (sauvegardeChargee) {
  const nouveauMagasin = new ECommerce();
  nouveauMagasin.chargerEtat(sauvegardeChargee);
  console.log(nouveauMagasin);
}
