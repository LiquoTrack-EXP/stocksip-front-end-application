<script setup>
/**
 * plan.component component.
 * @displayName plan.component
 * @version 1.0.0
 */
import { ref, computed, onMounted } from "vue";
import {
  PlanService,
  SubscriptionService,
} from "@/features/paymentsandsubscriptions/services/subscription.service";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const toast = useToast();

const plans = ref([]);
const selectedPlanId = ref(null);
const isLoading = ref(true);

const normalizePlan = (plan) => ({
  id: plan.planId ?? plan.id,
  planType: plan.planType,
  description: plan.description ?? "",
  paymentFrequency: plan.paymentFrequency,
  planPrice: String(plan.price ?? plan.planPrice ?? 0),
  currency: plan.currency ?? "USD",
  planLimits: {
    maxUsers: plan.maxUsers ?? plan.planLimits?.maxUsers,
    maxWarehouses: plan.maxWarehouses ?? plan.planLimits?.maxWarehouses,
    maxProducts: plan.maxProducts ?? plan.planLimits?.maxProducts,
  },
});

const FALLBACK_PLANS = [
  {
    id: "plan_1",
    planType: "Básico",
    planPrice: "0.00",
    paymentFrequency: "None",
    planLimits: { maxUsers: 10, maxWarehouses: 5, maxProducts: 500 },
  },
  {
    id: "plan_2",
    planType: "Premium",
    planPrice: "5.99",
    paymentFrequency: "Monthly",
    planLimits: { maxUsers: 100, maxWarehouses: 20, maxProducts: 2000 },
  },
  {
    id: "plan_3",
    planType: "Enterprise",
    planPrice: "42.99",
    paymentFrequency: "Yearly",
    planLimits: { maxUsers: 200, maxWarehouses: 40, maxProducts: 20000 },
  },
];

onMounted(async () => {
  try {
    const response = await PlanService.getAllPlans();
    const raw = response.data;
    plans.value =
      Array.isArray(raw) && raw.length > 0
        ? raw.map(normalizePlan)
        : FALLBACK_PLANS;
  } catch (err) {
    console.error("Error loading plans:", err);
    plans.value = FALLBACK_PLANS;
  } finally {
    isLoading.value = false;
  }
});

const selectPlan = (id) => {
  selectedPlanId.value = id;
};

const continueToPayment = async () => {
  if (!selectedPlanId.value) return;
  isLoading.value = true;
  try {
    const accountId = localStorage.getItem("accountId");
    if (!accountId) {
      alert("No se encontró accountId");
      return;
    }
    await SubscriptionService.createSubscriptionForAccount(accountId, {
      selectedPlanId: selectedPlanId.value,
    });
    toast.add({
      severity: "success",
      summary: "Éxito",
      detail: "¡Suscripción activada con éxito!",
      life: 3000,
    });

    setTimeout(() => {
      router.push("/home");
    }, 1500);
  } catch (err) {
    console.error("Error subscribing:", err.response?.data);
    alert(
      "Error al suscribirse: " +
        (err.response?.data?.message || "Error desconocido"),
    );
  } finally {
    isLoading.value = false;
  }
};

const formatPrice = (priceStr) => {
  const price = parseFloat(priceStr);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const formatLimit = (value, unit) => {
  if (value >= 2147483647) return `${unit} Ilimitados`;
  return `Hasta ${value} ${unit}`;
};
</script>

<template>
  <div class="web-layout plan-layout">
    <div class="content-wrapper">
      <header class="page-header">
        <h1 class="page-title">{{ $t("subscriptions.choose_plan") }}</h1>
        <div class="title-underline"></div>
        <p class="page-subtitle">{{ $t("subscriptions.choose_subtitle") }}</p>
      </header>

      <div class="plans-container">
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="plan-card glass-panel"
          :class="{
            selected: selectedPlanId === plan.id,
            popular: plan.paymentFrequency === 'Monthly' && plan.planPrice > 0,
          }"
          @click="selectPlan(plan.id)"
        >
          <div class="badge-wrapper" v-if="plan.paymentFrequency === 'Yearly'">
            <span class="discount-badge">{{
              $t("subscriptions.save_badge")
            }}</span>
          </div>

          <div class="card-content">
            <h3 class="plan-type">{{ plan.planType.toUpperCase() }}</h3>

            <div class="price-block">
              <span class="price-val">{{ formatPrice(plan.planPrice) }}</span>
              <span class="price-freq">
                {{
                  plan.paymentFrequency === "Monthly"
                    ? "subscriptions.per_month"
                    : "subscriptions.per_year"
                }}
              </span>
            </div>

            <p class="plan-desc">{{ plan.description }}</p>

            <div class="divider"></div>

            <ul class="features-list">
              <li v-if="plan.planLimits?.maxUsers">
                <svg viewBox="0 0 24 24" class="check-icon">
                  <path
                    fill="currentColor"
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                  />
                </svg>
                <span>{{
                  formatLimit(plan.planLimits.maxUsers, "Usuarios")
                }}</span>
              </li>
              <li v-if="plan.planLimits?.maxWarehouses">
                <svg viewBox="0 0 24 24" class="check-icon">
                  <path
                    fill="currentColor"
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                  />
                </svg>
                <span>{{
                  formatLimit(plan.planLimits.maxWarehouses, "Almacenes")
                }}</span>
              </li>
              <li v-if="plan.planLimits?.maxProducts">
                <svg viewBox="0 0 24 24" class="check-icon">
                  <path
                    fill="currentColor"
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                  />
                </svg>
                <span>{{
                  formatLimit(plan.planLimits.maxProducts, "Productos")
                }}</span>
              </li>
              <li v-if="plan.planLimits?.storageGuides">
                <svg viewBox="0 0 24 24" class="check-icon">
                  <path
                    fill="currentColor"
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                  />
                </svg>
                <span>Guías de almacenamiento</span>
              </li>
              <li v-if="plan.planLimits?.premiumStorageGuides">
                <svg viewBox="0 0 24 24" class="check-icon">
                  <path
                    fill="currentColor"
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                  />
                </svg>
                <span>Guías premium</span>
              </li>
              <li v-if="plan.planLimits?.communitySupport">
                <svg viewBox="0 0 24 24" class="check-icon">
                  <path
                    fill="currentColor"
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                  />
                </svg>
                <span>Soporte comunitario</span>
              </li>
              <li v-if="plan.planLimits?.prioritySupport">
                <svg viewBox="0 0 24 24" class="check-icon">
                  <path
                    fill="currentColor"
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                  />
                </svg>
                <span>Soporte prioritario</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="bottom-action">
        <button
          class="pill-btn continue-btn"
          :disabled="!selectedPlanId || isLoading"
          @click="continueToPayment"
        >
          <span v-if="!isLoading">Continuar</span>
          <svg v-else class="spinner" viewBox="0 0 50 50">
            <circle
              class="path"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke-width="5"
            ></circle>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plan-layout {
  min-height: 100vh;
  background: linear-gradient(180deg, #2b000d 0%, #4a1b2a 100%);
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-wrapper {
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48px;
  text-align: center;
}
.page-title {
  font-size: 36px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0px;
  margin: 0 0 12px;
}
.title-underline {
  width: 120px;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, #e53e3e 0%, #ff7676 100%);
  margin-bottom: 20px;
}
.page-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.plans-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.plan-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.plan-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
}

.plan-card.selected {
  border: 2px solid #e53e3e;
  background: rgba(229, 62, 62, 0.05);
  box-shadow: 0 20px 48px rgba(229, 62, 62, 0.2);
  transform: translateY(-8px);
}

.plan-card.popular {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
}

.badge-wrapper {
  position: absolute;
  top: 16px;
  right: 16px;
}
.discount-badge {
  background: #e53e3e;
  color: #ffffff;
  font-size: 12px;
  font-weight: 800;
  padding: 6px 12px;
  border-radius: 12px;
  letter-spacing: 0.5px;
}

.card-content {
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.plan-type {
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 2px;
  margin: 0 0 16px;
}

.price-block {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 8px;
}
.price-val {
  font-size: 40px;
  font-weight: 800;
  color: #ffffff;
}
.price-freq {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 6px;
}

.plan-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 24px;
  min-height: 40px;
  font-weight: 500;
}

.divider {
  width: 80%;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 24px;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}
.features-list li {
  display: flex;
  align-items: center;
  gap: 12px;
}
.check-icon {
  width: 20px;
  height: 20px;
  color: #81c784;
  flex-shrink: 0;
}
.features-list span {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.bottom-action {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}
.pill-btn {
  width: 100%;
  padding: 18px 24px;
  border-radius: 28px;
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
}
.continue-btn {
  background: #e53e3e;
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(229, 62, 62, 0.4);
}
.continue-btn:hover:not(:disabled) {
  background: #ff4f4f;
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(229, 62, 62, 0.6);
}
.continue-btn:disabled {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.3);
  box-shadow: none;
  cursor: not-allowed;
}

.spinner {
  animation: rotate 2s linear infinite;
  width: 28px;
  height: 28px;
}
.spinner .path {
  stroke: #ffffff;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}
@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
