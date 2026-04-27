<script>
/**
 * AdminPanelEditComponent component.
 * @displayName AdminPanelEditComponent
 * @version 1.0.0
 */
export default {
  name: "AdminPanelEditComponent",
  data() {
    return {
      userId: null,
      user: {
        nombre: "Bruhh 14z",
        apellido: "",
        telefono: "+10000000000",
        rol: "Admin",
      },
    };
  },
  created() {
    this.userId = this.$route.params.id;
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
     * triggerImageUpload
     * @public
     */
    triggerImageUpload() {
      alert("Abriendo el selector de archivos del sistema operativo...");
    },
    /**
     * saveProfile
     * @public
     */
    saveProfile() {
      alert("Cambios de perfil guardados en el servidor para el usuario #" + this.userId);
      this.$router.go(-1);
    },
  },
};
</script>

<template>
  <div class="dialog-backdrop" @click.self="closeDialog">
    
    <div class="modal-card wide-model">
      
      
      <div class="modal-header">
        <h2 class="modal-title">{{ $t('profile.edit_profile') }}</h2>
        <button class="close-btn" @click="closeDialog" title="Cancelar edición">
          <svg viewBox="0 0 24 24" class="close-icon">
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>
      </div>

      <div class="modal-content-split">
        
        <div class="profile-hero-pane">
          
          <div class="avatar-ring">
            <div class="avatar-fill">
              <svg viewBox="0 0 24 24" class="person-silhouette">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                />
              </svg>
            </div>
          </div>

          
          <button class="pill-btn select-img-btn" @click="triggerImageUpload">
            Seleccionar imagen
          </button>
        </div>

        
        <div class="form-pane">
          <h3 class="pane-title">Configuración de Cuenta</h3>

          <div class="view-form-grid">
            <div class="field-item">
              <label class="mockup-label">Nombre</label>
              <div class="input-wrapper mockup-shadow editable">
                <input type="text" v-model="user.nombre" placeholder="Ingresa el nombre" />
              </div>
            </div>

            <div class="field-item">
              <label class="mockup-label">Apellido</label>
              <div class="input-wrapper mockup-shadow editable">
                <input type="text" v-model="user.apellido" placeholder="Ingresa tus apellidos" />
              </div>
            </div>

            <div class="field-item full-width">
              <label class="mockup-label">Número de teléfono</label>
              <div class="input-wrapper mockup-shadow editable">
                <input type="tel" v-model="user.telefono" placeholder="+00000000000" />
              </div>
            </div>

            <div class="field-item full-width">
              <label class="mockup-label">Rol asignado</label>
              <div class="input-wrapper mockup-shadow editable">
                 
                <input type="text" v-model="user.rol" />
              </div>
            </div>
          </div>

          
          <div class="actions-footer">
            <button class="pill-btn dark-mockup-btn" @click="saveProfile">{{ $t('common.save') }}</button>
          </div>
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


.modal-card {
  background: #f4ecec;
  width: 100%;
  max-width: 900px;
  border-radius: 28px;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px 10px;
}

.modal-title {
  font-size: 24px;
  font-weight: 800;
  color: #2b000d;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #a0979a;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(43, 0, 13, 0.08);
  color: #2b000d;
}

.close-icon {
  width: 26px;
  height: 26px;
}

.modal-content-split {
  display: flex;
  min-height: 440px;
}


.profile-hero-pane {
  flex: 0 0 340px;
  background: linear-gradient(
    135deg,
    rgba(43, 0, 13, 0.01) 0%,
    rgba(43, 0, 13, 0.04) 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid rgba(43, 0, 13, 0.08);
  padding: 40px;
}

.avatar-ring {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 4px solid #3c1f2a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  margin-bottom: 24px; 
}

.avatar-fill {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #c0b9ba;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.person-silhouette {
  width: 110px;
  height: 110px;
  color: #fdfdfd;
  margin-top: 25px;
}


.pill-btn.select-img-btn {
  background: #391421;
  color: #ffffff;
  padding: 12px 28px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 16px rgba(57, 20, 33, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pill-btn.select-img-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(57, 20, 33, 0.3);
}


.form-pane {
  flex: 1;
  padding: 45px 50px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.pane-title {
  font-size: 18px;
  font-weight: 800;
  color: #2b000d;
  margin: 0 0 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(43, 0, 13, 0.06);
}

.view-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 28px;
  column-gap: 24px;
}

.full-width {
  grid-column: span 2;
}

.mockup-label {
  font-size: 14px;
  font-weight: 800;
  color: #3b1923;
  margin-bottom: 8px;
  margin-left: 2px;
}


.mockup-shadow.editable input {
  width: 100%;
  padding: 16px 20px;
  border-radius: 12px;
  
  border: 1px solid #dadbdc; 
  font-size: 15px;
  font-family: inherit;
  color: #3b1923;
  font-weight: 600;
  
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(43, 0, 13, 0.02);
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.mockup-shadow.editable input:focus {
  outline: none;
  border-color: #3b1923; 
  box-shadow: 0 4px 16px rgba(59, 25, 35, 0.1);
}


.mockup-shadow.editable input::placeholder {
  color: #c9cccc;
  font-weight: 500;
}


.actions-footer {
  margin-top: auto;
  padding-top: 40px;
  display: flex;
  justify-content: flex-end;
}

.pill-btn.dark-mockup-btn {
  background: #391421;
  color: #ffffff;
  padding: 16px 48px;
  border-radius: 40px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 12px 24px rgba(57, 20, 33, 0.2);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.pill-btn.dark-mockup-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 32px rgba(57, 20, 33, 0.3);
  background: #2b000d;
}
</style>
