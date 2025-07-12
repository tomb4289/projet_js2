class CartService {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.updateCartDisplay();
  }

  addToCart(product, quantity = 1) {
    const existingItem = this.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        title: product.title,
        poster: product.poster,
        rating: product.rating,
        quantity: quantity,
        price: this.calculatePrice(product.rating)
      });
    }
    
    this.saveCart();
    this.updateCartDisplay();
    return true;
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    this.updateCartDisplay();
  }

  updateQuantity(productId, quantity) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.saveCart();
        this.updateCartDisplay();
      }
    }
  }

  calculatePrice(rating) {
    return Math.round(rating * 2.5 * 100) / 100;
  }

  getCartTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
    this.updateCartDisplay();
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  updateCartDisplay() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const count = this.getCartCount();
    
    cartCountElements.forEach(element => {
      element.textContent = count;
      element.style.display = count > 0 ? 'inline' : 'none';
    });
  }

  getCart() {
    return this.cart;
  }
}

export const cartService = new CartService();