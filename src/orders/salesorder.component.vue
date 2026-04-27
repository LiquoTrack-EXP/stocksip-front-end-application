<script setup>
/**
 * salesorder.component component.
 * @displayName salesorder.component
 * @version 1.0.0
 */
import { ref, onMounted } from 'vue';
import { OrderService } from '@/orders/services/order.service.js';

const salesOrders = ref([]);
const isLoading = ref(true);
const error = ref(null);

const loadOrders = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const accountId = localStorage.getItem('accountId');
    if (!accountId) { isLoading.value = false; return; }
    const response = await OrderService.getAccountSalesOrders(accountId);
    salesOrders.value = response.data || [];
  } catch (err) {
    console.error('Error loading sales orders:', err);
    error.value = 'No se pudieron cargar las órdenes de venta.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => loadOrders());

const navToCreate = () => {
  console.log("Navigating to create sales order...");
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

const getStatusColor = (status) => {
  switch(status.toUpperCase()) {
    case 'PENDING': return { bg: 'rgba(242, 228, 156, 0.3)', color: '#b59300' };
    case 'CONFIRM': 
    case 'CONFIRMED': return { bg: 'rgba(76, 175, 80, 0.15)', color: '#4CAF50' };
    case 'CANCEL':
    case 'CANCELED': return { bg: 'rgba(229, 62, 62, 0.15)', color: '#e53e3e' };
    default: return { bg: 'rgba(43, 0, 13, 0.08)', color: '#2b000d' };
  }
};
</script>

<template>
  <div class="web-layout sales-orders-layout">
    
    <div class="content-wrapper">
      <header class="page-header">
        <h1 class="page-title">{{ $t('orders.sales_orders') }}</h1>
        <p class="page-subtitle">{{ $t('orders.sales_subtitle') }}</p>
      </header>

      
      <div class="action-bar">
        <h2 class="section-title">{{ $t('orders.recent') }}</h2>
        <div class="action-buttons">
          <button class="icon-btn reload-btn" @click="loadOrders" title="Recargar Órdenes">
            <svg viewBox="0 0 24 24" class="btn-icon"><path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
          </button>
          <button class="icon-btn add-btn" @click="navToCreate" title="Nueva Orden">
            <svg viewBox="0 0 24 24" class="btn-icon"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="loading-state">
        <svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
      </div>

      <div v-else-if="error" class="error-state glass-panel">
        <p>{{ error }}</p>
      </div>

      <div v-else class="orders-list">
        
        
        <div v-if="salesOrders.length === 0" class="empty-state glass-panel">
          <svg viewBox="0 0 24 24" class="empty-icon"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/></svg>
          <h3>{{ $t('orders.empty_sales') }}</h3>
          <p>Crea tu primera orden de venta para comenzar.</p>
          <button class="pill-btn create-btn" @click="navToCreate">{{ $t('orders.create_order') }}</button>
        </div>

        
        <div 
          v-for="order in salesOrders" 
          :key="order.id" 
          class="order-card glass-panel"
        >
          <div class="card-header">
            <span class="order-code">{{ order.orderCode }}</span>
            <div 
              class="status-pill" 
              :style="{ backgroundColor: getStatusColor(order.status).bg, color: getStatusColor(order.status).color }"
            >
              {{ order.status }}
            </div>
          </div>

          <div class="card-body">
            <div class="products-list">
              <div v-for="(item, index) in order.items" :key="index" class="product-row">
                <div class="product-info">
                  <div class="img-placeholder"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></div>
                  <div class="product-details">
                    <span class="product-name">{{ item.name || 'Producto sin nombre' }}</span>
                    <span class="product-meta">x{{ item.quantityToSell }} • {{ getCurrencyFormat([item]) }}{{ item.unitPrice.toFixed(2) }} c/u</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="card-footer">
            <div class="footer-stats">
              <div class="stat-item">
                <span class="stat-label">{{ $t('orders.fields.total') }}</span>
                <span class="stat-value total-val">{{ getCurrencyFormat(order.items) }}{{ calculateTotal(order.items).toFixed(2) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">{{ $t('orders.fields.items') }}</span>
                <span class="stat-value">{{ calculateQuantity(order.items) }}</span>
              </div>
            </div>
            <div class="footer-meta">
              <span class="date-label">Generado el: {{ order.receiptDate }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.sales-orders-layout {
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
  margin-bottom: 24px;
}
.page-title { font-size: 32px; font-weight: 800; color: #2b000d; margin: 0 0 8px; }
.page-subtitle { font-size: 16px; color: rgba(0,0,0,0.55); margin: 0; }

.action-bar {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
}
.section-title { font-size: 20px; font-weight: 700; color: #4a1b2a; margin: 0; }
.action-buttons { display: flex; gap: 12px; }

.icon-btn {
  width: 44px; height: 44px; border-radius: 12px; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  color: white; box-shadow: 0 4px 12px rgba(43, 0, 13, 0.15);
}
.reload-btn { background: #4a1b2a; }
.reload-btn:hover { background: #2b000d; transform: translateY(-2px); }
.add-btn { background: #2b000d; }
.add-btn:hover { background: #000000; transform: translateY(-2px); }
.btn-icon { width: 24px; height: 24px; }


.glass-panel {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(43, 0, 13, 0.12);
  box-shadow: 0 16px 40px rgba(43, 0, 13, 0.08);
}


.loading-state { display: flex; justify-content: center; padding: 40px; }
.spinner { animation: rotate 2s linear infinite; width: 40px; height: 40px; }
.spinner .path { stroke: #2b000d; stroke-linecap: round; animation: dash 1.5s ease-in-out infinite; }
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash {
  0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
}

.error-state { border-radius: 24px; padding: 24px; text-align: center; color: #e53e3e; font-weight: 700; }
.empty-state { border-radius: 24px; padding: 48px; text-align: center; color: rgba(0,0,0,0.55); }
.empty-icon { width: 64px; height: 64px; color: #4a1b2a; margin-bottom: 16px; opacity: 0.5; }
.create-btn { margin-top: 16px; background: #2b000d; color: white; border: none; padding: 12px 24px; border-radius: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.create-btn:hover { background: #4a1b2a; transform: translateY(-2px); box-shadow: 0 8px 16px rgba(43, 0, 13, 0.2); }


.orders-list { display: flex; flex-direction: column; gap: 16px; }

.order-card {
  border-radius: 20px; overflow: hidden; padding: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.order-card:hover { transform: translateY(-2px); box-shadow: 0 20px 48px rgba(43, 0, 13, 0.12); }

.card-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
}
.order-code { font-size: 16px; font-weight: 800; color: #4a1b2a; background: rgba(43, 0, 13, 0.05); padding: 6px 12px; border-radius: 8px; }
.status-pill { padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 800; letter-spacing: 0.5px; }

.card-body { margin-bottom: 16px; }
.products-list { display: flex; flex-direction: column; gap: 12px; }

.product-row { display: flex; justify-content: space-between; align-items: center; }
.product-info { display: flex; align-items: center; gap: 12px; }
.img-placeholder { width: 40px; height: 40px; background: rgba(43, 0, 13, 0.05); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: rgba(43, 0, 13, 0.3); }
.img-placeholder svg { width: 24px; height: 24px; }
.product-details { display: flex; flex-direction: column; }
.product-name { font-size: 15px; font-weight: 700; color: #2b000d; }
.product-meta { font-size: 13px; color: rgba(0,0,0,0.55); margin-top: 2px; }

.divider { height: 1px; background: rgba(43, 0, 13, 0.08); margin: 0 -20px 16px; }

.card-footer { display: flex; justify-content: space-between; align-items: flex-end; }
.footer-stats { display: flex; gap: 24px; }
.stat-item { display: flex; flex-direction: column; }
.stat-label { font-size: 12px; color: rgba(0,0,0,0.55); margin-bottom: 2px; }
.stat-value { font-size: 15px; font-weight: 700; color: #2b000d; }
.total-val { color: #e53e3e; font-size: 18px; }

.date-label { font-size: 13px; color: rgba(0,0,0,0.4); }

@media (max-width: 500px) {
  .card-footer { flex-direction: column; align-items: flex-start; gap: 12px; }
  .footer-stats { width: 100%; justify-content: space-between; }
}
</style>
