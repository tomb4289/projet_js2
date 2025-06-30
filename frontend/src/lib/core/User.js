export default class User {
  constructor(id, nom, email, password, role = "client") {
    this.id = id;
    this.nom = nom;
    this.email = email;
    this.password = password;
    this.role = role; // 'client', 'admin', 'manager'
    this.estActif = true;
    this.dateInscription = new Date();
  }

  // Méthode pour mettre à jour le profil
  mettreAJourProfil = (nouveauxDetails) => {
    Object.assign(this, nouveauxDetails);
    console.log(`Profil de ${this.nom} mis à jour`);
  };

  // Méthode pour désactiver le compte
  desactiverCompte = () => {
    this.estActif = false;
    console.log(`Compte de ${this.nom} désactivé`);
  };

  // Méthode statique pour valider un email
  static validerEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  toJSON() {
    return {
      _type: "User",
      id: this.id,
      nom: this.nom,
      email: this.email,
      role: this.role,
      estActif: this.estActif,
      dateInscription: this.dateInscription.toISOString(),
    };
  }
}
