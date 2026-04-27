<script setup>
/**
 * inventory-detail.component component.
 * @displayName inventory-detail.component
 * @version 1.0.0
 */
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { InventoryService } from '../services/inventory.service.js';

const router = useRouter();
const route = useRoute();

const inventoryId = ref(route.params.inventoryId);
const inventory = ref(null);
const isLoading = ref(true);
const showDeleteConfirm = ref(false);
const showErrorDialog = ref(false);

const loadInventoryDetail = async () => {
  isLoading.value = true;
  try {
    const res = await InventoryService.getInventoryById(inventoryId.value);
    inventory.value = res.data;
  } catch (err) {
    console.error('Error loading inventory detail:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadInventoryDetail();
});

const goBack = () => router.go(-1);

const handleDelete = () => {
  if (inventory.value?.stock === 0 || inventory.value?.quantity === 0) {
    showDeleteConfirm.value = true;
  } else {
    showErrorDialog.value = true;
  }
};

const confirmDelete = async () => {
  try {
    await InventoryService.deleteInventory(inventoryId.value);
    showDeleteConfirm.value = false;
    router.go(-1);
  } catch (err) {
    console.error('Error deleting inventory:', err);
    alert('No se pudo eliminar el registro de inventario.');
  }
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

      
      <div v-if="isLoading" class="state-container">
        <svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5" stroke="white"></circle></svg>
      </div>

      
      <div v-else-if="inventory" class="inventory-content-area">
        <div class="image-section">
          <div class="image-card glass-panel">
            <img :src="inventory.productImageUrl || inventory.imageUrl" alt="Product" class="product-img" />
          </div>
        </div>

        
        <div class="info-card">
          <h1 class="product-title">{{ inventory.productName || inventory.name }}</h1>
          <p class="product-subtitle">Tipo: {{ inventory.productType || inventory.type }} | Marca: {{ inventory.brand }}</p>

          
          <div class="details-surface glass-panel">
            
            <div class="info-row">
              <span class="info-label">Estado Actual</span>
              <span class="info-value">En Stock</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Precio Unitario</span>
              <span class="info-value">{{ inventory.price || inventory.unitPrice }} {{ inventory.moneyCode || 'USD' }}</span>
            </div>

            <div class="info-row">
              <span class="info-label">Stock Mínimo</span>
              <span class="info-value">{{ inventory.minimumStock }}</span>
            </div>

            <div class="info-row quantity-row">
              <span class="info-label">Cantidad Almacenada</span>
              <span class="info-value accent-qty">{{ inventory.stock || inventory.quantity }}</span>
            </div>

          </div>
        </div>
      </div>
    </div>

    
    <button class="fab-delete" @click="handleDelete" title="Eliminar Inventario">
      <svg viewBox="0 0 24 24" class="fab-icon"><path fill="currentColor" d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
    </button>

    
    <div v-if="showDeleteConfirm" class="dialog-backdrop" @click.self="showDeleteConfirm = false">
      <div class="dialog-box glass-panel">
        <h3 class="dialog-title">¿Confirmar Eliminación?</h3>
        <p class="dialog-msg">Esta acción eliminará el registro del producto en este almacén. ¿Deseas continuar?</p>
        <div class="dialog-actions">
          <button class="pill-btn cancel-btn" @click="showDeleteConfirm = false">{{ $t('common.cancel') }}</button>
          <button class="pill-btn confirm-btn" @click="confirmDelete">{{ $t('common.delete') }}</button>
        </div>
      </div>
    </div>

    
    <div v-if="showErrorDialog" class="dialog-backdrop" @click.self="showErrorDialog = false">
      <div class="dialog-box glass-panel">
        <p class="dialog-msg dark-msg">No se puede eliminar el inventario mientras haya stock disponible. Retire o transfiera el stock primero.</p>
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
  top: 0;
  left: 0;
  width: 100%;
  height: 400px;
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
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ffffff;
  transition: background 0.2s;
}

.circle-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.header-icon {
  width: 24px;
  height: 24px;
}


.image-section {
  display: flex;
  justify-content: center;
  height: 300px;
  align-items: center;
}

.image-card {
  width: 240px;
  height: 240px;
  background: #ffffff;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 24px 48px rgba(139, 76, 92, 0.4); 
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}


.info-card {
  background: #f8f4f4;
  border-radius: 32px;
  padding: 32px;
  margin-top: -30px;
  box-shadow: 0 -10px 30px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 28px;
  font-weight: 800;
  color: #2b000d;
  margin: 0 0 8px;
}

.product-subtitle {
  font-size: 16px;
  color: rgba(0,0,0,0.55);
  margin: 0 0 32px;
}


.glass-panel {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(43, 0, 13, 0.12);
}

.details-surface {
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(43, 0, 13, 0.05);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(43, 0, 13, 0.06);
}

.quantity-row {
  border-bottom: none;
  padding-bottom: 0;
}

.info-label {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0,0,0,0.6);
}

.info-value {
  font-size: 16px;
  font-weight: 700;
  color: #2b000d;
}

.accent-qty {
  color: #e53e3e; 
  font-size: 18px;
}


.fab-delete {
  position: fixed;
  bottom: 32px;
  background: #e53e3e; 
  color: white;
  border: none;
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(229, 62, 62, 0.4);
  transition: transform 0.2s;
  z-index: 10;
}

.fab-delete:hover {
  transform: scale(1.05);
}

.fab-icon {
  width: 28px;
  height: 28px;
}


.dialog-backdrop {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(43, 0, 13, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-box {
  width: 90%;
  max-width: 400px;
  padding: 32px;
  border-radius: 28px;
  text-align: center;
  background: #ffffff;
}

.dialog-title {
  color: #2b000d;
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 16px;
}

.dialog-msg {
  color: rgba(0,0,0,0.6);
  font-size: 15px;
  margin: 0 0 24px;
  line-height: 1.5;
}

.dark-msg {
  color: #2b000d;
  font-weight: 600;
}

.dialog-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}

.pill-btn {
  padding: 12px 24px;
  border-radius: 20px;
  font-weight: 700;
  cursor: pointer;
  border: none;
}

.cancel-btn {
  background: transparent;
  color: rgba(0,0,0,0.6);
}
.cancel-btn:hover { background: rgba(0,0,0,0.05); }

.confirm-btn {
  background: #e53e3e;
  color: white;
}

.w-full { width: 100%; text-align: center; justify-content: center; }
</style>
