import "./assets/styles/styles.scss";
import "./main.scss";
import { env } from "./config/env.js";
import { Alert } from "./components/alert/index.js";
import { divRemove } from "./components/divRemove/index.js";

const content = document.querySelector(".content");

const displayProduits = (produits) => {
  const productsContainer = document.createElement("div");
  productsContainer.className = "products-container";
  const products = produits
    .slice(0)
    .reverse()
    .map((produit, index) => createProductElement(produit, index));

  productsContainer.append(...products);
  addEditDeleteEvents(productsContainer);
  content.append(productsContainer);
};

const createProductElement = (produit, index) => {
  const div = document.createElement("div");
  div.className = "product card overflow";
  div.innerHTML = `
    <i data-id=${produit.id}  class="x_delete fa-solid fa-trash"></i>
    <i data-id=${produit.id} class="x_edit fa-solid fa-pen-to-square"></i>
    <a href="/produit/produit.html?id=${produit.id}">
      <div class="product-container">
        <div class="overflow">
          <img src="${produit.image}" alt="${produit.nom}">
        </div>
        <h3 class="brand">${produit.maison}</h3>
        <h2 class="title">${produit.nom}</h2>
        <h2 class="price">${produit.prix}$</h2>
      </div>
    </a>
  `;
  return div;
};

const addEditDeleteEvents = (container) => {
  const deleteButtons = container.querySelectorAll(".fa-trash");
  const editButtons = container.querySelectorAll(".fa-pen-to-square");
  editButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const target = event.target;
      const productId = target.dataset.id;
      window.location.assign(`/form/form.html?id=${productId}`);
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      try {
        const confirm = await Alert.confirm(
          "Cette action est irréversible. Désirez-vous continuer ?",
          "Supprimer",
          "Annuler"
        );
        if (confirm) {
          const target = event.target;
          const productId = target.dataset.id;
          const response = await fetch(
            `${env.BACKEND_PRODUCTS_URL}/${productId}`,
            {
              method: "DELETE",
            }
          );
          const body = await response.json();
          divRemove(".products-container");
          fetchProduits();
        }
      } catch (e) {
        console.log("e : ", e);
      }
    });
  });
};
console.log("Toutes les variables Vite :", import.meta.env);
const fetchProduits = async () => {
  try {
    const response = await fetch(`${env.BACKEND_PRODUCTS_URL}`);
    let produits = await response.json();
    if (!Array.isArray(produits)) {
      produits = [produits];
    }
    displayProduits(produits);
  } catch (e) {
    console.log("e : ", e);
  }
};

fetchProduits();
