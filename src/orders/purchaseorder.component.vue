<script setup>
/**
 * purchaseorder.component component.
 * @displayName purchaseorder.component
 * @version 1.0.0
 */
import { ref, onMounted } from 'vue';
import { PurchaseOrderService } from '@/procurement/services/procurement.service.js';
import { OrderService } from '@/orders/services/order.service.js';

const ordersUi = ref([]);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const accountId = localStorage.getItem('accountId');
    if (!accountId) { isLoading.value = false; return; }
    const response = await PurchaseOrderService.getAllPurchaseOrdersByAccount(accountId);
    ordersUi.value = (response.data || []).map(o => ({ ...o, expanded: false }));
  } catch (err) {
    console.error('Error loading purchase orders:', err);
    error.value = 'No se pudieron cargar las órdenes de compra.';
  } finally {
    isLoading.value = false;
  }
});

const toggleExpand = (order) => {
  order.expanded = !order.expanded;
};

const convertToSales = async (orderId) => {
  isLoading.value = true;
  try {
    await OrderService.generateSalesOrderFromPurchase(orderId);
    alert(`La orden ${orderId} ha sido convertida a orden de venta.`);

    const accountId = localStorage.getItem('accountId');
    const response = await PurchaseOrderService.getAllPurchaseOrdersByAccount(accountId);
    ordersUi.value = (response.data || []).map(o => ({ ...o, expanded: false }));
  } catch (err) {
    console.error('Error converting to sales order:', err.response?.data);
    alert('Error: ' + (err.response?.data?.message || 'No se pudo convertir la orden'));
  } finally {
    isLoading.value = false;
  }
};

const getStatusColor = (status) => {
  switch(status?.toUpperCase()) {
    case 'PENDING': return '#e53e3e';
    case 'APPROVED': return '#4CAF50';
    default: return '#2b000d';
  }
};
</script>

<template>
  <div class="web-layout orders-layout">
    
    <div class="content-wrapper">
      <header class="page-header">
        <h1 class="page-title">{{ $t('orders.purchase_orders') }}</h1>
        <p class="page-subtitle">{{ $t('orders.purchase_subtitle') }}</p>
      </header>

      <div v-if="isLoading" class="loading-state">
        <svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
      </div>

      <div v-else class="orders-list">
        
        
        <div v-if="ordersUi.length === 0" class="empty-state glass-panel">
          <svg viewBox="0 0 24 24" class="empty-icon"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/></svg>
          <h3>{{ $t('orders.empty_purchase') }}</h3>
          <p>Explora catálogos para empezar a adquirir inventario.</p>
        </div>

        
        <div 
          v-for="order in ordersUi" 
          :key="order.id" 
          class="order-card glass-panel"
        >
          
          <div class="card-header" @click="toggleExpand(order)">
            <div class="header-main">
              <div class="code-badge">{{ order.code }}</div>
              <div class="title-block">
                <h3 class="order-title">{{ order.title }}</h3>
                <span class="order-date">{{ order.generatedAt }}</span>
              </div>
            </div>

            <div class="header-actions">
              <div class="status-badge" :style="{ backgroundColor: getStatusColor(order.status) }">
                {{ order.status }}
              </div>
              <div class="price-label">{{ order.priceLabel }}</div>
              <svg 
                viewBox="0 0 24 24" 
                class="chevron-icon" 
                :class="{ 'rotated': order.expanded }"
              >
                <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </div>
          </div>

          
          <div class="card-body" v-if="order.expanded">
            <div class="body-header">
              <span class="total-qty">Total de artículos: <strong>{{ order.quantity }}</strong></span>
            </div>

            <div class="products-list">
              <div v-for="(product, index) in order.products" :key="index" class="product-item">
                <div class="product-img-wrapper">
                  <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" />
                  <div v-else class="img-placeholder"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></div>
                </div>
                <div class="product-info">
                  <span class="product-name">{{ product.name }}</span>
                  <span class="product-meta">Cant: {{ product.quantity }} | P.U: ${{ product.unitPrice.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            
            <div class="card-footer" v-if="order.status.toUpperCase() === 'PENDING'">
              <button class="pill-btn convert-btn" @click.stop="convertToSales(order.id)">{{ $t('orders.process_to_sale') }}</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.orders-layout {
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


.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 48px rgba(43, 0, 13, 0.12);
}

.card-header {
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.header-main {
  display: flex;
  align-items: center;
  gap: 16px;
}

.code-badge {
  background: rgba(43, 0, 13, 0.08);
  color: #2b000d;
  font-weight: 800;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 12px;
}

.title-block {
  display: flex;
  flex-direction: column;
}

.order-title {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 700;
  color: #2b000d;
}

.order-date {
  font-size: 13px;
  color: rgba(0,0,0,0.55);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 12px;
  color: white;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.price-label {
  font-size: 18px;
  font-weight: 800;
  color: #2b000d;
  min-width: 90px;
  text-align: right;
}

.chevron-icon {
  width: 24px; height: 24px; color: rgba(0,0,0,0.4);
  transition: transform 0.3s ease;
}
.chevron-icon.rotated {
  transform: rotate(180deg);
}


.card-body {
  padding: 0 24px 24px;
  border-top: 1px solid rgba(43, 0, 13, 0.06);
}

.body-header {
  padding: 16px 0;
  font-size: 14px;
  color: rgba(0,0,0,0.82);
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: rgba(43, 0, 13, 0.03);
  border-radius: 16px;
}

.product-img-wrapper {
  width: 48px; height: 48px;
  border-radius: 12px; overflow: hidden; background: #ffffff;
  display: flex; align-items: center; justify-content: center;
}
.product-img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
.img-placeholder { color: rgba(0,0,0,0.2); width: 24px; height: 24px; }

.product-info {
  display: flex; flex-direction: column;
}
.product-name { font-size: 15px; font-weight: 700; color: #2b000d; }
.product-meta { font-size: 13px; color: rgba(0,0,0,0.55); margin-top: 2px; }

.card-footer {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.pill-btn {
  padding: 12px 24px; border-radius: 16px; font-weight: 700; font-size: 14px;
  cursor: pointer; transition: all 0.2s ease; border: none;
}
.convert-btn {
  background: #2b000d; color: #ffffff; box-shadow: 0 8px 16px rgba(43, 0, 13, 0.2);
}
.convert-btn:hover {
  background: #4a1b2a; transform: translateY(-2px); box-shadow: 0 12px 24px rgba(74, 27, 42, 0.3);
}

@media (max-width: 600px) {
  .header-main { flex-direction: column; align-items: flex-start; gap: 8px; }
  .price-label { display: none; }
}
</style>
