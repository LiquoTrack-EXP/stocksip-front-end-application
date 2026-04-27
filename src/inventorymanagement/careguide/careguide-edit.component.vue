<script setup>
/**
 * careguide-edit.component component.
 * @displayName careguide-edit.component
 * @version 1.0.0
 */
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { CareGuideService } from '../services/inventory.service.js';

const router = useRouter();
const route = useRoute();

const careGuideId = ref(route.params.id);
const showDeleteDialog = ref(false);
const isLoading = ref(true);

const formState = ref({
  productName: '',
  title: '',
  summary: '',
  minTemp: '',
  maxTemp: '',
  productType: '',
  imageUrl: ''
});

onMounted(async () => {
  if (careGuideId.value) {
    try {
      const res = await CareGuideService.getCareGuideById(careGuideId.value);
      const data = res.data;
      formState.value = {
        productName: data.productName || '',
        title: data.title || '',
        summary: data.summary || '',
        minTemp: data.minTemp || '',
        maxTemp: data.maxTemp || '',
        productType: data.productType || '',
        imageUrl: data.imageUrl || ''
      };
    } catch (err) {
      console.error('Error loading care guide:', err);
    } finally {
      isLoading.value = false;
    }
  } else {
    isLoading.value = false;
  }
});

const goBack = () => router.go(-1);

const saveGuide = async () => {
  isLoading.value = true;
  try {
    await CareGuideService.updateCareGuide(careGuideId.value, {
      title: formState.value.title,
      summary: formState.value.summary,
      minTemp: Number(formState.value.minTemp),
      maxTemp: Number(formState.value.maxTemp),
      productType: formState.value.productType
    });
    alert('Guía actualizada con éxito');
    router.go(-1);
  } catch (err) {
    console.error('Error updating guide:', err.response?.data);
    alert('Error: ' + (err.response?.data?.message || 'No se pudo actualizar'));
  } finally {
    isLoading.value = false;
  }
};

const confirmDelete = async () => {
  isLoading.value = true;
  try {
    await CareGuideService.deleteCareGuide(careGuideId.value);
    alert('Guía eliminada con éxito');
    showDeleteDialog.value = false;
    router.push('/careguides');
  } catch (err) {
    console.error('Error deleting guide:', err);
    alert('No se pudo eliminar la guía');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="web-layout edit-guide-layout">
    
    
    <div class="form-card glass-panel">
      
      
      <header class="card-header">
        <button class="icon-btn" @click="goBack" title="Volver">
          <svg viewBox="0 0 24 24" class="header-icon"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        
        <h2 class="header-title">{{ formState.productName || 'Care Guide' }}</h2>
        
        <button class="icon-btn" @click="showDeleteDialog = true" title="Eliminar guía">
          <svg viewBox="0 0 24 24" class="header-icon delete-icon"><path fill="currentColor" d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
        </button>
      </header>

      <div class="card-body">
        
        
        <div class="illustration-box">
          <img v-if="formState.imageUrl" :src="formState.imageUrl" alt="Guide Image" class="guide-image" />
          <div v-else class="placeholder-img">
            <svg viewBox="0 0 24 24" class="img-icon"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
          </div>
        </div>

        
        <div class="form-fields">
          
          <div class="field-item">
            <label class="field-label">Título</label>
            <div class="input-wrapper editable-shadow">
              <input type="text" v-model="formState.title" placeholder="Título de la guía" />
            </div>
          </div>

          <div class="field-item">
            <label class="field-label">Nombre del Producto</label>
            <div class="input-wrapper editable-shadow">
              <input type="text" v-model="formState.productName" placeholder="Ej: Vino Tinto Reserva" />
            </div>
          </div>

          <div class="field-item">
            <label class="field-label">Comentarios / Resumen</label>
            <div class="input-wrapper editable-shadow">
              <textarea v-model="formState.summary" rows="3" placeholder="Detalles de conservación..."></textarea>
            </div>
          </div>

          
          <div class="grid-form">
            <div class="field-item">
              <label class="field-label">Temp. Mínima</label>
              <div class="input-wrapper editable-shadow">
                <input type="number" v-model="formState.minTemp" placeholder="Ej: 12" />
              </div>
            </div>
            
            <div class="field-item">
              <label class="field-label">Temp. Máxima</label>
              <div class="input-wrapper editable-shadow">
                <input type="number" v-model="formState.maxTemp" placeholder="Ej: 18" />
              </div>
            </div>
          </div>

        </div>

      </div>

      
      <div class="card-footer">
        <button class="pill-btn save-btn" @click="saveGuide">{{ $t('common.save_changes') }}</button>
      </div>

    </div>

    
    <div v-if="showDeleteDialog" class="dialog-backdrop" @click.self="showDeleteDialog = false">
      <div class="delete-dialog glass-panel">
        <h3 class="dialog-title">¿Eliminar esta guía?</h3>
        <p class="dialog-msg">Esta acción es permanente y no se podrá deshacer.</p>
        
        <div class="dialog-actions">
          <button class="pill-btn confirm-delete-btn" @click="confirmDelete">{{ $t('common.delete') }}</button>
          <button class="pill-btn cancel-btn" @click="showDeleteDialog = false">{{ $t('common.cancel') }}</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>

.edit-guide-layout {
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
  max-width: 600px;
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
  color: #4a1b2a; 
  margin: 0;
  text-align: center;
  flex: 1;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a1b2a;
}

.icon-btn:hover {
  background: rgba(74, 27, 42, 0.08);
}

.header-icon {
  width: 26px;
  height: 26px;
}

.delete-icon {
  color: #e53e3e; 
}


.card-body {
  padding: 32px;
  flex: 1;
  overflow-y: auto;
}


.illustration-box {
  background-color: #F0E0D8;
  border: 1px solid #E1CBC1;
  border-radius: 24px;
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  box-shadow: 0 6px 12px rgba(0,0,0,0.05);
  overflow: hidden;
}

.placeholder-img {
  color: #d1b6ab;
}

.img-icon {
  width: 64px;
  height: 64px;
}

.guide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


.form-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field-label {
  font-size: 14px;
  font-weight: 700;
  color: #2b000d;
  margin-bottom: 8px;
  display: block;
  margin-left: 4px;
}

.grid-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.editable-shadow input,
.editable-shadow textarea {
  width: 100%;
  padding: 16px 20px;
  border-radius: 18px; 
  border: 1px solid #dcd9d9;
  font-size: 15px;
  font-family: inherit;
  color: #2b000d;
  background: #ffffff;
  box-shadow: inset 0 2px 4px rgba(43, 0, 13, 0.02);
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.editable-shadow input:focus,
.editable-shadow textarea:focus {
  outline: none;
  border-color: #4a1b2a;
  box-shadow: 0 0 0 3px rgba(74, 27, 42, 0.1);
}

.editable-shadow input::placeholder,
.editable-shadow textarea::placeholder {
  color: #8E8C89; 
  font-weight: 500;
}

.editable-shadow textarea {
  resize: vertical;
  min-height: 116px; 
}


.card-footer {
  padding: 24px 32px 32px;
  display: flex;
  justify-content: center;
}

.pill-btn {
  padding: 16px 48px;
  border-radius: 24px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.save-btn {
  background: #4a1b2a;
  color: #ffffff;
  width: 60%;
  box-shadow: 0 8px 16px rgba(74, 27, 42, 0.2);
}

.save-btn:hover {
  background: #2b000d;
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(74, 27, 42, 0.3);
}


.dialog-backdrop {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(43, 0, 13, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.delete-dialog {
  width: 90%;
  max-width: 380px;
  padding: 32px 28px;
  border-radius: 28px;
  text-align: center;
  background: #ffffff;
}

.dialog-title {
  color: #4a1b2a;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px;
}

.dialog-msg {
  color: rgba(0,0,0,0.6);
  margin: 0 0 24px;
  font-size: 15px;
}

.dialog-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.confirm-delete-btn {
  background: #4a1b2a;
  color: #ffffff;
  width: 100%;
}

.cancel-btn {
  background: #E6E0DC; 
  color: #4a1b2a;
  width: 100%;
}

.cancel-btn:hover {
  background: #d8cece;
}
</style>
