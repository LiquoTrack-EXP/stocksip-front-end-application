<script setup>
/**
 * inventory-subtrack.component component.
 * @displayName inventory-subtrack.component
 * @version 1.0.0
 */
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { InventoryService } from '@/features/inventorymanagement/services/inventory.service';

const router = useRouter();
const route = useRoute();

const warehouseId = route.params.warehouseId || '';
const productId = route.params.productId || '';

const formState = ref({
  quantityToDecrease: '',
  exitType: '',
  expirationDate: ''
});

const isLoading = ref(false);
const currentMaxStock = ref(0);

const goBack = () => router.go(-1);

const saveSubtrack = async () => {
  isLoading.value = true;
  try {
    await InventoryService.subtractProducts(warehouseId, productId, {
      quantityToDecrease: Number(formState.value.quantityToDecrease),
      exitType: formState.value.exitType,
      expirationDate: formState.value.expirationDate || null
    });
    alert('Productos retirados del inventario con éxito');
    router.go(-1);
  } catch (err) {
    console.error('Error subtracting products:', err.response?.data);
    alert('Error: ' + (err.response?.data?.message || 'No se pudo retirar'));
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="web-layout subtrack-layout">
    
    <div class="form-card glass-panel">
      
      <header class="card-header">
        <button class="icon-btn" @click="goBack" title="Volver">
          <svg viewBox="0 0 24 24" class="header-icon"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <h2 class="header-title">Retirar Productos</h2>
        <div class="header-spacer"></div>
      </header>

      <div class="card-body">
        
        <div class="form-fields">
          
          <div class="field-item">
            <label class="field-label">Seleccionar Producto en Stock</label>
            <div class="input-wrapper editable-shadow">
              <select v-model="formState.productId" @change="onProductSelected">
                <option value="" disabled>Seleccione el producto a retirar...</option>
                <option value="p1">Vino Tinto Reserva 2018 (50 disponibles)</option>
                <option value="p2">Cerveza Artesanal IPA (30 disponibles)</option>
              </select>
            </div>
          </div>

          
          <div class="field-item">
            <label class="field-label">Cantidad a Retirar *</label>
            <div class="input-wrapper editable-shadow">
              <input 
                type="number" 
                v-model="formState.quantity" 
                placeholder="Ej: 10" 
                min="1" 
                :max="currentMaxStock" 
                :disabled="!formState.productId"
              />
            </div>
            <span class="hint-text" v-if="formState.productId">
              Máximo permitido: {{ currentMaxStock }}
            </span>
          </div>

          
          <div class="field-item">
            <label class="field-label">Motivo de Salida *</label>
            <div class="input-wrapper editable-shadow">
              <select v-model="formState.exitType">
                <option value="" disabled>Seleccione un motivo...</option>
                <option value="Sold">Vendido (Sold)</option>
                <option value="Donated">Donado (Donated)</option>
                <option value="Spoiled">Dañado/Malo (Spoiled)</option>
                <option value="Consumed">Consumo Interno (Consumed)</option>
                <option value="Expired">Expirado (Expired)</option>
                <option value="Broke">Roto (Broke)</option>
              </select>
            </div>
          </div>

        </div>

      </div>

      
      <div class="card-footer">
        <button 
          class="pill-btn save-btn" 
          @click="saveSubtrack" 
          :disabled="!formState.quantity || !formState.productId || !formState.exitType || isLoading"
        >
          <span v-if="!isLoading">Retirar del Inventario</span>
          <svg v-else class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>

.subtrack-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4ecec;
  padding: 40px 20px;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(43, 0, 13, 0.12);
  box-shadow: 0 16px 40px rgba(43, 0, 13, 0.08);
}

.form-card {
  width: 100%;
  max-width: 500px;
  border-radius: 28px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}


.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px 16px;
  border-bottom: 1px solid rgba(43, 0, 13, 0.06);
}

.header-title {
  font-size: 20px;
  font-weight: 700;
  color: #2b000d;
  margin: 0;
}

.header-spacer { width: 42px; }

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s;
  color: #2b000d;
}
.icon-btn:hover { background: rgba(74, 27, 42, 0.08); }
.header-icon { width: 26px; height: 26px; }


.card-body {
  padding: 32px;
  flex: 1;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.field-label {
  font-size: 14px;
  font-weight: 700;
  color: #2b000d;
  margin-bottom: 8px;
  display: block;
  margin-left: 4px;
}

.hint-text {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.55);
  margin-left: 4px;
  margin-top: 4px;
  display: block;
}

.editable-shadow input,
.editable-shadow select {
  width: 100%;
  padding: 16px 20px;
  border-radius: 18px;
  border: 1px solid #dcd9d9;
  font-size: 15px;
  font-family: inherit;
  color: #2b000d;
  background: #ffffff;
  box-sizing: border-box;
  transition: all 0.2s ease;
  appearance: none;
}

.editable-shadow input:focus,
.editable-shadow select:focus {
  outline: none;
  border-color: #e53e3e; 
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
}

.editable-shadow input:disabled,
.editable-shadow select:disabled {
  background-color: #f9f9f9;
  cursor: not-allowed;
  opacity: 0.7;
}


.card-footer {
  padding: 0 32px 32px;
}

.pill-btn {
  width: 100%;
  padding: 16px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.save-btn {
  background: #2b000d;
  color: #ffffff;
  box-shadow: 0 8px 16px rgba(43, 0, 13, 0.2);
}

.save-btn:hover:not(:disabled) {
  background: #e53e3e; 
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(229, 62, 62, 0.3);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}


.spinner {
  animation: rotate 2s linear infinite;
  width: 24px;
  height: 24px;
}
.spinner .path {
  stroke: #ffffff;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash {
  0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
}
</style>
