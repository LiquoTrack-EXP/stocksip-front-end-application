import { createRouter, createWebHistory } from "vue-router";
import LoginComponent from "@/features/authentication/login/login.component.vue";
import RegisterComponent from "@/features/authentication/register/register.component.vue";
import { PageNotFoundComponent, SideNavbarComponent } from "@/shared/components";
import HomeComponent from "@/features/home/home.component.vue";
import WarehouseComponent from "@/features/inventorymanagement/warehouse/warehouse.component.vue";
import WarehouseEditComponent from "@/features/inventorymanagement/warehouse/warehouse-edit.component.vue";
import WarehousesCreateComponent from "@/features/inventorymanagement/warehouse/warehouses-create.component.vue";
import CareGuideComponent from "@/features/inventorymanagement/careguide/careguide.component.vue";
import CareGuideCreateComponent from "@/features/inventorymanagement/careguide/careguide-create.component.vue";
import CareGuideEditComponent from "@/features/inventorymanagement/careguide/careguide-edit.component.vue";
import CareGuideDetailComponent from "@/features/inventorymanagement/careguide/careguide-detail.component.vue";
import ProfileComponent from "@/features/profilemanagement/profile/profile.component.vue";
import StorageComponent from "@/features/inventorymanagement/storage/storage.component.vue";
import ProductCreateComponent from "@/features/inventorymanagement/storage/product-create.component.vue";
import ProductEditComponent from "@/features/inventorymanagement/storage/product-edit.component.vue";
import ProductDetailComponent from "@/features/inventorymanagement/storage/product-detail.component.vue";
import AdminPanelComponent from "@/features/authentication/adminpanel/adminpanel.component.vue";
import AdminPanelViewComponent from "@/features/authentication/adminpanel/adminpanel-view.component.vue";
import AdminPanelEditComponent from "@/features/authentication/adminpanel/adminpanel-edit.component.vue";
import AdminPanelCreateComponent from "@/features/authentication/adminpanel/adminpanel-create.component.vue";
import InventoryComponent from "@/features/inventorymanagement/inventories/inventory.component.vue";
import InventoryAdditionComponent from "@/features/inventorymanagement/inventories/inventory-addition.component.vue";
import InventorySubtrackComponent from "@/features/inventorymanagement/inventories/inventory-subtrack.component.vue";
import InventoryTransferComponent from "@/features/inventorymanagement/inventories/inventory-transfer.component.vue";
import InventoryDetailComponent from "@/features/inventorymanagement/inventories/inventory-detail.component.vue";
import SupplierSearchComponent from "@/features/procurementordering/suppliercatalogs/supplier-search.component.vue";
import SupplierCatalogComponent from "@/features/procurementordering/suppliercatalogs/supplier-catalog.component.vue";
import SupplierCatalogDetailComponent from "@/features/procurementordering/suppliercatalogs/supplier-catalog-detail.component.vue";
import CatalogItemDetailsComponent from "@/features/procurementordering/suppliercatalogs/catalog-item-details.component.vue";
import CatalogCreateEditComponent from "@/features/procurementordering/suppliercatalogs/catalog-create-edit.component.vue";
import CatalogListComponent from "@/features/procurementordering/suppliercatalogs/catalog-list.component.vue";
import CartComponent from "@/features/procurementordering/purchaseorders/cart.component.vue";
import SubscriptionsComponent from "@/features/paymentsandsubscriptions/subscriptions/subscriptions.component.vue";
import PurchaseOrderComponent from "@/features/ordermanagement/purchaseorder.component.vue";
import SupplierSalesOrderComponent from "@/features/ordermanagement/suppliersalesorder.component.vue";
import AccountComponent from "@/features/paymentsandsubscriptions/accounts/account.component.vue";
import PlanComponent from "@/features/paymentsandsubscriptions/plans/plan.component.vue";

const routes = [
  {
    path: "/",
    redirect: "/sign-in",
  },
  {
    path: "/sign-in",
    name: "sign-in",
    component: LoginComponent,
  },
  {
    path: "/sign-up",
    name: "sing-up",
    component: RegisterComponent,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: PageNotFoundComponent,
  },
  {
    path: "/home",
    name: "home",
    component: HomeComponent,
  },
  {
    path: "/warehouses",
    name: "warehouses",
    component: WarehouseComponent,
  },
  {
    path: "/warehouses/create",
    name: "warehouses-create",
    component: WarehousesCreateComponent,
  },
  {
    path: "/warehouses/edit/:warehouseId",
    name: "warehouses-edit",
    component: WarehouseEditComponent,
  },
  {
    path: "/care-guides",
    name: "careguide",
    component: CareGuideComponent,
  },
  {
    path: "/care-guides/create",
    name: "careguide-create",
    component: CareGuideCreateComponent,
  },
  {
    path: "/care-guides/edit/:id",
    name: "careguide-edit",
    component: CareGuideEditComponent,
  },
  {
    path: "/care-guides/detail/:id",
    name: "careguide-detail",
    component: CareGuideDetailComponent,
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileComponent,
  },
  {
    path: "/storage",
    name: "storage",
    component: StorageComponent,
  },
  {
    path: "/storage/create",
    name: "product-create",
    component: ProductCreateComponent,
  },
  {
    path: "/storage/edit/:productId",
    name: "product-edit",
    component: ProductEditComponent,
  },
  {
    path: "/product_detail/:productId",
    name: "product-detail",
    component: ProductDetailComponent,
  },
  {
    path: "/admin-panel",
    name: "admin-panel",
    component: AdminPanelComponent,
  },
  {
    path: "/admin-panel/view/:id",
    name: "admin-panel-view",
    component: AdminPanelViewComponent,
  },
  {
    path: "/admin-panel/edit/:id",
    name: "admin-panel-edit",
    component: AdminPanelEditComponent,
  },
  {
    path: "/admin-panel/create",
    name: "admin-panel-create",
    component: AdminPanelCreateComponent,
  },
  {
    path: "/warehouse_inventory/:warehouseId",
    name: "warehouse-inventory",
    component: InventoryComponent,
  },
  {
    path: "/inventory_addition/:warehouseId",
    name: "inventory-addition",
    component: InventoryAdditionComponent,
  },
  {
    path: "/inventory_subtrack/:warehouseId",
    name: "inventory-subtrack",
    component: InventorySubtrackComponent,
  },
  {
    path: "/inventory_transfer/:warehouseId",
    name: "inventory-transfer",
    component: InventoryTransferComponent,
  },
  {
    path: "/inventory_detail/:inventoryId",
    name: "inventory-detail",
    component: InventoryDetailComponent,
  },
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
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
