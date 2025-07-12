import "../../assets/styles/styles.scss";
import "./confirmation.scss";
import { updateHeader } from "../header/header.js";

updateHeader();

const orderInfo = document.getElementById('orderInfo');
const printOrderBtn = document.getElementById('printOrderBtn');

function getOrderIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('orderId');
}

function displayOrderDetails() {
  const orderId = getOrderIdFromUrl();
  
  if (!orderId) {
    orderInfo.innerHTML = '<p>Commande non trouvée.</p>';
    return;
  }
  
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const order = orders.find(o => o.id == orderId);
  
  if (!order) {
    orderInfo.innerHTML = '<p>Commande non trouvée.</p>';
    return;
  }
  
  const orderDate = new Date(order.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  orderInfo.innerHTML = `
    <div class="order-summary-card">
      <div class="order-header">
        <h3>Commande #${order.id}</h3>
        <p>Passée le ${orderDate}</p>
        <span class="order-status order-status--confirmed">Confirmée</span>
      </div>
      
      <div class="customer-info">
        <h4>Informations de livraison</h4>
        <p><strong>${order.customer.firstName} ${order.customer.lastName}</strong></p>
        <p>${order.customer.email}</p>
        <p>${order.customer.phone}</p>
        <p>${order.customer.address}</p>
        <p>${order.customer.postalCode} ${order.customer.city}</p>
        <p>${order.customer.country}</p>
        ${order.customer.notes ? `<p><em>Notes: ${order.customer.notes}</em></p>` : ''}
      </div>
      
      <div class="order-items">
        <h4>Articles commandés</h4>
        ${order.items.map(item => `
          <div class="order-item">
            <img src="${item.poster}" alt="${item.title}">
            <div class="item-details">
              <h5>${item.title}</h5>
              <p>Quantité: ${item.quantity}</p>
              <p>Prix unitaire: ${item.price}€</p>
            </div>
            <div class="item-total">
              ${(item.price * item.quantity).toFixed(2)}€
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="order-totals">
        <div class="total-line">
          <span>Sous-total:</span>
          <span>${order.subtotal.toFixed(2)}€</span>
        </div>
        <div class="total-line">
          <span>Livraison:</span>
          <span>${order.shipping.toFixed(2)}€</span>
        </div>
        <div class="total-line total-line--final">
          <span>Total:</span>
          <span>${order.total.toFixed(2)}€</span>
        </div>
      </div>
    </div>
  `;
}

printOrderBtn.addEventListener('click', () => {
  window.print();
});

displayOrderDetails();