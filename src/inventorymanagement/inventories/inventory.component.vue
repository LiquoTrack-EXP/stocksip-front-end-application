<script setup>
/**
 * inventory.component component.
 * @displayName inventory.component
 * @version 1.0.0
 */
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { WarehouseService } from '../services/inventory.service.js';

const router = useRouter();
const route = useRoute();

const warehouseId = ref(route.params.warehouseId);
const inventories = ref([]);
const isLoading = ref(true);
const error = ref(null);

const loadInventory = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const res = await WarehouseService.getWarehouseProducts(warehouseId.value);
    inventories.value = res.data || [];
  } catch (err) {
    console.error('Error loading inventory:', err);
    error.value = 'No se pudo cargar el inventario.';
  } finally {
    isLoading.value = false;
  }
};

const navigateTo = (path) => {
  router.push(path);
};

onMounted(() => {
  loadInventory();
});
</script>

<template>
  <div class="web-layout inventory-layout">
    <div class="content-wrapper">
      
      
      <div class="actions-card glass-panel">
        <h2 class="section-title">Acciones Rápidas</h2>
        
        <div class="actions-grid">
          
          <button class="action-btn add-btn" @click="navigateTo(`/inventory_addition/${warehouseId}`)">
            <svg viewBox="0 0 24 24" class="action-icon"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            <span class="action-label">Añadir</span>
          </button>
          
          
          <button class="action-btn sub-btn" @click="navigateTo(`/inventory_subtrack/${warehouseId}`)">
            <svg viewBox="0 0 24 24" class="action-icon"><path fill="currentColor" d="M19 13H5v-2h14v2z"/></svg>
            <span class="action-label">Retirar</span>
          </button>

          
          <button class="action-btn transfer-btn" @click="navigateTo(`/inventory_transfer/${warehouseId}`)">
            <svg viewBox="0 0 24 24" class="action-icon"><path fill="currentColor" d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"/></svg>
            <span class="action-label">Transferir</span>
          </button>
        </div>
      </div>

      
      <div v-if="isLoading" class="state-container glass-panel">
        <svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
      </div>

      
      <div v-else-if="error" class="state-container glass-panel error-state">
        <h3 class="error-title">Error</h3>
        <p class="error-desc">{{ error }}</p>
        <button class="pill-btn retry-btn" @click="loadInventory">{{ $t('common.retry') }}</button>
      </div>

      
      <div v-else-if="inventories.length === 0" class="empty-state glass-panel">
        <svg viewBox="0 0 24 24" class="empty-icon"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
        <p class="empty-title">No tienes productos en este almacén aún.</p>
        <p class="empty-subtitle">Toca el botón 'Añadir' en las acciones rápidas para comenzar.</p>
      </div>

      
      <div v-else class="inventory-grid">
        
        <div 
          class="inventory-card glass-panel" 
          v-for="item in inventories" 
          :key="item.id || item.inventoryId"
          @click="navigateTo(`/inventory_detail/${item.id || item.inventoryId}`)"
        >
          
          <div class="card-img-wrapper">
            <img v-if="item.productImageUrl || item.imageUrl" :src="item.productImageUrl || item.imageUrl" alt="Product" class="card-img" />
            <div v-else class="placeholder-img">
              <svg viewBox="0 0 24 24" class="placeholder-icon"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
            </div>
          </div>

          
          <div class="card-info">
            <h4 class="product-name" :title="item.productName || item.name">{{ item.productName || item.name }}</h4>
            
            <div class="info-row">
              <span class="info-label">Stock:</span>
              <span class="info-value stock-val">{{ item.quantity || item.stock }}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Precio:</span>
              <span class="info-value price-val">{{ item.moneyCode || 'S/.' }} {{ item.unitPrice || item.price }}</span>
            </div>

            <div class="info-row date-row" v-if="item.expirationDate">
              <span class="info-label">Expira:</span>
              <span class="info-value">{{ item.expirationDate }}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>


.inventory-layout {
  min-height: 100vh;
  background-color: #f4ecec;
  padding: 40px 20px;
}

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}


.glass-panel {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(43, 0, 13, 0.12);
  box-shadow: 0 16px 40px rgba(43, 0, 13, 0.06);
  border-radius: 20px;
}

.glass-panel:hover {
  box-shadow: 0 20px 48px rgba(43, 0, 13, 0.12);
}


.actions-card {
  padding: 24px 32px;
  margin-bottom: 32px;
}

.section-title {
  color: #2b000d;
  font-size: 20px;
  font-weight: 800;
  margin-top: 0;
  margin-bottom: 20px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  color: #ffffff;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}


.add-btn { background: #4CAF50; }
.sub-btn { background: #e53e3e;  }
.transfer-btn { background: #4a1b2a;  }

.action-icon {
  width: 28px;
  height: 28px;
}

.action-label {
  font-size: 14px;
  font-weight: 600;
}


.subsection-title {
  color: #4a1b2a;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
}


.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #d1b6ab;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: #2b000d;
  margin: 0 0 8px;
}

.empty-subtitle {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.55); 
  margin: 0;
}


.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.inventory-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.inventory-card:hover {
  transform: translateY(-4px);
}

.card-img-wrapper {
  width: 100%;
  height: 160px;
  background: #f0e0d8;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(43, 0, 13, 0.08);
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-icon {
  width: 48px;
  height: 48px;
  color: #d1b6ab;
}

.card-info {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-name {
  font-size: 18px;
  font-weight: 800;
  color: #2b000d;
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.55);
  font-weight: 600;
}

.info-value {
  font-size: 14px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.82);
}

.stock-val {
  color: #4a1b2a;
}

.price-val {
  color: #2b000d;
}

.date-row {
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px solid rgba(43, 0, 13, 0.06);
}


@media (max-width: 600px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
