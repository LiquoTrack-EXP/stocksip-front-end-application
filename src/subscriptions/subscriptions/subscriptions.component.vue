<script setup>
/**
 * subscriptions.component component.
 * @displayName subscriptions.component
 * @version 1.0.0
 */
import { ref, onMounted } from 'vue';
import AccountSubscriptionPlanComponent from './accountsubscriptionplan.component.vue';
import PlanComponent from '../plans/plan.component.vue';
import { SubscriptionService } from '@/subscriptions/services/subscription.service.js';

const hasActiveSubscription = ref(false);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const accountId = localStorage.getItem('accountId');
    if (!accountId) { isLoading.value = false; return; }
    const response = await SubscriptionService.getSubscriptionByAccountId(accountId);
    console.log('Subscription response:', response.data);

    hasActiveSubscription.value = !!(
      response.data && 
      (Array.isArray(response.data) ? response.data.length > 0 : response.data.subscriptionId)
    );
  } catch (err) {

    if (err?.response?.status !== 404) {
      console.error('Error loading subscription:', err);
    }
    hasActiveSubscription.value = false;
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="subscriptions-wrapper">
    <div v-if="isLoading" class="loading-overlay">
      <svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
    </div>

    
    <AccountSubscriptionPlanComponent v-else-if="hasActiveSubscription" />

    
    <PlanComponent v-else />
  </div>
</template>

<style scoped>
.subscriptions-wrapper {
  min-height: 100vh;
  width: 100%;
  position: relative;
}

.loading-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: #f4ecec;
  display: flex; align-items: center; justify-content: center;
  z-index: 9999;
}

.spinner { animation: rotate 2s linear infinite; width: 48px; height: 48px; }
.spinner .path { stroke: #2b000d; stroke-linecap: round; animation: dash 1.5s ease-in-out infinite; }
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash { 
  0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; } 
  50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; } 
  100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; } 
}
</style>
