<script>
import { AuthService } from "./data/remote/services/AuthService";
import { SubscriptionService } from "@/features/paymentsandsubscriptions/services/subscription.service";

export default {
  name: "LoginComponent",
  data() {
    return {
      email: "",
      password: "",
      passwordVisible: false,
      loading: false,
      error: "",
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = "";

      try {
        const response = await AuthService.signIn({
          email: this.email,
          password: this.password,
        });

        const { token, userId, accountId } = response.data;

        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId || "");
          localStorage.setItem("accountId", accountId || "");
          localStorage.setItem("userEmail", response.data.email || "");

          try {
            const subResponse =
              await SubscriptionService.getSubscriptionByAccountId(accountId);
            if (
              subResponse.data &&
              (subResponse.data.id || subResponse.data.subscriptionId)
            ) {
              this.$router.push("/home");
            } else {
              this.$router.push("/plans");
            }
          } catch (subErr) {
            this.$router.push("/plans");
          }
        }
      } catch (err) {
        console.error("Login error detail:", err.response?.data);
        this.error =
          err.response?.data?.message ||
          err.response?.data?.errors ||
          "Invalid email or password. Please try again.";
      } finally {
        this.loading = false;
      }
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
  },
};
</script>

<template>
  <div class="login-container">
    <div class="background-pattern"></div>
    <div class="login-card">
      <div class="brand-section">
        <div class="brand">
          <span class="brand-stock">Stock</span
          ><span class="brand-sip">Sip</span>
        </div>
        <p class="tagline">Smart Investment Management</p>
      </div>

      <div class="form-section">
        <h2 class="welcome-text">{{ $t("auth.login.title") }}</h2>
        <p class="subtitle">{{ $t("auth.login.subtitle") }}</p>

        <div v-if="error" class="error-message">
          <svg viewBox="0 0 24 24" class="error-icon">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
            />
          </svg>
          {{ typeof error === "string" ? error : "Authentication failed" }}
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="input-group">
            <label for="email">Email Address</label>
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

          <div class="form-options">
            <label class="checkbox-wrapper">
              <input type="checkbox" />
              <span class="checkmark"></span>
              Remember me
            </label>
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>

          <pv-button
            type="submit"
            :label="loading ? 'Signing In...' : 'Sign In'"
            class="sign-in-btn"
            :disabled="loading"
          />
        </form>

        <div class="divider">
          <span>or</span>
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
            Continue with Google
          </button>
          <button class="social-btn github">
            <span class="social-icon" aria-hidden="true">
              <svg class="brand-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 .5C5.73.5.98 5.25.98 11.52c0 4.86 3.15 8.98 7.52 10.44.55.1.75-.24.75-.53 0-.26-.01-1.12-.02-2.03-3.06.66-3.7-1.3-3.7-1.3-.5-1.27-1.23-1.61-1.23-1.61-1-.69.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.19 3.2.91.1-.71.38-1.19.7-1.46-2.44-.28-5-1.22-5-5.43 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .93-.3 3.05 1.13.88-.25 1.82-.38 2.75-.38s1.87.13 2.75.38c2.12-1.43 3.05-1.13 3.05-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.22-2.56 5.15-5 5.42.39.34.73 1.01.73 2.04 0 1.47-.01 2.66-.01 3.02 0 .29.2.63.76.52 4.36-1.46 7.51-5.58 7.51-10.44C23.02 5.25 18.27.5 12 .5Z"
                />
              </svg>
            </span>
            Continue with GitHub
          </button>
        </div>

        <div class="register-prompt">
          <p>
            Don't have an account?
            <a href="/sign-up" class="register-link">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
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
}

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
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

.login-card {
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

.login-card:hover {
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
  margin: 0 0 32px;
  line-height: 1.5;
}

.login-form {
  text-align: left;
  margin-bottom: 24px;
}

.error-message {
  background: rgba(229, 62, 62, 0.1);
  color: #e53e3e;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  border: 1px solid rgba(229, 62, 62, 0.2);
}

.error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
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
  height: 52px !important;
  padding: 0 16px !important;
  border: 2px solid rgba(43, 0, 13, 0.14) !important;
  border-radius: 12px !important;
  font-size: 16px !important;
  line-height: 1.2 !important;
  background: rgba(255, 255, 255, 0.92) !important;
  color: rgba(0, 0, 0, 0.82) !important;
  transition: all 0.3s ease !important;
  outline: none !important;
  box-shadow: none !important;
  box-sizing: border-box !important;
  display: block !important;
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

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: rgba(0, 0, 0, 0.45);
  pointer-events: none;
  z-index: 1;
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
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  height: 40px;
  width: 40px;
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
  justify-content: space-between;
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
  background: var(--primary-gradient);
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

.forgot-link {
  color: var(--accent-red);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: rgba(229, 62, 62, 0.8);
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
  margin-bottom: 24px !important;
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
  margin: 24px 0;
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

.apple .social-icon {
  color: #000;
}

.register-prompt {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.register-prompt p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.register-link {
  color: var(--accent-red);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: rgba(229, 62, 62, 0.8);
}

@media (max-width: 480px) {
  .login-card {
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
  .login-card {
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

.login-card {
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
</style>
