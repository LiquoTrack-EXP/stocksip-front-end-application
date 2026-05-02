<script setup>
/**
 * warehouse-edit.component component.
 * @displayName warehouse-edit.component
 * @version 1.0.0
 */
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { WarehouseService } from '@/features/inventorymanagement/services/inventory.service';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const warehouseId = computed(() => route.params.warehouseId);

const formState = ref({
  name: '',
  street: '',
  city: '',
  district: '',
  postalCode: '',
  country: 'Perú',
  capacity: '',
  minTemp: '',
  maxTemp: ''
});

const imagePreview = ref(null);
const imageFile = ref(null);
const isLoading = ref(false);

const paises = ["Perú", "Colombia", "Chile", "Argentina", "Ecuador", "México", "Bolivia", "Uruguay", "Paraguay", "Brasil"];
const ciudades = ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura", "Cusco", "Iquitos", "Huancayo", "Tacna", "Pucallpa"];
const distritos = ["Miraflores", "San Isidro", "Surco", "San Borja", "La Molina", "Barranco", "Magdalena", "Pueblo Libre", "San Miguel", "Lince"];

onMounted(async () => {
  if (warehouseId.value) {
    try {
      const response = await WarehouseService.getWarehouse(warehouseId.value);
      const w = response.data;
      formState.value = {
        name: w.name || '',
        street: w.addressStreet || '',
        city: w.addressCity || '',
        district: w.addressDistrict || '',
        postalCode: w.addressPostalCode || '',
        country: w.addressCountry || '',
        capacity: w.capacity || '',
        minTemp: w.temperatureMin || '',
        maxTemp: w.temperatureMax || ''
      };
      imagePreview.value = w.imageUrl || null;
    } catch (err) {
      console.error('Error loading warehouse:', err);
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

const triggerImageSelect = () => document.getElementById('warehouseImageUpload').click();

const goBack = () => router.go(-1);

const saveWarehouse = async () => {
  if (/^\d+$/.test(formState.value.name)) {
    toast.add({ severity: 'error', summary: 'Error de Validación', detail: 'El nombre del almacén no puede ser solo números.', life: 5000 });
    return;
  }
  if (/^\d+$/.test(formState.value.street)) {
    toast.add({ severity: 'error', summary: 'Error de Validación', detail: 'La dirección no puede contener solo números.', life: 5000 });
    return;
  }

  if (parseFloat(formState.value.minTemp) > parseFloat(formState.value.maxTemp)) {
    toast.add({ severity: 'error', summary: 'Temperatura Errónea', detail: 'La temperatura mínima no puede ser mayor a la máxima.', life: 5000 });
    return;
  }

  isLoading.value = true;
  try {
    const formData = new FormData();
    formData.append('Name', formState.value.name);
    formData.append('AddressStreet', formState.value.street);
    formData.append('AddressCity', formState.value.city);
    formData.append('AddressDistrict', formState.value.district);
    formData.append('AddressPostalCode', formState.value.postalCode);
    formData.append('AddressCountry', formState.value.country);
    formData.append('Capacity', formState.value.capacity);
    formData.append('TemperatureMin', formState.value.minTemp);
    formData.append('TemperatureMax', formState.value.maxTemp);
    if (imageFile.value) formData.append('Image', imageFile.value);

    await WarehouseService.updateWarehouse(warehouseId.value, formData);
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Almacén actualizado con éxito', life: 3000 });
    setTimeout(() => router.push('/warehouses'), 1000);
  } catch (err) {
    console.error('Error updating warehouse:', err.response?.data);
    toast.add({ severity: 'error', summary: 'Error', detail: err.response?.data?.message || 'Error desconocido', life: 5000 });
  } finally {
    isLoading.value = false;
  }
};

const isValidFormat = computed(() => {
  return formState.value.name && formState.value.street && formState.value.city && 
         formState.value.district && formState.value.postalCode && formState.value.country &&
         Number(formState.value.capacity) >= 0 && 
         Number(formState.value.minTemp) < Number(formState.value.maxTemp);
});
</script>

<template>
  <div class="web-layout edit-layout">
    
    <div class="form-card glass-panel">
      
      <header class="card-header">
        <button class="icon-btn" @click="goBack" title="Volver">
          <svg viewBox="0 0 24 24" class="header-icon"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <h2 class="header-title">{{ isEditMode ? 'Editar Almacén' : 'Nuevo Almacén' }}</h2>
        <div class="header-spacer"></div>
      </header>

      <div class="card-body">
        
        <div class="form-fields">

          
          <div class="image-upload-wrapper" @click="triggerImageSelect">
            <input type="file" id="warehouseImageUpload" accept="image/*" @change="onImageChange" style="display: none;" />
            <div class="image-preview" v-if="imagePreview || imageFile">
              <img :src="imagePreview" alt="Preview" class="preview-img" v-if="imagePreview" />
              <div class="image-overlay">Cambiar Imagen</div>
            </div>
            <div class="image-placeholder" v-else>
              <svg viewBox="0 0 24 24" class="upload-icon"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h-2v5H6l6 6 6-6h-2v-5z"/></svg>
              <span>Añadir foto</span>
            </div>
          </div>

          <div class="row-fields">
            <div class="field-group flex-1 editable-shadow">
              <label class="field-label">Nombre del Almacén</label>
              <input type="text" v-model="formState.name" placeholder="Ej: Central" />
            </div>
            <div class="field-group flex-1 editable-shadow">
              <label class="field-label">Capacidad (uds)</label>
              <input type="number" min="0" v-model="formState.capacity" placeholder="Ej: 500" />
            </div>
          </div>

          <div class="row-fields">
            <div class="field-group flex-1 editable-shadow">
              <label class="field-label">Calle</label>
              <input type="text" v-model="formState.street" placeholder="Ej: Av. Brasil 123" />
            </div>
            <div class="field-group flex-1 editable-shadow select-arrow-wrap">
              <label class="field-label">Distrito</label>
              <select v-model="formState.district" required>
                <option value="" disabled>Seleccione un distrito</option>
                <option v-for="distrito in distritos" :key="distrito" :value="distrito">{{ distrito }}</option>
              </select>
            </div>
          </div>

          <div class="row-fields">
            <div class="field-group flex-1 editable-shadow select-arrow-wrap">
              <label class="field-label">Ciudad</label>
              <select v-model="formState.city" required>
                <option value="" disabled>Seleccione una ciudad</option>
                <option v-for="ciudad in ciudades" :key="ciudad" :value="ciudad">{{ ciudad }}</option>
              </select>
            </div>
            <div class="field-group flex-1 editable-shadow select-arrow-wrap">
              <label class="field-label">País</label>
              <select v-model="formState.country" required disabled>
                <option value="Perú">Perú</option>
              </select>
            </div>
            <div class="field-group flex-1 editable-shadow">
              <label class="field-label">Código Postal</label>
              <input type="text" v-model="formState.postalCode" placeholder="Ej: 15000" />
            </div>
          </div>

          <div class="row-fields">
            <div class="field-group flex-1 editable-shadow">
              <label class="field-label">Temp. Min (°C)</label>
              <input type="number" v-model="formState.minTemp" placeholder="10" />
            </div>
            <div class="field-group flex-1 editable-shadow">
              <label class="field-label">Temp. Max (°C)</label>
              <input type="number" v-model="formState.maxTemp" placeholder="25" />
            </div>
          </div>

        </div>
      </div>

      <div class="card-footer">
        <button class="pill-btn save-btn" @click="saveWarehouse" :disabled="isLoading || !isValidFormat">
          <span v-if="!isLoading">Guardar Almacén</span>
          <svg v-else class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
        </button>
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

.select-arrow-wrap { position: relative; }
.select-arrow-wrap::after {
  content: "▼"; position: absolute; right: 20px; top: 45px;
  font-size: 10px; color: rgba(43, 0, 13, 0.5); pointer-events: none;
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
