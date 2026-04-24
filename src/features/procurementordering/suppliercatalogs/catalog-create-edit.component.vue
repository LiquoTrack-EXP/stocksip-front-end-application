<script setup>
/**
 * catalog-create-edit.component component.
 * @displayName catalog-create-edit.component
 * @version 1.0.0
 */
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { CatalogService } from '@/features/procurementordering/services/procurement.service';
import { WarehouseService } from '@/features/inventorymanagement/services/inventory.service';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const isEditMode = ref(route.params.id !== undefined);
const catalogId = ref(route.params.id || null);

const catalogName = ref('');
const catalogDescription = ref('');
const contactEmail = ref('');
const isPublished = ref(false);
const catalogItems = ref([]);

const showWarehouseDialog = ref(false);
const showProductDialog = ref(false);
const selectedWarehouseId = ref(null);
const selectedProductIds = ref([]);
const productStockInputs = ref({});

const isLoading = ref(false);
const warehouses = ref([]);
const warehouseProducts = ref([]);

onMounted(async () => {

  try {
    const accountId = localStorage.getItem('accountId');
    if (accountId) {
      const res = await WarehouseService.getAccountWarehouses(accountId);
      warehouses.value = res.data.warehouses || [];
    }
  } catch (err) {
    console.error('Error loading warehouses:', err);
  }

  if (isEditMode.value && catalogId.value) {
    try {
      const res = await CatalogService.getCatalogById(catalogId.value);
      const c = res.data;
      catalogName.value = c.name || '';
      catalogDescription.value = c.description || '';
      contactEmail.value = c.contactEmail || '';
      isPublished.value = c.isPublished || false;
      catalogItems.value = c.catalogItems || [];
    } catch (err) {
      console.error('Error loading catalog:', err);
    }
  }
});

const goBack = () => router.go(-1);

const openWarehouseDialog = () => {
  showWarehouseDialog.value = true;
};

const selectWarehouse = async (id) => {
  selectedWarehouseId.value = id;
  selectedProductIds.value = [];
  productStockInputs.value = {};
  showWarehouseDialog.value = false;

  try {
    const res = await WarehouseService.getWarehouseProducts(id);
    warehouseProducts.value = res.data || [];
  } catch (err) {
    console.error('Error loading warehouse products:', err);
    warehouseProducts.value = [];
  }
  showProductDialog.value = true;
};

const toggleProductSelection = (productId) => {
  const index = selectedProductIds.value.indexOf(productId);
  if (index === -1) {
    selectedProductIds.value.push(productId);
    productStockInputs.value[productId] = '';
  } else {
    selectedProductIds.value.splice(index, 1);
    delete productStockInputs.value[productId];
  }
};

const isProductAlreadyInCatalog = (productId) => {
  return catalogItems.value.some(item => item.productId === productId);
};

const confirmProductsSelection = async () => {
  if (!catalogId.value) {

    selectedProductIds.value.forEach(pid => {
      const p = warehouseProducts.value.find(x => x.productId === pid);
      if (p && !isProductAlreadyInCatalog(pid)) {
        catalogItems.value.push({
          productId: pid,
          productName: p.name,
          availableStock: parseInt(productStockInputs.value[pid] || '0', 10),
          amount: 0, currency: 'USD',
          _pendingWarehouseId: selectedWarehouseId.value
        });
      }
    });
  } else {

    for (const pid of selectedProductIds.value) {
      const stock = parseInt(productStockInputs.value[pid] || '0', 10);
      if (stock > 0) {
        try {
          const res = await CatalogService.addItemToCatalog(catalogId.value, {
            productId: pid,
            warehouseId: selectedWarehouseId.value,
            stock
          });
          catalogItems.value = res.data.catalogItems || catalogItems.value;
        } catch (err) {
          console.error('Error adding item to catalog:', err.response?.data);
        }
      }
    }
  }
  showProductDialog.value = false;
  selectedProductIds.value = [];
  productStockInputs.value = {};
};

const removeCatalogItem = async (productId) => {
  if (catalogId.value) {
    try {
      await CatalogService.removeItemFromCatalog(catalogId.value, productId);
    } catch (err) {
      console.error('Error removing item:', err);
    }
  }
  catalogItems.value = catalogItems.value.filter(item => item.productId !== productId);
};

const saveCatalog = async () => {
  isLoading.value = true;
  try {
    const accountId = localStorage.getItem('accountId');
    const payload = {
      name: catalogName.value,
      description: catalogDescription.value,
      contactEmail: contactEmail.value
    };

    if (isEditMode.value && catalogId.value) {

      await CatalogService.updateCatalog(catalogId.value, payload);
    } else {

      const res = await CatalogService.createCatalogForAccount(accountId, payload);
      catalogId.value = res.data.id;

      for (const item of catalogItems.value.filter(i => i._pendingWarehouseId)) {
        try {
          await CatalogService.addItemToCatalog(catalogId.value, {
            productId: item.productId,
            warehouseId: item._pendingWarehouseId,
            stock: item.availableStock
          });
        } catch (err) {
          console.error('Error adding pending item:', err);
        }
      }
    }

    if (isEditMode.value && catalogId.value) {
      try {
        if (isPublished.value) await CatalogService.publishCatalog(catalogId.value);
        else await CatalogService.unpublishCatalog(catalogId.value);
      } catch (err) {
        console.error('Error updating publication status:', err);
      }
    }

    alert(isEditMode.value ? t('catalogs.messages.update_success') : t('catalogs.messages.create_success'));
    goBack();
  } catch (err) {
    console.error('Error saving catalog:', err.response?.data);
    alert('Error al guardar: ' + (err.response?.data?.message || 'Error desconocido'));
  } finally {
    isLoading.value = false;
  }
};

const deleteCatalog = async () => {
  if (!confirm(t('catalogs.messages.delete_confirm'))) return;
  isLoading.value = true;
  try {

    await CatalogService.unpublishCatalog(catalogId.value);
    alert('Catálogo despublicado');
    goBack();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="web-layout catalog-create-edit-layout">
    <div class="content-wrapper">
      
      
      <header class="page-header">
        <button class="icon-btn" @click="goBack" title="Volver">
          <svg viewBox="0 0 24 24" class="header-icon"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <h1 class="page-title">{{ isEditMode ? $t('catalogs.edit_catalog') : $t('catalogs.new_catalog') }}</h1>
        <button v-if="isEditMode" class="icon-btn delete-icon" @click="deleteCatalog" title="Eliminar Catálogo">
          <svg viewBox="0 0 24 24" class="header-icon"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </button>
        <div v-else class="header-spacer"></div>
      </header>

      <div class="form-container">
        
        <h2 class="section-title">{{ $t('catalogs.info') }}</h2>
        <div class="form-group glass-panel">
          <input type="text" v-model="catalogName" :placeholder="$t('catalogs.fields.name')" class="styled-input" />
          <div class="divider"></div>
          <input type="text" v-model="catalogDescription" :placeholder="$t('catalogs.fields.description')" class="styled-input" />
          <div class="divider"></div>
          <input type="email" v-model="contactEmail" :placeholder="$t('catalogs.fields.email')" class="styled-input" />
        </div>

        
        <div class="items-header">
          <h2 class="section-title">{{ $t('catalogs.products_in_catalog') }}</h2>
          <button class="icon-btn add-btn" @click="openWarehouseDialog" title="Agregar Productos">
            <svg viewBox="0 0 24 24" class="header-icon"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
        </div>

        <div class="items-list-container glass-panel">
          <div v-if="catalogItems.length === 0" class="empty-items">
            {{ $t('catalogs.empty_items') }}
          </div>
          <div v-else class="items-list">
            <div v-for="item in catalogItems" :key="item.productId" class="catalog-item">
              <div class="item-info">
                <span class="item-name">{{ item.productName }}</span>
                <span class="item-meta">{{ item.unitPrice }} • Stock: {{ item.availableStock }}</span>
              </div>
              <button class="icon-btn delete-item-btn" @click="removeCatalogItem(item.productId)">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
              </button>
            </div>
          </div>
        </div>

        
        <div v-if="isEditMode" class="status-section glass-panel">
          <span class="status-label">{{ $t('catalogs.publish_catalog') }}</span>
          <label class="switch">
            <input type="checkbox" v-model="isPublished">
            <span class="slider round"></span>
          </label>
        </div>

        
        <button 
          class="pill-btn submit-btn" 
          :disabled="!catalogName || isLoading"
          @click="saveCatalog"
        >
          <span v-if="!isLoading">{{ isEditMode ? $t('common.save_changes') : $t('common.create_catalog') }}</span>
          <svg v-else class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
        </button>

      </div>
    </div>

    
    
    
    <div v-if="showWarehouseDialog" class="modal-backdrop" @click.self="showWarehouseDialog = false">
      <div class="modal-card glass-panel">
        <h3 class="modal-title">{{ $t('catalogs.modal.warehouse') }}</h3>
        <div class="modal-list">
          <div 
            v-for="wh in warehouses" 
            :key="wh.warehouseId" 
            class="list-item"
            @click="selectWarehouse(wh.warehouseId)"
          >
            {{ wh.name }}
          </div>
        </div>
        <div class="modal-actions">
          <button class="text-btn" @click="showWarehouseDialog = false">{{ $t('common.cancel') }}</button>
        </div>
      </div>
    </div>

    
    <div v-if="showProductDialog" class="modal-backdrop" @click.self="showProductDialog = false">
      <div class="modal-card glass-panel product-modal">
        <h3 class="modal-title">{{ $t('catalogs.modal.products') }}</h3>
        <div class="modal-list">
          <div 
            v-for="product in warehouseProducts" 
            :key="product.productId"
            class="product-item-card"
            :class="{ 'disabled': isProductAlreadyInCatalog(product.productId), 'selected': selectedProductIds.includes(product.productId) }"
            @click="!isProductAlreadyInCatalog(product.productId) && toggleProductSelection(product.productId)"
          >
            <div class="product-item-header">
              <div class="product-img-ph">?</div>
              <div class="product-info-mini">
                <span class="p-name">{{ product.name }}</span>
                <span class="p-price">{{ product.unitPrice }} {{ product.moneyCode }}</span>
              </div>
              <div class="p-action">
                <span v-if="isProductAlreadyInCatalog(product.productId)" class="added-label">{{ $t('catalogs.modal.added') }}</span>
                <input v-else type="checkbox" :checked="selectedProductIds.includes(product.productId)" @click.stop="toggleProductSelection(product.productId)" />
              </div>
            </div>
            
            <div v-if="selectedProductIds.includes(product.productId) && !isProductAlreadyInCatalog(product.productId)" class="stock-input-wrapper" @click.stop>
              <input type="number" v-model="productStockInputs[product.productId]" :placeholder="$t('catalogs.modal.stock_placeholder')" class="styled-input mini-input" />
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="text-btn" @click="showProductDialog = false">{{ $t('common.cancel') }}</button>
          <button class="pill-btn confirm-btn" @click="confirmProductsSelection" :disabled="selectedProductIds.length === 0">{{ $t('common.confirm') }}</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.catalog-create-edit-layout {
  min-height: 100vh; background-color: #f4ecec; padding: 20px;
  display: flex; flex-direction: column; align-items: center;
}
.content-wrapper { width: 100%; max-width: 600px; display: flex; flex-direction: column; }


.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-top: 12px; }
.page-title { font-size: 24px; font-weight: 800; color: #2b000d; margin: 0; }
.icon-btn { background: transparent; border: none; cursor: pointer; padding: 8px; border-radius: 50%; color: #2b000d; transition: background 0.2s; display: flex; align-items: center; justify-content: center; }
.icon-btn:hover { background: rgba(74, 27, 42, 0.08); }
.header-icon { width: 26px; height: 26px; }
.header-spacer { width: 42px; }
.delete-icon { color: #e53e3e; }
.delete-icon:hover { background: rgba(229, 62, 62, 0.1); }


.glass-panel {
  background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(43, 0, 13, 0.12); box-shadow: 0 8px 32px rgba(43, 0, 13, 0.06); border-radius: 20px;
  overflow: hidden;
}


.section-title { font-size: 16px; font-weight: 700; color: #4a1b2a; margin: 0 0 12px 4px; }
.form-container { display: flex; flex-direction: column; gap: 24px; padding-bottom: 60px; }


.form-group { display: flex; flex-direction: column; }
.styled-input {
  width: 100%; padding: 16px; border: none; background: transparent;
  font-size: 16px; color: #2b000d; outline: none; font-family: inherit;
}
.styled-input::placeholder { color: rgba(0,0,0,0.4); }
.divider { height: 1px; background: rgba(43, 0, 13, 0.08); margin: 0 16px; }


.items-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.add-btn { background: rgba(74, 27, 42, 0.1); color: #4a1b2a; padding: 6px; }
.add-btn:hover { background: rgba(74, 27, 42, 0.2); }

.items-list-container { padding: 8px 0; }
.empty-items { padding: 24px; text-align: center; color: rgba(0,0,0,0.5); font-size: 14px; }
.catalog-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid rgba(43,0,13,0.05); }
.catalog-item:last-child { border-bottom: none; }
.item-info { display: flex; flex-direction: column; }
.item-name { font-size: 15px; font-weight: 700; color: #2b000d; }
.item-meta { font-size: 13px; color: rgba(0,0,0,0.55); margin-top: 2px; }
.delete-item-btn { color: #e53e3e; padding: 6px; }
.delete-item-btn:hover { background: rgba(229, 62, 62, 0.1); }
.delete-item-btn svg { width: 20px; height: 20px; }


.status-section { display: flex; justify-content: space-between; align-items: center; padding: 16px; }
.status-label { font-size: 16px; font-weight: 700; color: #2b000d; }

.switch { position: relative; display: inline-block; width: 44px; height: 24px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; }
.slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; }
input:checked + .slider { background-color: #4a1b2a; }
input:checked + .slider:before { transform: translateX(20px); }
.slider.round { border-radius: 24px; }
.slider.round:before { border-radius: 50%; }


.submit-btn {
  margin-top: 16px; width: 100%; padding: 18px; border-radius: 28px; font-weight: 800; font-size: 16px;
  background: #2b000d; color: white; border: none; cursor: pointer; transition: all 0.2s;
  display: flex; justify-content: center; align-items: center; box-shadow: 0 8px 16px rgba(43, 0, 13, 0.2);
}
.submit-btn:hover:not(:disabled) { background: #4a1b2a; transform: translateY(-2px); box-shadow: 0 12px 24px rgba(74, 27, 42, 0.3); }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }


.modal-backdrop {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(43, 0, 13, 0.6); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;
}
.modal-card { width: 100%; max-width: 400px; padding: 24px; border-radius: 24px; background: #ffffff; display: flex; flex-direction: column; max-height: 80vh; }
.modal-title { color: #2b000d; font-size: 20px; font-weight: 800; margin: 0 0 16px; }

.modal-list { overflow-y: auto; display: flex; flex-direction: column; gap: 8px; flex: 1; margin-bottom: 16px; }
.list-item { padding: 16px; border-radius: 12px; background: rgba(43, 0, 13, 0.03); cursor: pointer; font-weight: 600; color: #2b000d; transition: background 0.2s; }
.list-item:hover { background: rgba(74, 27, 42, 0.08); }

.product-item-card {
  padding: 12px; border-radius: 12px; border: 1px solid rgba(43, 0, 13, 0.1); cursor: pointer; transition: all 0.2s;
}
.product-item-card.selected { background: rgba(74, 27, 42, 0.05); border-color: #4a1b2a; }
.product-item-card.disabled { background: #f0f0f0; opacity: 0.7; cursor: not-allowed; }

.product-item-header { display: flex; align-items: center; gap: 12px; }
.product-img-ph { width: 40px; height: 40px; border-radius: 8px; background: rgba(43, 0, 13, 0.08); display: flex; align-items: center; justify-content: center; color: rgba(0,0,0,0.4); font-weight: 800; }
.product-info-mini { display: flex; flex-direction: column; flex: 1; }
.p-name { font-size: 14px; font-weight: 700; color: #2b000d; }
.p-price { font-size: 12px; color: rgba(0,0,0,0.55); }
.p-action { display: flex; align-items: center; }
.added-label { font-size: 11px; font-weight: 700; color: rgba(0,0,0,0.4); text-transform: uppercase; }
.p-action input[type="checkbox"] { accent-color: #4a1b2a; transform: scale(1.2); }

.stock-input-wrapper { margin-top: 12px; }
.mini-input { padding: 10px 12px; font-size: 14px; border: 1px solid rgba(43, 0, 13, 0.1); border-radius: 8px; }

.modal-actions { display: flex; justify-content: flex-end; gap: 12px; padding-top: 16px; border-top: 1px solid rgba(43, 0, 13, 0.08); }
.text-btn { background: transparent; border: none; color: rgba(0,0,0,0.6); font-weight: 700; cursor: pointer; padding: 10px 16px; border-radius: 12px; }
.text-btn:hover { background: rgba(0,0,0,0.05); }
.confirm-btn { background: #4a1b2a; color: white; padding: 10px 24px; border-radius: 20px; font-weight: 700; border: none; cursor: pointer; }
.confirm-btn:disabled { opacity: 0.5; cursor: not-allowed; }


.spinner { animation: rotate 2s linear infinite; width: 24px; height: 24px; }
.spinner .path { stroke: #ffffff; stroke-linecap: round; animation: dash 1.5s ease-in-out infinite; }
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash { 0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; } 50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; } 100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; } }
</style>
