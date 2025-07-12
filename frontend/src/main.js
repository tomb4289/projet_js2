import "./assets/styles/styles.scss";
import "./main.scss";
import { env } from "./config/env.js";
import { Alert } from "./components/alert/index.js";
import { divRemove } from "./components/divRemove/index.js";
import { authService } from "./services/auth.js";
import { updateHeader } from "./components/header/header.js";
import { cartService } from "./components/cart/cart.js";

const content = document.querySelector(".site-main-content");

const registerSection = document.getElementById("register-section");
const showRegisterLink = document.getElementById("show-register-link");
const registerForm = document.getElementById("register-form");
const registerErrorElement = document.getElementById("errors");
const cancelRegisterBtn = document.getElementById("cancel-register-btn");

const addMovieSection = document.getElementById("add-movie-section");
const showAddMovieLink = document.getElementById("show-add-movie-link");
const addMovieForm = document.getElementById("add-movie-form");
const addMovieErrorElement = document.getElementById("form-errors");
const cancelAddMovieBtn = document.getElementById("cancel-add-movie-btn");

const usersSection = document.getElementById("users-section");
const showUsersLink = document.getElementById("show-users-link");
const cancelUsersBtn = document.getElementById("cancel-users-btn");
const usersTableBody = document.getElementById("users-table-body");
const userErrorElement = document.getElementById("user-errors");

let registerErrors = [];
let addMovieFormErrors = [];
let userErrors = [];

updateHeader();

const displayMovies = (movies) => {
  const moviesContainer = document.createElement("div");
  moviesContainer.className = "movie-list";

  const movieElements = movies
    .slice(0)
    .reverse()
    .map((movie) => createMovieElement(movie));

  moviesContainer.append(...movieElements);

  addEditDeleteEvents(moviesContainer);

  if (content) {
    content.innerHTML = "";
    content.append(moviesContainer);
  }
};

const createMovieElement = (movie) => {
  const div = document.createElement("div");
  div.className = "movie-card";
  div.style.position = "relative";
  div.innerHTML = `
    <i data-id="${movie.id}" class="x_delete fa-solid fa-trash"></i>
    <i data-id="${movie.id}" class="x_edit fa-solid fa-pen-to-square"></i>
    <div class="movie-card__content-area" data-movie-id="${movie.id}">
      <img src="${movie.poster}" alt="${
    movie.title
  }" class="movie-card__poster">
      <div class="movie-card__content">
        <h2 class="movie-card__title">${movie.title}</h2>
        <p class="movie-card__description">${movie.description.substring(
          0,
          100
        )}...</p>
        <div class="movie-card__meta">
          <span class="movie-card__release-date">Sortie: ${
            movie.release_date ? movie.release_date.substring(0, 4) : "N/A"
          }</span>
          <span class="movie-card__rating">⭐ ${movie.rating}/10</span>
        </div>
      </div>
    </div>
    <div class="movie-card__actions">
      <button class="button button--primary add-to-cart-btn" data-id="${
        movie.id
      }" data-movie='${JSON.stringify(movie)}'>
        Ajouter au panier
      </button>
    </div>
  `;
  return div;
};

const addEditDeleteEvents = (container) => {
  if (!container) {
    return;
  }

  const deleteButtons = container.querySelectorAll(".fa-trash");
  const editButtons = container.querySelectorAll(".fa-pen-to-square");

  const isAdmin = authService.isAdmin();

  if (!isAdmin) {
    deleteButtons.forEach((btn) => (btn.style.display = "none"));
    editButtons.forEach((btn) => (btn.style.display = "none"));
  }

  editButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const movieId = event.target.dataset.id;
      showSection("add-movie");
      loadMovieForEdit(movieId);
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      try {
        const confirm = await Alert.confirm(
          "Cette action est irréversible. Désirez-vous continuer ?",
          "Supprimer",
          "Annuler"
        );
        if (confirm) {
          const movieId = event.target.dataset.id;
          const response = await fetch(
            `${env.BACKEND_PRODUCTS_URL}/${movieId}`,
            {
              method: "DELETE",
              headers: authService.getAuthHeaders(),
            }
          );
          if (!response.ok) {
            throw new Error("Failed to delete movie");
          }
          await response.json();
          divRemove(".movie-list");
          fetchMovies();
          Alert.success("Film supprimé avec succès!");
        }
      } catch (e) {
        Alert.error("Erreur lors de la suppression du film");
        console.error("Delete error:", e);
      }
    });
  });

  const addToCartButtons = container.querySelectorAll(".add-to-cart-btn");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.stopPropagation();

      const movieId = parseInt(event.target.dataset.id);
      const movieData = event.target.dataset.movie;

      try {
        const movie = JSON.parse(movieData);
        if (movie && movie.id) {
          const success = cartService.addToCart({
            id: movie.id,
            title: movie.title,
            poster: movie.poster,
            rating: movie.rating,
          });
          if (success) {
            Alert.success("Film ajouté au panier!");
          } else {
            Alert.error("Impossible d'ajouter le film au panier.");
          }
        } else {
          Alert.error("Film non trouvé ou données invalides!");
        }
      } catch (error) {
        Alert.error(
          "Erreur lors de l'ajout au panier: données du film invalides."
        );
        console.error("Cart error:", error);
      }
    });
  });

  const movieCards = container.querySelectorAll(".movie-card__content-area");

  movieCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const movieId = event.currentTarget.dataset.movieId;
      window.location.href = `/produit/produit.html?id=${movieId}`;
    });
  });
};

const fetchMovies = async () => {
  try {
    const response = await fetch(`${env.BACKEND_PRODUCTS_URL}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}. Body: ${errorText}`
      );
    }

    let movies = await response.json();

    if (!Array.isArray(movies)) {
      movies = [movies];
    }

    if (movies.length === 0) {
      if (content) {
        content.innerHTML =
          '<p class="no-movies-message">Aucun film n\'est disponible pour le moment.</p>';
      }
      return;
    }

    window.movies = movies;
    displayMovies(movies);
  } catch (e) {
    Alert.error(`Erreur lors du chargement des films: ${e.message || e}`);
    console.error("Fetch movies error:", e);
  }
};

const displayRegisterErrors = () => {
  if (registerErrors.length) {
    let errorHTML = "";
    registerErrors.forEach((e) => {
      errorHTML += `<li>${e}</li>`;
    });
    registerErrorElement.innerHTML = errorHTML;
  } else {
    registerErrorElement.innerHTML = "";
  }
};

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    registerErrors = [];

    const formData = new FormData(registerForm);
    const userData = Object.fromEntries(formData.entries());

    let hasErrors = false;
    if (!userData.nom) {
      registerErrors.push("Le nom d'utilisateur est obligatoire.");
      hasErrors = true;
    }
    if (!userData.email) {
      registerErrors.push("L'email est obligatoire.");
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      registerErrors.push("Le format de l'email est invalide.");
      hasErrors = true;
    }
    if (!userData.password) {
      registerErrors.push("Le mot de passe est obligatoire.");
      hasErrors = true;
    } else if (userData.password.length < 6) {
      registerErrors.push(
        "Le mot de passe doit contenir au moins 6 caractères."
      );
      hasErrors = true;
    }

    if (hasErrors) {
      displayRegisterErrors();
      return;
    }

    try {
      const response = await fetch("http://localhost:5252/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.success(
          "Inscription réussie ! Vous pouvez maintenant gérer cet utilisateur."
        );
        registerForm.reset();
        showSection("movies");
      } else {
        registerErrors.push(result.error || "Erreur lors de l'inscription.");
        displayRegisterErrors();
      }
    } catch (error) {
      registerErrors.push("Erreur réseau ou du serveur.");
      displayRegisterErrors();
      console.error("Registration error:", error);
    }
  });
}

const loadMovieForEdit = async (movieId) => {
  if (!movieId) {
    addMovieForm.reset();
    document.querySelector("#add-movie-section .form__title").textContent =
      "Ajouter un nouveau Film";
    document.querySelector(
      '#add-movie-form button[type="submit"]'
    ).textContent = "Sauvegarder";
    return;
  }

  try {
    const response = await fetch(`${env.BACKEND_PRODUCTS_URL}/${movieId}`);
    if (!response.ok) {
      throw new Error("Film non trouvé");
    }
    const movie = await response.json();

    document.getElementById("id").value = movie.id;
    document.getElementById("title").value = movie.title;
    document.getElementById("poster").value = movie.poster;
    document.getElementById("description").value = movie.description;
    document.getElementById("release_date").value = movie.release_date;
    document.getElementById("rating").value = movie.rating;

    document.querySelector("#add-movie-section .form__title").textContent =
      "Modifier le Film";
    document.querySelector(
      '#add-movie-form button[type="submit"]'
    ).textContent = "Mettre à jour";
  } catch (error) {
    Alert.error("Erreur lors du chargement du film: " + error.message);
    console.error("Load movie for edit error:", error);
  }
};

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

const addMovieFormIsValid = (movie) => {
  addMovieFormErrors = [];
  if (
    !movie.title ||
    !movie.poster ||
    !movie.description ||
    !movie.release_date ||
    movie.rating === undefined ||
    movie.rating === null
  ) {
    addMovieFormErrors.push(
      "Vous devez renseigner tous les champs obligatoires."
    );
  }

  if (movie.description && movie.description.length < 20) {
    addMovieFormErrors.push(
      "La description du film est trop courte (min 20 caractères)."
    );
  }

  const ratingValidation = validateRating(movie.rating);
  if (ratingValidation !== true) {
    addMovieFormErrors.push(ratingValidation);
  }

  displayAddMovieErrors();
  return addMovieFormErrors.length === 0;
};

const displayAddMovieErrors = () => {
  if (addMovieFormErrors.length) {
    let errorHTML = "";
    addMovieFormErrors.forEach((e) => {
      errorHTML += `<li>${e}</li>`;
    });
    addMovieErrorElement.innerHTML = errorHTML;
    addMovieErrorElement.classList.add("message-area--visible");
  } else {
    addMovieErrorElement.innerHTML = "";
    addMovieErrorElement.classList.remove("message-area--visible");
  }
};

if (addMovieForm) {
  addMovieForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(addMovieForm);
    const movie = Object.fromEntries(formData.entries());

    if (movie.rating) {
      movie.rating = parseFloat(movie.rating);
    }
    if (movie.id) {
      movie.id = parseInt(movie.id, 10);
    } else {
      delete movie.id;
    }

    if (addMovieFormIsValid(movie)) {
      try {
        const isUpdate = movie.id;
        const url = isUpdate
          ? `${env.BACKEND_PRODUCTS_URL}/${movie.id}`
          : env.BACKEND_PRODUCTS_URL;
        const method = isUpdate ? "PUT" : "POST";

        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            ...authService.getAuthHeaders(),
          },
          body: JSON.stringify(movie),
        });

        const data = await response.json();

        if (response.ok) {
          Alert.success(
            `Film ${isUpdate ? "mis à jour" : "ajouté"} avec succès!`
          );
          addMovieForm.reset();
          showSection("movies");
          fetchMovies();
        } else {
          addMovieFormErrors.push(
            data.error || `Erreur lors de l'enregistrement du film.`
          );
          displayAddMovieErrors();
        }
      } catch (error) {
        addMovieFormErrors.push("Erreur réseau ou du serveur.");
        displayAddMovieErrors();
        console.error("Add/Edit movie error:", error);
      }
    }
  });
}

const fetchUsers = async () => {
  if (!authService.isAdmin()) {
    Alert.error(
      "Accès refusé. Droits administrateur requis pour voir les utilisateurs."
    );
    showSection("movies");
    return;
  }
  userErrors = [];
  displayUserErrors();
  if (usersTableBody) {
    usersTableBody.innerHTML =
      '<tr><td colspan="4">Chargement des utilisateurs...</td></tr>';
  }
  try {
    const response = await fetch("http://localhost:5252/api/users", {
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Erreur lors du chargement des utilisateurs."
      );
    }

    const users = await response.json();

    if (usersTableBody) {
      usersTableBody.innerHTML = ""; // Clear loading message
      if (users.length === 0) {
        usersTableBody.innerHTML =
          '<tr><td colspan="4">Aucun utilisateur enregistré.</td></tr>';
      } else {
        users.forEach((user) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nom}</td>
            <td>${user.email}</td>
            <td>
              <button class="button button--danger delete-user-btn" data-id="${user.id}">Supprimer</button>
            </td>
          `;
          usersTableBody.appendChild(tr);
        });
      }
    }
  } catch (error) {
    userErrors.push(
      error.message ||
        "Erreur réseau ou du serveur lors du chargement des utilisateurs."
    );
    displayUserErrors();
    console.error("Fetch users error:", error);
  }
};

const displayUserErrors = () => {
  if (userErrors.length) {
    let errorHTML = "";
    userErrors.forEach((e) => {
      errorHTML += `<li>${e}</li>`;
    });
    userErrorElement.innerHTML = errorHTML;
    userErrorElement.classList.add("message-area--visible");
  } else {
    userErrorElement.innerHTML = "";
    userErrorElement.classList.remove("message-area--visible");
  }
};

const handleDeleteUser = async (userId) => {
  try {
    const confirm = await Alert.confirm(
      "Voulez-vous vraiment supprimer cet utilisateur ?",
      "Oui",
      "Non"
    );
    if (confirm) {
      const response = await fetch(
        `http://localhost:5252/api/users/${userId}`,
        {
          method: "DELETE",
          headers: authService.getAuthHeaders(),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la suppression de l'utilisateur."
        );
      }
      await response.json();
      Alert.success("Utilisateur supprimé avec succès!");
      fetchUsers(); // Re-fetch and display users
    }
  } catch (error) {
    Alert.error("Erreur: " + error.message);
    console.error("Delete user error:", error);
  }
};

if (usersTableBody) {
  usersTableBody.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-user-btn")) {
      const userId = event.target.dataset.id;
      handleDeleteUser(userId);
    }
  });
}

const showSection = (sectionName) => {
  if (content) content.style.display = "none";
  if (registerSection) registerSection.style.display = "none";
  if (addMovieSection) addMovieSection.style.display = "none";
  if (usersSection) usersSection.style.display = "none";

  if (sectionName === "movies") {
    if (content) content.style.display = "block";
    fetchMovies();
  } else if (sectionName === "register") {
    if (registerSection) registerSection.style.display = "block";
    registerErrors = [];
    displayRegisterErrors();
    registerForm.reset();
  } else if (sectionName === "add-movie") {
    if (!authService.isAdmin()) {
      Alert.error("Accès refusé. Droits administrateur requis.");
      setTimeout(() => {
        showSection("movies");
      }, 2000);
      return;
    }
    if (addMovieSection) addMovieSection.style.display = "block";
    loadMovieForEdit(null);
    addMovieFormErrors = [];
    displayAddMovieErrors();
  } else if (sectionName === "users") {
    if (usersSection) usersSection.style.display = "block";
    fetchUsers();
  }
};

if (showRegisterLink) {
  showRegisterLink.addEventListener("click", (event) => {
    event.preventDefault();
    showSection("register");
  });
}

if (cancelRegisterBtn) {
  cancelRegisterBtn.addEventListener("click", () => {
    showSection("movies");
  });
}

if (showAddMovieLink) {
  showAddMovieLink.addEventListener("click", (event) => {
    event.preventDefault();
    showSection("add-movie");
  });
}

if (cancelAddMovieBtn) {
  cancelAddMovieBtn.addEventListener("click", () => {
    showSection("movies");
  });
}

if (showUsersLink) {
  showUsersLink.addEventListener("click", (event) => {
    event.preventDefault();
    showSection("users");
  });
}

if (cancelUsersBtn) {
  cancelUsersBtn.addEventListener("click", () => {
    showSection("movies");
  });
}

showSection("movies");

const initialMovieId = new URLSearchParams(window.location.search).get("id");
if (initialMovieId) {
  showSection("add-movie");
  loadMovieForEdit(initialMovieId);
}
