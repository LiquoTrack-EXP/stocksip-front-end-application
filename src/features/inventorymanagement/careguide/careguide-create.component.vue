<script>
import {
  CareGuideService,
  ProductService,
} from "../services/inventory.service";

/**
 * CareguideCreateComponent component.
 * @displayName CareguideCreateComponent
 * @version 1.0.0
 */
export default {
  name: "CareguideCreateComponent",
  data() {
    return {
      products: [],
      isLoading: false,
      form: {
        productId: "",
        type: "",
        comments: "",
        minTemp: "",
        maxTemp: "",
      },
      productTypes: [],
    };
  },
  async mounted() {
    try {
      const accountId = localStorage.getItem("accountId");
      if (accountId) {
        const res = await ProductService.getAccountProducts(accountId);

        const data = res.data;
        this.products = Array.isArray(data) ? data : (data?.products ?? []);
      }

      const resTypes = await ProductService.getAllProductTypes();
      this.productTypes = resTypes.data || [];
    } catch (err) {
      if (err?.response?.status !== 404) {
        console.error("Error loading data:", err);
      }
      if (!this.products.length) this.products = [];
      if (!this.productTypes.length) this.productTypes = [];
    }
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
     * saveGuide
     * @public
     */
    async saveGuide() {
      const minTemp = parseFloat(this.form.minTemp);
      const maxTemp = parseFloat(this.form.maxTemp);

      if (isNaN(minTemp) || isNaN(maxTemp)) {
        alert("Por favor ingresa valores numéricos válidos para las temperaturas");
        return;
      }

      if (minTemp >= maxTemp) {
        alert("La temperatura mínima debe ser menor que la temperatura máxima");
        return;
      }

      this.isLoading = true;
      try {
        const accountId = localStorage.getItem("accountId");
        if (!accountId) return;

        await CareGuideService.createCareGuide(accountId, {
          typeOfLiquor: this.form.type,
          productName: this.form.productId,
          title: `Guía de conservación`,
          summary: this.form.comments,
          recommendedMinTemperature: minTemp,
          recommendedMaxTemperature: maxTemp,
        });

        alert("¡Nueva guía ha sido agregada con éxito!");
        this.$router.push("/care-guides");
      } catch (err) {
        console.error("Error creating care guide:", err.response?.data);
        alert(
          "Error: " +
            (err.response?.data?.message || "No se pudo crear la guía"),
        );
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<template>
  <div class="careguide-create-container web-layout">
    <div class="content-wrapper">
      <header class="web-header">
        <div class="flex-title-area">
          <button class="back-btn" @click="goBack" title="Volver al listado">
            <svg viewBox="0 0 24 24" class="back-icon">
              <path
                fill="currentColor"
                d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"
              />
            </svg>
          </button>
          <div class="header-text">
            <h1 class="page-title">New Guide</h1>
            <p class="page-subtitle">
              Configura los parámetros óptimos para preservar la calidad del
              producto.
            </p>
          </div>
        </div>
      </header>

      <div class="create-split-view glass-panel">
        <div class="image-section">
          <div class="img-display-box">
            <div class="product-preview">
              <img
                v-if="form.product === 'Vino Tinto Malbec'"
                src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=300"
                alt="Vino"
                class="mockup-img"
              />
              <img
                v-else-if="form.product === 'Ron Cartavio'"
                src="https://images.unsplash.com/photo-1620067600868-b7eb1c52d43e?auto=format&fit=crop&q=80&w=300"
                alt="Ron"
                class="mockup-img"
              />

              <div v-else class="img-placeholder">
                <svg viewBox="0 0 24 24" class="bottle-icon">
                  <path
                    fill="currentColor"
                    d="M8 21h8v-9l-2-4V5c0-1.1-.9-2-2-2h-0c-1.1 0-2 .9-2 2v3l-2 4v9h0z"
                  />
                </svg>
                <span
                  >Seleccione un producto del listado o cargue uno nuevo</span
                >
              </div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <form @submit.prevent="saveGuide" class="modern-form">
            <h2 class="form-title">Especificaciones Técnicas</h2>

            <div class="form-grid">
              <div class="field-group full-width">
                <label>Select Product</label>
                <div class="input-wrap select-wrap mockup-shadow">
                  <select v-model="form.productId" required>
                    <option disabled value="">Select Product...</option>
                    <option
                      v-for="p in products"
                      :key="p.id || p.productId"
                      :value="p.id || p.productId"
                    >
                      {{ p.name || p.productName }}
                    </option>
                  </select>
                  <svg viewBox="0 0 24 24" class="chevron-icon">
                    <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
                  </svg>
                </div>
              </div>

              <div class="field-group full-width">
                <label>Type</label>
                <div class="input-wrap select-wrap mockup-shadow">
                  <select v-model="form.type" required>
                    <option disabled value="">Select Type...</option>
                    <option
                      v-for="t in productTypes"
                      :key="t.name || t"
                      :value="t.name || t"
                    >
                      {{ t.name || t }}
                    </option>
                  </select>
                  <svg viewBox="0 0 24 24" class="chevron-icon">
                    <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
                  </svg>
                </div>
              </div>

              <div class="field-group full-width">
                <label>Comments</label>
                <div class="input-wrap textarea-wrap mockup-shadow">
                  <textarea
                    v-model="form.comments"
                    placeholder="Comments"
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <div class="field-group">
                <label>Min. Temperature</label>
                <div class="input-wrap icon-input mockup-shadow">
                  <input
                    type="number"
                    step="0.5"
                    v-model="form.minTemp"
                    placeholder="Ej: 12"
                    required
                  />
                  <span class="suffix">°C</span>
                </div>
              </div>

              <div class="field-group">
                <label>Max. Temperature</label>
                <div class="input-wrap icon-input mockup-shadow">
                  <input
                    type="number"
                    step="0.5"
                    v-model="form.maxTemp"
                    placeholder="Ej: 18"
                    required
                  />
                  <span class="suffix">°C</span>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button
                type="button"
                class="cancel-btn"
                @click="goBack"
                :disabled="isLoading"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="save-btn add-mockup-btn"
                :disabled="isLoading"
              >
                <span v-if="!isLoading">Add</span>
                <svg
                  v-else
                  class="spinner"
                  viewBox="0 0 50 50"
                  style="width: 24px; height: 24px"
                >
                  <circle
                    class="path"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke-width="5"
                    stroke="white"
                  ></circle>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.careguide-create-container {
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
  background:
    radial-gradient(
      circle at top left,
      rgba(229, 62, 62, 0.04),
      transparent 50%
    ),
    var(--bottom-bg);
  animation: fadeIn 0.4s ease-out;
}

.content-wrapper {
  max-width: 1050px;
  margin: 0 auto;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: var(--button-bg);
  color: var(--white);
  transform: translateX(-4px);
}

.back-icon {
  width: 28px;
  height: 28px;
}

.header-text {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: #79344c;
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
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 12px 40px rgba(43, 0, 13, 0.06);
  border-radius: 24px;
}

.create-split-view {
  display: flex;
  min-height: 600px;
  overflow: hidden;
}

.image-section {
  flex: 0 0 380px;
  background: linear-gradient(
    135deg,
    rgba(235, 227, 228, 0.8) 0%,
    rgba(244, 236, 236, 0.5) 100%
  );
  border-right: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.img-display-box {
  width: 100%;
  aspect-ratio: 1;
  background-color: var(--white);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(43, 0, 13, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border: 1px solid rgba(43, 0, 13, 0.04);
}

.product-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mockup-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.img-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: rgba(43, 0, 13, 0.2);
}

.bottle-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 12px;
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
  column-gap: 24px;
  row-gap: 24px;
}

.full-width {
  grid-column: span 2;
}

.field-group label {
  display: block;
  font-size: 13px;
  font-weight: 800;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.mockup-shadow input,
.mockup-shadow select,
.mockup-shadow textarea {
  width: 100%;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: var(--white);
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(43, 0, 13, 0.06);
}

.mockup-shadow input:focus,
.mockup-shadow select:focus,
.mockup-shadow textarea:focus {
  outline: none;
  border-color: rgba(74, 27, 42, 0.3);
  box-shadow: 0 4px 20px rgba(74, 27, 42, 0.12);
}

.mockup-shadow input::placeholder,
.mockup-shadow textarea::placeholder {
  color: rgba(0, 0, 0, 0.4);
  font-weight: 500;
}

.select-wrap {
  position: relative;
}

.select-wrap select {
  appearance: none;
  cursor: pointer;
  padding-right: 50px;
  color: rgba(0, 0, 0, 0.6);
}

.chevron-icon {
  width: 24px;
  height: 24px;
  color: rgba(0, 0, 0, 0.5);
  position: absolute;
  right: 18px;
  pointer-events: none;
}

.textarea-wrap textarea {
  resize: vertical;
  min-height: 100px;
}

.icon-input .suffix {
  position: absolute;
  right: 20px;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-secondary);
  pointer-events: none;
}

.icon-input input {
  padding-right: 50px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
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
  background: #25030b;
  color: var(--white);
  padding: 18px 48px;
  border-radius: 40px;
  font-weight: 800;
  font-size: 18px;
  cursor: pointer;
  border: none;
  box-shadow: 0 8px 24px rgba(37, 3, 11, 0.35);
  transition: all 0.3s;
}

.add-mockup-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(37, 3, 11, 0.45);
  background: var(--top-bg);
}

@media (max-width: 900px) {
  .create-split-view {
    flex-direction: column;
  }
  .image-section {
    flex: none;
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--glass-border);
    padding: 30px;
  }
  .img-display-box {
    max-width: 250px;
  }
  .form-section {
    padding: 30px;
  }
}

@media (max-width: 600px) {
  .careguide-create-container {
    padding: 20px 16px;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .full-width {
    grid-column: span 1;
  }
  .form-actions {
    flex-direction: column-reverse;
  }
  .add-mockup-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>
