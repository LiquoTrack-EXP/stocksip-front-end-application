<script>
import { WarehouseService } from '@/features/inventorymanagement/services/inventory.service';

/**
 * WarehouseComponent component.
 * @displayName WarehouseComponent
 * @version 1.0.0
 */
export default {
  name: "WarehouseComponent",
  data() {
    return {
      isLoading: true,
      maxWarehouses: 0,
      warehouses: [],
      error: null,
    };
  },
  async mounted() {
    await this.fetchWarehouses();
  },
  methods: {
    /**
     * fetchWarehouses
     * @public
     */
    async fetchWarehouses() {
      this.isLoading = true;
      this.error = null;
      try {
        const accountId = localStorage.getItem('accountId');
        /**
         * if
         * @param {any} !accountId
         * @public
         */
        if (!accountId) { this.isLoading = false; return; }
        const response = await WarehouseService.getAccountWarehouses(accountId);
        const data = response.data;

        this.warehouses = (Array.isArray(data) ? data : data?.warehouses) ?? [];
        this.maxWarehouses = data?.maxWarehousesAllowed ?? 0;
      } catch (err) {
        /**
         * if
         * @param {any} err?.response?.status !== 404
         * @public
         */
        if (err?.response?.status !== 404) {
          console.error('Error fetching warehouses:', err);
        }
        this.error = err?.response?.status !== 404 ? 'No se pudieron cargar los almacenes.' : null;
        this.warehouses = [];
      } finally {
        this.isLoading = false;
      }
    },
    goToCreate() {

      if (this.maxWarehouses > 0 && this.warehouses.length >= this.maxWarehouses) {
        this.$toast.add({ severity: 'warn', summary: 'Límite alcanzado', detail: '¡Has alcanzado el límite máximo de almacenes de tu plan!', life: 3000 });
        return;
      }
      this.$router.push("/warehouses/create");
    },
    goToEdit(warehouseId) {
      this.$router.push(`/warehouses/edit/${warehouseId}`);
    },
    goToInventory(warehouseId) {
      this.$router.push(`/warehouse_inventory/${warehouseId}`);
    },
  },
};
</script>

<template>
  <div class="warehouse-container web-layout">
    <div class="content-wrapper">
      <header class="web-header">
        <div class="header-titles">
          <h1 class="page-title">{{ $t('warehouses.title') }}</h1>
          <p class="page-subtitle">
            {{ $t('warehouses.subtitle') }}
            <span class="badge" v-if="maxWarehouses > 0"
              >{{ warehouses.length }} / {{ maxWarehouses }} {{ $t('warehouses.capacity').toLowerCase() }}</span
            >
            <span class="badge" v-else>
              {{ warehouses.length }} {{ $t('warehouses.title').toLowerCase() }}
            </span>
          </p>
        </div>
        <button
          class="action-btn primary-btn"
          @click="goToCreate"
        >
          <svg viewBox="0 0 24 24" class="btn-icon">
            <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>{{ $t('warehouses.new_warehouse') }}</button>
      </header>

      <div class="main-content">
        <div v-if="isLoading" class="warehouse-grid">
          <div
            class="warehouse-card glass-panel"
            v-for="i in 3"
            :key="'skel-w-' + i"
          >
            <pv-skeleton
              width="100%"
              height="180px"
              borderRadius="0"
            ></pv-skeleton>

            <div class="card-body">
              <div class="card-text" style="width: 70%">
                <pv-skeleton
                  width="80%"
                  height="1.2rem"
                  borderRadius="8px"
                  style="margin-bottom: 8px"
                ></pv-skeleton>
                <pv-skeleton
                  width="50%"
                  height="0.9rem"
                  borderRadius="8px"
                ></pv-skeleton>
              </div>
              <pv-skeleton shape="circle" size="38px"></pv-skeleton>
            </div>

            <div class="card-footer">
              <div class="stat-mini" style="flex: 1">
                <pv-skeleton
                  width="40px"
                  height="0.6rem"
                  borderRadius="4px"
                  style="margin-bottom: 6px"
                ></pv-skeleton>
                <pv-skeleton
                  width="70px"
                  height="0.9rem"
                  borderRadius="4px"
                ></pv-skeleton>
              </div>
              <div class="stat-mini" style="flex: 1">
                <pv-skeleton
                  width="40px"
                  height="0.6rem"
                  borderRadius="4px"
                  style="margin-bottom: 6px"
                ></pv-skeleton>
                <pv-skeleton
                  width="50px"
                  height="0.9rem"
                  borderRadius="4px"
                ></pv-skeleton>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="warehouses.length === 0" class="empty-state-fullscreen">
          <div class="empty-illustration">
            <svg viewBox="0 0 24 24" class="empty-icon">
              <path
                fill="currentColor"
                d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z"
              />
            </svg>
          </div>
          <h2 class="empty-title">Aún no tienes instalaciones</h2>
          <p class="empty-subtitle">
            El corazón de una logística eficiente son sus puntos de
            distribución. Comienza la expansión de tu red organizando tu stock
            en almacenes digitales.
          </p>
          <button class="action-btn primary-btn large-btn" @click="goToCreate">
            <svg viewBox="0 0 24 24" class="btn-icon">
              <path
                fill="currentColor"
                d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
              />
            </svg>
            Crear mi primer almacén
          </button>
        </div>

        <div v-else class="warehouse-grid">
          <div
            class="warehouse-card glass-panel"
            v-for="w in warehouses"
            :key="w.id"
            @click="goToInventory(w.warehouseId)"
            style="cursor: pointer;"
          >
            <div
              class="card-image"
              :style="{
                backgroundImage:
                  'url(' +
                  (w.image ||
                    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800') +
                  ')',
              }"
            ></div>
            <div class="card-body">
              <div class="card-text">
                
                <h3 class="w-name">{{ w.name }}</h3>
                <p class="w-address">{{ w.addressStreet }}, {{ w.addressCity }}</p>
              </div>
              <button
                class="icon-btn edit-btn"
                @click.stop="goToEdit(w.warehouseId)"
                title="Editar"
              >
                <svg viewBox="0 0 24 24" class="pencil-icon">
                  <path
                    fill="currentColor"
                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                  />
                </svg>
              </button>
            </div>
            <div class="card-footer">
              <div class="stat-mini">
                <span class="label">Temp:</span>
                <span class="value">{{ w.temperatureMin ?? '--' }}°C - {{ w.temperatureMax ?? '--' }}°C</span>
              </div>
              <div class="stat-mini">
                <span class="label">Cap:</span>
                <span class="value">{{ w.capacity ?? '--' }}</span>
              </div>
            </div>
          </div>
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
  background:
    radial-gradient(
      circle at top right,
      rgba(229, 62, 62, 0.06),
      transparent 40%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(74, 27, 42, 0.04),
      transparent 40%
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
}

.header-titles {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--top-bg);
  margin: 0 0 8px;
  letter-spacing: -0.5px;
}

.page-subtitle {
  margin: 0;
  font-size: 15px;
  color: var(--text-secondary);
  font-weight: 500;
  display: flex;
  align-items: center;
}

.badge {
  display: inline-block;
  background: var(--button-bg);
  color: var(--white);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  margin-left: 12px;
  box-shadow: 0 2px 6px rgba(43, 0, 13, 0.15);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.primary-btn {
  background: var(--button-bg);
  color: var(--white);
  box-shadow: 0 6px 16px rgba(43, 0, 13, 0.2);
}

.primary-btn:hover {
  background: var(--top-bg);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(43, 0, 13, 0.3);
}

.outline-btn {
  background: var(--white);
  color: var(--top-bg);
  border: 1px solid var(--glass-border);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);
  padding: 14px 28px;
}

.outline-btn:hover {
  background: var(--button-bg);
  color: var(--white);
  border-color: var(--button-bg);
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(43, 0, 13, 0.2);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 12px 32px rgba(43, 0, 13, 0.05);
  border-radius: 20px;
}

.empty-state-fullscreen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 60vh;
  padding: 40px 20px;
  animation: fadeIn 0.8s ease-out forwards;
}

.empty-illustration {
  width: 140px;
  height: 140px;
  background: var(--glass-bg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  box-shadow: 0 24px 50px rgba(43, 0, 13, 0.08);
  color: var(--accent-red);
  border: 4px solid var(--white);
  transition: transform 0.5s ease;
}

.empty-state-fullscreen:hover .empty-illustration {
  transform: translateY(-8px) scale(1.02);
}

.empty-icon {
  width: 60px;
  height: 60px;
  fill: currentColor;
}

.empty-title {
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 16px;
  color: var(--top-bg);
  letter-spacing: -1px;
}

.empty-subtitle {
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 40px;
  color: var(--text-secondary);
  max-width: 600px;
  font-weight: 500;
}

.large-btn {
  padding: 16px 36px;
  font-size: 16px;
  border-radius: 40px;
  box-shadow: 0 8px 24px rgba(74, 27, 42, 0.25);
}

.large-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(74, 27, 42, 0.35);
}

.warehouse-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.warehouse-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s;
}

.warehouse-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(43, 0, 13, 0.12);
}

.card-image {
  height: 180px;
  background-size: cover;
  background-position: center;
  background-color: #eee;
  border-bottom: 1px solid var(--glass-border);
}

.card-body {
  padding: 24px 24px 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-text {
  flex: 1;
}

.w-name {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 800;
  color: var(--top-bg);
}

.w-address {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.card-footer {
  padding: 0 24px 20px;
  display: flex;
  gap: 16px;
  border-top: 1px dashed rgba(43, 0, 13, 0.08);
  margin-top: auto;
  padding-top: 16px;
}

.stat-mini {
  display: flex;
  flex-direction: column;
}

.stat-mini .label {
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 800;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.stat-mini .value {
  font-size: 13px;
  font-weight: 600;
  color: var(--top-bg);
}

.edit-btn {
  background: var(--white);
  border: 1px solid var(--glass-border);
  color: var(--top-bg);
  cursor: pointer;
  padding: 10px;
  border-radius: 12px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
}

.edit-btn:hover {
  background: var(--button-bg);
  color: var(--white);
  border-color: var(--button-bg);
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(43, 0, 13, 0.15);
}

.pencil-icon {
  width: 18px;
  height: 18px;
}


@media (max-width: 768px) {
  .warehouse-container {
    padding: 24px 20px;
  }
  .web-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  .action-btn {
    width: 100%;
  }
  .empty-state {
    padding: 60px 20px;
  }
}
</style>
