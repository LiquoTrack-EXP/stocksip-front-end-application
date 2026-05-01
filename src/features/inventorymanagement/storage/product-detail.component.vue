<script setup>
/**
 * product-detail.component component.
 * @displayName product-detail.component
 * @version 1.0.0
 */
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ProductService, WarehouseService } from '@/features/inventorymanagement/services/inventory.service';

const router = useRouter();
const route = useRoute();

const product = ref({
  id: '',
  name: '',
  type: '',
  brand: '',
  imageUrl: '',
  unitPrice: 0,
  currencyCode: 'USD',
  minimumStock: 0,
  totalStockInWarehouse: 0,
  content: 0
});

onMounted(async () => {
  const productId = route.params.productId;
  if (!productId) return;
  
  try {
    const res = await ProductService.getProductById(productId);
    const data = res.data;
    
    product.value = {
      id: data.id || productId,
      name: data.name || '',
      type: data.type || '',
      brand: data.brand || '',
      imageUrl: data.imageUrl || '',
      unitPrice: data.unitPrice || 0,
      currencyCode: data.code || 'USD',
      minimumStock: data.minimumStock || 0,
      totalStockInWarehouse: data.totalStockInStore || data.totalStockInWarehouse || 0,
      content: data.content || 0
    };

    // If totalStockInWarehouse is still 0, we can attempt to fetch it from warehouses
    if (product.value.totalStockInWarehouse === 0) {
      const accountId = localStorage.getItem('accountId');
      if (accountId) {
        try {
          const warehousesRes = await WarehouseService.getAccountWarehouses(accountId);
          const warehouses = warehousesRes.data.warehouses || [];
          
          let totalStock = 0;
          for (const warehouse of warehouses) {
            try {
              const warehouseProductsRes = await WarehouseService.getWarehouseProducts(warehouse.warehouseId);
              let warehouseProducts = [];
              if (Array.isArray(warehouseProductsRes.data)) {
                warehouseProducts = warehouseProductsRes.data;
              } else if (warehouseProductsRes.data && Array.isArray(warehouseProductsRes.data.products)) {
                warehouseProducts = warehouseProductsRes.data.products;
              } else if (warehouseProductsRes.data && Array.isArray(warehouseProductsRes.data.items)) {
                warehouseProducts = warehouseProductsRes.data.items;
              }
              
              const productInWarehouse = warehouseProducts.find(wp => 
                (wp.productId === productId || wp.id === productId)
              );
              if (productInWarehouse) {
                totalStock += (productInWarehouse.availableStock || productInWarehouse.stock || productInWarehouse.quantity || 0);
              }
            } catch (err) {
              console.error(`Error fetching products for warehouse ${warehouse.warehouseId}:`, err);
            }
          }
          
          product.value.totalStockInWarehouse = totalStock;
        } catch (err) {
          console.error('Error fetching warehouses:', err);
        }
      }
    }
  } catch (err) {
    console.error('Error fetching product details:', err);
  }
});

const showDeleteConfirm = ref(false);
const showErrorDialog = ref(false);

const goBack = () => router.go(-1);
const goEdit = () => router.push(`/storage/edit/${product.value.id}`);

const stockColor = computed(() => product.value.totalStockInWarehouse > 0 ? '#4CAF50' : '#e53e3e');
const stockText = computed(() => product.value.totalStockInWarehouse > 0 ? 'En Stock' : 'Sin Stock');

const handleDelete = () => {
  if (product.value.totalStockInWarehouse === 0) {
    showDeleteConfirm.value = true;
  } else {
    showErrorDialog.value = true;
  }
};

const confirmDelete = () => {
  console.log("Eliminando producto ID:", product.value.id);
  showDeleteConfirm.value = false;
  router.go(-1);
};
</script>

<template>
  <div class="web-layout detail-layout">
    
    
    <div class="top-gradient-bg"></div>

    <div class="content-wrapper">
      
      <header class="detail-header">
        <button class="circle-btn back-btn" @click="goBack" title="Volver">
          <svg viewBox="0 0 24 24" class="header-icon"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
      </header>

      
      <div class="image-section">
        <div class="image-card glass-panel">
          <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" class="product-img" />
          
          
          <div class="stock-badge" :style="{ backgroundColor: stockColor }">
            {{ stockText }}
          </div>
        </div>
      </div>

      
      <div class="info-card">
        <h1 class="product-title">{{ product.name }}</h1>
        <p class="product-subtitle">Tipo: {{ product.type }} | Marca: {{ product.brand }}</p>

        
        <h2 class="price-text">{{ product.unitPrice }} {{ product.currencyCode }}</h2>

        
        <div class="details-surface glass-panel">
          <div class="info-row">
            <span class="info-label">Stock Mínimo</span>
            <span class="info-value">{{ product.minimumStock }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Total Almacenado</span>
            <span class="info-value accent-qty">{{ product.totalStockInWarehouse }}</span>
          </div>
          <div class="info-row quantity-row">
            <span class="info-label">Contenido (ml)</span>
            <span class="info-value">{{ product.content }} ml</span>
          </div>
        </div>

        <div class="care-guide-link">
          <span class="care-guide-text">Ver Guía de Cuidado Asociada</span>
        </div>
      </div>
    </div>

    
    <div class="fab-container">
      <button class="fab-btn fab-delete" @click="handleDelete" title="Eliminar Producto">
        <svg viewBox="0 0 24 24" class="fab-icon"><path fill="currentColor" d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
      </button>
      <button class="fab-btn fab-edit" @click="goEdit" title="Editar Producto">
        <svg viewBox="0 0 24 24" class="fab-icon"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
      </button>
    </div>

    
    <div v-if="showDeleteConfirm" class="dialog-backdrop" @click.self="showDeleteConfirm = false">
      <div class="dialog-box glass-panel">
        <h3 class="dialog-title">¿Confirmar Eliminación?</h3>
        <p class="dialog-msg">Esta acción eliminará el producto del catálogo permanentemente.</p>
        <div class="dialog-actions">
          <button class="pill-btn cancel-btn" @click="showDeleteConfirm = false">{{ $t('common.cancel') }}</button>
          <button class="pill-btn confirm-btn" @click="confirmDelete">{{ $t('common.delete') }}</button>
        </div>
      </div>
    </div>

    <div v-if="showErrorDialog" class="dialog-backdrop" @click.self="showErrorDialog = false">
      <div class="dialog-box glass-panel">
        <h3 class="dialog-title">No se puede eliminar</h3>
        <p class="dialog-msg dark-msg">Este producto aún tiene existencias en uno o más almacenes. Retire el stock antes de eliminarlo del catálogo.</p>
        <div class="dialog-actions">
          <button class="pill-btn cancel-btn w-full" @click="showErrorDialog = false">Entendido</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.detail-layout {
  min-height: 100vh;
  position: relative;
  background-color: #f4ecec;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
}


.top-gradient-bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 300px;
  background: linear-gradient(180deg, #2b000d 0%, #4a1b2a 100%);
  z-index: 0;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 700px;
  padding: 0 20px 100px;
}

.detail-header {
  padding: 20px 0;
}

.circle-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 48px; height: 48px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #ffffff;
  transition: background 0.2s;
}
.circle-btn:hover { background: rgba(255, 255, 255, 0.3); }
.header-icon { width: 24px; height: 24px; }


.image-section {
  display: flex; justify-content: center; height: 300px; align-items: center;
  position: relative;
}

.image-card {
  width: 240px; height: 240px;
  background: #ffffff; border-radius: 24px; padding: 24px;
  box-shadow: 0 24px 48px rgba(139, 76, 92, 0.4);
  display: flex; align-items: center; justify-content: center;
  position: relative;
}

.product-img { max-width: 100%; max-height: 100%; object-fit: contain; }

.stock-badge {
  position: absolute; top: -16px; right: -16px;
  padding: 6px 16px; border-radius: 20px;
  color: white; font-size: 13px; font-weight: 800;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}


.info-card {
  background: #f8f4f4; border-radius: 32px; padding: 32px;
  margin-top: -30px; box-shadow: 0 -10px 30px rgba(0,0,0,0.1);
  display: flex; flex-direction: column;
}

.product-title { font-size: 28px; font-weight: 800; color: #2b000d; margin: 0 0 8px; }
.product-subtitle { font-size: 16px; color: rgba(0,0,0,0.55); margin: 0 0 24px; }
.price-text { font-size: 32px; font-weight: 900; color: #4a1b2a; margin: 0 0 32px; }


.glass-panel {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(43, 0, 13, 0.12);
}

.details-surface {
  border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 16px;
  box-shadow: 0 4px 12px rgba(43, 0, 13, 0.05); margin-bottom: 24px;
}

.info-row {
  display: flex; justify-content: space-between; align-items: center;
  padding-bottom: 12px; border-bottom: 1px solid rgba(43, 0, 13, 0.06);
}
.quantity-row { border-bottom: none; padding-bottom: 0; }

.info-label { font-size: 15px; font-weight: 600; color: rgba(0,0,0,0.6); }
.info-value { font-size: 16px; font-weight: 700; color: #2b000d; }
.accent-qty { color: #e53e3e; font-size: 18px; }

.care-guide-link {
  margin-top: 16px; padding-bottom: 60px;
}
.care-guide-text {
  font-weight: 800; font-size: 16px; color: #2b000d; cursor: pointer; text-decoration: underline;
}


.fab-container {
  position: fixed; bottom: 32px; width: 100%; max-width: 700px;
  display: flex; justify-content: space-between; padding: 0 24px;
  box-sizing: border-box; z-index: 10;
}

.fab-btn {
  width: 64px; height: 64px; border-radius: 20px; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: white; transition: transform 0.2s;
}
.fab-btn:hover { transform: scale(1.05); }

.fab-delete { background: #e53e3e; box-shadow: 0 8px 24px rgba(229, 62, 62, 0.4); }
.fab-edit { background: #4a1b2a; box-shadow: 0 8px 24px rgba(74, 27, 42, 0.4); }
.fab-icon { width: 28px; height: 28px; }


.dialog-backdrop {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(43, 0, 13, 0.6); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.dialog-box {
  width: 90%; max-width: 400px; padding: 32px; border-radius: 28px; text-align: center; background: #ffffff;
}
.dialog-title { color: #2b000d; font-size: 20px; font-weight: 800; margin: 0 0 16px; }
.dialog-msg { color: rgba(0,0,0,0.6); font-size: 15px; margin: 0 0 24px; line-height: 1.5; }
.dark-msg { color: #2b000d; font-weight: 600; }
.dialog-actions { display: flex; gap: 16px; justify-content: flex-end; }

.pill-btn { padding: 12px 24px; border-radius: 20px; font-weight: 700; cursor: pointer; border: none; }
.cancel-btn { background: transparent; color: rgba(0,0,0,0.6); }
.cancel-btn:hover { background: rgba(0,0,0,0.05); }
.confirm-btn { background: #e53e3e; color: white; }
.w-full { width: 100%; text-align: center; justify-content: center; }
</style>
