import "../../assets/styles/styles.scss";
import "./checkout.scss";
import { cartService } from "../cart/cart.js";
import { Alert } from "../alert/index.js";
import { updateHeader } from "../header/header.js";

updateHeader();

const orderItems = document.getElementById('orderItems');
const subtotal = document.getElementById('subtotal');
const shipping = document.getElementById('shipping');
const finalTotal = document.getElementById('finalTotal');
const checkoutForm = document.getElementById('checkoutForm');
const placeOrderBtn = document.getElementById('placeOrderBtn');

const SHIPPING_COST = 5.99;

function displayOrderSummary() {
  const cart = cartService.getCart();
  
  if (cart.length === 0) {
    Alert.error("Votre panier est vide");
    window.location.href = '../cart/cart.html';
    return;
  }
  
  orderItems.innerHTML = '';
  
  cart.forEach(item => {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    orderItem.innerHTML = `
      <div class="order-item__image">
        <img src="${item.poster}" alt="${item.title}">
      </div>
      <div class="order-item__details">
        <h4>${item.title}</h4>
        <p>Quantité: ${item.quantity}</p>
        <p>Prix unitaire: ${item.price}€</p>
      </div>
      <div class="order-item__total">
        ${(item.price * item.quantity).toFixed(2)}€
      </div>
    `;
    orderItems.appendChild(orderItem);
  });
  
  const cartTotal = cartService.getCartTotal();
  subtotal.textContent = cartTotal.toFixed(2) + '€';
  finalTotal.textContent = (cartTotal + SHIPPING_COST).toFixed(2) + '€';
}

placeOrderBtn.addEventListener('click', async () => {
  const formData = new FormData(checkoutForm);
  const orderData = Object.fromEntries(formData.entries());
  
  if (!checkoutForm.checkValidity()) {
    Alert.error("Veuillez remplir tous les champs obligatoires");
    return;
  }
  
  const confirm = await Alert.confirm(
    "Êtes-vous sûr de vouloir confirmer cette commande ?",
    "Confirmer",
    "Annuler"
  );
  
  if (confirm) {
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      customer: orderData,
      items: cartService.getCart(),
      subtotal: cartService.getCartTotal(),
      shipping: SHIPPING_COST,
      total: cartService.getCartTotal() + SHIPPING_COST,
      status: 'confirmée'
    };
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    cartService.clearCart();
    
    Alert.success("Commande confirmée avec succès!");
    
    setTimeout(() => {
      window.location.href = '../order-confirmation/confirmation.html?orderId=' + order.id;
    }, 1500);
  }
});

displayOrderSummary();