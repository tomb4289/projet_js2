import "../assets/styles/styles.scss";

const registerForm = document.getElementById("register-form");
const errorElement = document.getElementById("errors");
let errors = [];

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  errors = [];

  const formData = new FormData(registerForm);
  const userData = Object.fromEntries(formData.entries());

  let hasErrors = false;
  if (!userData.username) {
    errors.push("Le nom d'utilisateur est obligatoire.");
    hasErrors = true;
  }
  if (!userData.email) {
    errors.push("L'email est obligatoire.");
    hasErrors = true;
  } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
    errors.push("Le format de l'email est invalide.");
    hasErrors = true;
  }
  if (!userData.password) {
    errors.push("Le mot de passe est obligatoire.");
    hasErrors = true;
  } else if (userData.password.length < 6) {
    errors.push("Le mot de passe doit contenir au moins 6 caractères.");
    hasErrors = true;
  }

  if (hasErrors) {
    displayErrors();
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
      alert(
        "Inscription réussie ! Vous pouvez maintenant gérer cet utilisateur."
      );
      window.location.href = "../../users.html";
    } else {
      errors.push(result.error || "Erreur lors de l'inscription.");
      displayErrors();
    }
  } catch (error) {
    errors.push("Erreur réseau ou du serveur.");
    displayErrors();
    console.error("Erreur d'inscription:", error);
  }
});

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
