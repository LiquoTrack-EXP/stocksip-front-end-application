<script>
import { ProductService } from '@/features/inventorymanagement/storage/data/remote/services/ProductService';
import { BrandService } from '@/features/inventorymanagement/storage/data/remote/services/BrandService';
import { ProductTypeService } from '@/features/inventorymanagement/storage/data/remote/services/ProductTypeService';

/**
 * ProductCreateComponent component.
 * @displayName ProductCreateComponent
 * @version 1.0.0
 */
export default {
  name: "ProductCreateComponent",
  data() {
    return {
      isLoading: false,
      imageFile: null,
      form: {
        name: "",
        type: "",
        brand: "",
        currency: "PEN",
        unitPrice: null,
        minStock: null,
        contentCapacity: null,
        supplierId: "",
      },
      brands: [],
      productTypes: []
    };
  },
  async mounted() {
    await this.fetchDropdownData();
  },
  methods: {
    /**
     * goBack
     * @public
     */
    goBack() {
      this.$router.go(-1);
    },
    /**
     * fetchDropdownData
     * @public
     */
    async fetchDropdownData() {
      const fallbackBrands = [
        { _id: '69ea57f4e35cede8f7c20d76', name: 'Tabernero' },
        { _id: '69ea57f4e35cede8f7c20d77', name: 'SantiagoQueirolo' },
        { _id: '69ea57f4e35cede8f7c20d78', name: 'Pilsen' },
        { _id: '69ea57f4e35cede8f7c20d79', name: 'Cristal' },
        { _id: '69ea57f4e35cede8f7c20d7a', name: 'Cusqueña' },
        { _id: '69ea57f4e35cede8f7c20d7b', name: 'JhonnyWalker' }
      ];
      const fallbackTypes = [
        { _id: '69ea57f4e35cede8f7c20d85', name: 'Tequilas' },
        { _id: '69ea57f4e35cede8f7c20d86', name: 'Vodkas' },
        { _id: '69ea57f4e35cede8f7c20d87', name: 'Gins' },
        { _id: '69ea57f4e35cede8f7c20d88', name: 'Cocktails' },
        { _id: '69ea57f4e35cede8f7c20d89', name: 'Juices' },
        { _id: '69ea57f4e35cede8f7c20d8a', name: 'SoftDrinks' },
        { _id: '69ea57f4e35cede8f7c20d8b', name: 'Others' }
      ];

      const [brandsResult, typesResult] = await Promise.allSettled([
        BrandService.getAllBrands(),
        ProductTypeService.getAllProductTypes()
      ]);

      this.brands = (brandsResult.status === 'fulfilled' && brandsResult.value.data?.length)
        ? brandsResult.value.data
        : fallbackBrands;

      this.productTypes = (typesResult.status === 'fulfilled' && typesResult.value.data?.length)
        ? typesResult.value.data
        : fallbackTypes;

      if (brandsResult.status === 'rejected') console.warn('[ProductCreate] Brands no disponibles desde API, usando fallback.');
      if (typesResult.status === 'rejected') console.warn('[ProductCreate] ProductTypes no disponibles desde API, usando fallback.');

      if (this.brands.length > 0 && !this.form.brand) this.form.brand = this.brands[0].name;
      if (this.productTypes.length > 0 && !this.form.type) this.form.type = this.productTypes[0].name;
    },
    onImageChange(e) {
      this.imageFile = e.target.files[0] || null;
    },
    async addProduct() {
      if (/^\d+$/.test(this.form.name)) {
        this.$toast.add({ severity: 'error', summary: 'Error de Validación', detail: 'El nombre del producto no puede ser solo números.', life: 5000 });
        return;
      }

      this.isLoading = true;
      try {
        const accountId = localStorage.getItem('accountId');
        if (!accountId) { 
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontró accountId', life: 5000 }); 
          return; 
        }

        const formData = new FormData();
        formData.append('Name', this.form.name);
        formData.append('Type', this.form.type);
        formData.append('Brand', this.form.brand);
        formData.append('UnitPrice', this.form.unitPrice);
        formData.append('Code', this.form.currency);
        formData.append('MinimumStock', this.form.minStock);
        formData.append('Content', this.form.contentCapacity);
        if (this.form.supplierId) formData.append('SupplierId', this.form.supplierId);
        if (this.imageFile) formData.append('Image', this.imageFile);

        await ProductService.registerProduct(accountId, formData);
        this.$toast.add({ severity: 'success', summary: 'Éxito', detail: 'Producto registrado con éxito', life: 3000 });
        this.$router.push('/storage');
      } catch (err) {
        const status = err.response?.status;
        const body   = err.response?.data;
        console.error('[addProduct] HTTP status:', status);
        console.error('[addProduct] Response body:', JSON.stringify(body, null, 2));
        console.error('[addProduct] Full error:', err);
        const isTimeout = err.code === 'ECONNABORTED' || err.message?.includes('timeout');
        const isNoResponse = !err.response;
        let msg;
        if (isTimeout || isNoResponse) {
          msg = 'El servidor tardó demasiado en responder. Verifica que el backend esté activo y la base de datos conectada.';
        } else {
          msg = body?.message || body?.title || body?.error || JSON.stringify(body) || 'Error desconocido';
        }
        this.$toast.add({ severity: 'error', summary: 'Error', detail: msg, life: 5000 });
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<template>
  <div class="product-create-container web-layout">
    <div class="content-wrapper">
      
      
      <header class="web-header">
        <div class="flex-title-area">
          <button class="back-btn" @click="goBack" :title="$t('common.back')">
            
            <svg viewBox="0 0 24 24" class="back-icon">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <div class="header-text">
            <h1 class="page-title">{{ $t('products.new_product') }}</h1>
            <p class="page-subtitle">{{ $t('products.subtitle') }}</p>
          </div>
        </div>
      </header>

      
      <div class="create-split-view glass-panel">
        
        
        <div class="image-upload-section">
          <div class="upload-container">
            
            <label class="img-placeholder-box" for="product-image">
              <input type="file" id="product-image" accept="image/*" @change="onImageChange" style="display: none;" />
              <svg viewBox="0 0 24 24" class="camera-icon">
                <circle cx="12" cy="12" r="3.2"/>
                <path fill="currentColor" d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
              </svg>
            </label>
            <p class="select-img-text">{{ imageFile ? imageFile.name : 'Select an image' }}</p>
          </div>
        </div>
        
        <div class="form-section">
          <form @submit.prevent="addProduct" class="modern-form">
            <h2 class="form-title">Detalles Fundamentales</h2>
            
            <div class="form-grid">
              
              <div class="field-group full-width">
                <label class="external-label">{{ $t('common.name') }}</label>
                <div class="input-wrap mockup-shadow">
                  <input type="text" v-model="form.name" placeholder="Vino Borgoña" required />
                </div>
              </div>

              <div class="field-group">
                <div class="dark-dropdown-wrap mockup-shadow">
                  <span class="internal-label">{{ $t('products.type') }}</span>
                  <select v-model="form.type" required>
                    <option disabled value="">{{ $t('products.type') }}...</option>
                    <option v-for="t in productTypes" :key="t._id || t.id" :value="t.name">{{ t.name }}</option>
                  </select>
                  <svg viewBox="0 0 24 24" class="chevron-icon"><path fill="currentColor" d="M7 10l5 5 5-5H7z"/></svg>
                </div>
              </div>

              <div class="field-group">
                <div class="dark-dropdown-wrap mockup-shadow">
                  <span class="internal-label">{{ $t('products.brand') }}</span>
                  <select v-model="form.brand" required>
                    <option disabled value="">{{ $t('products.brand') }}...</option>
                    <option v-for="b in brands" :key="b._id || b.id" :value="b.name">{{ b.name }}</option>
                  </select>
                  <svg viewBox="0 0 24 24" class="chevron-icon"><path fill="currentColor" d="M7 14l5-5 5 5H7z"/></svg> 
                </div>
              </div>

              <div class="field-group">
                <label class="external-label">{{ $t('products.unit_price') }}</label>
                <div class="input-wrap mockup-shadow">
                  <input type="number" step="0.01" min="0.01" v-model="form.unitPrice" placeholder="18" required />
                </div>
              </div>

              <div class="field-group">
                <div class="dark-dropdown-wrap mockup-shadow">
                  <span class="internal-label">Currency *</span>
                  <select v-model="form.currency" required>
                    <option disabled value="">Select...</option>
                    <option value="USD">USD</option>
                    <option value="PEN">PEN</option>
                    <option value="EUR">EUR</option>
                  </select>
                  <svg viewBox="0 0 24 24" class="chevron-icon"><path fill="currentColor" d="M7 10l5 5 5-5H7z"/></svg>
                </div>
              </div>

              <div class="field-group">
                <label class="external-label">{{ $t('products.min_stock') }}</label>
                <div class="input-wrap mockup-shadow">
                  <input type="number" min="0" step="1" v-model="form.minStock" placeholder="e.g., 10" required />
                </div>
              </div>

              <div class="field-group">
                <label class="external-label">{{ $t('products.quantity') }}</label>
                <div class="input-wrap mockup-shadow">
                  <input type="number" min="0" step="1" v-model="form.contentCapacity" placeholder="e.g., 750" required />
                </div>
              </div>

            </div>

            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="goBack">{{ $t('common.cancel') }}</button>
              <button type="submit" class="save-btn add-mockup-btn">{{ $t('home.features.new_product.button') }}</button>
            </div>

          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.product-create-container {
  --top-bg: #2b000d;
  --bottom-bg: #f4ecec;
  --accent-red: #e53e3e;
  --button-bg: #4a1b2a;
  --white: #ffffff;
  --black: #000000;
  
  --glass-bg: rgba(255, 255, 255, 0.95);
  --glass-border: rgba(43, 0, 13, 0.08);
  --text-primary: rgba(0, 0, 0, 0.85);
  --text-secondary: rgba(0, 0, 0, 0.55);

  padding: 40px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--bottom-bg);
  background: radial-gradient(circle at top left, rgba(229, 62, 62, 0.04), transparent 50%), var(--bottom-bg);
  animation: fadeIn 0.4s ease-out;
}

.content-wrapper {
  max-width: 1050px;
  margin: 0 auto;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.web-header {
  margin-bottom: 30px;
}

.flex-title-area {
  display: flex;
  align-items: center;
}

.back-btn {
  background: var(--white);
  border: 1px solid var(--glass-border);
  color: var(--button-bg);
  cursor: pointer;
  padding: 12px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px; 
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: var(--button-bg);
  color: var(--white);
  transform: translateX(-4px);
}

.back-icon {
  width: 26px;
  height: 26px; 
}

.header-text {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--top-bg); 
  margin: 0 0 4px;
  letter-spacing: -0.5px;
}

.page-subtitle {
  margin: 0;
  font-size: 15px;
  color: var(--text-secondary);
}


.glass-panel {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: 0 12px 40px rgba(43, 0, 13, 0.06);
  border-radius: 24px;
}

.create-split-view {
  display: flex;
  min-height: 600px;
  overflow: hidden;
}


.image-upload-section {
  flex: 0 0 400px; 
  background: linear-gradient(135deg, rgba(244, 236, 236, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%); 
  border-right: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.img-placeholder-box {
  width: 100%;
  aspect-ratio: 4 / 3; 
  background-color: #cacaca; 
  border-radius: 16px; 
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.03); 
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.img-placeholder-box:hover {
  background-color: #b8b8b8;
}

.camera-icon {
  width: 54px;
  height: 54px;
  color: #555555; 
}

.select-img-text {
  font-size: 15px;
  font-weight: 600;
  color: #a0979a; 
  margin: 0;
}


.form-section {
  flex: 1;
  padding: 50px;
  background: var(--white);
}

.form-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--top-bg);
  margin: 0 0 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(43, 0, 13, 0.06);
}

.modern-form {
  display: flex;
  flex-direction: column;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
  row-gap: 24px;
}

.full-width {
  grid-column: span 2;
}


.external-label {
  display: block;
  font-size: 14px;
  font-weight: 800;
  color: #1c060d; 
  margin-bottom: 8px;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}


.mockup-shadow input, .mockup-shadow select {
  width: 100%;
  padding: 16px 20px;
  border-radius: 8px; 
  border: 1px solid rgba(43, 0, 13, 0.1); 
  font-size: 16px;
  font-family: inherit;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(43, 0, 13, 0.04); 
}


.input-wrap input {
  background: var(--white);
  color: var(--text-primary);
  font-weight: 600;
}

.input-wrap input:focus {
  outline: none;
  border-color: rgba(74, 27, 42, 0.3);
  box-shadow: 0 4px 16px rgba(74, 27, 42, 0.08); 
}

.input-wrap input::placeholder {
  color: rgba(0, 0, 0, 0.25); 
  font-weight: 500;
}




.dark-dropdown-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
}

.dark-dropdown-wrap select {
  appearance: none;
  cursor: pointer;
  padding: 24px 44px 10px 16px; 
  
  
  background: #3a2e31; 
  color: #fdfafb; 
  font-weight: 600;
  border: 1px solid transparent; 
  box-shadow: 0 4px 12px rgba(58, 46, 49, 0.3); 
}

.dark-dropdown-wrap select:focus {
  outline: none;
  border-color: rgba(229, 62, 62, 0.4); 
}


.internal-label {
  position: absolute;
  top: 8px;
  left: 16px;
  font-size: 11px;
  font-weight: 600;
  color: #c4b5b9; 
  pointer-events: none; 
}


.dark-dropdown-wrap .chevron-icon {
  width: 24px;
  height: 24px;
  color: #fff; 
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}


.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  margin-top: 50px;
  padding-top: 32px;
}

.cancel-btn {
  background: transparent;
  color: var(--text-secondary);
  padding: 16px 28px;
  border-radius: 28px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: rgba(43, 0, 13, 0.05);
  color: var(--top-bg);
}


.add-mockup-btn {
  background: linear-gradient(135deg, #2b000d 0%, #100206 100%); 
  color: var(--white);
  padding: 12px 36px;
  border-radius: 40px; 
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.05); 
  box-shadow: 0 8px 24px rgba(30, 5, 12, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  width: auto;
  position: relative;
  overflow: hidden;
}

.add-mockup-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: all 0.5s ease;
}

.add-mockup-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 32px rgba(45, 13, 24, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, #3d0515 0%, #1a050c 100%);
}

.add-mockup-btn:hover::after {
  left: 100%;
}

.add-mockup-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(30, 5, 12, 0.3);
}



@media (max-width: 900px) {
  .create-split-view {
    flex-direction: column;
  }
  .image-upload-section {
    flex: none;
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--glass-border);
    padding: 30px;
  }
  .upload-container {
    max-width: 380px;
    margin: 0 auto;
  }
  .form-section {
    padding: 30px;
  }
}

@media (max-width: 600px) {
  .product-create-container {
    padding: 20px 16px;
  }
  .form-grid {
    grid-template-columns: 1fr;
    row-gap: 20px;
  }
  .full-width {
    grid-column: span 1;
  }
  .form-actions {
    flex-direction: column-reverse;
  }
  .add-mockup-btn, .cancel-btn {
    width: 100%;
  }
}
</style>
