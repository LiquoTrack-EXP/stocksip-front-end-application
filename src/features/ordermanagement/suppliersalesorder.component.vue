<script setup>
/**
 * suppliersalesorder.component component.
 * @displayName suppliersalesorder.component
 * @version 1.0.0
 */
import { ref, computed, onMounted } from 'vue';
import { OrderService } from '@/features/ordermanagement/services/order.service';

const orders = ref([]);
const isLoading = ref(true);
const error = ref(null);

const showStatusDialog = ref(false);
const selectedOrder = ref(null);
const statusOptions = ['PENDING', 'CONFIRM', 'CANCEL'];

onMounted(async () => {
  try {
    const accountId = localStorage.getItem('accountId');
    if (!accountId) { isLoading.value = false; return; }

    const response = await OrderService.getOrdersByLiquorStoreOwner(accountId);

    const data = response.data;
    orders.value = Array.isArray(data) ? data : (data?.orders ?? []);
  } catch (err) {
    if (err?.response?.status !== 403 && err?.response?.status !== 404) {
      console.error('Error loading supplier sales orders:', err);
    }
    error.value = err?.response?.status === 403
      ? 'Sin permisos para ver las órdenes de este rol.'
      : 'No se pudieron cargar las órdenes.';
  } finally {
    isLoading.value = false;
  }
});

const openStatusDialog = (order) => {
  selectedOrder.value = order;
  showStatusDialog.value = true;
};

const changeStatus = async (newStatus) => {
  if (!selectedOrder.value) return;
  const orderId = selectedOrder.value.id || selectedOrder.value.salesOrderId;
  try {
    if (newStatus === 'CONFIRM') {
      await OrderService.confirmOrder(orderId);
    } else if (newStatus === 'CANCEL') {
      await OrderService.cancelOrder(orderId);
    }
    selectedOrder.value.status = newStatus;
  } catch (err) {
    console.error('Error changing order status:', err.response?.data);
    alert('Error al cambiar estado: ' + (err.response?.data?.message || 'Error desconocido'));
  }
  showStatusDialog.value = false;
};

const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + (item.unitPrice * item.quantityToSell), 0);
};

const calculateQuantity = (items) => {
  return items.reduce((sum, item) => sum + item.quantityToSell, 0);
};

const getCurrencyFormat = (items) => {
  const firstCurrency = items[0]?.currency || 'PEN';
  return ['USD', '$'].includes(firstCurrency.toUpperCase()) ? '$' : 'S/.';
};

const getStatusStyles = (status) => {
  const s = status.toUpperCase();
  if (s === 'CONFIRM' || s === 'CONFIRMED') {
    return { bg: 'rgba(76, 175, 80, 0.15)', color: '#4CAF50' };
  } else if (s === 'CANCEL' || s === 'CANCELED') {
    return { bg: 'rgba(229, 62, 62, 0.15)', color: '#e53e3e' };
  } else {
    return { bg: 'rgba(242, 228, 156, 0.3)', color: '#b59300' };
  }
};
</script>

<template>
  <div class="web-layout supplier-orders-layout">
    <div class="content-wrapper">
      
      <header class="page-header">
        <h1 class="page-title">{{ $t('orders.supplier_sales') }}</h1>
        <p class="page-subtitle">{{ $t('orders.supplier_sales_subtitle') }}</p>
      </header>

      <div v-if="isLoading" class="loading-state">
        <svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
      </div>

      <div v-else-if="error" class="error-state glass-panel">
        <p>{{ error }}</p>
      </div>

      <div v-else class="orders-list">
        
        
        <div v-if="orders.length === 0" class="empty-state glass-panel">
          <svg viewBox="0 0 24 24" class="empty-icon"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/></svg>
          <h3>No hay pedidos</h3>
          <p>Aún no has recibido órdenes de venta.</p>
        </div>

        
        <div 
          v-for="order in orders" 
          :key="order.id" 
          class="order-card glass-panel"
        >
          <div class="card-main">
            <div class="card-info">
              <h3 class="order-code">{{ order.orderCode }}</h3>
              <p class="order-price">
                Total: <strong>{{ getCurrencyFormat(order.items) }}{{ calculateTotal(order.items).toFixed(2) }}</strong>
              </p>
              <p class="order-qty">Cantidad: {{ calculateQuantity(order.items) }} items</p>
              <p class="order-date">Generado el: {{ order.receiptDate || '-' }}</p>
            </div>

            <div class="card-actions">
              <div 
                class="status-pill" 
                :style="{ backgroundColor: getStatusStyles(order.status).bg, color: getStatusStyles(order.status).color }"
              >
                {{ order.status }}
              </div>
              <button class="pill-btn update-btn" @click="openStatusDialog(order)">
                Actualizar Estado
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    
    <div v-if="showStatusDialog" class="dialog-backdrop" @click.self="showStatusDialog = false">
      <div class="dialog-box glass-panel">
        <h3 class="dialog-title">Actualizar Estado de la Orden</h3>
        <p class="dialog-msg">Selecciona el nuevo estado para <strong>{{ selectedOrder?.orderCode }}</strong>:</p>
        
        <div class="options-list">
          <label 
            v-for="option in statusOptions" 
            :key="option" 
            class="option-row"
          >
            <input 
              type="radio" 
              name="statusOption" 
              :value="option" 
              :checked="selectedOrder?.status === option"
              @change="changeStatus(option)"
            />
            <span class="option-label">{{ option }}</span>
          </label>
        </div>

        <div class="dialog-actions">
          <button class="pill-btn cancel-btn w-full" @click="showStatusDialog = false">{{ $t('common.cancel') }}</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.supplier-orders-layout {
  min-height: 100vh;
  background-color: #f4ecec;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-wrapper {
  width: 100%;
  max-width: 800px;
}

.page-header {
  margin-bottom: 32px;
  text-align: left;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: #2b000d;
  margin: 0 0 8px;
}

.page-subtitle {
  font-size: 16px;
  color: rgba(0,0,0,0.55);
  margin: 0;
}


.glass-panel {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(43, 0, 13, 0.12);
  box-shadow: 0 16px 40px rgba(43, 0, 13, 0.08);
}


.empty-state {
  border-radius: 24px; padding: 48px; text-align: center;
  color: rgba(0,0,0,0.55);
}
.empty-icon { width: 64px; height: 64px; color: #4a1b2a; margin-bottom: 16px; opacity: 0.5; }


.error-state {
  border-radius: 24px; padding: 24px; text-align: center;
  color: #e53e3e; font-weight: 700;
}


.loading-state {
  display: flex; justify-content: center; padding: 40px;
}
.spinner { animation: rotate 2s linear infinite; width: 40px; height: 40px; }
.spinner .path { stroke: #2b000d; stroke-linecap: round; animation: dash 1.5s ease-in-out infinite; }
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash {
  0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
}


.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  border-radius: 20px;
  padding: 24px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 48px rgba(43, 0, 13, 0.12);
}

.card-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-code {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 800;
  color: #4a1b2a;
}

.order-price {
  margin: 0;
  font-size: 16px;
  color: rgba(0,0,0,0.82);
}
.order-price strong { color: #2b000d; font-weight: 800; }

.order-qty {
  margin: 0; font-size: 14px; color: rgba(0,0,0,0.55);
}

.order-date {
  margin: 8px 0 0; font-size: 13px; color: rgba(0,0,0,0.4);
}

.card-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
}

.status-pill {
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.update-btn {
  background: transparent;
  color: #2b000d;
  border: 1px solid rgba(43, 0, 13, 0.2);
  padding: 8px 16px;
  font-size: 13px;
}
.update-btn:hover {
  background: rgba(43, 0, 13, 0.05);
}


.dialog-backdrop {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(43, 0, 13, 0.6); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.dialog-box {
  width: 90%; max-width: 400px; padding: 32px; border-radius: 28px; background: #ffffff;
}
.dialog-title { color: #2b000d; font-size: 20px; font-weight: 800; margin: 0 0 8px; }
.dialog-msg { color: rgba(0,0,0,0.6); font-size: 14px; margin: 0 0 24px; }
.dialog-msg strong { color: #2b000d; }

.options-list {
  display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px;
}
.option-row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; border-radius: 12px; background: rgba(43, 0, 13, 0.03);
  cursor: pointer; transition: background 0.2s;
}
.option-row:hover { background: rgba(43, 0, 13, 0.08); }
.option-row input[type="radio"] { accent-color: #2b000d; transform: scale(1.2); }
.option-label { font-size: 15px; font-weight: 700; color: #2b000d; }

.dialog-actions { display: flex; justify-content: center; }

.pill-btn { padding: 12px 24px; border-radius: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s ease; border: none; }
.cancel-btn { background: transparent; color: rgba(0,0,0,0.6); }
.cancel-btn:hover { background: rgba(0,0,0,0.05); }
.w-full { width: 100%; text-align: center; }

@media (max-width: 500px) {
  .card-main { flex-direction: column; align-items: flex-start; gap: 16px; }
  .card-actions { align-items: flex-start; width: 100%; flex-direction: row; justify-content: space-between; }
}
</style>
