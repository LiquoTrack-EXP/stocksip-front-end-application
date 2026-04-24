<script>
import { UserService } from "../services/user.service";

/**
 * AdminPanelCreateComponent component.
 * @displayName AdminPanelCreateComponent
 * @version 1.0.0
 */
export default {
  name: "AdminPanelCreateComponent",
  data() {
    return {
      newUser: {
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        role: "Employee",
        profileRole: "Seller",
      },
      isLoading: false,
      rolesSistema: ["Employee", "Admin"],
      rolesAsignados: ["Seller", "Buyer", "WarehouseWorker", "Admin"],
    };
  },
  methods: {
    /**
     * closeDialog
     * @public
     */
    closeDialog() {
      this.$router.go(-1);
    },
    /**
     * saveUser
     * @public
     */
    async saveUser() {
      this.isLoading = true;
      try {
        const accountId = localStorage.getItem("accountId");
        if (!accountId) return;

        await UserService.registerSubUser(accountId, {
          name: this.newUser.name,
          email: this.newUser.email,
          password: this.newUser.password,
          phoneNumber: this.newUser.phoneNumber,
          role: this.newUser.role,
          profileRole: this.newUser.profileRole,
        });

        alert(
          "¡El usuario " + this.newUser.name + " se ha invitado exitosamente!",
        );
        this.$router.go(-1);
      } catch (err) {
        console.error("Error creating user:", err.response?.data);
        alert(
          "Error: " +
            (err.response?.data?.message || "No se pudo invitar al usuario"),
        );
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<template>
  <div class="dialog-backdrop" @click.self="closeDialog">
    <div class="modal-card creation-model">
      <div class="modal-header">
        <h2 class="hero-title">{{ $t('admin.new_user') }}</h2>
      </div>

      <div class="modal-body-form">
        <div class="form-section">
          <h4 class="section-label">{{ $t('admin.fields.name') }}</h4>

          <div class="grid-form">
            <div class="field-item full-width">
              <div class="input-wrapper editable-shadow">
                <input
                  type="text"
                  v-model="newUser.name"
                  :placeholder="$t('admin.fields.name')"
                />
              </div>
            </div>

            <div class="field-item">
              <div class="input-wrapper editable-shadow">
                <input
                  type="email"
                  v-model="newUser.email"
                  :placeholder="$t('auth.login.email')"
                />
              </div>
            </div>

            <div class="field-item">
              <div class="input-wrapper editable-shadow">
                <input
                  type="password"
                  v-model="newUser.password"
                  :placeholder="$t('auth.login.password')"
                />
              </div>
            </div>

            <div class="field-item">
              <div class="input-wrapper editable-shadow">
                <input
                  type="tel"
                  v-model="newUser.phoneNumber"
                  :placeholder="$t('admin.fields.phone')"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="form-section split-dropdowns">
          <div class="field-item dropdown-section">
            <h4 class="section-label">Rol (sistema)</h4>
            <div class="input-wrapper editable-shadow select-arrow">
              <select v-model="newUser.role">
                <option v-for="rol in rolesSistema" :key="rol" :value="rol">
                  {{ rol }}
                </option>
              </select>
            </div>
          </div>

          <div class="field-item dropdown-section">
            <h4 class="section-label">Rol asignado</h4>
            <div class="input-wrapper editable-shadow select-arrow">
              <select v-model="newUser.profileRole">
                <option v-for="rol in rolesAsignados" :key="rol" :value="rol">
                  {{ rol }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="actions-footer">
          <button
            class="pill-btn cancel-btn"
            @click="closeDialog"
            :disabled="isLoading"
          >{{ $t('common.cancel') }}</button>
          <button
            class="pill-btn save-btn"
            @click="saveUser"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">{{ $t('common.save') }}</span>
            <svg
              v-else
              class="spinner"
              viewBox="0 0 50 50"
              style="width: 20px; height: 20px; display: inline-block"
            >
              <circle
                class="path"
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="white"
                stroke-width="5"
              ></circle>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(20, 0, 5, 0.55);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(10px);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-card.creation-model {
  background: #f4ecec;
  width: 100%;
  max-width: 650px;
  border-radius: 32px;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.modal-header {
  padding: 40px 45px 10px;
}

.hero-title {
  font-size: 30px;
  font-weight: 800;
  color: #3b1923;
  margin: 0;
}

.modal-body-form {
  padding: 25px 45px 45px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-section {
  display: flex;
  flex-direction: column;
}

.section-label {
  font-size: 15px;
  font-weight: 700;
  color: #be5555;
  margin: 0 0 14px 4px;
}

.grid-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 20px;
  column-gap: 20px;
}

.full-width {
  grid-column: span 2;
}

.split-dropdowns {
  flex-direction: row;
  gap: 20px;
}
.dropdown-section {
  flex: 1;
}
.dropdown-section .section-label {
  margin-top: 0;
}

.editable-shadow input,
.editable-shadow select {
  width: 100%;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid #dcd9d9;
  font-size: 15px;
  font-family: inherit;
  color: #3b1923;
  font-weight: 600;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(43, 0, 13, 0.03);
  box-sizing: border-box;
  transition: all 0.2s ease;
  appearance: none;
}

.select-arrow {
  position: relative;
}
.select-arrow::after {
  content: "▼";
  font-size: 10px;
  color: #c9cccc;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.editable-shadow input:focus,
.editable-shadow select:focus {
  outline: none;
  border-color: #3b1923;
  box-shadow: 0 4px 16px rgba(59, 25, 35, 0.1);
}

.editable-shadow input::placeholder {
  color: #c9cccc;
  font-weight: 500;
}

.actions-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.pill-btn {
  padding: 16px 40px;
  border-radius: 40px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  min-width: 140px;
}

.cancel-btn {
  background: #ffffff;
  color: #2b000d;
  border: 1px solid #d4cacc;
}
.cancel-btn:hover {
  background: #f7f3f4;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.04);
}

.save-btn {
  background: #391421;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 12px 24px rgba(57, 20, 33, 0.2);
}
.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 32px rgba(57, 20, 33, 0.3);
  background: #2b000d;
}
</style>
