import "../assets/styles/styles.scss";
import { env } from "../config/env.js";
import { Alert } from "../components/alert/index.js";
import { authService } from "../services/auth.js";
import { updateHeader } from "../components/header/header.js";

updateHeader();

if (!authService.isAdmin()) {
  Alert.error("Accès refusé. Droits administrateur requis.");
  setTimeout(() => {
    window.location.href = "/";
  }, 2000);
}

const form = document.querySelector("form");
const errorElement = document.querySelector("#errors");
let errors = [];

const getMovieIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
};

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
    
    document.querySelector(".form__title").textContent = "Modifier le Film";
    document.querySelector('button[type="submit"]').textContent = "Mettre à jour";
    
  } catch (error) {
    Alert.error("Erreur lors du chargement du film: " + error.message);
    console.error("Erreur:", error);
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const movie = Object.fromEntries(formData.entries());

  if (movie.rating) {
    movie.rating = parseFloat(movie.rating);
  }
  if (movie.id) {
    movie.id = parseInt(movie.id, 10);
  } else {
    delete movie.id;
  }

  if (formIsValid(movie)) {
    try {
      const isUpdate = movie.id;
      const url = isUpdate
        ? `${env.BACKEND_PRODUCTS_URL}/${movie.id}`
        : env.BACKEND_PRODUCTS_URL;
      const method = isUpdate ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          ...authService.getAuthHeaders(),
        },
        body: JSON.stringify(movie),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.success(`Film ${isUpdate ? "mis à jour" : "ajouté"} avec succès!`);
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        errors.push(data.error || `Erreur lors de l'enregistrement du film.`);
        displayErrors();
      }
    } catch (error) {
      errors.push("Erreur réseau ou du serveur.");
      displayErrors();
      console.error("Erreur:", error);
    }
  }
});

const validateRating = (ratingString) => {
  if (!ratingString) {
    return "La note est obligatoire !";
  }
  const rating = parseFloat(ratingString);
  if (isNaN(rating) || rating < 0 || rating > 10) {
    return "La note doit être un nombre entre 0 et 10.";
  }
  if (ratingString.split(".")[1]?.length > 3) {
    return "Mettez au maximum trois décimales après le . svp!";
  }
  return true;
};

const formIsValid = (movie) => {
  errors = [];
  if (
    !movie.title ||
    !movie.poster ||
    !movie.description ||
    !movie.release_date ||
    movie.rating === undefined ||
    movie.rating === null
  ) {
    errors.push("Vous devez renseigner tous les champs obligatoires.");
  }

  if (movie.description && movie.description.length < 20) {
    errors.push("La description du film est trop courte (min 20 caractères).");
  }

  const ratingValidation = validateRating(movie.rating);
  if (ratingValidation !== true) {
    errors.push(ratingValidation);
  }

  displayErrors();
  return errors.length === 0;
};

const displayErrors = () => {
  if (errors.length) {
    let errorHTML = "";
    errors.forEach((e) => {
      errorHTML += `<li>${e}</li>`;
    });
    errorElement.innerHTML = errorHTML;
    errorElement.classList.add("message-area--visible");
  } else {
    errorElement.innerHTML = "";
    errorElement.classList.remove("message-area--visible");
  }
};

const movieId = getMovieIdFromUrl();
if (movieId) {
  loadMovieForEdit(movieId);
}