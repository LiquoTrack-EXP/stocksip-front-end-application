<script setup>
/**
 * product-edit.component component.
 * @displayName product-edit.component
 * @version 1.0.0
 */
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { ProductService } from '@/features/inventorymanagement/services/inventory.service';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const productId = computed(() => route.params.productId);

const formState = ref({
  name: '',
  type: '',
  brand: '',
  unitPrice: '',
  code: '',
  minimumStock: '',
  content: ''
});

const imagePreview = ref(null);
const imageFile = ref(null);
const isLoading = ref(false);

const currencies = ['USD', 'EUR', 'PEN', 'GBP'];

onMounted(async () => {
  if (productId.value) {
    try {
      const response = await ProductService.getProductById(productId.value);
      const p = response.data;
      formState.value = {
        name: p.name || '',
        type: p.type || '',
        brand: p.brand || '',
        unitPrice: p.unitPrice || '',
        code: p.code || '',
        minimumStock: p.minimumStock || '',
        content: p.content || ''
      };
      imagePreview.value = p.imageUrl || null;
    } catch (err) {
      console.error('Error loading product:', err);
    }
  }
});

const onImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const triggerImageSelect = () => document.getElementById('imageUpload').click();

const goBack = () => router.go(-1);

const saveProduct = async () => {
  if (/^\d+$/.test(formState.value.name)) {
    toast.add({ severity: 'error', summary: 'Error de Validación', detail: 'El nombre del producto no puede ser solo números.', life: 5000 });
    return;
  }
  if (formState.value.unitPrice < 0.01) {
    toast.add({ severity: 'error', summary: 'Error de Validación', detail: 'El precio unitario debe ser al menos 0.01.', life: 5000 });
    return;
  }
  if (!Number.isInteger(Number(formState.value.minimumStock)) || formState.value.minimumStock < 0) {
    toast.add({ severity: 'error', summary: 'Error de Validación', detail: 'El stock mínimo debe ser un número entero mayor o igual a 0.', life: 5000 });
    return;
  }
  if (!Number.isInteger(Number(formState.value.content)) || formState.value.content < 0) {
    toast.add({ severity: 'error', summary: 'Error de Validación', detail: 'La cantidad debe ser un número entero mayor o igual a 0.', life: 5000 });
    return;
  }
  if (Number(formState.value.content) < Number(formState.value.minimumStock)) {
    toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'La cantidad ingresada es menor al stock mínimo establecido.', life: 5000 });
  }


  isLoading.value = true;
  try {
    const formData = new FormData();
    formData.append('Name', formState.value.name);
    formData.append('UnitPrice', formState.value.unitPrice);
    formData.append('Code', formState.value.code || '');
    formData.append('MinimumStock', formState.value.minimumStock);
    formData.append('Quantity', formState.value.content);
    if (imageFile.value) formData.append('Image', imageFile.value);

    await ProductService.updateProduct(productId.value, formData);
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Producto actualizado con éxito', life: 3000 });
    setTimeout(() => router.push('/storage'), 1000);
  } catch (err) {
    const errorData = err.response?.data;
    console.error('Error updating product:', errorData);
    let errorMsg = 'No se pudo actualizar el producto.';
    
    if (typeof errorData === 'string') {
      errorMsg = errorData;
    } else if (errorData && errorData.errors) {
      errorMsg = Object.values(errorData.errors).flat().join(' ');
    } else if (errorData && errorData.message) {
      errorMsg = errorData.message;
    } else if (err.message) {
      errorMsg = err.message;
    }

    toast.add({ severity: 'error', summary: 'Error del Servidor', detail: errorMsg, life: 7000 });
  } finally {
    isLoading.value = false;
  }
};

const isValidFormat = computed(() => {
  return formState.value.name && formState.value.type && formState.value.brand && 
         formState.value.unitPrice && formState.value.content && formState.value.minimumStock;
});
</script>

<template>
  <div class="web-layout edit-layout">
    
    <div class="form-card glass-panel">
      
      <header class="card-header">
        <button class="icon-btn" @click="goBack" title="Volver">
          <svg viewBox="0 0 24 24" class="header-icon"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <h2 class="header-title">{{ isEditMode ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
        <div class="header-spacer"></div>
      </header>

      <div class="card-body">
        
        <div class="form-fields">

          
          <div class="image-upload-wrapper" @click="triggerImageSelect">
            <input type="file" id="imageUpload" accept="image/*" @change="onImageChange" style="display: none;" />
            <div class="image-preview" v-if="imagePreview">
              <img :src="imagePreview" alt="Preview" class="preview-img" />
            </div>
            <div class="placeholder-content" v-else>
              <svg viewBox="0 0 24 24" class="camera-icon"><path fill="currentColor" d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
              <span>Subir imagen</span>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Nombre del Producto</label>
            <input type="text" v-model="formState.name" class="styled-input" placeholder="Ej: Vino Tinto" required />
          </div>

          <div class="row-fields">
            <div class="field-group flex-1">
              <label class="field-label">Tipo de Producto</label>
              <input type="text" v-model="formState.type" class="styled-input" placeholder="Ej: Vino" required />
            </div>
            <div class="field-group flex-1">
              <label class="field-label">Marca</label>
              <input type="text" v-model="formState.brand" class="styled-input" placeholder="Ej: Tabernero" required />
            </div>
          </div>

          <div class="row-fields">
            <div class="field-group flex-1">
              <label class="field-label">Moneda</label>
              <div class="select-wrapper">
                <select v-model="formState.code" class="styled-input" required>
                  <option value="" disabled>Seleccione...</option>
                  <option value="PEN">PEN</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                <svg viewBox="0 0 24 24" class="select-icon"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg>
              </div>
            </div>
            <div class="field-group flex-1">
              <label class="field-label">Precio Unitario</label>
              <input type="number" step="0.01" min="0.01" v-model="formState.unitPrice" class="styled-input" placeholder="0.00" required />
            </div>
          </div>

          <div class="row-fields">
            <div class="field-group flex-1">
              <label class="field-label">Stock Mínimo</label>
              <input type="number" min="0" step="1" v-model="formState.minimumStock" class="styled-input" placeholder="10" required />
            </div>
            <div class="field-group flex-1">
              <label class="field-label">Contenido (Volumen)</label>
              <input type="number" min="0" step="1" v-model="formState.content" class="styled-input" placeholder="750" required />
            </div>
          </div>

        </div>
      </div>

      <div class="card-footer">
        <button class="pill-btn cancel-btn" @click="goBack" :disabled="isLoading">{{ $t('common.cancel') }}</button>
        <button class="pill-btn save-btn" @click="saveProduct" :disabled="isLoading">{{ $t('common.save') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit-layout {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background-color: #f4ecec; padding: 40px 20px;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(43, 0, 13, 0.12); box-shadow: 0 16px 40px rgba(43, 0, 13, 0.08);
}

.form-card {
  width: 100%; max-width: 600px; border-radius: 28px; overflow: hidden;
  display: flex; flex-direction: column;
}


.card-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 24px 32px 16px; border-bottom: 1px solid rgba(43, 0, 13, 0.06);
}
.header-title { font-size: 20px; font-weight: 700; color: #2b000d; margin: 0; }
.header-spacer { width: 42px; }

.icon-btn {
  background: transparent; border: none; cursor: pointer; padding: 8px; border-radius: 50%;
  transition: background 0.2s; color: #2b000d;
}
.icon-btn:hover { background: rgba(74, 27, 42, 0.08); }
.header-icon { width: 26px; height: 26px; }


.card-body { padding: 32px; flex: 1; }
.form-fields { display: flex; flex-direction: column; gap: 24px; }
.row-fields { display: flex; gap: 16px; width: 100%; }
.flex-1 { flex: 1; }

.field-label { font-size: 14px; font-weight: 700; color: #2b000d; margin-bottom: 8px; display: block; margin-left: 4px; }

.editable-shadow input, .editable-shadow select {
  width: 100%; padding: 16px 20px; border-radius: 18px; border: 1px solid #dcd9d9;
  font-size: 15px; font-family: inherit; color: #2b000d; background: #ffffff;
  box-sizing: border-box; transition: all 0.2s ease; appearance: none;
}
.editable-shadow input:focus, .editable-shadow select:focus {
  outline: none; border-color: #4a1b2a; box-shadow: 0 0 0 3px rgba(74, 27, 42, 0.1);
}


.image-upload-wrapper {
  width: 100%; height: 180px; border-radius: 12px; overflow: hidden; cursor: pointer;
  background: rgba(43, 0, 13, 0.05); border: 2px dashed rgba(43, 0, 13, 0.2);
  display: flex; align-items: center; justify-content: center; position: relative;
  transition: border-color 0.2s;
}
.image-upload-wrapper:hover { border-color: #4a1b2a; }

.image-preview { width: 100%; height: 100%; position: relative; }
.image-preview img { width: 100%; height: 100%; object-fit: cover; }
.image-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); color: white; display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.2s; font-weight: 700;
}
.image-upload-wrapper:hover .image-overlay { opacity: 1; }

.image-placeholder { display: flex; flex-direction: column; align-items: center; color: rgba(43, 0, 13, 0.5); }
.upload-icon { width: 48px; height: 48px; margin-bottom: 8px; }


.card-footer { padding: 0 32px 32px; }
.pill-btn {
  width: 100%; padding: 16px; border-radius: 16px; font-weight: 700; font-size: 16px;
  cursor: pointer; transition: all 0.2s ease; border: none; display: flex; align-items: center; justify-content: center;
}
.save-btn { background: #2b000d; color: #ffffff; box-shadow: 0 8px 16px rgba(43, 0, 13, 0.2); }
.save-btn:hover:not(:disabled) { background: #4a1b2a; transform: translateY(-2px); box-shadow: 0 12px 24px rgba(74, 27, 42, 0.3); }
.save-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }


.spinner { animation: rotate 2s linear infinite; width: 24px; height: 24px; }
.spinner .path { stroke: #ffffff; stroke-linecap: round; animation: dash 1.5s ease-in-out infinite; }
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash {
  0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
}
</style>
