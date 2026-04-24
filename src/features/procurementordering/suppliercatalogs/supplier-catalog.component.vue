<script setup>
/**
 * supplier-catalog.component component.
 * @displayName supplier-catalog.component
 * @version 1.0.0
 */
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { CatalogService } from '@/features/procurementordering/services/procurement.service';
import { AccountService } from '@/features/paymentsandsubscriptions/services/account.service';

const router = useRouter();
const route = useRoute();

const supplierId = ref(route.params.id);
const isLoading = ref(true);
const error = ref(null);
const supplierInfo = ref(null);

const goBack = () => router.go(-1);

const loadSupplierCatalogs = async () => {
  isLoading.value = true;
  error.value = null;
  try {

    const accRes = await AccountService.getAccountById(supplierId.value);
    const businessName = accRes.data?.business?.businessName || 'Proveedor';

    const catRes = await CatalogService.getAllCatalogsByAccount(supplierId.value);
    
    supplierInfo.value = {
      account: { business: { businessName } },
      catalogs: catRes.data || []
    };
  } catch (err) {
    console.error('Error loading supplier catalogs:', err);
    error.value = 'No se pudieron cargar los catálogos del proveedor.';
  } finally {
    isLoading.value = false;
  }
};
const retryLoading = () => {
  loadSupplierCatalogs();
};

const goToCatalog = (catalogId) => {
  router.push(`/supplier-catalog-detail/${catalogId}`);
};

onMounted(() => {
  loadSupplierCatalogs();
});
</script>

<template>
  <div class="web-layout supplier-catalog-layout">
    <div class="content-wrapper">
      
      
      <header class="page-header">
        <button class="icon-btn" @click="goBack" title="Volver">
          <svg viewBox="0 0 24 24" class="header-icon"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <h1 class="page-title">Catálogos del Proveedor</h1>
        <div class="header-spacer"></div>
      </header>

      <div class="catalog-content">
        
        
        <div v-if="isLoading" class="state-container glass-panel">
          <svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
        </div>

        
        <div v-else-if="error" class="state-container glass-panel error-state">
          <h3 class="error-title">Error al cargar los catálogos</h3>
          <p class="error-desc">{{ error }}</p>
          <button class="pill-btn retry-btn" @click="retryLoading">{{ $t('common.retry') }}</button>
        </div>

        
        <div v-else-if="supplierInfo" class="supplier-data-container">
          
          
          <div class="supplier-info-card glass-panel">
            <h2 class="business-name">{{ supplierInfo.account.business.businessName }}</h2>
            <p class="catalogs-count">{{ supplierInfo.catalogs.length }} catálogos disponibles</p>
          </div>

          
          <div v-if="supplierInfo.catalogs.length === 0" class="state-container glass-panel">
            <p class="empty-text">Este proveedor aún no tiene catálogos disponibles.</p>
          </div>
          
          <div v-else class="catalogs-list">
            <div 
              v-for="catalog in supplierInfo.catalogs" 
              :key="catalog.id" 
              class="catalog-card glass-panel"
              @click="goToCatalog(catalog.id)"
            >
              <div class="catalog-info">
                <h3 class="catalog-name">{{ catalog.name }}</h3>
                <p class="catalog-desc">{{ catalog.description }}</p>
              </div>
              <div class="catalog-stats">
                <span class="product-count">{{ Array.isArray(catalog.catalogItems) ? catalog.catalogItems.length : 0 }}</span>
                <span class="product-label">productos</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.supplier-catalog-layout {
  min-height: 100vh; background-color: #f4ecec; padding: 20px;
  display: flex; flex-direction: column; align-items: center;
}
.content-wrapper { width: 100%; max-width: 800px; display: flex; flex-direction: column; }


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
.retry-btn { background: #2b000d; color: white; border: none; padding: 12px 24px; border-radius: 20px; font-weight: 700; cursor: pointer; }
.retry-btn:hover { background: #4a1b2a; }


.supplier-data-container { display: flex; flex-direction: column; gap: 24px; }


.supplier-info-card {
  padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center;
  background: rgba(247, 231, 232, 0.8); 
  border-color: rgba(139, 76, 92, 0.15);
}
.business-name { font-size: 20px; font-weight: 800; color: #2b000d; margin: 0 0 8px; }
.catalogs-count { font-size: 14px; color: rgba(0,0,0,0.6); font-weight: 500; margin: 0; }


.catalogs-list { display: flex; flex-direction: column; gap: 16px; }

.catalog-card {
  padding: 20px 24px; display: flex; justify-content: space-between; align-items: center;
  cursor: pointer; transition: all 0.2s;
}
.catalog-card:hover { transform: translateY(-3px); box-shadow: 0 20px 48px rgba(43, 0, 13, 0.12); }

.catalog-info { display: flex; flex-direction: column; gap: 6px; flex: 1; padding-right: 16px; }
.catalog-name { font-size: 18px; font-weight: 700; color: #2b000d; margin: 0; }
.catalog-desc { font-size: 14px; color: rgba(0,0,0,0.55); margin: 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.catalog-stats { display: flex; flex-direction: column; align-items: flex-end; justify-content: center; }
.product-count { font-size: 24px; font-weight: 800; color: #8b4c5c; line-height: 1; }
.product-label { font-size: 12px; color: #8b4c5c; font-weight: 600; margin-top: 4px; }


.spinner { animation: rotate 2s linear infinite; width: 40px; height: 40px; }
.spinner .path { stroke: #4a1b2a; stroke-linecap: round; animation: dash 1.5s ease-in-out infinite; }
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash { 0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; } 50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; } 100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; } }
</style>
