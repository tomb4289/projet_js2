import "../assets/styles/styles.scss";

const usersTableBody = document.getElementById("users-table-body");
const userFormContainer = document.getElementById("user-form-container");
const addUserBtn = document.getElementById("add-user-btn");
const userForm = document.getElementById("user-form");
const cancelUserFormBtn = document.getElementById("cancel-user-form");
const userMessage = document.getElementById("user-message");
const userFormErrors = document.getElementById("user-form-errors");

let currentUserId = null;

const API_BASE_URL = "http://localhost:5252/api/users";

const fetchUsers = async () => {
  try {
    userMessage.textContent = "Chargement des utilisateurs...";
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const users = await response.json();
    displayUsers(users);
    userMessage.textContent = "";
  } catch (error) {
    userMessage.textContent = `Erreur lors du chargement des utilisateurs: ${error.message}`;
    console.error("Erreur de fetchUsers:", error);
    usersTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Impossible de charger les utilisateurs.</td></tr>`;
  }
};

const displayUsers = (users) => {
  usersTableBody.innerHTML = "";
  if (users.length === 0) {
    usersTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Aucun utilisateur trouvé.</td></tr>`;
    return;
  }
  users.forEach((user) => {
    const row = usersTableBody.insertRow();
    row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username || "N/A"}</td>
            <td>${user.email || "N/A"}</td>
            <td>
                <button class="btn-edit" data-id="${user.id}">Modifier</button>
                <button class="btn-delete" data-id="${
                  user.id
                }">Supprimer</button>
            </td>
        `;
  });

  document.querySelectorAll(".btn-edit").forEach((button) => {
    button.addEventListener("click", (e) => editUser(e.target.dataset.id));
  });
  document.querySelectorAll(".btn-delete").forEach((button) => {
    button.addEventListener("click", (e) => deleteUser(e.target.dataset.id));
  });
};

const showUserForm = (user = null) => {
  userForm.reset();
  userFormErrors.innerHTML = "";
  if (user) {
    currentUserId = user.id;
    userForm.id.value = user.id;
    userForm.username.value = user.username;
    userForm.email.value = user.email;
    userForm.password.placeholder =
      "Laisser vide pour conserver l'ancien mot de passe";
    userForm.password.required = false;
  } else {
    currentUserId = null;
    userForm.id.value = "";
    userForm.password.placeholder = "";
    userForm.password.required = true;
  }
  userFormContainer.style.display = "block";
  window.scrollTo(0, userFormContainer.offsetTop);
};

const hideUserForm = () => {
  userFormContainer.style.display = "none";
  userForm.reset();
  currentUserId = null;
};

const submitUserForm = async (event) => {
  event.preventDefault();
  userFormErrors.innerHTML = "";
  const formData = new FormData(userForm);
  const userData = Object.fromEntries(formData.entries());

  let errors = [];
  if (!userData.username) errors.push("Le nom d'utilisateur est obligatoire.");
  if (!userData.email) errors.push("L'email est obligatoire.");
  else if (!/\S+@\S+\.\S+/.test(userData.email))
    errors.push("Le format de l'email est invalide.");

  if (!currentUserId && !userData.password)
    errors.push("Le mot de passe est obligatoire pour un nouvel utilisateur.");
  if (currentUserId && userData.password && userData.password.length < 6)
    errors.push("Le mot de passe doit contenir au moins 6 caractères.");

  if (errors.length > 0) {
    userFormErrors.innerHTML = errors.map((e) => `<li>${e}</li>`).join("");
    return;
  }

  try {
    const method = currentUserId ? "PUT" : "POST";
    const url = currentUserId
      ? `${API_BASE_URL}/${currentUserId}`
      : API_BASE_URL;

    const dataToSend = { username: userData.username, email: userData.email };
    if (userData.password) {
      dataToSend.password = userData.password;
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    const result = await response.json();

    if (response.ok) {
      userMessage.style.color = "green";
      userMessage.textContent = `Utilisateur ${
        currentUserId ? "mis à jour" : "ajouté"
      } avec succès!`;
      hideUserForm();
      fetchUsers();
    } else {
      userMessage.style.color = "red";
      userMessage.textContent = result.error || "Erreur lors de l'opération.";
      userFormErrors.innerHTML = `<li>${
        result.error || "Erreur inconnue."
      }</li>`;
    }
  } catch (error) {
    userMessage.style.color = "red";
    userMessage.textContent = "Erreur réseau ou du serveur.";
    console.error("Erreur de soumission:", error);
  }
};

const editUser = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Utilisateur avec l'ID ${id} non trouvé.`);
    }
    const user = await response.json();
    showUserForm(user);
  } catch (error) {
    userMessage.style.color = "red";
    userMessage.textContent = `Erreur lors du chargement de l'utilisateur pour modification: ${error.message}`;
    console.error("Erreur editUser:", error);
  }
};

const deleteUser = async (id) => {
  if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur?")) {
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      userMessage.style.color = "green";
      userMessage.textContent = "Utilisateur supprimé avec succès!";
      fetchUsers();
    } else {
      const result = await response.json();
      userMessage.style.color = "red";
      userMessage.textContent =
        result.error || "Erreur lors de la suppression.";
    }
  } catch (error) {
    userMessage.style.color = "red";
    userMessage.textContent = "Erreur réseau ou du serveur.";
    console.error("Erreur deleteUser:", error);
  }
};

addUserBtn.addEventListener("click", () => showUserForm());
cancelUserFormBtn.addEventListener("click", hideUserForm);
userForm.addEventListener("submit", submitUserForm);

fetchUsers();
