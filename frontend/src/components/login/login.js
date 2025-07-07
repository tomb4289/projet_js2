import "../../assets/styles/styles.scss";
import { authService } from "../../services/auth.js";
import { Alert } from "../alert/index.js";

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorElement = document.getElementById('loginErrors');

if (authService.isAuthenticated()) {
  window.location.href = '/';
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    displayError('Veuillez remplir tous les champs');
    return;
  }

  try {
    const result = await authService.login(email, password);
    
    if (result.success) {
      Alert.success('Connexion réussie!');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      displayError(result.error);
    }
  } catch (error) {
    displayError('Erreur de connexion');
  }
});

function displayError(message) {
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  setTimeout(() => {
    errorElement.style.display = 'none';
  }, 5000);
}