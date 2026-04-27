<script>
export default {
  name: "SideNavbarComponent",
  data() {
    return {
      isExpanded: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.isExpanded = !this.isExpanded;
      this.$emit("toggle", this.isExpanded);
    },
    navigate(path) {
      this.$router.push(path).catch(() => {});
    },
    logout() {
      this.$router.push("/").catch(() => {});
    },
  },
  computed: {
    navItems() {
      return [
        { name: this.$t("nav.home") || "Inicio", path: "/home", icon: "home" },
        { name: this.$t("nav.warehouses") || "Almacenes", path: "/warehouses", icon: "warehouses" },
        { name: this.$t("nav.care_guides") || "Guias de cuidado", path: "/care-guides", icon: "care-guides" },
        { name: this.$t("nav.orders") || "Ordenes", path: "/orders", icon: "orders" },
        { name: this.$t("nav.supplier_orders") || "Ventas (Prov.)", path: "/supplier-orders", icon: "supplier-orders" },
        { name: this.$t("nav.catalogs") || "Catálogos", path: "/catalogs", icon: "catalogs" },
        { name: this.$t("nav.products") || "Productos", path: "/storage", icon: "products" },
        { name: this.$t("nav.suppliers") || "Proveedores", path: "/supplier-search", icon: "suppliers" },
        { name: this.$t("nav.cart") || "Carrito", path: "/cart", icon: "cart" },
        { name: this.$t("nav.subscriptions") || "Suscripciones", path: "/subscriptions", icon: "subscriptions" },
        { name: this.$t("nav.admin") || "Panel de administración", path: "/admin-panel", icon: "admin" },
        { name: this.$t("nav.profile") || "Mi Cuenta", path: "/profile", icon: "profile" },
      ];
    },
    currentRoute() {
      return this.$route ? this.$route.path : "/home";
    },
  },
};
</script>

<template>
  <nav :class="['side-navbar', { expanded: isExpanded }]">
    <div class="navbar-header" @click="toggleSidebar">
      <div class="brand-logo">
        <svg viewBox="0 0 24 24" class="logo-icon">
          <path
            fill="currentColor"
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          />
        </svg>
      </div>
      <span class="brand-text" v-if="isExpanded">
        <span class="brand-stock">Stock</span><span class="brand-sip">Sip</span>
      </span>
    </div>

    <ul class="nav-links">
      <li
        v-for="item in navItems"
        :key="item.name"
        :class="['nav-item', { active: currentRoute === item.path }]"
        @click="navigate(item.path)"
      >
        <div class="icon-wrapper">
          <svg v-if="item.icon === 'home'" viewBox="0 0 24 24" class="nav-icon">
            <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <svg
            v-else-if="item.icon === 'warehouses'"
            viewBox="0 0 24 24"
            class="nav-icon"
          >
            <path
              fill="currentColor"
              d="M12 3L2 8v13h20V8l-10-5zm-6 16v-8h2v8H6zm4 0v-8h2v8h-2zm4 0v-8h2v8h-2z"
            />
          </svg>
          <svg
            v-else-if="item.icon === 'care-guides'"
            viewBox="0 0 24 24"
            class="nav-icon"
          >
            <path
              fill="currentColor"
              d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H6V4h2v8l2.5-1.5L13 12V4h5v16z"
            />
          </svg>
          <svg
            v-else-if="item.icon === 'orders'"
            viewBox="0 0 24 24"
            class="nav-icon"
          >
            <path
              fill="currentColor"
              d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3m-3 11H8v-5h8v5m3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1m-1-9H6v4h12V3z"
            />
          </svg>
          <svg
            v-else-if="item.icon === 'supplier-orders'"
            viewBox="0 0 24 24"
            class="nav-icon"
          >
            <path
              fill="currentColor"
              d="M3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20zm3-4H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2z"
            />
          </svg>
          <svg
            v-else-if="item.icon === 'catalogs'"
            viewBox="0 0 24 24"
            class="nav-icon"
          >
            <path
              fill="currentColor"
              d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"
            />
          </svg>
          <svg
            v-else-if="item.icon === 'products'"
            viewBox="0 0 24 24"
            class="nav-icon"
          >
            <path
              fill="currentColor"
              d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"
            />
          </svg>
          <svg
            v-else-if="item.icon === 'suppliers'"
            viewBox="0 0 24 24"
            class="nav-icon"
          >
            <path
              fill="currentColor"
              d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"
            />
          </svg>
          <svg
            v-else-if="item.icon === 'cart'"
            viewBox="0 0 24 24"
            class="nav-icon"
          >
            <path
              fill="currentColor"
              d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
            />
          </svg>
          <svg
            v-else-if="item.icon === 'subscriptions'"
            viewBox="0 0 24 24"
            class="nav-icon"
          >
            <path
              fill="currentColor"
              d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"
            />
          </svg>
          <svg
            v-else-if="item.icon === 'admin'"
            viewBox="0 0 24 24"
            class="nav-icon"
          >
            <path
              fill="currentColor"
              d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.4 0 2.8 1.1 2.8 2.5V11c.6 0 1.2.6 1.2 1.2v3.5c0 .7-.6 1.3-1.2 1.3H9.2c-.6 0-1.2-.6-1.2-1.3v-3.5c0-.6.6-1.2 1.2-1.2V9.5C9.2 8.1 10.6 7 12 7zm0 1c-.8 0-1.5.7-1.5 1.5V11h3V9.5C13.5 8.7 12.8 8 12 8z"
            />
          </svg>
          <svg
            v-else-if="item.icon === 'profile'"
            viewBox="0 0 24 24"
            class="nav-icon"
          >
            <path
              fill="currentColor"
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
        </div>
        <span class="nav-text" v-if="isExpanded">{{ item.name }}</span>
        <span class="nav-tooltip" v-if="!isExpanded">{{ item.name }}</span>
      </li>
    </ul>

    <div class="navbar-footer">
      <div class="nav-item logout" @click="logout">
        <div class="icon-wrapper">
          <svg viewBox="0 0 24 24" class="nav-icon">
            <path
              fill="currentColor"
              d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
            />
          </svg>
        </div>
        <span class="nav-text" v-if="isExpanded">{{ $t('profile.logout') }}</span>
        <span class="nav-tooltip" v-if="!isExpanded">Salir</span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.side-navbar {
  --top-bg: #2b000d;
  --bottom-bg: #f4ecec;
  --accent-red: #e53e3e;
  --button-bg: #4a1b2a;
  --white: #ffffff;
  --black: #000000;

  --glass-bg: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(43, 0, 13, 0.12);

  --text-primary: rgba(0, 0, 0, 0.82);
  --text-secondary: rgba(0, 0, 0, 0.55);

  --shadow-soft: 0 10px 40px rgba(43, 0, 13, 0.08);
  --shadow-hover: 0 16px 50px rgba(43, 0, 13, 0.14);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 80px; /* Ancho colapsado */
  background: var(--glass-bg);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-right: 1px solid var(--glass-border);
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  transition: width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: 1000;
  overflow: visible;
}

.side-navbar.expanded {
  width: 260px;
}

.navbar-header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  cursor: pointer;
  border-bottom: 1px solid var(--glass-border);
  transition: padding 0.3s ease;
}

.side-navbar.expanded .navbar-header {
  justify-content: flex-start;
}

.brand-logo {
  min-width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--top-bg), var(--button-bg));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  box-shadow: 0 4px 12px rgba(43, 0, 13, 0.25);
  transition: transform 0.3s ease;
}

.navbar-header:hover .brand-logo {
  transform: scale(1.05);
}

.logo-icon {
  width: 22px;
  height: 22px;
}

.brand-text {
  margin-left: 16px;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.5px;
  white-space: nowrap;
  opacity: 0;
  animation: fadeIn 0.4s ease forwards 0.1s;
}

.brand-stock {
  color: var(--accent-red);
}

.brand-sip {
  color: var(--text-primary);
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.nav-links {
  list-style: none;
  padding: 24px 12px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-links::-webkit-scrollbar {
  width: 4px;
}

.nav-links::-webkit-scrollbar-thumb {
  background: var(--glass-border);
  border-radius: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 14px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  position: relative;
}

.nav-item:hover {
  background: rgba(43, 0, 13, 0.04);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--button-bg);
  color: var(--white);
  box-shadow: 0 8px 20px rgba(74, 27, 42, 0.2);
}

.icon-wrapper {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon {
  width: 22px;
  height: 22px;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.nav-item:hover .nav-icon {
  transform: scale(1.15);
}

.nav-text {
  margin-left: 12px;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards 0.1s;
}

.nav-tooltip {
  position: absolute;
  left: calc(100% + 12px);
  background: var(--top-bg);
  color: var(--white);
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1001;
}

.nav-tooltip::before {
  content: "";
  position: absolute;
  top: 50%;
  left: -4px;
  transform: translateY(-50%);
  border-width: 5px 5px 5px 0;
  border-style: solid;
  border-color: transparent var(--top-bg) transparent transparent;
}

.nav-item:hover .nav-tooltip {
  opacity: 1;
  transform: translateX(0);
}

.navbar-footer {
  padding: 20px 12px;
  border-top: 1px solid var(--glass-border);
}

.nav-item.logout {
  color: var(--accent-red);
}

.nav-item.logout:hover {
  background: rgba(229, 62, 62, 0.08);
}
</style>
