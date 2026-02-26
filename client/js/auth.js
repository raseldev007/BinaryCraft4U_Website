// Auth helpers
const AUTH_KEY = 'bc_token';
const USER_KEY = 'bc_user';

const Auth = {
    setSession: (token, user) => {
        localStorage.setItem(AUTH_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    getUser: () => {
        try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; }
        catch { return null; }
    },
    getToken: () => localStorage.getItem(AUTH_KEY),
    isLoggedIn: () => !!localStorage.getItem(AUTH_KEY),
    isAdmin: () => { const u = Auth.getUser(); return u && u.role === 'admin'; },
    logout: () => {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('bc_cart_count');
        showToast('Logged out successfully', 'info');
        setTimeout(() => window.location.href = 'index.html', 800);
    },
    requireAuth: () => {
        if (!Auth.isLoggedIn()) {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
            return false;
        }
        return true;
    },
    requireAdmin: () => {
        if (!Auth.isAdmin()) { window.location.href = 'index.html'; return false; }
        return true;
    }
};

// Update navbar based on auth state
const updateNavAuth = () => {
    const user = Auth.getUser();
    const authSection = document.getElementById('nav-auth');
    const cartCount = parseInt(localStorage.getItem('bc_cart_count') || '0');
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge && cartCount > 0) { cartBadge.textContent = cartCount; cartBadge.style.display = 'flex'; }

    if (!authSection) return;
    if (user) {
        authSection.innerHTML = `
      <a href="cart.html" class="cart-btn" title="Cart">
        🛒 <span class="cart-badge" id="cart-badge" style="display:${cartCount > 0 ? 'flex' : 'none'}">${cartCount}</span>
      </a>
      <div class="user-menu">
        <div class="user-avatar-btn">👤</div>
        <div class="user-dropdown">
          <a href="dashboard.html"><i class="fas fa-chart-bar"></i> Dashboard</a>
          <a href="profile.html">👤 Profile</a>
          <a href="order-history.html"><i class="fas fa-box"></i> My Orders</a>
          ${user.role === 'admin' ? '<a href="admin/index.html">⚙️ Admin Panel</a>' : ''}
          <div class="divider"></div>
          <a href="#" onclick="Auth.logout()">🚪 Logout</a>
        </div>
      </div>`;
    } else {
        authSection.innerHTML = `
      <a href="cart.html" class="cart-btn" title="Cart">🛒</a>
      <a href="login.html" class="btn btn-outline btn-sm">Login</a>
      <a href="register.html" class="btn btn-primary btn-sm">Get Started</a>`;
    }
};

// Toast helper
const showToast = (message, type = 'success') => {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3500);
};

window.Auth = Auth;
window.showToast = showToast;
window.updateNavAuth = updateNavAuth;

document.addEventListener('DOMContentLoaded', updateNavAuth);
