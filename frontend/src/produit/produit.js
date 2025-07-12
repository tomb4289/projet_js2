import "../assets/styles/styles.scss";
import "./produit.scss";
import { authService } from "../services/auth.js";
import { updateHeader } from "../components/header/header.js";

updateHeader();

const movieDetailContainer = document.getElementById("movieDetailContainer");
const messageArea = document.getElementById("messageArea");
const editMovieBtn = document.getElementById("editMovieBtn");
const deleteMovieBtn = document.getElementById("deleteMovieBtn");
const movieFormContainer = document.getElementById("movieFormContainer");
const movieForm = document.getElementById("movieForm");
const cancelEditFormBtn = document.getElementById("cancelEditFormBtn");

const movieIdInput = document.getElementById("movieId");
const titleInput = document.getElementById("title");
const posterInput = document.getElementById("poster");
const descriptionInput = document.getElementById("description");
const releaseDateInput = document.getElementById("release_date");
const ratingInput = document.getElementById("rating");

const API_URL = "http://localhost:5252/api/products";
let currentMovie = null;

const getMovieIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
};

const showMessage = (message, type = "success") => {
  messageArea.textContent = message;
  messageArea.className = `message-area ${type}`;
  setTimeout(() => {
    messageArea.textContent = "";
    messageArea.className = "message-area";
  }, 5000);
};

const displayMovie = (movie) => {
  if (!movie) {
    movieDetailContainer.innerHTML = "<p>Film non trouvé.</p>";
    return;
  }
  currentMovie = movie;

  movieDetailContainer.innerHTML = `
    <div class="card p-20 movie-details-card">
      <div class="movie-poster">
        <img src="${movie.poster}" alt="${movie.title}">
      </div>
      <div class="px-20 movie-info">
        <div class="release-year"><h2>${
          movie.release_date ? movie.release_date.substring(0, 4) : "N/A"
        }</h2></div>
        <div class="movie-title"><h1>${movie.title}</h1></div>
        <div class="movie-rating"><h3>Note: ${
          movie.rating || "N/A"
        }/10</h3></div>
        <div class="movie-description"><p>${movie.description}</p></div>
      </div>
    </div>
  `;
  movieDetailContainer.style.display = "block";
  movieFormContainer.classList.add("hidden");
};

const fetchMovie = async (id) => {
  if (!id) {
    showMessage("ID du film manquant dans l'URL.", "error");
    movieDetailContainer.innerHTML =
      "<p>ID du film manquant. Retour à l'accueil.</p>";
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);
    return;
  }
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        showMessage("Film non trouvé.", "error");
        movieDetailContainer.innerHTML =
          "<p>Ce film n'existe pas. Retour à l'accueil.</p>";
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 2000);
        return null;
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const movie = await response.json();
    displayMovie(movie);
    return movie;
  } catch (error) {
    console.error("Erreur lors du chargement du film:", error);
    showMessage(`Erreur lors du chargement du film: ${error.message}`, "error");
    movieDetailContainer.innerHTML =
      "<p>Erreur lors du chargement des détails du film.</p>";
    return null;
  }
};

const populateEditForm = (movie) => {
  movieIdInput.value = movie.id;
  titleInput.value = movie.title;
  posterInput.value = movie.poster;
  descriptionInput.value = movie.description;
  releaseDateInput.value = movie.release_date || "";
  ratingInput.value = movie.rating || "";
};

const showForm = () => {
  movieDetailContainer.style.display = "none";
  movieFormContainer.classList.remove("hidden");
  editMovieBtn.style.display = "none";
  deleteMovieBtn.style.display = "none";
};

const hideForm = () => {
  movieDetailContainer.style.display = "block";
  movieFormContainer.classList.add("hidden");
  editMovieBtn.style.display = "inline-block";
  deleteMovieBtn.style.display = "inline-block";
};

editMovieBtn.addEventListener("click", () => {
  if (currentMovie) {
    populateEditForm(currentMovie);
    showForm();
  } else {
    showMessage("Impossible de modifier: film non chargé.", "error");
  }
});

cancelEditFormBtn.addEventListener("click", () => {
  hideForm();
});

deleteMovieBtn.addEventListener("click", async () => {
  if (!currentMovie || !currentMovie.id) {
    showMessage("Impossible de supprimer: film non chargé.", "error");
    return;
  }

  if (
    confirm(
      `Êtes-vous sûr de vouloir supprimer le film "${currentMovie.title}" ?`
    )
  ) {
    try {
      const response = await fetch(`${API_URL}/${currentMovie.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      showMessage("Film supprimé avec succès !", "success");
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la suppression du film:", error);
      showMessage(`Erreur lors de la suppression: ${error.message}`, "error");
    }
  }
});

movieForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(movieForm);
  const updatedMovie = {};
  formData.forEach((value, key) => {
    if (key === "release_date" || key === "rating") {
      updatedMovie[key] = parseFloat(value) || 0;
    } else {
      updatedMovie[key] = value;
    }
  });

  const movieId = updatedMovie.id;

  try {
    const response = await fetch(`${API_URL}/${movieId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedMovie),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
    }

    const result = await response.json();
    showMessage("Film mis à jour avec succès !", "success");
    fetchMovie(movieId);
    hideForm();
  } catch (error) {
    console.error("Erreur lors de la mise à jour du film:", error);
    showMessage(`Erreur lors de la mise à jour: ${error.message}`, "error");
  }
});

const productId = getMovieIdFromUrl();
fetchMovie(productId);