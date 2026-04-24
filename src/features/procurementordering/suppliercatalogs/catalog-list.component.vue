<script setup>
/**
 * catalog-list.component component.
 * @displayName catalog-list.component
 * @version 1.0.0
 */
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { CatalogService } from '@/features/procurementordering/services/procurement.service';

const router = useRouter();

const isLoading = ref(false);
const error = ref(null);
const catalogs = ref([]);

const loadCatalogs = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const accountId = localStorage.getItem('accountId');
    if (!accountId) { isLoading.value = false; return; }
    const response = await CatalogService.getAllCatalogsByAccount(accountId);
    catalogs.value = (response.data || []).map((c) => ({
      ...c,
      productCount: Array.isArray(c.catalogItems) ? c.catalogItems.length : 0,
    }));
  } catch (err) {
    console.error('Error loading catalogs:', err);
    error.value = 'No se pudieron cargar los catálogos.';
  } finally {
    isLoading.value = false;
  }
};

const goToCreateCatalog = () => {
  router.push('/catalogs/new');
};

const goToEditCatalog = (id) => {
  router.push(`/catalogs/edit/${id}`);
};

const toggleCatalogStatus = async (catalog) => {
  try {
    if (catalog.isPublished) {
      await CatalogService.unpublishCatalog(catalog.id);
    } else {
      await CatalogService.publishCatalog(catalog.id);
    }
    catalog.isPublished = !catalog.isPublished;
  } catch (err) {
    console.error('Error toggling catalog status:', err);
    alert('No se pudo cambiar el estado del catálogo.');
  }
};

onMounted(() => {
  loadCatalogs();
});
</script>

<template>
  <div class="web-layout catalog-list-layout">
    <div class="content-wrapper">
      
      
      <header class="page-header">
        <div class="header-titles">
          <h1 class="page-title">{{ $t('catalogs.title') }}</h1>
          <p class="page-subtitle">{{ $t('catalogs.subtitle') }}</p>
        </div>
        <button class="pill-btn add-btn" @click="goToCreateCatalog">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          {{ $t('catalogs.new_catalog') }}
        </button>
      </header>

      <div class="catalog-content">
        
        
        <div v-if="isLoading" class="state-container glass-panel">
          <svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
        </div>

        
        <div v-else-if="error" class="state-container glass-panel error-state">
          <h3 class="error-title">{{ $t('common.error_loading') }}</h3>
          <p class="error-desc">{{ error }}</p>
          <button class="pill-btn retry-btn" @click="loadCatalogs">{{ $t('common.retry') }}</button>
        </div>

        
        <div v-else-if="catalogs.length === 0" class="state-container empty-state glass-panel">
          <svg viewBox="0 0 24 24" class="empty-icon"><path fill="currentColor" d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>
          <h3 class="empty-title">{{ $t('catalogs.empty_title') }}</h3>
          <p class="empty-desc">{{ $t('catalogs.empty_desc') }}</p>
        </div>

        
        <div v-else class="catalogs-grid">
          <div 
            v-for="catalog in catalogs" 
            :key="catalog.id" 
            class="catalog-card glass-panel"
            @click="goToEditCatalog(catalog.id)"
          >
            <div class="card-header">
              <span class="status-badge" :class="{ 'active': catalog.isPublished, 'inactive': !catalog.isPublished }">
                {{ catalog.isPublished ? $t('catalogs.status.published') : $t('catalogs.status.draft') }}
              </span>
              <button class="icon-btn" @click.stop="toggleCatalogStatus(catalog)" title="Cambiar estado">
                <svg viewBox="0 0 24 24" v-if="catalog.isPublished"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                <svg viewBox="0 0 24 24" v-else><path fill="currentColor" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>
              </button>
            </div>
            
            <h3 class="c-name">{{ catalog.name }}</h3>
            <p class="c-desc">{{ catalog.description }}</p>
            
            <div class="card-footer">
              <div class="product-info">
                <span class="p-count">{{ catalog.productCount }}</span>
                <span class="p-label">{{ $t('products.plural') }}</span>
              </div>
              <button class="pill-btn edit-sm-btn">{{ $t('common.edit') }}</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.catalog-list-layout {
  min-height: 100vh; background-color: #f4ecec; padding: 40px 20px;
  display: flex; flex-direction: column; align-items: center;
}
.content-wrapper { width: 100%; max-width: 900px; display: flex; flex-direction: column; }


.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
.header-titles { display: flex; flex-direction: column; }
.page-title { font-size: 32px; font-weight: 800; color: #2b000d; margin: 0 0 8px; }
.page-subtitle { font-size: 16px; color: rgba(0,0,0,0.55); margin: 0; }

.add-btn { background: #4a1b2a; color: white; display: flex; align-items: center; gap: 8px; border: none; padding: 14px 24px; border-radius: 20px; font-weight: 800; font-size: 15px; cursor: pointer; transition: all 0.2s; box-shadow: 0 8px 16px rgba(74, 27, 42, 0.2); }
.add-btn:hover { background: #2b000d; transform: translateY(-2px); box-shadow: 0 12px 24px rgba(43, 0, 13, 0.3); }
.add-btn svg { width: 20px; height: 20px; }


.glass-panel {
  background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(43, 0, 13, 0.12); box-shadow: 0 16px 40px rgba(43, 0, 13, 0.06); border-radius: 24px;
}


.state-container { padding: 60px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.empty-icon { width: 64px; height: 64px; color: #4a1b2a; opacity: 0.3; margin-bottom: 16px; }
.empty-title { font-size: 20px; font-weight: 800; color: #4a1b2a; margin: 0 0 8px; }
.empty-desc { color: rgba(0,0,0,0.55); font-size: 16px; margin: 0; }


.catalogs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }

.catalog-card {
  padding: 24px; display: flex; flex-direction: column; cursor: pointer; transition: all 0.2s;
}
.catalog-card:hover { transform: translateY(-4px); box-shadow: 0 24px 48px rgba(43, 0, 13, 0.12); border-color: rgba(74, 27, 42, 0.2); }

.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
.status-badge.active { background: rgba(76, 175, 80, 0.15); color: #2E7D32; }
.status-badge.inactive { background: rgba(158, 158, 158, 0.2); color: #616161; }

.icon-btn { background: transparent; border: none; cursor: pointer; color: rgba(0,0,0,0.4); padding: 4px; border-radius: 50%; transition: color 0.2s; }
.icon-btn:hover { color: #4a1b2a; }
.icon-btn svg { width: 24px; height: 24px; }

.c-name { font-size: 20px; font-weight: 800; color: #2b000d; margin: 0 0 8px; line-height: 1.2; }
.c-desc { font-size: 14px; color: rgba(0,0,0,0.55); margin: 0 0 24px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 16px; border-top: 1px solid rgba(43, 0, 13, 0.08); }
.product-info { display: flex; align-items: baseline; gap: 4px; }
.p-count { font-size: 24px; font-weight: 800; color: #8b4c5c; line-height: 1; }
.p-label { font-size: 13px; color: rgba(0,0,0,0.55); font-weight: 600; }

.edit-sm-btn { padding: 8px 16px; border-radius: 12px; background: rgba(74, 27, 42, 0.1); color: #4a1b2a; border: none; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.edit-sm-btn:hover { background: #4a1b2a; color: white; }


.spinner { animation: rotate 2s linear infinite; width: 40px; height: 40px; }
.spinner .path { stroke: #4a1b2a; stroke-linecap: round; animation: dash 1.5s ease-in-out infinite; }
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash { 0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; } 50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; } 100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; } }
</style>
