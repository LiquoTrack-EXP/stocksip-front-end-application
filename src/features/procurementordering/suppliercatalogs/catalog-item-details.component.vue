<script setup>
/**
 * catalog-item-details.component component.
 * @displayName catalog-item-details.component
 * @version 1.0.0
 */
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { CatalogService } from '@/features/procurementordering/services/procurement.service';

const router = useRouter();
const route = useRoute();
const catalogId = ref(route.params.catalogId);
const productId = ref(route.params.productId);

const isLoading = ref(false);
const showSuccessDialog = ref(false);
const quantity = ref(1);

const catalogItem = ref(null);

const goBack = () => router.go(-1);
const goToCart = () => router.push('/cart');

const loadItem = async () => {
  isLoading.value = true;
  try {
    const res = await CatalogService.getCatalogById(catalogId.value);
    const catalog = res.data;
    const item = catalog.catalogItems.find(i => i.productId === productId.value);
    if (item) {
      catalogItem.value = {
        productId: item.productId,
        productName: item.productName || 'Producto',
        unitPrice: item.amount,
        currency: item.currency || 'USD',
        availableStock: item.availableStock || 0,
        imageUrl: item.productImage || ''
      };
    }
  } catch (err) {
    console.error('Error loading item:', err);
  } finally {
    isLoading.value = false;
  }
};

const increaseQuantity = () => {
  if (catalogItem.value && quantity.value < catalogItem.value.availableStock) {
    quantity.value++;
  }
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = () => {
  isLoading.value = true;
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(i => i.productId === catalogItem.value.productId);
    
    if (existingItem) {
      existingItem.quantity += quantity.value;
    } else {
      cart.push({
        ...catalogItem.value,
        quantity: quantity.value
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    showSuccessDialog.value = true;
  } catch (err) {
    console.error('Error adding to cart:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadItem();
});
</script>

<template>
  <div class="web-layout item-detail-layout">
    
    
    <div class="bg-gradient"></div>

    <div class="content-wrapper">
      
      
      <header class="page-header">
        <button class="icon-btn dark-mode-btn" @click="goBack" :title="$t('common.back')">
          <svg viewBox="0 0 24 24" class="header-icon"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <div class="header-spacer"></div>
      </header>

      
      <div v-if="isLoading && !catalogItem && !showSuccessDialog" class="state-container">
        <svg class="spinner light" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
      </div>

      
      <div v-else-if="catalogItem" class="item-content-wrapper">
        
        
        <div class="image-section">
          <div class="image-card glass-panel">
            <img v-if="catalogItem.imageUrl" :src="catalogItem.imageUrl" :alt="catalogItem.productName" />
            <div v-else class="img-placeholder">{{ $t('catalogs.item_details.no_image') }}</div>
          </div>
          
          <div class="stock-badge" :class="{ 'out-of-stock': catalogItem.availableStock === 0 }">
            {{ catalogItem.availableStock > 0 ? $t('catalogs.item_details.in_stock') : $t('catalogs.item_details.out_of_stock') }}
          </div>
        </div>

        
        <div class="detail-card glass-panel">
          <h1 class="p-name">{{ catalogItem.productName }}</h1>
          <h2 class="p-price">{{ catalogItem.unitPrice || $t('catalogs.item_details.price_not_available') }}</h2>

          
          <div class="info-cards-row">
            <div class="info-card">
              <svg viewBox="0 0 24 24" class="info-icon"><path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-.9-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4h16v3z"/></svg>
              <span class="info-label">{{ $t('products.stock') }}</span>
              <span class="info-value">{{ catalogItem.availableStock }} {{ $t('products.units') }}</span>
            </div>
            <div class="info-card">
              <svg viewBox="0 0 24 24" class="info-icon"><path fill="currentColor" d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.41l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.41zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>
              <span class="info-label">{{ $t('products.unit_price') }}</span>
              <span class="info-value">{{ catalogItem.unitPrice }}</span>
            </div>
          </div>

          <h3 class="section-title">{{ $t('catalogs.item_details.about_product') }}</h3>
          <p class="p-desc">Este es un excelente producto proveniente de los mejores viñedos. Cuenta con una maduración ideal y representa una adición fundamental para tu inventario.</p>

          <h3 class="section-title mt-24">{{ $t('catalogs.item_details.select_quantity') }}</h3>
          <div class="quantity-selector">
            <button class="qty-btn" @click="decreaseQuantity">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 13H5v-2h14v2z"/></svg>
            </button>
            <div class="qty-display">
              <span class="qty-number">{{ quantity }}</span>
              <span class="qty-label">{{ $t('products.units') }}</span>
            </div>
            <button class="qty-btn add" @click="increaseQuantity" :disabled="quantity >= catalogItem.availableStock">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </button>
          </div>
        </div>

      </div>

    </div>

    
    <div v-if="catalogItem" class="floating-bottom-bar">
      <button 
        class="pill-btn add-cart-btn" 
        :disabled="catalogItem.availableStock === 0 || isLoading"
        @click="addToCart"
      >
        <span v-if="!isLoading && catalogItem.availableStock > 0" class="btn-content">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          {{ $t('catalogs.item_details.add_to_cart', { qty: quantity }) }}
        </span>
        <span v-else-if="!isLoading && catalogItem.availableStock === 0">{{ $t('catalogs.item_details.out_of_stock') }}</span>
        <svg v-else class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
      </button>
    </div>

    
    <div v-if="showSuccessDialog" class="modal-backdrop" @click.self="showSuccessDialog = false">
      <div class="modal-card glass-panel">
        <h3 class="modal-title">{{ $t('catalogs.item_details.added_success') }}</h3>
        <p class="modal-desc">{{ $t('catalogs.item_details.added_desc', { qty: quantity, name: catalogItem?.productName }) }}</p>
        <div class="modal-actions">
          <button class="text-btn" @click="showSuccessDialog = false">{{ $t('catalogs.item_details.continue_shopping') }}</button>
          <button class="pill-btn confirm-btn" @click="goToCart">{{ $t('catalogs.item_details.view_cart') }}</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.item-detail-layout {
  min-height: 100vh; background-color: #f4ecec; position: relative;
  display: flex; flex-direction: column; align-items: center; padding-bottom: 100px;
}
.bg-gradient {
  position: absolute; top: 0; left: 0; width: 100%; height: 400px;
  background: linear-gradient(180deg, #2b000d 0%, #4a1b2a 100%);
  z-index: 0;
}

.content-wrapper { width: 100%; max-width: 700px; display: flex; flex-direction: column; position: relative; z-index: 1; padding: 20px; }


.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-top: 12px; }
.dark-mode-btn { background: rgba(255,255,255,0.2) !important; color: white !important; }
.dark-mode-btn:hover { background: rgba(255,255,255,0.3) !important; }
.icon-btn { border: none; cursor: pointer; padding: 10px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
.header-icon { width: 26px; height: 26px; }


.glass-panel {
  background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(43, 0, 13, 0.12); box-shadow: 0 16px 40px rgba(43, 0, 13, 0.08); border-radius: 20px;
}


.item-content-wrapper { display: flex; flex-direction: column; align-items: center; }
.image-section { position: relative; width: 100%; max-width: 280px; height: 280px; margin-bottom: -40px; z-index: 2; }
.image-card { width: 100%; height: 100%; border-radius: 32px; display: flex; align-items: center; justify-content: center; padding: 24px; background: white; box-shadow: 0 24px 48px rgba(43, 0, 13, 0.3) !important; }
.image-card img { width: 100%; height: 100%; object-fit: contain; }
.img-placeholder { color: rgba(0,0,0,0.4); font-weight: 700; }
.stock-badge { position: absolute; top: 16px; right: 16px; background: #4CAF50; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; text-transform: uppercase; }
.stock-badge.out-of-stock { background: #e53e3e; }


.detail-card { width: 100%; padding: 64px 32px 40px; border-radius: 32px; background: #f8f4f4; border: none; }
.p-name { font-size: 28px; font-weight: 800; color: #2b000d; margin: 0 0 8px; line-height: 1.2; }
.p-price { font-size: 32px; font-weight: 800; color: #4a1b2a; margin: 0 0 32px; }


.info-cards-row { display: flex; gap: 16px; margin-bottom: 32px; }
.info-card { flex: 1; background: white; border-radius: 20px; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; box-shadow: 0 4px 12px rgba(43,0,13,0.05); }
.info-icon { width: 32px; height: 32px; color: #4a1b2a; margin-bottom: 12px; }
.info-label { font-size: 12px; color: rgba(0,0,0,0.55); font-weight: 600; margin-bottom: 4px; }
.info-value { font-size: 18px; font-weight: 800; color: #2b000d; }

.section-title { font-size: 20px; font-weight: 800; color: #2b000d; margin: 0 0 16px; }
.mt-24 { margin-top: 32px; }
.p-desc { background: white; padding: 20px; border-radius: 20px; color: rgba(0,0,0,0.6); font-size: 15px; line-height: 1.5; margin: 0; box-shadow: 0 4px 12px rgba(43,0,13,0.05); }


.quantity-selector { background: white; border-radius: 20px; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(43,0,13,0.05); }
.qty-btn { width: 48px; height: 48px; border-radius: 50%; border: none; background: rgba(74, 27, 42, 0.1); color: #4a1b2a; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; }
.qty-btn:hover:not(:disabled) { background: rgba(74, 27, 42, 0.2); }
.qty-btn.add { background: #4a1b2a; color: white; }
.qty-btn.add:hover:not(:disabled) { background: #2b000d; }
.qty-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.qty-btn svg { width: 24px; height: 24px; }
.qty-display { display: flex; flex-direction: column; align-items: center; }
.qty-number { font-size: 32px; font-weight: 800; color: #2b000d; line-height: 1; }
.qty-label { font-size: 12px; color: rgba(0,0,0,0.55); font-weight: 600; }


.floating-bottom-bar { position: fixed; bottom: 0; left: 0; width: 100%; padding: 24px; background: linear-gradient(to top, #f4ecec 60%, transparent); display: flex; justify-content: center; z-index: 10; }
.add-cart-btn { width: 100%; max-width: 600px; padding: 20px; border-radius: 32px; background: #4a1b2a; color: white; font-size: 18px; font-weight: 800; border: none; cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: 0 12px 24px rgba(74, 27, 42, 0.4); transition: all 0.2s; }
.add-cart-btn:hover:not(:disabled) { background: #2b000d; transform: translateY(-2px); box-shadow: 0 16px 32px rgba(43, 0, 13, 0.5); }
.add-cart-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; background: #666; }
.btn-content { display: flex; align-items: center; gap: 8px; }
.btn-content svg { width: 24px; height: 24px; }


.modal-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(43, 0, 13, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-card { width: 100%; max-width: 400px; padding: 32px; border-radius: 32px; background: #ffffff; display: flex; flex-direction: column; text-align: center; }
.modal-title { color: #2b000d; font-size: 24px; font-weight: 800; margin: 0 0 12px; }
.modal-desc { color: rgba(0,0,0,0.6); font-size: 16px; margin: 0 0 32px; line-height: 1.5; }
.modal-actions { display: flex; justify-content: space-between; gap: 16px; }
.text-btn { flex: 1; background: transparent; border: none; color: #4a1b2a; font-weight: 800; font-size: 16px; cursor: pointer; padding: 16px; border-radius: 20px; }
.text-btn:hover { background: rgba(74, 27, 42, 0.05); }
.confirm-btn { flex: 1; background: #4a1b2a; color: white; padding: 16px; border-radius: 20px; font-weight: 800; font-size: 16px; border: none; cursor: pointer; box-shadow: 0 8px 16px rgba(74, 27, 42, 0.2); }
.confirm-btn:hover { background: #2b000d; }


.spinner { animation: rotate 2s linear infinite; width: 32px; height: 32px; }
.spinner .path { stroke: #ffffff; stroke-linecap: round; animation: dash 1.5s ease-in-out infinite; }
.spinner.light .path { stroke: #ffffff; }
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash { 0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; } 50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; } 100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; } }
</style>
