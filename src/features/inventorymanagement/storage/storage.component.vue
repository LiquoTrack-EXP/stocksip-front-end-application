<script>
import { ProductService } from '@/features/inventorymanagement/services/inventory.service';

/**
 * StorageComponent component.
 * @displayName StorageComponent
 * @version 1.0.0
 */
export default {
  name: "StorageComponent",
  data() {
    return {
      isLoading: true,
      maxProducts: 0,
      products: [],
      error: null,
    };
  },
  async mounted() {
    await this.fetchProducts();
  },
  methods: {
    /**
     * fetchProducts
     * @public
     */
    async fetchProducts() {
      this.isLoading = true;
      this.error = null;
      try {
        const accountId = localStorage.getItem('accountId');
        /**
         * if
         * @param {any} !accountId
         * @public
         */
        if (!accountId) { this.isLoading = false; return; }
        const response = await ProductService.getAccountProducts(accountId);
        if (Array.isArray(response.data)) {
          this.products = response.data;
        } else if (response.data && Array.isArray(response.data.products)) {
          this.products = response.data.products;
        } else if (response.data && Array.isArray(response.data.items)) {
          this.products = response.data.items;
        } else {
          this.products = [];
        }
        this.maxProducts = response.data?.maxProductsAllowed || 0;
      } catch (err) {
        console.error('Error fetching products:', err);
        this.error = 'No se pudieron cargar los productos.';
      } finally {
        this.isLoading = false;
      }
    },
    goToCreate() {
      this.$router.push("/storage/create");
    },
    goToDetail(productId) {
      this.$router.push(`/product_detail/${productId}`);
    },
  },
};
</script>

<template>
  <div class="storage-container web-layout">
    <div class="content-wrapper">
      
      <header class="web-header">
        <div class="header-titles">
          <h1 class="page-title">Storage</h1>
          <p class="page-subtitle">
            Visualiza el registro detallado de las bebidas y licores
            disponibles.
          </p>
        </div>
      </header>

      
      <div class="stats-banner glass-panel">
        <div class="stats-info">
          <div class="stat-block">
            <span class="stat-label">Actual:</span>
            <span class="stat-value">{{ products.length }}</span>
          </div>

          <div class="stat-divider"></div>

          <div class="stat-block">
            <span class="stat-label">Máx. permitido:</span>
            <span class="stat-value">{{ maxProducts }}</span>
          </div>
        </div>

        <button class="action-btn dark-btn" @click="goToCreate">
          + New Product
        </button>
      </div>

      
      <div class="main-content">
        
        <div v-if="isLoading" class="products-grid">
          <div
            class="product-card glass-panel"
            v-for="i in 5"
            :key="'skel-s-' + i"
          >
            
            <pv-skeleton
              width="100%"
              height="190px"
              borderRadius="16px 16px 0 0"
              class="skel-img"
            ></pv-skeleton>

            <div class="card-details">
              
              <pv-skeleton
                width="85%"
                height="1.4rem"
                borderRadius="8px"
                class="skel-mb"
              ></pv-skeleton>
              <pv-skeleton
                width="50%"
                height="1rem"
                borderRadius="8px"
                class="skel-mb-large"
              ></pv-skeleton>

              
              <div class="stat-divider-horizontal"></div>

              
              <div class="skel-footer">
                <div class="skel-column">
                  <pv-skeleton
                    width="40px"
                    height="0.7rem"
                    borderRadius="4px"
                    class="skel-mb-sm"
                  ></pv-skeleton>
                  <pv-skeleton
                    width="60px"
                    height="1.1rem"
                    borderRadius="6px"
                  ></pv-skeleton>
                </div>
                <div class="skel-column" style="align-items: flex-end">
                  <pv-skeleton
                    width="30px"
                    height="0.7rem"
                    borderRadius="4px"
                    class="skel-mb-sm"
                  ></pv-skeleton>
                  <pv-skeleton
                    width="45px"
                    height="1.1rem"
                    borderRadius="6px"
                  ></pv-skeleton>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div v-else-if="products.length === 0" class="empty-state-fullscreen">
          <div class="empty-icon-wrap">
            
            <svg viewBox="0 0 24 24" class="empty-icon">
              
              <path
                fill="currentColor"
                d="M7.5 21H10v-2H9v-4c1.66 0 3-1.34 3-3V7.5H6V12c0 1.66 1.34 3 3 3v4H7.5v2zM7.5 9h3v1.5H7.5V9z"
              />
              
              <path
                fill="currentColor"
                d="M19 21h-6v-9.5L14 9V5h2v4l1 2.5V21zm-2.5-17v1.5h1V4h-1z"
              />
            </svg>
          </div>

          <h2 class="empty-title">You don't have any products yet.</h2>
          <p class="empty-subtitle">Tap the button above to create one.</p>
        </div>

        
        <div v-else class="products-grid">
          <div
            class="product-card glass-panel"
            v-for="product in products"
            :key="product.id || product.productId"
            @click="goToDetail(product.id || product.productId)"
            style="cursor: pointer;"
          >
            <div class="product-img-wrap">
              <img v-if="product.imageUrl" :src="product.imageUrl" alt="Product" class="product-img" />
              <div v-else class="img-placeholder">
                <svg viewBox="0 0 24 24" class="ph-icon"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
              </div>
            </div>

            <div class="card-details">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-meta">{{ product.brand || 'Marca no especificada' }} • {{ product.type || 'Tipo no especificado' }}</p>

              <div class="stat-divider-horizontal"></div>

              <div class="product-footer">
                <div class="skel-column">
                  <span class="skel-mb-sm footer-label">Precio</span>
                  <span class="footer-value">{{ product.unitPrice }} {{ product.code || 'USD' }}</span>
                </div>
                <div class="skel-column" style="align-items: flex-end">
                  <span class="skel-mb-sm footer-label">Stock Min</span>
                  <span class="footer-value">{{ product.minimumStock || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.storage-container {
  --top-bg: #2b000d;
  --bottom-bg: #f4ecec;
  --accent-red: #e53e3e;
  --button-bg: #4a1b2a;
  --white: #ffffff;
  --black: #000000;

  --glass-bg: rgba(255, 255, 255, 0.95);
  --glass-border: rgba(43, 0, 13, 0.08);
  --text-primary: rgba(0, 0, 0, 0.85);
  --text-secondary: rgba(0, 0, 0, 0.55);

  padding: 40px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--bottom-bg);
  
  background:
    radial-gradient(
      circle at top right,
      rgba(229, 62, 62, 0.03),
      transparent 40%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(74, 27, 42, 0.03),
      transparent 40%
    ),
    var(--bottom-bg);
  animation: fadeIn 0.4s ease-out;
}

.content-wrapper {
  max-width: 1050px;
  margin: 0 auto;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


.web-header {
  margin-bottom: 24px;
}

.header-titles {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--top-bg);
  margin: 0 0 6px;
  letter-spacing: -0.5px;
}

.page-subtitle {
  margin: 0;
  font-size: 15px;
  color: var(--text-secondary);
}


.stats-banner {
  background: var(--white);
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 30px rgba(43, 0, 13, 0.04);
  border-radius: 20px;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.stats-info {
  display: flex;
  align-items: center;
}

.stat-block {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.stat-label {
  font-size: 18px;
  font-weight: 800;
  color: var(--top-bg);
}

.stat-value {
  font-size: 20px;
  font-weight: 800;
  color: var(--top-bg);
}

.stat-divider {
  width: 2px;
  height: 24px;
  background-color: rgba(43, 0, 13, 0.1);
  margin: 0 24px;
}


.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 30px; 
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}


.dark-btn {
  background: #1c060d; 
  color: var(--white);
  box-shadow: 0 8px 20px rgba(28, 6, 13, 0.25);
}

.dark-btn:hover {
  background: var(--top-bg);
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(43, 0, 13, 0.3);
}


.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
  animation: fadeIn 0.8s ease-out forwards;
}

.product-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--white);
  border: 1px solid var(--glass-border);
  box-shadow: 0 10px 30px rgba(43, 0, 13, 0.05);
  border-radius: 16px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.card-details {
  padding: 20px;
  display: flex;
  flex-direction: column;
}


.skel-img {
  border-bottom: 1px solid rgba(43, 0, 13, 0.06);
}
.skel-mb {
  margin-bottom: 8px;
}
.skel-mb-large {
  margin-bottom: 20px;
}
.skel-mb-sm {
  margin-bottom: 6px;
}

.stat-divider-horizontal {
  height: 1px;
  width: 100%;
  background: rgba(43, 0, 13, 0.06);
  margin: 16px 0;
}

.skel-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.skel-column {
  display: flex;
  flex-direction: column;
}


.skeleton-wrapper {
  margin-top: 20px;
}


.empty-state-fullscreen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 55vh; 
  padding: 40px 20px;
}

.empty-icon-wrap {
  margin-bottom: 24px;
  
  color: #c4bdbe;
}

.empty-icon {
  width: 100px;
  height: 100px;
}

.empty-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 12px;
  
  color: #8c8385;
  letter-spacing: -0.2px;
}

.empty-subtitle {
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
  color: #a0979a;
  font-weight: 500;
}

.product-img-wrap {
  width: 100%;
  height: 190px;
  background: rgba(43, 0, 13, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(43, 0, 13, 0.06);
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.ph-icon {
  width: 48px;
  height: 48px;
  color: rgba(43, 0, 13, 0.2);
}

.product-name {
  font-size: 18px;
  font-weight: 800;
  color: var(--top-bg);
  margin: 0 0 6px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-meta {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.footer-label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 600;
}

.footer-value {
  font-size: 15px;
  font-weight: 800;
  color: var(--top-bg);
}

@media (max-width: 768px) {
  .storage-container {
    padding: 20px 16px;
  }
  .stats-banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    padding: 24px;
  }
  .action-btn {
    width: 100%;
  }
}
@media (max-width: 480px) {
  .stats-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .stat-divider {
    display: none;
  }
}
</style>
