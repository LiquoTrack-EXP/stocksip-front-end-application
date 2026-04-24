<script setup>
/**
 * cart.component component.
 * @displayName cart.component
 * @version 1.0.0
 */
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PurchaseOrderService } from '@/features/procurementordering/services/procurement.service';

const router = useRouter();
const cartItems = ref([]);
const isLoading = ref(false);

const loadCart = () => {
  try {
    cartItems.value = JSON.parse(localStorage.getItem('cart') || '[]');
  } catch (err) {
    console.error('Error loading cart:', err);
    cartItems.value = [];
  }
};

onMounted(() => {
  loadCart();
});

const subTotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
});

const total = computed(() => subTotal.value);

const increaseQuantity = (productId) => {
  const item = cartItems.value.find(i => i.productId === productId);
  if (item) {
    item.quantity++;
    saveCart();
  }
};

const decreaseQuantity = (productId) => {
  const item = cartItems.value.find(i => i.productId === productId);
  if (item && item.quantity > 1) {
    item.quantity--;
    saveCart();
  }
};

const removeItem = (productId) => {
  cartItems.value = cartItems.value.filter(i => i.productId !== productId);
  saveCart();
};

const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cartItems.value));
};

const goBack = () => router.go(-1);

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
};

const proceedToCheckout = async () => {
  if (cartItems.value.length === 0) return;
  isLoading.value = true;
  try {
    const accountId = localStorage.getItem('accountId');
    if (!accountId) return;

    const catalogIdBuyFrom = localStorage.getItem('selectedCatalogId') || '';
    const created = await PurchaseOrderService.createPurchaseOrderForAccount(accountId, {
      orderCode: `PO-${Date.now()}`,
      catalogIdBuyFrom,
      addressIndex: 0,
    });

    const purchaseOrderId = created.data?.id;
    if (purchaseOrderId) {
      for (const item of cartItems.value) {
        await PurchaseOrderService.addItemToPurchaseOrder(purchaseOrderId, {
          productId: item.productId,
          quantity: item.quantity,
        });
      }
    }
    
    alert("¡Orden de compra generada con éxito!");
    localStorage.removeItem('cart');
    router.push('/orders');
  } catch (err) {
    console.error('Error creating purchase order:', err.response?.data);
    alert('Error: ' + (err.response?.data?.message || 'No se pudo generar la orden'));
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="web-layout cart-layout">
    
    <div class="content-wrapper">
      
      
      <header class="page-header">
        <button class="icon-btn" @click="goBack" :title="$t('common.back')">
          <svg viewBox="0 0 24 24" class="header-icon"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <h1 class="page-title">{{ $t('cart.title') }}</h1>
        <div class="header-spacer"></div>
      </header>

      <div class="cart-body">
        
        <h2 class="section-title">{{ $t('cart.subtitle') }}</h2>

        <div v-if="cartItems.length === 0" class="empty-state glass-panel">
          <svg viewBox="0 0 24 24" class="empty-icon"><path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
          <h3>{{ $t('cart.empty_title') }}</h3>
          <p>{{ $t('cart.empty_desc') }}</p>
        </div>

        <div v-else class="cart-content-grid">
          
          
          <div class="items-list">
            <div 
              v-for="item in cartItems" 
              :key="item.productId" 
              class="cart-item-card glass-panel"
            >
              
              <div class="item-img-wrapper">
                <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.productName" />
                <div v-else class="img-placeholder"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></div>
              </div>

              
              <div class="item-details">
                <div class="details-top">
                  <div class="title-price">
                    <h3 class="product-name">{{ item.productName }}</h3>
                    <span class="unit-price">{{ $t('products.unit_price') }}: {{ formatPrice(item.unitPrice) }}</span>
                  </div>
                  
                  <button class="delete-btn" @click="removeItem(item.productId)" :title="$t('common.delete')">
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                  </button>
                </div>

                <div class="details-bottom">
                  
                  <div class="qty-controls">
                    <button class="qty-btn" @click="decreaseQuantity(item.productId)">
                      <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 13H5v-2h14v2z"/></svg>
                    </button>
                    <span class="qty-val">{{ item.quantity }}</span>
                    <button class="qty-btn add" @click="increaseQuantity(item.productId)">
                      <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                    </button>
                  </div>
                  
                  <div class="item-subtotal">
                    <span class="subtotal-label">{{ $t('cart.subtotal') }}:</span>
                    <span class="subtotal-val">{{ formatPrice(item.unitPrice * item.quantity) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div class="totals-section">
            <div class="totals-card glass-panel">
              <div class="totals-row">
                <span class="totals-label">{{ $t('cart.subtotal') }}</span>
                <span class="totals-val">{{ formatPrice(subTotal) }}</span>
              </div>
              <div class="divider"></div>
              <div class="totals-row total-row">
                <span class="totals-label">{{ $t('orders.fields.total') }}</span>
                <span class="totals-val big-val">{{ formatPrice(total) }}</span>
              </div>
            </div>

            
            <button 
              class="pill-btn next-btn" 
              :disabled="isLoading"
              @click="proceedToCheckout"
            >
              <span v-if="!isLoading">{{ $t('cart.checkout') }}</span>
              <svg v-else class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
            </button>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
.cart-layout {
  min-height: 100vh; background-color: #f4ecec; padding: 20px;
  display: flex; flex-direction: column; align-items: center;
}
.content-wrapper { width: 100%; max-width: 900px; display: flex; flex-direction: column; }


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

.section-title { font-size: 18px; font-weight: 700; color: #4a1b2a; margin: 0 0 16px 4px; }


.glass-panel {
  background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(43, 0, 13, 0.12); box-shadow: 0 16px 40px rgba(43, 0, 13, 0.08);
}


.empty-state { border-radius: 24px; padding: 64px 24px; text-align: center; color: rgba(0,0,0,0.55); }
.empty-icon { width: 80px; height: 80px; color: #4a1b2a; margin-bottom: 24px; opacity: 0.5; }


.cart-content-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  align-items: start;
}
@media (max-width: 800px) {
  .cart-content-grid { grid-template-columns: 1fr; }
}


.items-list { display: flex; flex-direction: column; gap: 16px; }
.cart-item-card {
  border-radius: 20px; padding: 16px; display: flex; gap: 16px;
  transition: transform 0.2s;
}
.cart-item-card:hover { transform: translateY(-2px); box-shadow: 0 20px 48px rgba(43, 0, 13, 0.12); }

.item-img-wrapper {
  width: 96px; height: 96px; border-radius: 12px; background: rgba(43, 0, 13, 0.04);
  display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;
}
.item-img-wrapper img { width: 80%; height: 80%; object-fit: contain; }
.img-placeholder { color: rgba(0,0,0,0.2); width: 32px; height: 32px; }

.item-details { display: flex; flex-direction: column; justify-content: space-between; flex: 1; }
.details-top { display: flex; justify-content: space-between; align-items: flex-start; }
.title-price { display: flex; flex-direction: column; gap: 4px; }
.product-name { font-size: 16px; font-weight: 800; color: #2b000d; margin: 0; }
.unit-price { font-size: 14px; color: rgba(0,0,0,0.55); }

.delete-btn {
  background: rgba(229, 62, 62, 0.1); color: #e53e3e; border: none;
  width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.2s;
}
.delete-btn:hover { background: rgba(229, 62, 62, 0.2); }
.delete-btn svg { width: 20px; height: 20px; }

.details-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; }

.qty-controls { display: flex; align-items: center; gap: 12px; }
.qty-btn {
  width: 36px; height: 36px; border-radius: 50%; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: background 0.2s;
  background: rgba(74, 27, 42, 0.1); color: #4a1b2a;
}
.qty-btn:hover { background: rgba(74, 27, 42, 0.2); }
.qty-btn.add { background: #4a1b2a; color: white; }
.qty-btn.add:hover { background: #2b000d; }
.qty-btn svg { width: 18px; height: 18px; }
.qty-val { font-size: 16px; font-weight: 800; color: #2b000d; min-width: 20px; text-align: center; }

.item-subtotal { display: flex; align-items: baseline; gap: 6px; }
.subtotal-label { font-size: 14px; color: rgba(0,0,0,0.55); }
.subtotal-val { font-size: 16px; font-weight: 800; color: #4a1b2a; }


.totals-section { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 20px; }
.totals-card { padding: 24px; border-radius: 20px; display: flex; flex-direction: column; gap: 16px; }
.totals-row { display: flex; justify-content: space-between; align-items: center; }
.totals-label { font-size: 16px; color: rgba(0,0,0,0.55); font-weight: 700; }
.totals-val { font-size: 18px; font-weight: 800; color: #2b000d; }
.divider { height: 1px; background: rgba(43, 0, 13, 0.08); }
.total-row .totals-label { font-size: 18px; color: #2b000d; }
.big-val { font-size: 24px; color: #4a1b2a; }

.next-btn {
  width: 100%; padding: 18px; border-radius: 28px; font-weight: 800; font-size: 18px;
  cursor: pointer; transition: all 0.2s; border: none; display: flex; justify-content: center; align-items: center;
  background: #2b000d; color: white; box-shadow: 0 8px 16px rgba(43, 0, 13, 0.2);
}
.next-btn:hover:not(:disabled) { background: #4a1b2a; transform: translateY(-2px); box-shadow: 0 12px 24px rgba(74, 27, 42, 0.3); }
.next-btn:disabled { opacity: 0.5; cursor: not-allowed; }


.spinner { animation: rotate 2s linear infinite; width: 24px; height: 24px; }
.spinner .path { stroke: #ffffff; stroke-linecap: round; animation: dash 1.5s ease-in-out infinite; }
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash { 0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; } 50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; } 100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; } }
</style>
