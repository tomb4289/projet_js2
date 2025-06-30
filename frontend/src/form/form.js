import "../assets/styles/styles.scss";

const form = document.querySelector("form");
const errorElement = document.querySelector("#errors");
let errors = [];

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
        ? `http://localhost:5252/api/products/${movie.id}`
        : "http://localhost:5252/api/products";
      const method = isUpdate ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movie),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Film ${isUpdate ? "mis à jour" : "ajouté"} avec succès!`);
        window.location.href = "/";
      } else {
        errors.push(data.message || `Erreur lors de l'enregistrement du film.`);
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
  } else {
    errorElement.innerHTML = "";
  }
};
