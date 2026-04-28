import { createRouter, createWebHistory } from "vue-router";

import { PageNotFoundComponent } from "@/shared/presentation/components/index.js";
import HomeComponent from "@/shared/presentation/views/home.component.vue";
import WarehouseComponent from "@/inventorymanagement/warehouse/warehouse.component.vue";
import WarehouseEditComponent from "@/inventorymanagement/warehouse/warehouse-edit.component.vue";
import WarehousesCreateComponent from "@/inventorymanagement/warehouse/warehouses-create.component.vue";
import CareGuideComponent from "@/inventorymanagement/careguide/careguide.component.vue";
import CareGuideCreateComponent from "@/inventorymanagement/careguide/careguide-create.component.vue";
import ProfileComponent from "@/profiles/profile/profile.component.vue";
import StorageComponent from "@/inventorymanagement/storage/storage.component.vue";
import ProductCreateComponent from "@/inventorymanagement/storage/product-create.component.vue";
import ProductEditComponent from "@/inventorymanagement/storage/product-edit.component.vue";
import ProductDetailComponent from "@/inventorymanagement/storage/product-detail.component.vue";
import InventoryComponent from "@/inventorymanagement/inventories/inventory.component.vue";
import InventoryAdditionComponent from "@/inventorymanagement/inventories/inventory-addition.component.vue";
import InventorySubtrackComponent from "@/inventorymanagement/inventories/inventory-subtrack.component.vue";
import InventoryTransferComponent from "@/inventorymanagement/inventories/inventory-transfer.component.vue";
import InventoryDetailComponent from "@/inventorymanagement/inventories/inventory-detail.component.vue";
import SupplierSearchComponent from "@/procurement/suppliercatalogs/supplier-search.component.vue";
import SupplierCatalogComponent from "@/procurement/suppliercatalogs/supplier-catalog.component.vue";
import SupplierCatalogDetailComponent from "@/procurement/suppliercatalogs/supplier-catalog-detail.component.vue";
import CatalogItemDetailsComponent from "@/procurement/suppliercatalogs/catalog-item-details.component.vue";
import CatalogCreateEditComponent from "@/procurement/suppliercatalogs/catalog-create-edit.component.vue";
import CatalogListComponent from "@/procurement/suppliercatalogs/catalog-list.component.vue";
import CartComponent from "@/procurement/purchaseorders/cart.component.vue";
import SubscriptionsComponent from "@/subscriptions/subscriptions/subscriptions.component.vue";
import PurchaseOrderComponent from "@/orders/purchaseorder.component.vue";
import SupplierSalesOrderComponent from "@/orders/suppliersalesorder.component.vue";
import AccountComponent from "@/subscriptions/accounts/account.component.vue";
import PlanComponent from "@/subscriptions/plans/plan.component.vue";

import iamRoutes from "@/iam/presentation/iam-routes.js";
import {authenticationGuard} from "@/iam/infrastructure/guards/authentication.guard.js";

/**
 * Routes for the application.
 */
const routes = [
    { path: "/", redirect: "/sign-in" },
    { path: "/:pathMatch(.*)*", name: "not-found", component: PageNotFoundComponent, meta: { title: 'Page Not Found' } },
    { path: "/home", name: "home", component: HomeComponent, },
    { path: "/warehouses", name: "warehouses", component: WarehouseComponent, },
    { path: "/warehouses/create", name: "warehouses-create", component: WarehousesCreateComponent, },
    { path: "/warehouses/edit/:warehouseId", name: "warehouses-edit", component: WarehouseEditComponent, },
    { path: "/care-guides", name: "careguide", component: CareGuideComponent, },
    { path: "/care-guides/create", name: "careguide-create", component: CareGuideCreateComponent, },
    { path: "/profile", name: "profile", component: ProfileComponent, },
    { path: "/storage", name: "storage", component: StorageComponent, },
    { path: "/storage/create", name: "product-create", component: ProductCreateComponent, },
    { path: "/storage/edit/:productId", name: "product-edit", component: ProductEditComponent, },
    { path: "/product_detail/:productId", name: "product-detail", component: ProductDetailComponent, },
    { path: "/warehouse_inventory/:warehouseId", name: "warehouse-inventory", component: InventoryComponent, },
    { path: "/inventory_addition/:warehouseId", name: "inventory-addition", component: InventoryAdditionComponent, },
    { path: "/inventory_subtrack/:warehouseId", name: "inventory-subtrack", component: InventorySubtrackComponent, },
    { path: "/inventory_transfer/:warehouseId", name: "inventory-transfer", component: InventoryTransferComponent, },
    { path: "/inventory_detail/:inventoryId", name: "inventory-detail", component: InventoryDetailComponent, },
    { path: "/supplier-search", name: "supplier-search", component: SupplierSearchComponent },
    { path: "/supplier-catalog/:id", name: "supplier-catalog", component: SupplierCatalogComponent },
    { path: "/supplier-catalog-detail/:id", name: "supplier-catalog-detail", component: SupplierCatalogDetailComponent },
    { path: "/catalog-item/:catalogId/:productId", name: "catalog-item-details", component: CatalogItemDetailsComponent },
    { path: "/catalogs", name: "catalogs", component: CatalogListComponent },
    { path: "/catalogs/new", name: "catalog-create", component: CatalogCreateEditComponent },
    { path: "/catalogs/edit/:id", name: "catalog-edit", component: CatalogCreateEditComponent },
    { path: "/cart", name: "cart", component: CartComponent },
    { path: "/subscriptions", name: "subscriptions", component: SubscriptionsComponent },
    { path: "/orders", name: "orders", component: PurchaseOrderComponent },
    { path: "/supplier-orders", name: "supplier-orders", component: SupplierSalesOrderComponent },
    { path: "/account", name: "account", component: AccountComponent },
    { path: "/plans", name: "plans", component: PlanComponent },
    { path: '/iam',             name: 'iam',            children: iamRoutes },
];

/**
 * Vue Router instance for the application.
 * Configures routes for IAM, Publishing, and Shared bounded contexts.
 */
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  let baseTitle = 'ACME Learning Center';
  document.title = `${to.meta["title"]} | ${baseTitle}`;
  authenticationGuard(to, from, next);
});

export default router;
