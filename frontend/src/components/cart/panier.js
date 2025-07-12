import "../../assets/styles/styles.scss";
import "./panier.scss";
import { cartService } from "./cart.js";
import { Alert } from "../alert/index.js";
import { updateHeader } from "../header/header.js";

updateHeader();

const cartContainer = document.getElementById('cartContainer');
const emptyCart = document.getElementById('emptyCart');
const cartItems = document.getElementById('cartItems');
const cartSummary = document.getElementById('cartSummary');
const cartTotal = document.getElementById('cartTotal');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

function displayCart() {
  const cart = cartService.getCart();
  
  if (cart.length === 0) {
    emptyCart.style.display = 'block';
    cartItems.style.display = 'none';
    cartSummary.style.display = 'none';
    return;
  }
  
  emptyCart.style.display = 'none';
  cartItems.style.display = 'block';
  cartSummary.style.display = 'block';
  
  cartItems.innerHTML = '';
  
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item__image">
        <img src="${item.poster}" alt="${item.title}">
      </div>
      <div class="cart-item__details">
        <h3 class="cart-item__title">${item.title}</h3>
        <p class="cart-item__rating">⭐ ${item.rating}/10</p>
        <p class="cart-item__price">${item.price}€</p>
      </div>
      <div class="cart-item__quantity">
        <button class="quantity-btn quantity-btn--minus" data-id="${item.id}">-</button>
        <span class="quantity-display">${item.quantity}</span>
        <button class="quantity-btn quantity-btn--plus" data-id="${item.id}">+</button>
      </div>
      <div class="cart-item__total">
        ${(item.price * item.quantity).toFixed(2)}€
      </div>
      <div class="cart-item__remove">
        <button class="remove-btn" data-id="${item.id}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
    cartItems.appendChild(cartItem);
  });
  
  cartTotal.textContent = cartService.getCartTotal().toFixed(2);
  
  addEventListeners();
}

function addEventListeners() {
  const minusButtons = document.querySelectorAll('.quantity-btn--minus');
  const plusButtons = document.querySelectorAll('.quantity-btn--plus');
  const removeButtons = document.querySelectorAll('.remove-btn');
  
  minusButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = parseInt(e.target.dataset.id);
      const item = cartService.getCart().find(item => item.id === productId);
      if (item) {
        cartService.updateQuantity(productId, item.quantity - 1);
        displayCart();
      }
    });
  });
  
  plusButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = parseInt(e.target.dataset.id);
      const item = cartService.getCart().find(item => item.id === productId);
      if (item) {
        cartService.updateQuantity(productId, item.quantity + 1);
        displayCart();
      }
    });
  });
  
  removeButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const productId = parseInt(e.target.dataset.id);
      const confirm = await Alert.confirm(
        "Êtes-vous sûr de vouloir supprimer cet article du panier ?",
        "Supprimer",
        "Annuler"
      );
      if (confirm) {
        cartService.removeFromCart(productId);
        displayCart();
        Alert.success("Article supprimé du panier");
      }
    });
  });
}

clearCartBtn.addEventListener('click', async () => {
  const confirm = await Alert.confirm(
    "Êtes-vous sûr de vouloir vider votre panier ?",
    "Vider",
    "Annuler"
  );
  if (confirm) {
    cartService.clearCart();
    displayCart();
    Alert.success("Panier vidé");
  }
});

checkoutBtn.addEventListener('click', () => {
  window.location.href = '../checkout/checkout.html';
});

displayCart();