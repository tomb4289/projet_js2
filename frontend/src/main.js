import "./assets/styles/styles.scss";
import "./main.scss";
import { produits } from "../data/products.js";

const content = document.querySelector(".site-main-content");

const displayProduits = () => {
  const productsContainer = document.createElement("div");
  productsContainer.className = "movie-list";
  const products = produits.map((produit, index) =>
    createProductElement(produit, index)
  );

  productsContainer.append(...products);
  content.append(productsContainer);
};

const createProductElement = (produit, index) => {
  const a = document.createElement("a");
  a.className = "movie-card";
  a.href = `/produit/produit.html?id=${produit.id}`;
  a.innerHTML = `
    <img src="${produit.poster}" alt="${
    produit.title
  }" class="movie-card__poster">
    <div class="movie-card__content">
      <h2 class="movie-card__title">${produit.title}</h2>
      <p class="movie-card__description">${produit.description.substring(
        0,
        100
      )}...</p>
      <div class="movie-card__meta">
        <span class="movie-card__release-date">Sortie: ${
          produit.release_date ? produit.release_date.substring(0, 4) : "N/A"
        }</span>
        <span class="movie-card__rating">⭐ ${produit.rating}/10</span>
      </div>
    </div>
  `;
  return a;
};

displayProduits();
