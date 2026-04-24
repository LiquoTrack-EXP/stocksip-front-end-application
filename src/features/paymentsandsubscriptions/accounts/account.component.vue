<script setup>
/**
 * account.component component.
 * @displayName account.component
 * @version 1.0.0
 */
import { ref, onMounted } from 'vue';
import { AccountService } from '@/features/paymentsandsubscriptions/services/account.service';

const accountStatus = ref('—');
const accountRole = ref('—');
const isLoading = ref(true);

const loadAccountData = async () => {
  isLoading.value = true;
  try {
    const accountId = localStorage.getItem('accountId');
    if (!accountId) { isLoading.value = false; return; }
    const response = await AccountService.getAccountById(accountId);
    const data = response.data;
    accountStatus.value = data.status || 'Active';
    accountRole.value = data.role || data.accountRole || '—';
  } catch (err) {
    console.error('Error loading account:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadAccountData();
});
</script>

<template>
  <div class="web-layout account-layout">
    <div class="content-wrapper">
      <header class="page-header">
        <h1 class="page-title">{{ $t('profile.title') }}</h1>
        <p class="page-subtitle">Gestiona el estado y el rol de tu cuenta corporativa.</p>
      </header>

      <div v-if="isLoading" class="loading-state">
        <svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
      </div>

      <div v-else class="account-card glass-panel">
        <div class="card-section">
          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24" class="status-icon"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          </div>
          <div class="info-block">
            <span class="info-label">Estado de la Cuenta</span>
            <span class="info-value status-active">{{ accountStatus }}</span>
          </div>
        </div>
        
        <div class="divider"></div>

        <div class="card-section">
          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24" class="role-icon"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <div class="info-block">
            <span class="info-label">Rol Asignado</span>
            <span class="info-value">{{ accountRole }}</span>
          </div>
        </div>

        <div class="card-footer">
          <button class="pill-btn refresh-btn" @click="loadAccountData">Actualizar Datos</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.account-layout {
  min-height: 100vh; background-color: #f4ecec; padding: 40px 20px;
  display: flex; flex-direction: column; align-items: center;
}
.content-wrapper { width: 100%; max-width: 600px; }

.page-header { margin-bottom: 32px; text-align: center; }
.page-title { font-size: 32px; font-weight: 800; color: #2b000d; margin: 0 0 8px; }
.page-subtitle { font-size: 16px; color: rgba(0,0,0,0.55); margin: 0; }

.glass-panel {
  background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(43, 0, 13, 0.12); box-shadow: 0 16px 40px rgba(43, 0, 13, 0.08);
  border-radius: 24px; overflow: hidden;
}

.card-section { display: flex; align-items: center; gap: 20px; padding: 32px; }
.icon-wrapper { 
  width: 56px; height: 56px; border-radius: 16px; background: rgba(43, 0, 13, 0.05);
  display: flex; align-items: center; justify-content: center;
}
.status-icon, .role-icon { width: 32px; height: 32px; color: #4a1b2a; }
.status-icon { color: #4CAF50; }

.info-block { display: flex; flex-direction: column; }
.info-label { font-size: 14px; color: rgba(0,0,0,0.55); margin-bottom: 4px; font-weight: 700; }
.info-value { font-size: 20px; font-weight: 800; color: #2b000d; }
.status-active { color: #4CAF50; }

.divider { height: 1px; background: rgba(43, 0, 13, 0.08); margin: 0 32px; }

.card-footer { padding: 24px 32px; background: rgba(43, 0, 13, 0.02); display: flex; justify-content: flex-end; }
.pill-btn { padding: 12px 24px; border-radius: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s; border: none; }
.refresh-btn { background: #2b000d; color: white; }
.refresh-btn:hover { background: #4a1b2a; transform: translateY(-2px); box-shadow: 0 8px 16px rgba(43, 0, 13, 0.2); }

.loading-state { display: flex; justify-content: center; padding: 40px; }
.spinner { animation: rotate 2s linear infinite; width: 40px; height: 40px; }
.spinner .path { stroke: #2b000d; stroke-linecap: round; animation: dash 1.5s ease-in-out infinite; }
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash { 0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; } 50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; } 100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; } }
</style>
