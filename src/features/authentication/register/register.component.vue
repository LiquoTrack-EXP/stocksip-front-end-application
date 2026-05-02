<script>
import { AuthService } from '../services/auth.service';

/**
 * RegisterComponent component.
 * @displayName RegisterComponent
 * @version 1.0.0
 */
export default {
  name: "RegisterComponent",
  data() {
    return {
      role: "",
      fullName: "",
      email: "",
      businessName: "",
      password: "",
      confirmPassword: "",
      passwordVisible: false,
      confirmPasswordVisible: false,
      loading: false,
      error: "",
      showTerms: false
    };
  },
  methods: {
    /**
     * handleRegister
     * @public
     */
    async handleRegister() {
      if (/\d/.test(this.fullName)) {
        this.$toast.add({ severity: 'error', summary: 'Error de Validación', detail: 'El nombre no puede contener números.', life: 5000 });
        return;
      }

      if (this.password.length < 7) {
        this.$toast.add({ severity: 'error', summary: 'Contraseña Débil', detail: 'La contraseña debe tener al menos 7 caracteres.', life: 5000 });
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden.', life: 5000 });
        return;
      }
      
      this.loading = true;
      this.error = "";
      
      const signUpData = {
        email: this.email,
        password: this.password,
        name: this.fullName,
        businessName: this.businessName,
        role: this.role === "Liquor Store Owner" ? "LiquorStoreOwner" : "Supplier"
      };

      try {
        const response = await AuthService.signUp(signUpData);
        this.$toast.add({ severity: 'success', summary: 'Éxito', detail: 'Registration successful! Please login.', life: 3000 });
        this.$router.push("/");
      } catch (err) {
        console.error("Register error detail:", err.response?.data);
        const backendError = err.response?.data?.message || err.response?.data?.errors || "Registration failed.";
        this.error = typeof backendError === 'object' ? JSON.stringify(backendError) : backendError;
        this.$toast.add({ severity: 'error', summary: 'Error del Servidor', detail: this.error, life: 5000 });
      } finally {
        this.loading = false;
      }
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    toggleConfirmPasswordVisibility() {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    },
    openTerms() {
      this.showTerms = true;
    }
  },
};
</script>

<template>
  <div class="register-container">
    <div class="background-pattern"></div>
    <div class="register-card">
      <div class="brand-section">
        <div class="brand">
          <span class="brand-stock">Stock</span
          ><span class="brand-sip">Sip</span>
        </div>
        <p class="tagline">Join the Smart Investment Revolution</p>
      </div>

      <div class="form-section">
        <h2 class="welcome-text">Create Account</h2>
        <p class="subtitle">Sign up to get started with StockSip</p>

        <form @submit.prevent="handleRegister" class="register-form">
          <div class="input-group">
            <label for="role">Select Your Role</label>
            <div class="input-wrapper">
              <select
                id="role"
                v-model="role"
                class="modern-input custom-select"
                required
                :class="{ 'placeholder-selected': !role }"
              >
                <option value="" disabled selected>Select role</option>
                <option value="Liquor Store Owner">Liquor Store Owner</option>
                <option value="Supplier">Supplier</option>
              </select>
            </div>
          </div>

          <div class="input-group">
            <label for="fullName">Full Name</label>
            <div class="input-wrapper">
              <pv-input-text
                id="fullName"
                type="text"
                v-model="fullName"
                placeholder="Enter your full name"
                class="modern-input"
                required
              />
            </div>
          </div>

          <div class="input-group">
            <label for="businessName">Business Name</label>
            <div class="input-wrapper">
              <pv-input-text
                id="businessName"
                type="text"
                v-model="businessName"
                placeholder="Enter your business name"
                class="modern-input"
                required
              />
            </div>
          </div>

          <div class="input-group">
            <label for="email">Email address</label>
            <div class="input-wrapper">
              <pv-input-text
                id="email"
                type="email"
                v-model="email"
                placeholder="Enter your email"
                class="modern-input"
                required
              />
            </div>
          </div>

          <div class="input-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <pv-input-text
                id="password"
                :type="passwordVisible ? 'text' : 'password'"
                v-model="password"
                placeholder="Enter your password"
                class="modern-input password-input"
                required
              />
              <button
                type="button"
                class="toggle-password"
                :aria-label="
                  passwordVisible ? 'Hide password' : 'Show password'
                "
                @click="togglePasswordVisibility"
              >
                <svg
                  v-if="passwordVisible"
                  class="eye"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
                  />
                </svg>
                <svg v-else class="eye" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M2.3 3.7a1 1 0 0 1 1.4 0l18.6 18.6a1 1 0 1 1-1.4 1.4l-2.3-2.3A11.9 11.9 0 0 1 12 19C5 19 2 12 2 12c.7-1.6 2-3.7 4.1-5.3L2.3 5.1a1 1 0 0 1 0-1.4Z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5c7 0 10 7 10 7-.4 1-1.2 2.3-2.5 3.5l-2.1-2.1a5 5 0 0 0-6.3-6.3L9 5.6c1-.4 2-.6 3-.6Z"
                  />
                  <path
                    fill="currentColor"
                    d="M8.6 10.2 6.8 8.4A13 13 0 0 0 4.2 12S7.2 17 12 17c1 0 2-.2 2.9-.5l-1.8-1.8a3 3 0 0 1-4.5-4.5Z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="input-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="input-wrapper">
              <pv-input-text
                id="confirmPassword"
                :type="confirmPasswordVisible ? 'text' : 'password'"
                v-model="confirmPassword"
                placeholder="Confirm your password"
                class="modern-input password-input"
                required
              />
              <button
                type="button"
                class="toggle-password"
                :aria-label="
                  confirmPasswordVisible ? 'Hide password' : 'Show password'
                "
                @click="toggleConfirmPasswordVisibility"
              >
                <svg
                  v-if="confirmPasswordVisible"
                  class="eye"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
                  />
                </svg>
                <svg v-else class="eye" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M2.3 3.7a1 1 0 0 1 1.4 0l18.6 18.6a1 1 0 1 1-1.4 1.4l-2.3-2.3A11.9 11.9 0 0 1 12 19C5 19 2 12 2 12c.7-1.6 2-3.7 4.1-5.3L2.3 5.1a1 1 0 0 1 0-1.4Z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5c7 0 10 7 10 7-.4 1-1.2 2.3-2.5 3.5l-2.1-2.1a5 5 0 0 0-6.3-6.3L9 5.6c1-.4 2-.6 3-.6Z"
                  />
                  <path
                    fill="currentColor"
                    d="M8.6 10.2 6.8 8.4A13 13 0 0 0 4.2 12S7.2 17 12 17c1 0 2-.2 2.9-.5l-1.8-1.8a3 3 0 0 1-4.5-4.5Z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="form-options terms-options">
            <label class="checkbox-wrapper">
              <input type="checkbox" required />
              <span class="checkmark"></span>
              Acepto los <a href="javascript:void(0)" class="terms-link" @click.stop="openTerms">Términos y Condiciones</a>
            </label>
          </div>

          <pv-dialog v-model:visible="showTerms" modal header="Términos y Condiciones" :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '641px': '100vw' }">
            <div class="terms-content">
              <h3>1. Aceptación de los Términos</h3>
              <p>Al registrarse en StockSip, usted acepta cumplir con nuestros términos de servicio y todas las leyes y regulaciones aplicables.</p>
              
              <h3>2. Uso del Servicio</h3>
              <p>StockSip es una plataforma de gestión de inventarios para licores. El usuario es responsable de mantener la confidencialidad de su cuenta.</p>
              
              <h3>3. Privacidad y Datos</h3>
              <p>Sus datos personales serán procesados de acuerdo con nuestra Política de Privacidad. No compartimos información con terceros sin su consentimiento explícito.</p>
              
              <h3>4. Limitación de Responsabilidad</h3>
              <p>StockSip no se hace responsable por errores en la entrada de datos por parte del usuario o interrupciones menores en el servicio.</p>
              
              <p style="margin-top: 20px; font-weight: bold;">Al marcar la casilla de aceptación, usted confirma que ha leído y comprendido estos términos.</p>
            </div>
            <template #footer>
              <pv-button label="Cerrar" icon="pi pi-check" @click="showTerms = false" autofocus />
            </template>
          </pv-dialog>

          <pv-button
            type="submit"
            :label="loading ? 'Signing Up...' : 'Sign Up'"
            class="sign-in-btn validate-btn"
            :disabled="loading"
          />
        </form>

        <div class="divider">
          <span>or sign up with</span>
        </div>

        <div class="social-login">
          <button class="social-btn google">
            <span class="social-icon" aria-hidden="true">
              <svg class="brand-icon" viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.22 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.023 6.053 29.217 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917Z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306 14.691 12.88 19.51C14.659 15.108 18.965 12 24 12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.023 6.053 29.217 4 24 4 16.318 4 9.656 8.337 6.306 14.691Z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.116 0 9.836-1.965 13.377-5.153l-6.178-5.229C29.182 35.091 26.715 36 24 36c-5.199 0-9.62-3.317-11.283-7.946l-6.525 5.027C9.505 39.556 16.227 44 24 44Z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303a12.05 12.05 0 0 1-4.104 5.618l.003-.002 6.178 5.229C36.943 40.137 44 35 44 24c0-1.341-.138-2.65-.389-3.917Z"
                />
              </svg>
            </span>
            Google
          </button>
        </div>

        <div class="login-prompt">
          <p>
            Already have an account?
            <a href="/" class="login-link">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
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
      900px 500px at 20% 10%,
      rgba(229, 62, 62, 0.1),
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
      circle at 20% 80%,
      rgba(229, 62, 62, 0.1) 0%,
      transparent 55%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(43, 0, 13, 0.1) 0%,
      transparent 55%
    ),
    radial-gradient(
      circle at 40% 40%,
      rgba(255, 255, 255, 0.18) 0%,
      transparent 55%
    );
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.register-card {
  width: 100%;
  max-width: 920px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-soft);
  padding: 0;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  overflow: hidden;
}

.register-card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

.brand-section {
  text-align: center;
  margin-bottom: 0;
  padding: 44px 38px;
  background:
    radial-gradient(
      700px 420px at 20% 20%,
      rgba(229, 62, 62, 0.2),
      transparent 55%
    ),
    linear-gradient(
      180deg,
      rgba(43, 0, 13, 0.96) 0%,
      rgba(74, 27, 42, 0.96) 100%
    );
  color: var(--white);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand {
  font-weight: 900;
  font-size: 32px;
  letter-spacing: -1px;
  margin-bottom: 8px;
}

.brand-stock {
  color: var(--accent-red);
}

.brand-sip {
  color: var(--white);
}

.tagline {
  color: rgba(255, 255, 255, 0.78);
  font-size: 14px;
  margin: 0;
  font-weight: 500;
}

.form-section {
  text-align: center;
  padding: 44px 38px;
}

.welcome-text {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 8px;
  letter-spacing: -0.2px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 16px;
  margin: 0 0 24px;
  line-height: 1.5;
}

.register-form {
  text-align: left;
  margin-bottom: 24px;
}

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  margin-bottom: 6px;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
  text-align: left;
  padding-left: 2px;
}

.input-wrapper {
  position: relative;
}

.modern-input,
.modern-input :deep(input),
.modern-input :deep(.p-inputtext),
.modern-input:deep(input),
.modern-input:deep(.p-inputtext) {
  width: 100% !important;
  height: 48px !important;
  padding: 0 16px !important;
  border: 2px solid rgba(43, 0, 13, 0.14) !important;
  border-radius: 12px !important;
  font-size: 15px !important;
  line-height: 1.2 !important;
  background: rgba(255, 255, 255, 0.92) !important;
  color: rgba(0, 0, 0, 0.82) !important;
  transition: all 0.3s ease !important;
  outline: none !important;
  box-shadow: none !important;
  box-sizing: border-box !important;
  display: block !important;
}

.custom-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(0,0,0,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") !important;
  background-repeat: no-repeat !important;
  background-position: right 16px center !important;
  background-size: 16px !important;
  cursor: pointer;
  padding-right: 40px !important;
}

.custom-select.placeholder-selected {
  color: rgba(0, 0, 0, 0.4) !important;
}

.custom-select option {
  color: rgba(0, 0, 0, 0.82);
}

.modern-input :deep(input:focus) {
  border-color: rgba(229, 62, 62, 0.45);
  box-shadow: 0 0 0 4px rgba(229, 62, 62, 0.1);
  background: white;
}

.modern-input :deep(.p-inputtext:focus) {
  border-color: rgba(229, 62, 62, 0.45) !important;
  box-shadow: 0 0 0 4px rgba(229, 62, 62, 0.1) !important;
  background: #ffffff !important;
}

.modern-input:deep(.p-inputtext:focus),
.modern-input:deep(input:focus) {
  border-color: rgba(229, 62, 62, 0.45) !important;
  box-shadow: 0 0 0 4px rgba(229, 62, 62, 0.1) !important;
  background: #ffffff !important;
}

.modern-input :deep(input::placeholder) {
  color: rgba(0, 0, 0, 0.4) !important;
}

.modern-input :deep(.p-inputtext::placeholder) {
  color: rgba(0, 0, 0, 0.4) !important;
}

.modern-input:deep(.p-inputtext::placeholder),
.modern-input:deep(input::placeholder) {
  color: rgba(0, 0, 0, 0.4) !important;
}

.password-input,
.password-input :deep(input),
.password-input :deep(.p-inputtext),
.password-input:deep(input),
.password-input:deep(.p-inputtext) {
  padding-right: 56px !important;
}

.toggle-password {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  height: 36px;
  width: 36px;
  border-radius: 10px;
  border: 0;
  background: transparent;
  color: rgba(0, 0, 0, 0.55);
  cursor: pointer;
  display: grid;
  place-items: center;
  padding: 0;
}

.toggle-password:hover {
  background: rgba(229, 62, 62, 0.06);
  color: rgba(0, 0, 0, 0.72);
}

.toggle-password:focus-visible {
  outline: 0;
  box-shadow: 0 0 0 4px rgba(229, 62, 62, 0.12);
}

.eye {
  width: 20px;
  height: 20px;
  display: block;
}

.form-options {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 24px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
  position: relative;
}

.checkbox-wrapper input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  margin-right: 8px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-wrapper input:checked ~ .checkmark {
  background: var(--accent-red);
  border-color: transparent;
}

.checkbox-wrapper input:checked ~ .checkmark:after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.sign-in-btn {
  width: 100% !important;
  height: 52px !important;
  border-radius: 12px !important;
  border: none !important;
  background: var(--button-bg) !important;
  color: white !important;
  font-weight: 700 !important;
  font-size: 16px !important;
  margin-bottom: 16px !important;
  box-shadow: 0 14px 30px rgba(74, 27, 42, 0.18) !important;
  transition: all 0.3s ease !important;
}

.sign-in-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 18px 36px rgba(74, 27, 42, 0.22) !important;
  opacity: 0.95;
}

.sign-in-btn :deep(.p-button-label) {
  color: white !important;
}

.divider {
  position: relative;
  text-align: center;
  margin: 20px 0;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e2e8f0;
}

.divider span {
  background: var(--glass-bg);
  padding: 0 16px;
  color: var(--text-secondary);
  font-size: 14px;
  position: relative;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  height: 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-btn:hover {
  border-color: rgba(229, 62, 62, 0.35);
  background: rgba(229, 62, 62, 0.04);
}

.social-icon {
  font-size: 18px;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.brand-icon {
  width: 18px;
  height: 18px;
  display: block;
}

.google .social-icon {
  color: #4285f4;
}

.login-prompt {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.login-prompt p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.login-link {
  color: var(--accent-red);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: rgba(229, 62, 62, 0.8);
}


@media (max-width: 480px) {
  .register-card {
    padding: 0;
  }

  .welcome-text {
    font-size: 24px;
  }

  .brand {
    font-size: 28px;
  }
}

@media (max-width: 900px) {
  .register-card {
    grid-template-columns: 1fr;
    max-width: 520px;
  }

  .brand-section {
    padding: 34px 26px;
  }

  .form-section {
    padding: 34px 26px;
  }
}


.register-card {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.terms-content {
  line-height: 1.6;
  color: var(--text-primary);
}
.terms-content h3 {
  margin-top: 20px;
  margin-bottom: 8px;
  color: var(--top-bg);
  font-size: 1.1rem;
}
.terms-content p {
  margin-bottom: 12px;
}
</style>
