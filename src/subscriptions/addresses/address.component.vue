<script setup>
/**
 * address.component component.
 * @displayName address.component
 * @version 1.0.0
 */
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const addresses = ref([
  { street: 'Av. Javier Prado Este 456', city: 'Lima', state: 'Lima', country: 'Perú', zipCode: '15034' },
  { street: 'Calle Los Pinos 123', city: 'Miraflores', state: 'Lima', country: 'Perú', zipCode: '15074' }
]);

const selectedAddressIndex = ref(null);
const showDialog = ref(false);
const isLoading = ref(false);
const errorMessage = ref(null);
const isOrderLoading = ref(false);

const newAddress = ref({ street: '', city: '', state: '', country: '', zipCode: '' });

const goBack = () => router.go(-1);

const selectAddress = (index) => {
  selectedAddressIndex.value = index;
};

const createOrder = () => {
  isOrderLoading.value = true;
  console.log('Creating order with address index:', selectedAddressIndex.value);
  setTimeout(() => {
    isOrderLoading.value = false;
    alert("Orden creada y convertida exitosamente.");
    goBack();
  }, 1500);
};

const saveAddress = () => {
  if(newAddress.value.street && newAddress.value.city) {
    isLoading.value = true;
    setTimeout(() => {
      addresses.value.push({ ...newAddress.value });
      newAddress.value = { street: '', city: '', state: '', country: '', zipCode: '' };
      showDialog.value = false;
      isLoading.value = false;
    }, 800);
  }
};
</script>

<template>
  <div class="web-layout address-layout">
    
    <div class="content-wrapper">
      
      <header class="page-header">
        <button class="icon-btn" @click="goBack" title="Volver">
          <svg viewBox="0 0 24 24" class="header-icon"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <h1 class="page-title">Seleccionar Dirección</h1>
        <div class="header-spacer"></div>
      </header>

      <div v-if="errorMessage" class="error-state glass-panel">{{ errorMessage }}</div>

      
      <div v-if="addresses.length === 0" class="empty-state glass-panel">
        <svg viewBox="0 0 24 24" class="empty-icon"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <h3>Sin Direcciones</h3>
        <p>Añade tu primera dirección para recibir tus pedidos.</p>
      </div>

      <div v-else class="address-list">
        <div 
          v-for="(address, index) in addresses" 
          :key="index"
          class="address-card glass-panel"
          :class="{ 'selected': selectedAddressIndex === index }"
          @click="selectAddress(index)"
        >
          <div class="card-radio">
            <input type="radio" :checked="selectedAddressIndex === index" readonly />
          </div>
          <div class="card-info">
            <div class="info-header">
              <span class="street">{{ address.street }}</span>
              <span class="index-badge">#{{ index + 1 }}</span>
            </div>
            <span class="city-state">{{ address.city }}, {{ address.state }}</span>
            <span class="country-zip" v-if="address.zipCode">{{ address.country }} - {{ address.zipCode }}</span>
          </div>
        </div>
      </div>

      
      <div class="bottom-action">
        <button 
          class="pill-btn create-order-btn" 
          :disabled="selectedAddressIndex === null || isOrderLoading || isLoading"
          @click="createOrder"
        >
          <span v-if="!isOrderLoading">{{ $t('orders.create_order') }}</span>
          <svg v-else class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
        </button>
      </div>

      
      <button class="fab-btn" @click="showDialog = true">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
      </button>

    </div>

    
    <div v-if="showDialog" class="dialog-backdrop" @click.self="showDialog = false">
      <div class="dialog-box glass-panel">
        <h3 class="dialog-title">Nueva Dirección</h3>
        
        <div class="form-fields">
          <div class="input-wrapper editable-shadow">
            <input type="text" v-model="newAddress.street" placeholder="Calle / Avenida *" />
          </div>
          <div class="input-wrapper editable-shadow">
            <input type="text" v-model="newAddress.city" placeholder="Ciudad *" />
          </div>
          <div class="input-wrapper editable-shadow">
            <input type="text" v-model="newAddress.state" placeholder="Estado / Provincia" />
          </div>
          <div class="row-fields">
            <div class="input-wrapper editable-shadow flex-1">
              <input type="text" v-model="newAddress.country" placeholder="País" />
            </div>
            <div class="input-wrapper editable-shadow flex-1">
              <input type="text" v-model="newAddress.zipCode" placeholder="Cód. Postal" />
            </div>
          </div>
        </div>

        <div class="dialog-actions">
          <button class="pill-btn cancel-btn" @click="showDialog = false" :disabled="isLoading">{{ $t('common.cancel') }}</button>
          <button class="pill-btn save-btn" @click="saveAddress" :disabled="!newAddress.street || !newAddress.city || isLoading">
            <span v-if="!isLoading">{{ $t('common.save') }}</span>
            <svg v-else class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="3"></circle></svg>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.address-layout {
  min-height: 100vh; background-color: #f4ecec; padding: 20px;
  display: flex; flex-direction: column; align-items: center; position: relative;
}
.content-wrapper { width: 100%; max-width: 600px; display: flex; flex-direction: column; flex: 1; }


.page-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 24px; padding-top: 12px;
}
.page-title { font-size: 24px; font-weight: 800; color: #2b000d; margin: 0; }
.header-spacer { width: 42px; }
.icon-btn {
  background: transparent; border: none; cursor: pointer; padding: 8px; border-radius: 50%;
  transition: background 0.2s; color: #2b000d;
}
.icon-btn:hover { background: rgba(74, 27, 42, 0.08); }
.header-icon { width: 26px; height: 26px; }


.glass-panel {
  background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(43, 0, 13, 0.12); box-shadow: 0 16px 40px rgba(43, 0, 13, 0.08);
}


.empty-state { border-radius: 24px; padding: 48px; text-align: center; color: rgba(0,0,0,0.55); margin-top: 40px; }
.empty-icon { width: 64px; height: 64px; color: #4a1b2a; margin-bottom: 16px; opacity: 0.5; }


.address-list { display: flex; flex-direction: column; gap: 16px; flex: 1; padding-bottom: 100px; }
.address-card {
  border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 16px;
  cursor: pointer; transition: all 0.2s; border: 2px solid transparent;
}
.address-card:hover { transform: translateY(-2px); box-shadow: 0 20px 48px rgba(43, 0, 13, 0.12); }
.address-card.selected { border-color: #2b000d; background: rgba(255, 255, 255, 1); }

.card-radio input[type="radio"] { accent-color: #2b000d; transform: scale(1.3); pointer-events: none; }

.card-info { display: flex; flex-direction: column; flex: 1; }
.info-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.street { font-size: 16px; font-weight: 800; color: #2b000d; }
.index-badge { font-size: 12px; font-weight: 700; color: #4a1b2a; background: rgba(43, 0, 13, 0.05); padding: 4px 8px; border-radius: 8px; }
.city-state, .country-zip { font-size: 14px; color: rgba(0,0,0,0.55); margin-top: 2px; }


.bottom-action { margin-top: auto; padding-top: 24px; }
.pill-btn { padding: 16px 24px; border-radius: 28px; font-weight: 800; font-size: 16px; cursor: pointer; transition: all 0.2s; border: none; width: 100%; display: flex; justify-content: center; align-items: center; }
.create-order-btn { background: #2b000d; color: white; box-shadow: 0 8px 16px rgba(43, 0, 13, 0.2); }
.create-order-btn:hover:not(:disabled) { background: #4a1b2a; transform: translateY(-2px); box-shadow: 0 12px 24px rgba(74, 27, 42, 0.3); }
.create-order-btn:disabled { opacity: 0.5; cursor: not-allowed; }


.fab-btn {
  position: fixed; bottom: 100px; right: calc(50% - 300px + 20px);
  width: 56px; height: 56px; border-radius: 50%; background: #4a1b2a; color: white;
  display: flex; align-items: center; justify-content: center; border: none; cursor: pointer;
  box-shadow: 0 8px 24px rgba(74, 27, 42, 0.4); transition: transform 0.2s;
}
@media (max-width: 640px) { .fab-btn { right: 20px; } }
.fab-btn:hover { transform: scale(1.05); }
.fab-btn svg { width: 28px; height: 28px; }


.dialog-backdrop {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(43, 0, 13, 0.6); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;
}
.dialog-box { width: 100%; max-width: 400px; padding: 32px; border-radius: 28px; background: #ffffff; }
.dialog-title { color: #2b000d; font-size: 24px; font-weight: 800; margin: 0 0 24px; }

.form-fields { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
.row-fields { display: flex; gap: 12px; }
.flex-1 { flex: 1; }

.editable-shadow input {
  width: 100%; padding: 14px 16px; border-radius: 12px; border: 1px solid #dcd9d9;
  font-size: 15px; font-family: inherit; color: #2b000d; background: #ffffff;
  box-sizing: border-box; transition: all 0.2s;
}
.editable-shadow input:focus { outline: none; border-color: #4a1b2a; box-shadow: 0 0 0 3px rgba(74, 27, 42, 0.1); }

.dialog-actions { display: flex; gap: 12px; }
.cancel-btn { background: transparent; color: rgba(0,0,0,0.6); border: 1px solid rgba(0,0,0,0.2); }
.cancel-btn:hover { background: rgba(0,0,0,0.05); }
.save-btn { background: #2b000d; color: white; }
.save-btn:hover:not(:disabled) { background: #4a1b2a; }
.save-btn:disabled { opacity: 0.5; cursor: not-allowed; }


.spinner { animation: rotate 2s linear infinite; width: 24px; height: 24px; }
.spinner .path { stroke: #ffffff; stroke-linecap: round; animation: dash 1.5s ease-in-out infinite; }
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash { 0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; } 50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; } 100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; } }
</style>
