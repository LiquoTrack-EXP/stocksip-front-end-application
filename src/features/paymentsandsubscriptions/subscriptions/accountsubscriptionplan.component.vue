<script setup>
/**
 * accountsubscriptionplan.component component.
 * @displayName accountsubscriptionplan.component
 * @version 1.0.0
 */
import { ref, onMounted } from 'vue';
import { SubscriptionService } from '@/features/paymentsandsubscriptions/subscriptions/data/remote/services/SubscriptionService';
import { PlanService } from '@/features/paymentsandsubscriptions/plans/data/remote/services/PlanService';

const accountSubscription = ref({
  planType: '—',
  status: '—',
  expirationDate: '—',
});

const availablePlans = ref([]);
const isLoading = ref(true);

const loadSubscriptionData = async () => {
  isLoading.value = true;
  try {
    const accountId = localStorage.getItem('accountId');
    if (!accountId) return;

    try {
      const subRes = await SubscriptionService.getSubscriptionByAccountId(accountId);
      const data = subRes.data || {};
      accountSubscription.value = {
        subscriptionId: data.subscriptionId,
        planType: data.planType || 'Free',
        status: data.status || 'Active',
        expirationDate: data.expirationDate || 'N/A',
      };
    } catch (err) {
      if (err?.response?.status !== 404) console.error('Error loading subscription:', err);

      accountSubscription.value = {
        planType: 'Free',
        status: 'Pending',
        expirationDate: 'N/A',
      };
    }

    const plansRes = await PlanService.getAllPlans();
    availablePlans.value = (plansRes.data || []).map(p => ({
      id: p.planId ?? p.id,
      type: p.planType,
      price: p.price ?? p.planPrice ?? 0
    }));
  } catch (err) {
    console.error('Error loading subscription dashboard:', err);
  } finally {
    isLoading.value = false;
  }
};

const upgradePlan = async (planId) => {
  isLoading.value = true;
  try {
    const accountId = localStorage.getItem('accountId');
    if (!accountId) return;

    if (accountSubscription.value.subscriptionId) {
      await SubscriptionService.upgradeSubscription(accountId, accountSubscription.value.subscriptionId, { newPlanId: planId });
    } else {
      await SubscriptionService.createSubscriptionForAccount(accountId, { selectedPlanId: planId });
    }
    alert('¡Plan actualizado con éxito!');
    await loadSubscriptionData();
  } catch (err) {
    console.error('Error upgrading plan:', err.response?.data);
    alert('Error: ' + (err.response?.data?.message || 'No se pudo actualizar el plan'));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadSubscriptionData();
});
</script>

<template>
  <div class="web-layout subs-layout">
    <div class="content-wrapper">
      
      
      <header class="page-header">
        <h1 class="page-title">{{ $t('subscriptions.title') }}</h1>
      </header>

      <div v-if="isLoading" class="loading-state">
        <svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
      </div>

      <div v-else class="subs-content">
        
        
        <section class="current-sub-section">
          <h2 class="section-title">{{ $t('subscriptions.current_plan') }}</h2>
          <div class="sub-card dark-glass-panel">
            <div class="card-header">
              <span class="plan-badge">{{ accountSubscription.planType }}</span>
              <div class="status-pill active-pill">{{ accountSubscription.status }}</div>
            </div>
            
            <div class="card-body">
              <div class="info-row">
                <span class="info-label">{{ $t('subscriptions.expiration_date') }}</span>
                <span class="info-val">{{ accountSubscription.expirationDate }}</span>
              </div>
            </div>
          </div>
        </section>

        
        <section class="available-plans-section">
          <h2 class="section-title">{{ $t('subscriptions.upgrade_plan') }}</h2>
          
          <div class="plans-list">
            <div 
              v-for="plan in availablePlans" 
              :key="plan.id"
              class="available-plan-card dark-glass-panel"
              :class="{ 'current-plan': plan.type === accountSubscription.planType }"
            >
              <div class="plan-info">
                <h3 class="plan-name">{{ plan.type }}</h3>
                <p class="plan-price">${{ plan.price }}</p>
              </div>
              <div class="plan-action">
                <span class="current-label" v-if="plan.type === accountSubscription.planType">{{ $t('subscriptions.current_plan') }}</span>
                <button 
                  v-else 
                  class="pill-btn upgrade-btn" 
                  @click="upgradePlan(plan.id)"
                >
                  {{ $t('subscriptions.upgrade') }}
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<style scoped>
.subs-layout {
  min-height: 100vh;
  
  background: linear-gradient(180deg, #2b000d 0%, #4a1b2a 100%);
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-wrapper {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
}


.page-header {
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 40px;
}
.page-title { font-size: 32px; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: 0px; text-align: center; }


.section-title {
  font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.7);
  margin: 0 0 16px 4px; letter-spacing: 0px;
}
.current-sub-section { margin-bottom: 40px; }


.dark-glass-panel {
  background: rgba(255, 255, 255, 0.04); 
  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08); 
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
}


.sub-card { padding: 24px 32px; }
.card-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 24px;
}
.plan-badge {
  background: linear-gradient(90deg, #e53e3e 0%, #ff7676 100%);
  color: white; font-weight: 800; font-size: 14px; letter-spacing: 1px;
  padding: 6px 14px; border-radius: 10px;
}
.status-pill {
  padding: 6px 14px; border-radius: 12px; font-size: 12px; font-weight: 700; text-transform: uppercase;
}
.active-pill { background: rgba(76, 175, 80, 0.15); color: #81c784; border: 1px solid rgba(76, 175, 80, 0.3); }

.card-body { display: flex; flex-direction: column; }
.info-row { display: flex; flex-direction: column; }
.info-label { font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;}
.info-val { font-size: 18px; font-weight: 700; color: #ffffff; }


.plans-list {
  display: flex; flex-direction: column; gap: 16px;
}
.available-plan-card {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 24px; transition: transform 0.2s, background 0.2s;
  cursor: pointer;
}
.available-plan-card:hover:not(.current-plan) { 
  transform: translateY(-2px); 
  background: rgba(255, 255, 255, 0.08);
}
.available-plan-card.current-plan {
  opacity: 0.5; border-color: transparent; pointer-events: none; background: rgba(0,0,0,0.2);
}

.plan-info { display: flex; flex-direction: column; }
.plan-name { font-size: 18px; font-weight: 800; color: #ffffff; margin: 0 0 4px; letter-spacing: 1px; }
.plan-price { font-size: 14px; color: rgba(255,255,255,0.6); margin: 0; font-weight: 500;}

.current-label { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.5); padding-right: 8px;}
.pill-btn {
  padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 14px;
  cursor: pointer; transition: all 0.2s; border: none;
}
.upgrade-btn {
  background: #e53e3e; color: #ffffff;
}
.upgrade-btn:hover { background: #ff4f4f; box-shadow: 0 4px 16px rgba(229, 62, 62, 0.4); transform: translateY(-2px); }


.loading-state { display: flex; justify-content: center; padding: 40px; }
.spinner { animation: rotate 2s linear infinite; width: 40px; height: 40px; }
.spinner .path { stroke: #ffffff; stroke-linecap: round; animation: dash 1.5s ease-in-out infinite; }
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash { 0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; } 50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; } 100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; } }
</style>
