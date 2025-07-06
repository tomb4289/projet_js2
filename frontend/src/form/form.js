import "./assets/styles/styles.scss";
import "./main.scss";
import { produits } from "../data/products.js";
import { env } from "../config/env.js";
import { Alert } from "../components/alert/index.js";

const content = document.querySelector(".site-main-content");

// Get movie ID from URL for editing
const getMovieIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
};

// Load movie data for editing
const loadMovieForEdit = async (movieId) => {
  if (!movieId) return;
  
  try {
    const response = await fetch(`${env.BACKEND_PRODUCTS_URL}/${movieId}`);
    if (!response.ok) {
      throw new Error("Film non trouvé");
    }
    const movie = await response.json();
    
    // Populate form fields
    document.getElementById("id").value = movie.id;
    document.getElementById("title").value = movie.title;
    document.getElementById("poster").value = movie.poster;
    document.getElementById("description").value = movie.description;
    document.getElementById("release_date").value = movie.release_date;
    document.getElementById("rating").value = movie.rating;
    
    // Update form title
    document.querySelector(".form__title").textContent = "Modifier le Film";
    document.querySelector('button[type="submit"]').textContent = "Mettre à jour";
    
  } catch (error) {
    Alert.error("Erreur lors du chargement du film: " + error.message);
    console.error("Erreur:", error);
  }
};

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

// Initialize form
const movieId = getMovieIdFromUrl();
if (movieId) {
  loadMovieForEdit(movieId);
}

displayProduits();