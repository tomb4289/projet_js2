import "./assets/styles/styles.scss";
import { env } from "./config/env.js";
import { Alert } from "./components/alert/index.js";
import { divRemove } from "./components/divRemove/index.js";

const content = document.querySelector(".site-main-content");

const displayMovies = (movies) => {
  const moviesContainer = document.createElement("div");
  moviesContainer.className = "movie-list";
  const movieElements = movies
    .slice(0)
    .reverse()
    .map((movie, index) => createMovieElement(movie, index));

  moviesContainer.append(...movieElements);
  addEditDeleteEvents(moviesContainer);
  content.append(moviesContainer);
};

const createMovieElement = (movie, index) => {
  const div = document.createElement("div");
  div.className = "movie-card";
  div.innerHTML = `
    <i data-id="${movie.id}" class="x_delete fa-solid fa-trash"></i>
    <i data-id="${movie.id}" class="x_edit fa-solid fa-pen-to-square"></i>
    <a href="/src/produit/produit.html?id=${movie.id}">
      <img src="${movie.poster}" alt="${movie.title}" class="movie-card__poster">
      <div class="movie-card__content">
        <h2 class="movie-card__title">${movie.title}</h2>
        <p class="movie-card__description">${movie.description.substring(0, 100)}...</p>
        <div class="movie-card__meta">
          <span class="movie-card__release-date">Sortie: ${
            movie.release_date ? movie.release_date.substring(0, 4) : "N/A"
          }</span>
          <span class="movie-card__rating">⭐ ${movie.rating}/10</span>
        </div>
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
      event.preventDefault();
      const target = event.target;
      const movieId = target.dataset.id;
      window.location.assign(`/form/form.html?id=${movieId}`);
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      try {
        const confirm = await Alert.confirm(
          "Cette action est irréversible. Désirez-vous continuer ?",
          "Supprimer",
          "Annuler"
        );
        if (confirm) {
          const target = event.target;
          const movieId = target.dataset.id;
          const response = await fetch(
            `${env.BACKEND_PRODUCTS_URL}/${movieId}`,
            {
              method: "DELETE",
            }
          );
          const body = await response.json();
          divRemove(".movie-list");
          fetchMovies();
          Alert.success("Film supprimé avec succès!");
        }
      } catch (e) {
        console.log("Erreur lors de la suppression:", e);
        Alert.error("Erreur lors de la suppression du film");
      }
    });
  });
};

const fetchMovies = async () => {
  try {
    const response = await fetch(`${env.BACKEND_PRODUCTS_URL}`);
    let movies = await response.json();
    if (!Array.isArray(movies)) {
      movies = [movies];
    }
    displayMovies(movies);
  } catch (e) {
    console.log("Erreur lors du chargement des films:", e);
    Alert.error("Erreur lors du chargement des films");
  }
};

fetchMovies();