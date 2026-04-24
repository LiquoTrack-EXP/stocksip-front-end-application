<script setup>
/**
 * supplier-catalog-detail.component component.
 * @displayName supplier-catalog-detail.component
 * @version 1.0.0
 */
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const catalogId = ref(route.params.id || 'cat-001');

const isLoading = ref(false);
const error = ref(null);

const catalog = ref(null);
const supplierInfo = ref(null);

const goBack = () => router.go(-1);

const loadCatalog = () => {
  isLoading.value = true;
  error.value = null;
  
  setTimeout(() => {
    isLoading.value = false;
    supplierInfo.value = {
      account: { business: { businessName: 'Distribuidora Los Andes S.A.C.' } }
    };
    catalog.value = {
      name: 'Catálogo de Licores Premium',
      contactEmail: 'ventas@losandes.com',
      catalogItems: [
        { productId: 'prod-1', productName: 'Vino Tinto Reserva 2018', unitPrice: '$25.00', imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=400' },
        { productId: 'prod-2', productName: 'Pisco Acholado', unitPrice: '$30.00', imageUrl: '' },
        { productId: 'prod-3', productName: 'Cerveza Artesanal', unitPrice: '$5.00', imageUrl: '' }
      ]
    };
  }, 800);
};

const goToProductDetail = (item) => {

  router.push(`/catalog-item/${catalogId.value}/${item.productId}`);
};

onMounted(() => {
  loadCatalog();
});
</script>

<template>
  <div class="web-layout catalog-detail-layout">
    <div class="content-wrapper">
      
      
      <header class="page-header">
        <button class="icon-btn" @click="goBack" title="Volver">
          <svg viewBox="0 0 24 24" class="header-icon"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <h1 class="page-title">{{ catalog?.name || 'Detalle del Catálogo' }}</h1>
        <div class="header-spacer"></div>
      </header>

      
      <div v-if="isLoading" class="state-container glass-panel">
        <svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
      </div>

      
      <div v-else-if="error" class="state-container glass-panel error-state">
        <h3 class="error-title">Error</h3>
        <p class="error-desc">{{ error }}</p>
      </div>

      
      <div v-else-if="catalog" class="catalog-data-container">
        
        
        <div class="supplier-info-card glass-panel">
          <h2 class="business-name">{{ supplierInfo?.account?.business?.businessName || 'Proveedor Desconocido' }}</h2>
          <span class="supplier-badge">Proveedor</span>
          <p class="supplier-email">{{ catalog.contactEmail }}</p>
        </div>

        <h3 class="section-title">Productos Disponibles</h3>

        
        <div v-if="catalog.catalogItems.length === 0" class="state-container glass-panel">
          <p class="empty-text">No se encontraron productos en este catálogo.</p>
        </div>

        <div v-else class="products-grid">
          <div 
            v-for="item in catalog.catalogItems" 
            :key="item.productId" 
            class="product-card glass-panel"
            @click="goToProductDetail(item)"
          >
            <div class="product-img-wrapper">
              <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.productName" />
              <div v-else class="img-placeholder"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></div>
            </div>
            <div class="product-info">
              <h4 class="p-name">{{ item.productName }}</h4>
              <p class="p-price">{{ item.unitPrice || 'N/A' }}</p>
              <button class="pill-btn add-btn" @click.stop="goToProductDetail(item)">Ver Detalle</button>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
.catalog-detail-layout {
  min-height: 100vh; background-color: #f4ecec; padding: 20px;
  display: flex; flex-direction: column; align-items: center;
}
.content-wrapper { width: 100%; max-width: 900px; display: flex; flex-direction: column; }


.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-top: 12px; }
.page-title { font-size: 24px; font-weight: 800; color: #2b000d; margin: 0; }
.icon-btn { background: transparent; border: none; cursor: pointer; padding: 8px; border-radius: 50%; color: #2b000d; transition: background 0.2s; display: flex; align-items: center; justify-content: center; }
.icon-btn:hover { background: rgba(74, 27, 42, 0.08); }
.header-icon { width: 26px; height: 26px; }
.header-spacer { width: 42px; }


.glass-panel {
  background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(43, 0, 13, 0.12); box-shadow: 0 16px 40px rgba(43, 0, 13, 0.06); border-radius: 20px;
}


.state-container { padding: 60px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.empty-text { color: rgba(0,0,0,0.55); font-size: 16px; font-weight: 500; }
.error-title { color: #e53e3e; font-size: 18px; font-weight: 700; margin-bottom: 8px; }
.error-desc { color: rgba(0,0,0,0.6); margin-bottom: 24px; }


.catalog-data-container { display: flex; flex-direction: column; gap: 24px; }


.supplier-info-card {
  padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;
}
.business-name { font-size: 20px; font-weight: 800; color: #2b000d; margin: 0 0 4px; }
.supplier-badge { font-size: 12px; background: rgba(74, 27, 42, 0.1); color: #4a1b2a; padding: 4px 12px; border-radius: 12px; font-weight: 700; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
.supplier-email { font-size: 14px; color: rgba(0,0,0,0.55); margin: 0; }

.section-title { font-size: 18px; font-weight: 800; color: #4a1b2a; margin: 8px 0 0 4px; }


.products-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px;
}

.product-card {
  padding: 16px; display: flex; flex-direction: column; align-items: center;
  cursor: pointer; transition: all 0.2s;
}
.product-card:hover { transform: translateY(-3px); box-shadow: 0 20px 48px rgba(43, 0, 13, 0.12); }

.product-img-wrapper {
  width: 100%; aspect-ratio: 1; border-radius: 12px; background: rgba(43, 0, 13, 0.04);
  display: flex; align-items: center; justify-content: center; overflow: hidden; margin-bottom: 12px;
}
.product-img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
.img-placeholder { color: rgba(0,0,0,0.2); width: 40px; height: 40px; }

.product-info { display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%; }
.p-name { font-size: 15px; font-weight: 700; color: #2b000d; margin: 0 0 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.p-price { font-size: 14px; color: rgba(0,0,0,0.55); font-weight: 600; margin: 0 0 12px; }

.add-btn { background: #4a1b2a; color: white; border: none; padding: 10px 16px; border-radius: 16px; font-weight: 700; cursor: pointer; width: 100%; font-size: 13px; transition: background 0.2s; }
.add-btn:hover { background: #2b000d; }


.spinner { animation: rotate 2s linear infinite; width: 40px; height: 40px; }
.spinner .path { stroke: #4a1b2a; stroke-linecap: round; animation: dash 1.5s ease-in-out infinite; }
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash { 0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; } 50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; } 100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; } }
</style>
