import "../../assets/styles/styles.scss";
import "./admin.scss";
import { authService } from "../../services/auth.js";
import { updateHeader } from "../header/header.js";
import { Alert } from "../alert/index.js";
import { env } from "../../config/env.js";

updateHeader();

if (!authService.isAdmin()) {
  Alert.error("Accès refusé. Droits administrateur requis.");
  setTimeout(() => {
    window.location.href = "/";
  }, 2000);
}

const moviesCount = document.getElementById('moviesCount');
const usersCount = document.getElementById('usersCount');
const ordersCount = document.getElementById('ordersCount');
const recentOrdersList = document.getElementById('recentOrdersList');
const viewOrdersBtn = document.getElementById('viewOrdersBtn');
const exportDataBtn = document.getElementById('exportDataBtn');

async function loadDashboardData() {
  try {
    const [moviesResponse, usersResponse] = await Promise.all([
      fetch(env.BACKEND_PRODUCTS_URL),
      fetch(env.BACKEND_USERS_URL, {
        headers: authService.getAuthHeaders()
      })
    ]);

    if (moviesResponse.ok) {
      const movies = await moviesResponse.json();
      moviesCount.textContent = Array.isArray(movies) ? movies.length : 0;
    }

    if (usersResponse.ok) {
      const users = await usersResponse.json();
      usersCount.textContent = Array.isArray(users) ? users.length : 0;
    }

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    ordersCount.textContent = orders.length;
    
    displayRecentOrders(orders);
    
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    Alert.error('Erreur lors du chargement des statistiques');
  }
}

function displayRecentOrders(orders) {
  if (orders.length === 0) {
    recentOrdersList.innerHTML = '<p>Aucune commande récente</p>';
    return;
  }
  
  const recentOrders = orders
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  recentOrdersList.innerHTML = recentOrders.map(order => {
    const orderDate = new Date(order.date).toLocaleDateString('fr-FR');
    return `
      <div class="order-item">
        <div class="order-info">
          <h4>Commande #${order.id}</h4>
          <p>${order.customer.firstName} ${order.customer.lastName}</p>
          <p>${orderDate}</p>
        </div>
        <div class="order-total">
          ${order.total.toFixed(2)}€
        </div>
        <div class="order-status">
          <span class="status-badge status-badge--${order.status}">${order.status}</span>
        </div>
      </div>
    `;
  }).join('');
}

viewOrdersBtn.addEventListener('click', () => {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  
  if (orders.length === 0) {
    Alert.error('Aucune commande à afficher');
    return;
  }
  
  const ordersWindow = window.open('', '_blank');
  ordersWindow.document.write(`
    <html>
      <head>
        <title>Toutes les commandes</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .order { border: 1px solid #ddd; margin: 10px 0; padding: 15px; }
          .order-header { font-weight: bold; margin-bottom: 10px; }
          .order-items { margin: 10px 0; }
          .order-item { padding: 5px 0; border-bottom: 1px solid #eee; }
        </style>
      </head>
      <body>
        <h1>Toutes les commandes</h1>
        ${orders.map(order => `
          <div class="order">
            <div class="order-header">
              Commande #${order.id} - ${new Date(order.date).toLocaleDateString('fr-FR')}
            </div>
            <p><strong>Client:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
            <p><strong>Email:</strong> ${order.customer.email}</p>
            <p><strong>Total:</strong> ${order.total.toFixed(2)}€</p>
            <div class="order-items">
              <strong>Articles:</strong>
              ${order.items.map(item => `
                <div class="order-item">
                  ${item.title} - Quantité: ${item.quantity} - ${(item.price * item.quantity).toFixed(2)}€
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </body>
    </html>
  `);
});

exportDataBtn.addEventListener('click', async () => {
  try {
    const [moviesResponse, usersResponse] = await Promise.all([
      fetch(env.BACKEND_PRODUCTS_URL),
      fetch(env.BACKEND_USERS_URL, {
        headers: authService.getAuthHeaders()
      })
    ]);

    const movies = moviesResponse.ok ? await moviesResponse.json() : [];
    const users = usersResponse.ok ? await usersResponse.json() : [];
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');

    const exportData = {
      exportDate: new Date().toISOString(),
      movies: movies,
      users: users.map(user => ({
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        estActif: user.estActif
      })),
      orders: orders
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `export-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    Alert.success('Données exportées avec succès');
    
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    Alert.error('Erreur lors de l\'export des données');
  }
});

loadDashboardData();