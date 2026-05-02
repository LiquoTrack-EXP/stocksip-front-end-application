<script>
import { WarehouseService } from './data/remote/services/WarehouseService';

/**
 * WarehousesCreateComponent component.
 * @displayName WarehousesCreateComponent
 * @version 1.0.0
 */
export default {
  name: "WarehousesCreateComponent",
  data() {
    return {
      isLoading: false,
      imageFile: null,
      form: {
        nombre: "",
        calle: "",
        ciudad: "",
        distrito: "",
        codigoPostal: "",
        pais: "Perú",
        capacidad: 0,
        tempMin: "",
        tempMax: "",
      },
      paises: ["Perú", "Colombia", "Chile", "Argentina", "Ecuador", "México", "Bolivia", "Uruguay", "Paraguay", "Brasil"],
      ciudades: ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura", "Cusco", "Iquitos", "Huancayo", "Tacna", "Pucallpa"],
      distritos: ["Miraflores", "San Isidro", "Surco", "San Borja", "La Molina", "Barranco", "Magdalena", "Pueblo Libre", "San Miguel", "Lince"],
    };
  },
  methods: {
    /**
     * closeForm
     * @public
     */
    closeForm() {
      this.$router.push("/warehouses");
    },
    /**
     * onImageChange
     * @param {any} e
     * @public
     */
    onImageChange(e) {
      this.imageFile = e.target.files[0] || null;
    },
    /**
     * saveWarehouse
     * @public
     */
    async saveWarehouse() {
      if (/^\d+$/.test(this.form.nombre)) {
        this.$toast.add({ severity: 'error', summary: 'Error de Validación', detail: 'El nombre del almacén no puede ser solo números.', life: 5000 });
        return;
      }
      if (/^\d+$/.test(this.form.calle)) {
        this.$toast.add({ severity: 'error', summary: 'Error de Validación', detail: 'La dirección no puede contener solo números.', life: 5000 });
        return;
      }
      if (parseFloat(this.form.tempMin) > parseFloat(this.form.tempMax)) {
        this.$toast.add({ severity: 'error', summary: 'Temperatura Errónea', detail: 'La temperatura mínima no puede ser mayor a la máxima.', life: 5000 });
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
        formData.append('Name', this.form.nombre);
        formData.append('AddressStreet', this.form.calle);
        formData.append('AddressCity', this.form.ciudad);
        formData.append('AddressDistrict', this.form.distrito);
        formData.append('AddressPostalCode', this.form.codigoPostal);
        formData.append('AddressCountry', this.form.pais);
        formData.append('Capacity', this.form.capacidad || 0);
        formData.append('TemperatureMin', this.form.tempMin || 0);
        formData.append('TemperatureMax', this.form.tempMax || 0);
        if (this.imageFile) formData.append('Image', this.imageFile);

        await WarehouseService.registerWarehouse(accountId, formData);
        this.$toast.add({ severity: 'success', summary: 'Éxito', detail: 'Almacén creado con éxito', life: 3000 });
        this.$router.push("/warehouses");
      } catch (err) {
        const errorData = err.response?.data;
        console.error('Error creating warehouse:', errorData);
        let errorMsg = 'No se pudo crear el almacén.';

        if (typeof errorData === 'string') {
          errorMsg = errorData;
        } else if (errorData && errorData.errors) {
          // Handle ASP.NET Core validation errors object
          errorMsg = Object.values(errorData.errors).flat().join(' ');
        } else if (errorData && errorData.message) {
          errorMsg = errorData.message;
        } else if (err.message) {
          errorMsg = err.message;
        }
        
        this.$toast.add({ severity: 'error', summary: 'Error del Servidor', detail: errorMsg, life: 5000 });
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<template>
  <div class="warehouse-container web-layout">
    <div class="content-wrapper">
      <header class="web-header">
        <div class="flex-title-area">
          <button class="back-btn" @click="closeForm" title="Volver al listado">
            <svg viewBox="0 0 24 24" class="back-icon">
              <path
                fill="currentColor"
                d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
              />
            </svg>
          </button>
          <div class="header-text">
            <h1 class="page-title">Crear Nuevo Almacén</h1>
            <p class="page-subtitle">
              Rellena los detalles para tu nueva instalación de inventario
            </p>
          </div>
        </div>
      </header>

      <div class="create-split-view glass-panel">
        <div class="upload-section">
          <div class="upload-top">
            <h3 class="side-title">Fotografía</h3>
            <p class="side-desc">
              Añade una imagen referencial para identificar fácilmente esta
              sucursal.
            </p>
          </div>

          <div class="upload-box-wrapper">
            <label class="upload-box" for="warehouse-image">
              <input type="file" id="warehouse-image" accept="image/*" @change="onFileChange" style="display: none;" />
              <svg viewBox="0 0 24 24" class="upload-icon">
                <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h-2v5H6l6 6 6-6h-2v-5z"/>
              </svg>
              <span class="upload-text">Subir foto (Opcional)</span>
              <p class="file-name" v-if="imageFile">{{ imageFile.name }}</p>
            </label>
          </div>
        </div>
        <div class="form-section">
          <form class="modern-form" @submit.prevent="saveWarehouse">
            <h2 class="form-title">Detalles de la Propiedad</h2>
            <div class="form-grid">
              <div class="field-group full-width">
                <label>Nombre del almacén *</label>
                <div class="input-wrap mockup-shadow">
                  <input type="text" v-model="form.nombre" placeholder="Ej: Almacén Central" required />
                </div>
              </div>
              <div class="field-group">
                <label>Capacidad (unidades) *</label>
                <div class="input-wrap mockup-shadow">
                  <input type="number" v-model="form.capacidad" placeholder="Ej: 5000" min="0" required />
                </div>
              </div>
              <div class="field-group">
                <label>Temp. Mínima (°C) *</label>
                <div class="input-wrap mockup-shadow">
                  <input type="number" v-model="form.tempMin" placeholder="Ej: 15" required />
                </div>
              </div>
              <div class="field-group">
                <label>Temp. Máxima (°C) *</label>
                <div class="input-wrap mockup-shadow">
                  <input type="number" v-model="form.tempMax" placeholder="Ej: 25" required />
                </div>
              </div>
            </div>
            
            <h2 class="form-title" style="margin-top: 32px;">Ubicación</h2>
            <div class="form-grid">
              <div class="field-group full-width">
                <label>Dirección (Calle / Av.) *</label>
                <div class="input-wrap mockup-shadow">
                  <input type="text" v-model="form.calle" placeholder="Ej: Av. Los Rosales 123" required />
                </div>
              </div>
              <div class="field-group">
                <label>Distrito *</label>
                <div class="input-wrap mockup-shadow select-arrow">
                  <select v-model="form.distrito" required>
                    <option value="" disabled>Seleccione un distrito</option>
                    <option v-for="distrito in distritos" :key="distrito" :value="distrito">{{ distrito }}</option>
                  </select>
                </div>
              </div>
              <div class="field-group">
                <label>Ciudad *</label>
                <div class="input-wrap mockup-shadow select-arrow">
                  <select v-model="form.ciudad" required>
                    <option value="" disabled>Seleccione una ciudad</option>
                    <option v-for="ciudad in ciudades" :key="ciudad" :value="ciudad">{{ ciudad }}</option>
                  </select>
                </div>
              </div>
              <div class="field-group">
                <label>País *</label>
                <div class="input-wrap mockup-shadow select-arrow">
                  <select v-model="form.pais" required disabled>
                    <option value="Perú">Perú</option>
                  </select>
                </div>
              </div>
              <div class="field-group">
                <label>Código Postal</label>
                <div class="input-wrap mockup-shadow">
                  <input type="text" v-model="form.codigoPostal" placeholder="Ej: 15036" />
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="closeForm">{{ $t('common.cancel') }}</button>
              <button type="submit" class="save-btn add-mockup-btn" :disabled="isLoading">
                <span v-if="!isLoading">Registrar Almacén</span>
                <span v-else>Guardando...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.warehouse-container {
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


.upload-section {
  flex: 0 0 400px; 
  background: linear-gradient(135deg, rgba(244, 236, 236, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%); 
  border-right: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  padding: 40px;
}

.upload-top {
  margin-bottom: 30px;
}

.side-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--top-bg);
  margin: 0 0 8px 0;
}

.side-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

.upload-box-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.upload-box {
  width: 100%;
  aspect-ratio: 4 / 3; 
  background-color: #cacaca; 
  border-radius: 16px; 
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.03); 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  padding: 20px;
  text-align: center;
}

.upload-box:hover {
  background-color: #b8b8b8;
}

.upload-icon {
  width: 54px;
  height: 54px;
  color: #555555; 
  margin-bottom: 12px;
}

.upload-text {
  font-size: 15px;
  font-weight: 600;
  color: #a0979a; 
  margin: 0;
}

.file-name {
  margin-top: 10px;
  font-size: 13px;
  color: var(--top-bg);
  word-break: break-all;
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


.external-label, .field-group label {
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


.mockup-shadow input,
.mockup-shadow select {
  width: 100%;
  padding: 16px 20px;
  border-radius: 8px; 
  border: 1px solid rgba(43, 0, 13, 0.1); 
  font-size: 16px;
  font-family: inherit;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(43, 0, 13, 0.04); 
  appearance: none;
}

.select-arrow {
  position: relative;
}
.select-arrow::after {
  content: "▼";
  font-size: 10px;
  color: rgba(43, 0, 13, 0.5);
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.input-wrap input,
.input-wrap select {
  background: var(--white);
  color: var(--text-primary);
  font-weight: 600;
}

.input-wrap input:focus,
.input-wrap select:focus {
  outline: none;
  border-color: rgba(74, 27, 42, 0.3);
  box-shadow: 0 4px 16px rgba(74, 27, 42, 0.08); 
}

.input-wrap input::placeholder {
  color: rgba(0, 0, 0, 0.25); 
  font-weight: 500;
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
  .upload-section {
    flex: none;
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--glass-border);
    padding: 30px;
  }
  .upload-top {
    text-align: center;
    margin-bottom: 24px;
  }
  .upload-box-wrapper {
    justify-content: center;
  }
  .upload-box {
    max-width: 300px;
  }
  .form-section {
    padding: 30px;
  }
}

@media (max-width: 600px) {
  .warehouse-container {
    padding: 20px 15px;
  }
  .flex-title-area {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .back-btn {
    margin: 0;
  }
  .form-grid {
    grid-template-columns: 1fr;
    row-gap: 20px;
  }
  .full-width,
  .divider {
    grid-column: span 1;
  }
  .form-actions {
    flex-direction: column-reverse;
  }
  .save-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>
