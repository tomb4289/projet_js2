import { authService } from "../../services/auth.js";
import { cartService } from "../cart/cart.js";

export function updateHeader() {
  const headerNav = document.querySelector('.main-header__nav');
  if (!headerNav) return;

  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  const user = authService.getUser();

  let authLinks = '';
  
  if (isAuthenticated) {
    authLinks = `
      <li class="main-header__nav-item">
        <span class="main-header__nav-link">Bonjour, ${user.nom}</span>
      </li>
      ${isAdmin ? `
        <li class="main-header__nav-item">
          <a href="./form/form.html" class="main-header__nav-link">Ajouter un film</a>
        </li>
        <li class="main-header__nav-item">
          <a href="./users/users.html" class="main-header__nav-link">Gérer les utilisateurs</a>
        </li>
        <li class="main-header__nav-item">
          <a href="./components/admin/admin.html" class="main-header__nav-link">Administration</a>
        </li>
      ` : ''}
      <li class="main-header__nav-item">
        <a href="./components/cart/cart.html" class="main-header__nav-link">
          Panier <span class="cart-count">0</span>
        </a>
      </li>
      <li class="main-header__nav-item">
        <button id="logoutBtn" class="button button--secondary button--small">Déconnexion</button>
      </li>
    `;
  } else {
    authLinks = `
      <li class="main-header__nav-item">
        <a href="./components/cart/cart.html" class="main-header__nav-link">
          Panier <span class="cart-count">0</span>
        </a>
      </li>
      <li class="main-header__nav-item">
        <a href="./components/login/login.html" class="main-header__nav-link">Connexion</a>
      </li>
    `;
  }

  const existingAuthItems = headerNav.querySelectorAll('.auth-item');
  existingAuthItems.forEach(item => item.remove());

  headerNav.insertAdjacentHTML('beforeend', authLinks.replace(/class="main-header__nav-item"/g, 'class="main-header__nav-item auth-item"'));

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      authService.logout();
    });
  }
  
  cartService.updateCartDisplay();
}

document.addEventListener('DOMContentLoaded', updateHeader);