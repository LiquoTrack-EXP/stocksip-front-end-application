<script setup>
/**
 * profile.component component.
 * @displayName profile.component
 * @version 1.0.0
 */
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ProfileService } from '../services/profile.service';

const { locale } = useI18n();

const changeLanguage = (lang) => {
  locale.value = lang;
};

const user = ref({
  id: "",
  firstName: "",
  lastName: "",
  fullName: "Cargando...",
  phoneNumber: "",
  assignedRole: "",
});

const isEditing = ref(false);
const isLoading = ref(false);
const editForm = ref({
  firstName: "",
  lastName: "",
  phoneNumber: "",
});

const fetchProfile = async () => {
  try {
    const response = await ProfileService.getMyProfile();
    user.value = response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
};

onMounted(fetchProfile);

const toggleEdit = () => {
  if (!isEditing.value) {
    editForm.value = {
      firstName: user.value.firstName,
      lastName: user.value.lastName,
      phoneNumber: user.value.phoneNumber,
    };
  }
  isEditing.value = !isEditing.value;
};

const cancelEdit = () => {
  isEditing.value = false;
};

const saveProfile = async () => {
  isLoading.value = true;
  try {
    const formData = new FormData();
    formData.append('FirstName', editForm.value.firstName);
    formData.append('LastName', editForm.value.lastName);
    formData.append('PhoneNumber', editForm.value.phoneNumber);
    formData.append('AssignedRole', user.value.assignedRole);

    await ProfileService.updateProfile(user.value.id, formData);
    await fetchProfile();
    isEditing.value = false;
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Error al actualizar el perfil");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="web-layout profile-layout">
    <div class="content-wrapper">
      <header class="page-header">
        <h1 class="page-title">{{ $t('nav.profile') || 'Profile' }}</h1>
        <p class="page-subtitle">Visualiza y administra tus credenciales de usuario.</p>
        
        <div class="language-switcher">
          <span class="lang-label">Language:</span>
          <button class="lang-btn" :class="{ active: locale === 'en' }" @click="changeLanguage('en')">EN</button>
          <button class="lang-btn" :class="{ active: locale === 'es' }" @click="changeLanguage('es')">ES</button>
        </div>
      </header>

      <div class="profile-card glass-panel" :class="{ 'editing-mode': isEditing }">
        
        
        <div class="avatar-header">
          <div class="avatar-circle">
            <svg viewBox="0 0 24 24" class="avatar-icon">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
          <h2 class="user-display-name">{{ isEditing ? editForm.firstName + ' ' + editForm.lastName : user.fullName }}</h2>
          <span class="user-role-badge">{{ user.assignedRole }}</span>
        </div>

        <div class="divider"></div>

        
        <div class="card-section">
          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24" class="section-icon"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <div class="info-block">
            <span class="info-label">Nombres</span>
            <input v-if="isEditing" type="text" v-model="editForm.firstName" class="edit-input" placeholder="Tus nombres" />
            <span v-else class="info-value">{{ user.firstName }}</span>
          </div>
        </div>

        <div class="divider"></div>

        
        <div class="card-section">
          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24" class="section-icon"><path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
          </div>
          <div class="info-block">
            <span class="info-label">Apellidos</span>
            <input v-if="isEditing" type="text" v-model="editForm.lastName" class="edit-input" placeholder="Tus apellidos" />
            <span v-else class="info-value" :class="{'empty-value': !user.lastName}">{{ user.lastName || 'Sin apellidos' }}</span>
          </div>
        </div>

        <div class="divider"></div>

        
        <div class="card-section">
          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24" class="section-icon"><path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          </div>
          <div class="info-block">
            <span class="info-label">Número de Teléfono</span>
            <input v-if="isEditing" type="tel" v-model="editForm.phoneNumber" class="edit-input" placeholder="+1..." />
            <span v-else class="info-value">{{ user.phoneNumber }}</span>
          </div>
        </div>

        
        <div class="card-footer" :class="{ 'editing-footer': isEditing }">
          <template v-if="isEditing">
            <button class="pill-btn cancel-btn" @click="cancelEdit" :disabled="isLoading">{{ $t('common.cancel') }}</button>
            <button class="pill-btn save-btn" @click="saveProfile" :disabled="isLoading">
              <span v-if="!isLoading">{{ $t('common.save_changes') }}</span>
              <svg v-else class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
            </button>
          </template>
          <template v-else>
            <button class="pill-btn edit-btn" @click="toggleEdit">Editar Perfil</button>
          </template>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-layout {
  min-height: 100vh; background-color: #f4ecec; padding: 40px 20px;
  display: flex; flex-direction: column; align-items: center;
}
.content-wrapper { width: 100%; max-width: 600px; }

.page-header { margin-bottom: 32px; text-align: center; }
.page-title { font-size: 32px; font-weight: 800; color: #2b000d; margin: 0 0 8px; }
.page-subtitle { font-size: 16px; color: rgba(0,0,0,0.55); margin: 0; }

.language-switcher { margin-top: 16px; display: flex; justify-content: center; align-items: center; gap: 8px; }
.lang-label { font-weight: 700; color: #4a1b2a; font-size: 14px; }
.lang-btn { background: transparent; border: 1px solid rgba(74, 27, 42, 0.2); padding: 4px 12px; border-radius: 12px; cursor: pointer; font-weight: 700; transition: all 0.2s; color: #4a1b2a; }
.lang-btn.active { background: #4a1b2a; color: white; border-color: #4a1b2a; }
.lang-btn:hover:not(.active) { background: rgba(74, 27, 42, 0.05); }

.glass-panel {
  background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(43, 0, 13, 0.12); box-shadow: 0 16px 40px rgba(43, 0, 13, 0.08);
  border-radius: 24px; overflow: hidden; transition: all 0.3s ease;
}
.glass-panel.editing-mode {
  box-shadow: 0 24px 48px rgba(229, 62, 62, 0.15); border-color: rgba(229, 62, 62, 0.3);
}


.avatar-header {
  display: flex; flex-direction: column; align-items: center; padding: 40px 32px 32px;
  background: linear-gradient(180deg, rgba(247, 231, 232, 0.6) 0%, rgba(255, 255, 255, 0) 100%);
  transition: all 0.3s;
}
.editing-mode .avatar-header { background: linear-gradient(180deg, rgba(229, 62, 62, 0.08) 0%, rgba(255, 255, 255, 0) 100%); }

.avatar-circle {
  width: 120px; height: 120px; background: white; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 12px 24px rgba(43, 0, 13, 0.12); border: 2px solid #2b000d;
  margin-bottom: 20px; overflow: hidden; color: #d8d0d2;
}
.avatar-icon { width: 130px; height: 130px; margin-top: 10px; }
.user-display-name { font-size: 24px; font-weight: 800; color: #2b000d; margin: 0 0 8px; text-align: center; }
.user-role-badge { 
  background: rgba(74, 27, 42, 0.1); color: #4a1b2a; padding: 6px 16px; 
  border-radius: 20px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
}


.card-section { display: flex; align-items: center; gap: 20px; padding: 24px 32px; }
.icon-wrapper { 
  width: 56px; height: 56px; border-radius: 16px; background: rgba(43, 0, 13, 0.05);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.section-icon { width: 28px; height: 28px; color: #4a1b2a; }

.info-block { display: flex; flex-direction: column; flex: 1; }
.info-label { font-size: 14px; color: rgba(0,0,0,0.55); margin-bottom: 8px; font-weight: 700; }
.info-value { font-size: 18px; font-weight: 800; color: #2b000d; }
.empty-value { color: rgba(0,0,0,0.3); font-weight: 600; font-style: italic; }


.edit-input {
  width: 100%; padding: 12px 16px; border-radius: 12px;
  border: 1px solid rgba(43, 0, 13, 0.15); background: rgba(255, 255, 255, 0.8);
  font-size: 16px; font-weight: 600; color: #2b000d; font-family: inherit;
  transition: all 0.2s; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
}
.edit-input:focus {
  outline: none; border-color: #e53e3e; box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
  background: white;
}
.edit-input::placeholder { color: rgba(0,0,0,0.3); font-weight: 500; }

.divider { height: 1px; background: rgba(43, 0, 13, 0.08); margin: 0 32px; }

.card-footer { padding: 24px 32px; background: rgba(43, 0, 13, 0.02); display: flex; justify-content: flex-end; }
.editing-footer { justify-content: space-between; }
.pill-btn { 
  padding: 14px 32px; border-radius: 24px; font-weight: 800; font-size: 15px; 
  cursor: pointer; transition: all 0.2s; border: none; display: flex; justify-content: center; align-items: center;
}
.edit-btn { background: #2b000d; color: white; box-shadow: 0 8px 24px rgba(43, 0, 13, 0.15); }
.edit-btn:hover { background: #4a1b2a; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(43, 0, 13, 0.25); }

.cancel-btn { background: transparent; color: #4a1b2a; border: 1px solid rgba(74, 27, 42, 0.2); }
.cancel-btn:hover:not(:disabled) { background: rgba(74, 27, 42, 0.05); }

.save-btn { background: #e53e3e; color: white; box-shadow: 0 8px 20px rgba(229, 62, 62, 0.3); min-width: 180px;}
.save-btn:hover:not(:disabled) { background: #ff4f4f; transform: translateY(-2px); box-shadow: 0 12px 28px rgba(229, 62, 62, 0.4); }
.save-btn:disabled, .cancel-btn:disabled { opacity: 0.6; cursor: not-allowed; }


.spinner { animation: rotate 2s linear infinite; width: 24px; height: 24px; }
.spinner .path { stroke: #ffffff; stroke-linecap: round; animation: dash 1.5s ease-in-out infinite; }
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash { 0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; } 50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; } 100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; } }
</style>
