<script>
export default {
  name: "PageNotFoundComponent",
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
<template>
  <div class="not-found-container">
    <div class="background-pattern"></div>
    <div class="glass-card">
      <div class="error-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Page Not Found</h2>
        <p class="error-message">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <button class="back-home-btn" @click="goBack">
          Regresar a la página anterior
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
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

  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  background-color: var(--bottom-bg);
  background:
    radial-gradient(
      900px 500px at 50% -10%,
      rgba(229, 62, 62, 0.08),
      transparent 60%
    ),
    linear-gradient(180deg, var(--bottom-bg) 0%, #fbf7f7 100%);
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(
      circle at 80% 80%,
      rgba(43, 0, 13, 0.05) 0%,
      transparent 55%
    ),
    radial-gradient(
      circle at 20% 20%,
      rgba(229, 62, 62, 0.05) 0%,
      transparent 55%
    );
  animation: float 25s ease-in-out infinite;
  pointer-events: none;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.02);
  }
}

.glass-card {
  width: 100%;
  max-width: 540px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-soft);
  padding: 60px 40px;
  position: relative;
  z-index: 1;
  text-align: center;
  transition: all 0.4s ease;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(30px);
}

.glass-card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-4px) !important;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.error-code {
  font-size: 120px;
  font-weight: 900;
  line-height: 1;
  margin: 0;
  background: linear-gradient(135deg, var(--accent-red) 0%, var(--top-bg) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -4px;
  margin-bottom: 16px;
  user-select: none;
}

.error-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 16px;
  letter-spacing: -0.5px;
}

.error-message {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 40px;
  max-width: 80%;
}

.back-home-btn {
  height: 52px;
  padding: 0 36px;
  border-radius: 12px;
  border: none;
  background: var(--button-bg);
  color: var(--white);
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 14px 30px rgba(74, 27, 42, 0.18);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.back-home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(74, 27, 42, 0.25);
  opacity: 0.95;
}

.back-home-btn:active {
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 600px) {
  .glass-card {
    padding: 40px 24px;
    margin: 0 16px;
    border-radius: 20px;
  }

  .error-code {
    font-size: 96px;
  }

  .error-title {
    font-size: 26px;
  }

  .error-message {
    font-size: 15px;
    max-width: 100%;
    margin-bottom: 32px;
  }

  .back-home-btn {
    width: 100%;
  }
}
</style>
