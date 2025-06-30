Voici une **structure détaillée pour le devis du projet** :

- **Frontend** : Vanilla JS + Vite (pour la modernité et la performance).
- **Backend** : Node.js (API REST).
- **Fonctionnalités** : Catalogue produits, panier, profils utilisateurs, paiement (Stripe ou autre).

---

## **1. Présentation du Projet**

**Objectif** : Développer une plateforme e-commerce minimaliste avec :

- **Frontend** rapide et moderne (Vanilla JS + Vite).
- **Backend** scalable (Node.js + Express).
- **Base de données** : (Pas de database) utilisation de Objets JSON

---

## **2. Architecture Technique**

### **Frontend (Vanilla JS + Vite)**

- **Bundler** : Vite (HMR, optimisations).
- **Structure des fichiers** :
  ```
  /src
    /assets       # Images, CSS
    /components   # Composants réutilisables (header, cart, etc.)
    /pages        # Vues (Home, Product, Checkout)
    /services     # Appels API (fetch vers le backend)
    /utils        # Helpers (formatters, auth, etc.)
  ```

### **Backend (Node.js)**

- **Framework** : Express.js.
- **Structure des fichiers** :
  ```
  /src
    /controllers  # Logique métier (products, users, orders)
    /routes       # Routes API (/api/products, /api/users)
    /middlewares  # Auth, validation, etc.
    /config       # DB, Stripe, etc.
  ```

### **Paiement**

- **Solution** : Stripe (ou PayPal).
- **Flow** :
  1. Client valide le panier → Création d’une session Stripe.
  2. Redirection vers Stripe pour paiement.
  3. Webhook Stripe → Confirmation de commande.

---

## **3. Fonctionnalités Détailées**

### **A. Frontend**

| Fonctionnalité         | Description                                        | Temps (jours) |
| ---------------------- | -------------------------------------------------- | ------------- |
| **Catalogue Produits** | Liste dynamique, filtres, fiche produit détaillée. | 3             |
| **Panier**             | Ajout/retrait, quantité, calcul du total.          | 2             |
| **Checkout**           | Formulaire + intégration Stripe.                   | 3             |
| **Compte Utilisateur** | Inscription, connexion, historique de commandes.   | 4             |

### **B. Backend**

| Fonctionnalité       | Description                            | Temps (jours) |
| -------------------- | -------------------------------------- | ------------- |
| **API Produits**     | CRUD + recherche.                      | 2             |
| **API Panier**       | Gestion session utilisateur/guest.     | 2             |
| **API Paiement**     | Création de sessions Stripe, webhooks. | 3             |
| **Authentification** | JWT, sécurité (bcrypt, rate limiting). | 3             |

---

## **4. Livrables**

- **Code source** (Frontend + Backend) sur dépôt Git privé.
- **Documentation** :
  - Setup local (README.md).
  - API specs (Postman/OpenAPI).
- **Déploiement** :
  - Frontend : Vercel/Netlify.
  - Backend : Render/AWS.

---

## **5. Estimation des Coûts LOL**

| Poste                   | Temps (jours) | Coût ($CAD$/jour) | Total ($CAD) |
| ----------------------- | ------------- | ----------------- | ------------ |
| **Frontend**            | 14            | 500               | 11 000       |
| **Backend**             | 12            | 500               | 9 000        |
| **UI/UX**               | 5             | 400               | 4 000        |
| **Tests & Déploiement** | 3             | 500               | 2 700        |
| **Total HT**            |               |                   | **26 700**   |
| **TVA (20%)**           |               |                   | 5 100        |
| **Total TTC**           |               |                   | **31 800**   |

---

## **6. Planning Prévisionnel**

| Phase                   | Durée          |
| ----------------------- | -------------- |
| **Cours**               | 4 semaine      |
| **Développement**       | 4 semaines     |
| **Tests & Corrections** | 1 semaine      |
| **Livraison**           | 1 semaine      |
| **Total**               | **6 semaines** |

---

### **Pourquoi Ce Choix Technologique ?**

- **Vite** : Build ultra-rapide, meilleur DX que Webpack.
- **Vanilla JS** : Évite la surcharge de frameworks pour un petit projet.
- **Node.js** : Asynchrone, idéal pour les APIs.

---
