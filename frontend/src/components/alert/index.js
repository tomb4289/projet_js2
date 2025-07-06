export class Alert {
  static confirm(message, confirmText = "Confirmer", cancelText = "Annuler") {
    return new Promise((resolve) => {
      // Create modal overlay
      const overlay = document.createElement("div");
      overlay.className = "alert-overlay";
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      `;

      // Create modal
      const modal = document.createElement("div");
      modal.className = "alert-modal";
      modal.style.cssText = `
        background: #2c2c2c;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
        max-width: 400px;
        width: 90%;
        text-align: center;
        color: #f5f5f5;
      `;

      // Create message
      const messageEl = document.createElement("p");
      messageEl.textContent = message;
      messageEl.style.cssText = `
        margin-bottom: 1.5rem;
        font-size: 1rem;
        line-height: 1.4;
      `;

      // Create buttons container
      const buttonsContainer = document.createElement("div");
      buttonsContainer.style.cssText = `
        display: flex;
        gap: 1rem;
        justify-content: center;
      `;

      // Create cancel button
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = cancelText;
      cancelBtn.className = "button button--secondary";
      cancelBtn.style.cssText = `
        padding: 0.75rem 1.5rem;
        border: 1px solid #e50914;
        background: transparent;
        color: #e50914;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 700;
        transition: all 0.3s ease;
      `;

      // Create confirm button
      const confirmBtn = document.createElement("button");
      confirmBtn.textContent = confirmText;
      confirmBtn.className = "button button--primary";
      confirmBtn.style.cssText = `
        padding: 0.75rem 1.5rem;
        border: none;
        background: #e50914;
        color: #f5f5f5;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 700;
        transition: all 0.3s ease;
      `;

      // Add hover effects
      cancelBtn.addEventListener("mouseenter", () => {
        cancelBtn.style.background = "rgba(229, 9, 20, 0.1)";
      });
      cancelBtn.addEventListener("mouseleave", () => {
        cancelBtn.style.background = "transparent";
      });

      confirmBtn.addEventListener("mouseenter", () => {
        confirmBtn.style.background = "#cc0812";
      });
      confirmBtn.addEventListener("mouseleave", () => {
        confirmBtn.style.background = "#e50914";
      });

      // Add event listeners
      cancelBtn.addEventListener("click", () => {
        document.body.removeChild(overlay);
        resolve(false);
      });

      confirmBtn.addEventListener("click", () => {
        document.body.removeChild(overlay);
        resolve(true);
      });

      // Close on overlay click
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          document.body.removeChild(overlay);
          resolve(false);
        }
      });

      // Close on escape key
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          document.body.removeChild(overlay);
          document.removeEventListener("keydown", handleEscape);
          resolve(false);
        }
      };
      document.addEventListener("keydown", handleEscape);

      // Assemble modal
      buttonsContainer.appendChild(cancelBtn);
      buttonsContainer.appendChild(confirmBtn);
      modal.appendChild(messageEl);
      modal.appendChild(buttonsContainer);
      overlay.appendChild(modal);

      // Add to DOM
      document.body.appendChild(overlay);

      // Focus confirm button
      confirmBtn.focus();
    });
  }

  static success(message, duration = 3000) {
    this.showToast(message, "success", duration);
  }

  static error(message, duration = 5000) {
    this.showToast(message, "error", duration);
  }

  static showToast(message, type = "info", duration = 3000) {
    const toast = document.createElement("div");
    toast.className = `alert-toast alert-toast--${type}`;
    toast.textContent = message;
    
    const baseStyles = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 4px;
      color: white;
      font-weight: 600;
      z-index: 1001;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
      word-wrap: break-word;
    `;

    const typeStyles = {
      success: "background: #4caf50;",
      error: "background: #f44336;",
      info: "background: #2196f3;"
    };

    toast.style.cssText = baseStyles + (typeStyles[type] || typeStyles.info);

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = "translateX(0)";
    }, 10);

    // Animate out and remove
    setTimeout(() => {
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, duration);
  }
}