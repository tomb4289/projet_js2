export default class ECommerce {
  constructor() {
    this.utilisateurs = new Map(); // { userId: User }
    this.inventaire = new Inventaire();
    this.paniers = new Map(); // { userId: Panier }
    this.commandes = new Map(); // { commandeId: Commande }
    this.factures = new Map(); // { factureId: Facture }
  }

  // Inscription utilisateur
  inscrireUtilisateur = (nom, email, role = "client") => {
    if (!User.validerEmail(email)) {
      throw new Error("Email invalide");
    }

    const id = `user-${Date.now()}`;
    const nouvelUtilisateur =
      role === "admin"
        ? new Admin(id, nom, email)
        : new User(id, nom, email, role);

    this.utilisateurs.set(id, nouvelUtilisateur);
    this.paniers.set(id, new Panier(id));
    return nouvelUtilisateur;
  };

  // Ajouter au panier
  ajouterAuPanier = (userId, produitId, quantite = 1) => {
    const panier = this.paniers.get(userId);
    const produit = this.inventaire.produits.get(produitId);

    if (!panier || !produit) return false;

    return panier.ajouterArticle(produit, quantite);
  };

  // Passer commande
  passerCommande = (userId) => {
    const panier = this.paniers.get(userId);
    const utilisateur = this.utilisateurs.get(userId);

    if (!panier || !utilisateur || panier.articles.size === 0) {
      return null;
    }

    const commande = panier.passerCommande(utilisateur, this.inventaire);
    this.commandes.set(commande.id, commande);

    const facture = commande.genererFacture(utilisateur, this.inventaire);
    this.factures.set(facture.id, facture);

    return { commande, facture };
  };

  // Obtenir les commandes d'un utilisateur
  getCommandesUtilisateur = (userId) => {
    return Array.from(this.commandes.values())
      .filter((cmd) => cmd.utilisateurId === userId)
      .sort((a, b) => b.dateCommande - a.dateCommande);
  };

  // Recherche de produits
  rechercherProduits = (term) => {
    return this.inventaire.rechercherProduits(term);
  };

  sauvegarderEtat() {
    const etat = {
      utilisateurs: Array.from(this.utilisateurs.values()).map((u) =>
        u.toJSON()
      ),
      produits: Array.from(this.inventaire.produits.values()).map((p) =>
        p.toJSON()
      ),
      paniers: Array.from(this.paniers.values()).map((p) => p.toJSON()),
      commandes: Array.from(this.commandes.values()).map((c) => c.toJSON()),
      factures: Array.from(this.factures.values()).map((f) => f.toJSON()),
      _dateSauvegarde: new Date().toISOString(),
    };

    return JSON.stringify(etat, null, 2); // Le 2 est pour l'indentation
  }

  chargerEtat(jsonString) {
    const etat = JSON.parse(jsonString, ECommerce.reviver);

    // Réinitialiser les collections
    this.utilisateurs = new Map();
    this.inventaire = new Inventaire();
    this.paniers = new Map();
    this.commandes = new Map();
    this.factures = new Map();

    // Charger les utilisateurs
    etat.utilisateurs.forEach((userData) => {
      let user;
      if (userData.role === "admin") {
        user = new Admin(userData.id, userData.nom, userData.email);
      } else {
        user = new User(
          userData.id,
          userData.nom,
          userData.email,
          userData.role
        );
      }
      user.estActif = userData.estActif;
      user.dateInscription = new Date(userData.dateInscription);
      this.utilisateurs.set(user.id, user);
    });

    // Charger les produits
    etat.produits.forEach((produitData) => {
      const produit = new Produit(
        produitData.id,
        produitData.nom,
        produitData.prix,
        produitData.description,
        produitData.stock
      );
      produit.dateCreation = new Date(produitData.dateCreation);
      produit.estDisponible = produitData.estDisponible;
      this.inventaire.ajouterProduit(produit);
    });

    // Charger les paniers
    etat.paniers.forEach((panierData) => {
      const panier = new Panier(panierData.utilisateurId);
      panier.articles = new Map(panierData.articles); // Reconstruire la Map
      panier.dateCreation = new Date(panierData.dateCreation);
      panier.estActif = panierData.estActif;
      this.paniers.set(panierData.utilisateurId, panier);
    });

    // Charger les commandes et factures (similaire)
    // ... implémentation similaire pour les autres collections ...
  }

  static reviver(key, value) {
    if (
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)
    ) {
      return new Date(value);
    }

    if (value && value._type === "Map" && Array.isArray(value.data)) {
      return new Map(value.data);
    }

    return value;
  }
}
