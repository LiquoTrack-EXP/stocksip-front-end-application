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
        pais: "",
        capacidad: "",
        tempMin: "",
        tempMax: "",
      },
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
      this.isLoading = true;
      try {
        const accountId = localStorage.getItem('accountId');
        /**
         * if
         * @param {any} !accountId
         * @public
         */
        if (!accountId) { alert('No se encontró accountId'); return; }

        const formData = new FormData();
        formData.append('Name', this.form.nombre);
        formData.append('AddressStreet', this.form.calle);
        formData.append('AddressCity', this.form.ciudad);
        formData.append('AddressDistrict', this.form.distrito);
        formData.append('AddressPostalCode', this.form.codigoPostal);
        formData.append('AddressCountry', this.form.pais);
        formData.append('Capacity', this.form.capacidad);
        formData.append('TemperatureMin', this.form.tempMin);
        formData.append('TemperatureMax', this.form.tempMax);
        if (this.imageFile) formData.append('Image', this.imageFile);

        await WarehouseService.registerWarehouse(accountId, formData);
        alert("Almacén creado con éxito");
        this.$router.push("/warehouses");
      } catch (err) {
        console.error('Error creating warehouse:', err.response?.data);
        alert('Error al crear almacén: ' + (err.response?.data?.message || 'Error desconocido'));
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
          <form class="modern-form" @submit.prevent="submitForm">
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
                  <input type="number" v-model="form.capacidad" placeholder="Ej: 5000" required />
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
                <div class="input-wrap mockup-shadow">
                  <input type="text" v-model="form.distrito" placeholder="Ej: San Isidro" required />
                </div>
              </div>
              <div class="field-group">
                <label>Ciudad *</label>
                <div class="input-wrap mockup-shadow">
                  <input type="text" v-model="form.ciudad" placeholder="Ej: Lima" required />
                </div>
              </div>
              <div class="field-group">
                <label>País *</label>
                <div class="input-wrap mockup-shadow">
                  <input type="text" v-model="form.pais" placeholder="Ej: Perú" required />
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
