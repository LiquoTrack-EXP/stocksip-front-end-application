<script>
/**
 * HomeComponent component.
 * @displayName HomeComponent
 * @version 1.0.0
 */
export default {
  name: "HomeComponent",
  data() {
    return {};
  },
  computed: {
    features() {
      return [
        {
          title: this.$t('home.features.new_product.title'),
          description: this.$t('home.features.new_product.description'),
          buttonText: this.$t('home.features.new_product.button'),
          icon: "product",
        },
        {
          title: this.$t('home.features.catalogs.title'),
          description: this.$t('home.features.catalogs.description'),
          buttonText: this.$t('home.features.catalogs.button'),
          icon: "catalog",
        },
        {
          title: this.$t('home.features.admin.title'),
          description: this.$t('home.features.admin.description'),
          buttonText: this.$t('home.features.admin.button'),
          icon: "admin",
        },
        {
          title: this.$t('home.features.care_guides.title'),
          description: this.$t('home.features.care_guides.description'),
          buttonText: this.$t('home.features.care_guides.button'),
          icon: "guide",
        },
      ];
    },
  },
  methods: {
    /**
     * handleAction
     * @param {any} featureName
     * @public
     */
    handleAction(featureName) {
      console.log("Action triggered for:", featureName);
    },
  },
};
</script>

<template>
  <div class="home-container">
    <header class="page-header">
      <h1 class="page-title">{{ $t('home.title') }}</h1>
    </header>
    <section class="hero-card">
      <div class="hero-content">
        <h2>{{ $t('home.hero_title') }}</h2>
        <p>{{ $t('home.hero_subtitle') }}</p>
        <button class="upgrade-btn">{{ $t('home.upgrade_btn') }}</button>
      </div>
      <div class="hero-illustration">
        <svg viewBox="0 0 100 100" class="rocket-svg">
          <path d="M40 85 Q50 100 60 85 Q50 90 40 85" fill="#f59e0b" />
          <path d="M45 85 Q50 95 55 85" fill="#fde047" />
          <path
            d="M30 65 L20 80 L40 75 Z"
            fill="#e53e3e"
            stroke="#1f2937"
            stroke-width="3"
            stroke-linejoin="round"
          />
          <path
            d="M70 65 L80 80 L60 75 Z"
            fill="#e53e3e"
            stroke="#1f2937"
            stroke-width="3"
            stroke-linejoin="round"
          />
          <path
            d="M50 15 Q30 40 35 75 L65 75 Q70 40 50 15 Z"
            fill="#ff7676"
            stroke="#1f2937"
            stroke-width="3"
            stroke-linejoin="round"
          />
          <circle
            cx="50"
            cy="50"
            r="10"
            fill="#60a5fa"
            stroke="#1f2937"
            stroke-width="3"
          />
          <circle cx="50" cy="50" r="4" fill="#93c5fd" />
          <path
            d="M50 15 Q43 28 39 35 L61 35 Q57 28 50 15 Z"
            fill="#e53e3e"
            stroke="#1f2937"
            stroke-width="3"
          />
        </svg>
      </div>
    </section>

    <div class="features-grid">
      <div
        class="feature-card glass-panel"
        v-for="(feature, index) in features"
        :key="index"
      >
        <div class="icon-wrapper">
          <svg
            v-if="feature.icon === 'product'"
            viewBox="0 0 24 24"
            class="feature-icon"
            stroke="currentColor"
            fill="none"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M9 2v4a3 3 0 0 0-3 3v11a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-11a3 3 0 0 0-3-3v-4"
            />
            <path d="M10 2h4" />
            <path d="M8 12h8" />
            <path d="M10 6v3" />
            <path d="M14 6v3" />
            <path d="M18 10v4a3 3 0 0 1-6 0v-4h6z" />
            <path d="M15 17v4" />
            <path d="M13 21h4" />
          </svg>

          <svg
            v-else-if="feature.icon === 'catalog'"
            viewBox="0 0 24 24"
            class="feature-icon"
            stroke="currentColor"
            fill="none"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
            />
            <rect x="9" y="3" width="6" height="4" rx="2" />
            <path d="M9 12h6" />
            <path d="M9 16h6" />
            <circle cx="6" cy="12" r="0.5" fill="currentColor" />
            <circle cx="6" cy="16" r="0.5" fill="currentColor" />
            <path d="M15 11l4.5-4.5a1.5 1.5 0 0 1 2.1 2.1L17.1 13.1z" />
            <path d="M15 11l2.1 2.1" />
          </svg>

          <svg
            v-else-if="feature.icon === 'admin'"
            viewBox="0 0 24 24"
            class="feature-icon"
            stroke="currentColor"
            fill="none"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M16 18A4 4 0 0 0 8 18" />
            <circle cx="12" cy="10" r="3" />
            <path
              d="M12 10 c1.5 0 2 -1 2 -2 c0 -1.5 -1 -2 -2 -2 s-2 0.5 -2 2 c0 1 0.5 2 2 2 z"
              fill="currentColor"
            />
            <path d="M15 12 c-0.5 1.5 -2 2.5 -3 2.5 s-2.5 -1 -3 -2.5" />
          </svg>

          <svg
            v-else-if="feature.icon === 'guide'"
            viewBox="0 0 24 24"
            class="feature-icon"
            stroke="currentColor"
            fill="none"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
            />
            <path d="M9 8l1.5 1.5L13 7" />
            <path d="M15 7l3 3M18 7l-3 3" />
            <path d="M7 14h10" />
            <path d="M7 16h8" />
            <path d="M12 22v-2.5" />
            <path d="M10 2h4v5l-2-2-2 2z" />
          </svg>
        </div>

        <h3 class="feature-title">{{ feature.title }}</h3>
        <p class="feature-desc">{{ feature.description }}</p>
        <button class="action-btn" @click="handleAction(feature.title)">
          {{ feature.buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  --top-bg: #2b000d;
  --bottom-bg: #f4ecec;
  --accent-red: #e53e3e;
  --button-bg: #4a1b2a;
  --white: #ffffff;
  --black: #000000;

  --glass-bg: rgba(255, 255, 255, 0.9);
  --glass-border: rgba(43, 0, 13, 0.12);

  --text-primary: rgba(0, 0, 0, 0.82);
  --text-secondary: rgba(0, 0, 0, 0.55);

  --shadow-soft: 0 18px 60px rgba(43, 0, 13, 0.14);
  --shadow-hover: 0 22px 70px rgba(43, 0, 13, 0.2);
  padding: 30px;
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
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
}

.hero-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(
    135deg,
    var(--top-bg) 0%,
    #682238 60%,
    rgba(229, 62, 62, 0.8) 100%
  );
  border-radius: 20px;
  padding: 30px 40px;
  color: var(--white);
  box-shadow: 0 15px 35px rgba(43, 0, 13, 0.25);
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 60%;
  z-index: 2;
}

.hero-content h2 {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 12px;
  line-height: 1.2;
}

.hero-content p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 15px;
  line-height: 1.5;
  margin: 0 0 20px;
}

.upgrade-btn {
  background: var(--white);
  color: var(--top-bg);
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.upgrade-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.2);
}

.hero-illustration {
  z-index: 2;
}

.rocket-svg {
  width: 140px;
  height: 140px;
  animation: floatRocket 6s ease-in-out infinite;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2));
}

@keyframes floatRocket {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(2deg);
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.feature-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30px 20px;
  border-radius: 20px;
}

.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-soft);
  transition: all 0.3s ease;
}

.glass-panel:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-4px);
}

.icon-wrapper {
  margin-bottom: 16px;
  height: 60px;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--top-bg);
}

.feature-icon {
  width: 100%;
  height: 100%;
}

.feature-title {
  color: var(--top-bg);
  font-size: 18px;
  font-weight: 800;
  margin: 0 0 8px;
}

.feature-desc {
  color: var(--text-secondary);
  font-size: 13px;
  margin: 0 0 20px;
  min-height: 40px;
}

.action-btn {
  background: var(--button-bg);
  color: var(--white);
  border: none;
  padding: 10px 24px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  width: 80%;
  max-width: 200px;
  box-shadow: 0 8px 16px rgba(43, 0, 13, 0.15);
  transition: all 0.3s ease;
  margin-top: auto;
}

.action-btn:hover {
  background: var(--top-bg);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(43, 0, 13, 0.2);
}


@media (max-width: 768px) {
  .hero-card {
    flex-direction: column;
    text-align: center;
    padding: 30px 20px;
  }

  .hero-content {
    max-width: 100%;
    margin-bottom: 24px;
  }

  .hero-illustration {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .rocket-svg {
    width: 120px;
    height: 120px;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .action-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
