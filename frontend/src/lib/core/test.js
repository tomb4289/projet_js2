import ECommerce from "./ECommerce";
import Produit from "./Produit";

// Initialisation du système
const monMagasin = new ECommerce();

// Création d'un admin
const admin = monMagasin.inscrireUtilisateur(
  "Admin",
  "admin@boutique.com",
  "admin"
);

// Ajout de produits
const produit1 = new Produit(
  "prod-1",
  "Ordinateur Portable",
  999.99,
  "PC haute performance",
  10
);
const produit2 = new Produit(
  "prod-2",
  "Smartphone",
  699.99,
  "Dernier modèle",
  15
);

admin.ajouterProduit(monMagasin.inventaire, produit1);
admin.ajouterProduit(monMagasin.inventaire, produit2);

// Inscription d'un client
const client = monMagasin.inscrireUtilisateur(
  "Jean Dupont",
  "jean@exemple.com"
);

// Ajout au panier
monMagasin.ajouterAuPanier(client.id, produit1.id, 1);
monMagasin.ajouterAuPanier(client.id, produit2.id, 2);

// Passage de commande
const { commande, facture } = monMagasin.passerCommande(client.id);

// Affichage de la facture
console.log(facture.afficherFacture());
