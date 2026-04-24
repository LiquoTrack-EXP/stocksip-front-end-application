<script setup>
/**
 * supplier-search.component component.
 * @displayName supplier-search.component
 * @version 1.0.0
 */
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { CatalogService } from '@/features/procurementordering/services/procurement.service';

const router = useRouter();

const query = ref('');
const suppliers = ref([]);
const isLoading = ref(true);
const error = ref(null);

const goBack = () => router.go(-1);

const loadSuppliers = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const accountId = localStorage.getItem('accountId');
    const response = await CatalogService.getAccountWithBusiness(accountId);
    suppliers.value = response.data || [];
  } catch (err) {
    console.error('Error loading suppliers:', err);
    error.value = 'No se pudieron cargar los proveedores.';
  } finally {
    isLoading.value = false;
  }
};
const filteredSuppliers = computed(() => {
  if (!query.value) return suppliers.value;
  const q = query.value.toLowerCase();
  return suppliers.value.filter(s => 
    (s.account?.business?.businessName || '').toLowerCase().includes(q) ||
    (s.account?.business?.businessEmail || '').toLowerCase().includes(q)
  );
});

const onSupplierSelected = (accountId) => {
  router.push(`/supplier-catalog/${accountId}`);
};

const retryLoading = () => {
  loadSuppliers();
};

onMounted(() => {
  loadSuppliers();
});
</script>

<template>
  <div class="web-layout supplier-search-layout">
    <div class="content-wrapper">
      
      
      <header class="page-header">
        <button class="icon-btn" @click="goBack" :title="$t('common.back')">
          <svg viewBox="0 0 24 24" class="header-icon"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <h1 class="page-title">{{ $t('suppliers.title') }}</h1>
        <div class="header-spacer"></div>
      </header>

      
      <div class="search-bar-container glass-panel">
        <svg viewBox="0 0 24 24" class="search-icon"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <input 
          type="text" 
          v-model="query" 
          :placeholder="$t('suppliers.search_placeholder')" 
          class="search-input"
        />
      </div>

      <div class="results-container">
        
        
        <div v-if="isLoading" class="state-container glass-panel">
          <svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
        </div>

        
        <div v-else-if="error" class="state-container glass-panel error-state">
          <h3 class="error-title">{{ $t('suppliers.error_loading') }}</h3>
          <p class="error-desc">{{ error }}</p>
          <button class="pill-btn retry-btn" @click="retryLoading">{{ $t('common.retry') }}</button>
        </div>

        
        <div v-else-if="query.trim() === ''" class="state-container empty-state glass-panel">
          <svg viewBox="0 0 24 24" class="empty-icon"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <h3 class="empty-title">{{ $t('suppliers.begin_search') }}</h3>
          <p class="empty-desc">{{ $t('suppliers.begin_search_desc') }}</p>
        </div>

        
        <div v-else-if="filteredSuppliers.length === 0" class="state-container empty-state glass-panel">
          <p class="empty-desc">{{ $t('suppliers.not_found') }} "{{ query }}".</p>
        </div>

        
        <div v-else class="suppliers-list">
          <div 
            v-for="supplier in filteredSuppliers" 
            :key="supplier.account.id" 
            class="supplier-card glass-panel"
            @click="onSupplierSelected(supplier.account.id)"
          >
            <div class="supplier-info">
              <h3 class="s-name">{{ supplier.account.business.businessName }}</h3>
              <p class="s-email">{{ supplier.account.business.businessEmail }}</p>
            </div>
            <div class="supplier-stats">
              <span class="catalogs-count">{{ supplier.catalogs.length }}</span>
              <span class="catalogs-label">{{ $t('catalogs.plural') }}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
.supplier-search-layout {
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


.search-bar-container { display: flex; align-items: center; gap: 12px; padding: 8px 16px; margin-bottom: 24px; transition: box-shadow 0.2s; }
.search-bar-container:focus-within { box-shadow: 0 16px 40px rgba(74, 27, 42, 0.15); border-color: rgba(74, 27, 42, 0.3); }
.search-icon { width: 24px; height: 24px; color: rgba(0,0,0,0.4); }
.search-input { flex: 1; padding: 12px 0; border: none; background: transparent; font-size: 16px; color: #2b000d; outline: none; font-family: inherit; }
.search-input::placeholder { color: rgba(0,0,0,0.4); }


.state-container { padding: 60px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.empty-icon { width: 64px; height: 64px; color: #4a1b2a; opacity: 0.3; margin-bottom: 16px; }
.empty-title { font-size: 20px; font-weight: 700; color: #4a1b2a; margin: 0 0 8px; }
.empty-desc { color: rgba(0,0,0,0.55); font-size: 16px; margin: 0; }

.error-title { color: #e53e3e; font-size: 18px; font-weight: 700; margin-bottom: 8px; }
.error-desc { color: rgba(0,0,0,0.6); margin-bottom: 24px; }
.retry-btn { background: #2b000d; color: white; border: none; padding: 12px 24px; border-radius: 20px; font-weight: 700; cursor: pointer; }
.retry-btn:hover { background: #4a1b2a; }


.suppliers-list { display: flex; flex-direction: column; gap: 16px; }
.supplier-card {
  padding: 20px 24px; display: flex; justify-content: space-between; align-items: center;
  cursor: pointer; transition: all 0.2s;
}
.supplier-card:hover { transform: translateY(-3px); box-shadow: 0 20px 48px rgba(43, 0, 13, 0.12); }

.supplier-info { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.s-name { font-size: 18px; font-weight: 700; color: #2b000d; margin: 0; }
.s-email { font-size: 14px; color: rgba(0,0,0,0.55); margin: 0; }

.supplier-stats { display: flex; flex-direction: column; align-items: flex-end; justify-content: center; background: rgba(74, 27, 42, 0.05); padding: 12px 16px; border-radius: 16px; }
.catalogs-count { font-size: 20px; font-weight: 800; color: #8b4c5c; line-height: 1; margin-bottom: 2px; }
.catalogs-label { font-size: 12px; color: #8b4c5c; font-weight: 600; }


.spinner { animation: rotate 2s linear infinite; width: 40px; height: 40px; }
.spinner .path { stroke: #4a1b2a; stroke-linecap: round; animation: dash 1.5s ease-in-out infinite; }
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash { 0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; } 50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; } 100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; } }
</style>
