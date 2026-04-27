<script>
import { CareGuideService } from '../services/inventory.service.js';

/**
 * CareGuideComponent component.
 * @displayName CareGuideComponent
 * @version 1.0.0
 */
export default {
  name: "CareGuideComponent",
  data() {
    return {
      isLoading: true,
      searchQuery: "",
      filterOption: "Most Recent",
      filters: ["Most Recent", "Alphabetical", "By Category"],
      guides: [],
    };
  },
  async mounted() {
    await this.fetchGuides();
  },
  computed: {
    filteredGuides() {
      return this.guides.filter(
        (g) =>
          (g.title || g.productName || '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (g.category || g.type || '').toLowerCase().includes(this.searchQuery.toLowerCase()),
      );
    },
  },
  methods: {
    /**
     * fetchGuides
     * @public
     */
    async fetchGuides() {
      this.isLoading = true;
      try {
        const accountId = localStorage.getItem('accountId');
        if (!accountId) return;
        const response = await CareGuideService.getAccountCareGuides(accountId);

        const raw = response.data || [];
        this.guides = raw.map((g) => ({
          ...g,
          id:       g.careGuideId ?? g.id,
          title:    g.title,
          category: g.typeOfLiquor ?? g.productName ?? '',
          temp:     (g.recommendedMinTemperature != null && g.recommendedMaxTemperature != null)
                      ? `${g.recommendedMinTemperature}° - ${g.recommendedMaxTemperature}°C`
                      : '',
          image:    g.imageUrl ?? g.image ?? '',
        }));
      } catch (err) {

        /**
         * if
         * @param {any} err?.response?.status !== 404
         * @public
         */
        if (err?.response?.status !== 404) {
          console.error('Error fetching care guides:', err);
        }
        this.guides = [];
      } finally {
        this.isLoading = false;
      }
    },
    goToCreate() {
      this.$router.push("/care-guides/create");
    },
    seeGuide(id) {
      this.$router.push(`/care-guides/edit/${id}`);
    },
  },
};
</script>

<template>
  <div class="careguide-container web-layout">
    <div class="content-wrapper">
      <header class="web-header">
        <div class="header-titles">
          <h1 class="page-title">
            Care Guides
            <span class="badge">({{ guides.length }})</span>
          </h1>
          <p class="page-subtitle">
            Centraliza y consolida los manuales técnicos y requerimientos de
            temperatura.
          </p>
        </div>

        <button class="action-btn primary-btn" @click="goToCreate">
          <svg viewBox="0 0 24 24" class="btn-icon">
            <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Nuevo
        </button>
      </header>

      <div class="toolbar">
        <div class="search-box glass-panel">
          <svg viewBox="0 0 24 24" class="search-icon">
            <path
              fill="currentColor"
              d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            />
          </svg>
          <input type="text" v-model="searchQuery" placeholder="Search..." />
        </div>

        <div class="filter-box glass-panel">
          <select v-model="filterOption" class="filter-select">
            <option v-for="opt in filters" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
          <svg viewBox="0 0 24 24" class="dropdown-icon">
            <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
          </svg>
        </div>
      </div>

      <div v-if="isLoading" class="guide-grid">
        <div
          class="guide-card glass-panel"
          v-for="i in 6"
          :key="'skeleton-' + i"
        >
          <pv-skeleton
            width="72px"
            height="72px"
            borderRadius="12px"
            style="margin-right: 18px; flex-shrink: 0"
          ></pv-skeleton>

          <div
            class="card-info"
            style="
              display: flex;
              flex-direction: column;
              gap: 8px;
              justify-content: center;
            "
          >
            <pv-skeleton
              width="70%"
              height="1.1rem"
              borderRadius="8px"
            ></pv-skeleton>
            <pv-skeleton
              width="45%"
              height="0.9rem"
              borderRadius="8px"
            ></pv-skeleton>
          </div>

          <pv-skeleton
            width="80px"
            height="32px"
            borderRadius="8px"
            style="margin-left: 10px"
          ></pv-skeleton>
        </div>
      </div>

      <div v-else-if="filteredGuides.length === 0" class="empty-state">
        <div class="empty-icon-wrapper">
          <svg viewBox="0 0 24 24" class="empty-icon">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
            />
          </svg>
        </div>
        <p class="empty-title">Sin resultados</p>
        <p class="empty-subtitle">
          No pudimos encontrar guías que coincidan con tu búsqueda.
        </p>
      </div>

      <div v-else class="guide-grid">
        <div
          class="guide-card glass-panel"
          v-for="guide in filteredGuides"
          :key="guide.id"
        >
          <div
            class="card-img"
            :style="{ backgroundImage: 'url(' + guide.image + ')' }"
          ></div>

          <div class="card-info">
            <h3 class="g-title">{{ guide.title }}</h3>
            <p class="g-subtitle">{{ guide.category }} · {{ guide.temp }}</p>
          </div>

          <button class="see-guide-btn" @click="seeGuide(guide.id)">
            See Guide
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.careguide-container {
  --top-bg: #2b000d;
  --bottom-bg: #f4ecec;
  --accent-red: #e53e3e;
  --button-bg: #4a1b2a;
  --white: #ffffff;
  --black: #000000;

  --glass-bg: rgba(255, 255, 255, 0.85);
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
      rgba(229, 62, 62, 0.05),
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

.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 24px rgba(43, 0, 13, 0.04);
}

.web-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.header-titles {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--top-bg);
  margin: 0 0 6px;
  display: flex;
  align-items: center;
}

.badge {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-secondary);
  margin-left: 10px;
  opacity: 0.8;
}

.page-subtitle {
  margin: 0;
  font-size: 15px;
  color: var(--text-secondary);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 40px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.primary-btn {
  background: var(--button-bg);
  color: var(--white);
  box-shadow: 0 6px 16px rgba(43, 0, 13, 0.2);
}

.primary-btn:hover {
  background: var(--top-bg);
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(43, 0, 13, 0.25);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-radius: 40px;
  height: 54px;
  flex: 1;
  max-width: 480px;
  background: var(--white);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
  margin-right: 12px;
}

.search-box input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  color: var(--text-primary);
  font-weight: 500;
}

.search-box input:focus {
  outline: none;
}

.search-box input::placeholder {
  color: rgba(0, 0, 0, 0.3);
}

.filter-box {
  display: flex;
  align-items: center;
  position: relative;
  height: 54px;
  border-radius: 40px;
  background: var(--white);
  padding: 0 20px;
  min-width: 180px;
}

.filter-select {
  appearance: none;
  background: transparent;
  border: none;
  width: 100%;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
}

.dropdown-icon {
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
  pointer-events: none;
  position: absolute;
  right: 16px;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
}

.guide-card {
  display: flex;
  align-items: center;
  padding: 14px;
  border-radius: 20px;
  background: var(--white);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s;
  cursor: pointer;
}

.guide-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(43, 0, 13, 0.08);
}

.card-img {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  margin-right: 18px;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.g-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--top-bg);
  margin: 0 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.g-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0;
  white-space: nowrap;
}

.see-guide-btn {
  background: transparent;
  border: none;
  color: #682238;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  margin-left: 10px;
  transition: all 0.2s;
  border-radius: 8px;
}

.see-guide-btn:hover {
  background: rgba(43, 0, 13, 0.04);
  color: var(--top-bg);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}
.empty-icon-wrapper {
  color: rgba(43, 0, 13, 0.2);
  margin-bottom: 20px;
}
.empty-icon {
  width: 64px;
  height: 64px;
}
.empty-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--top-bg);
  margin: 0 0 8px;
}
.empty-subtitle {
  color: var(--text-secondary);
}


@media (max-width: 768px) {
  .warehouse-container {
    padding: 20px;
  }
  .web-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .action-btn {
    width: 100%;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  .search-box {
    max-width: 100%;
  }
  .filter-box {
    width: 100%;
  }

  .guide-grid {
    grid-template-columns: 1fr;
  }
}
</style>
