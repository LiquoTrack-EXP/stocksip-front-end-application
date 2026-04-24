import httpClient from '@/api/axios';





/**
 * Service CatalogService
 */
export const CatalogService = {
  /**
   * getCatalogById
   * @param {any} catalogId
   * @public
   */
  getCatalogById(catalogId) {
    return httpClient.get(import.meta.env.VITE_API_CATALOG_DETAILS.replace('{catalogId}', catalogId));
  },
  /**
   * updateCatalog
   * @param {any} catalogId
   * @param {any} data
   * @public
   */
  updateCatalog(catalogId, data) {
    return httpClient.put(import.meta.env.VITE_API_CATALOG_DETAILS.replace('{catalogId}', catalogId), data);
  },
  /**
   * getAllCatalogs
   * @public
   */
  getAllCatalogs() {
    return httpClient.get(import.meta.env.VITE_API_CATALOGS);
  },
  /**
   * getPublishedCatalogs
   * @public
   */
  getPublishedCatalogs() {
    return httpClient.get(import.meta.env.VITE_API_CATALOGS_PUBLISHED);
  },
  /**
   * publishCatalog
   * @param {any} catalogId
   * @public
   */
  publishCatalog(catalogId) {
    return httpClient.put(import.meta.env.VITE_API_CATALOG_PUBLICATIONS.replace('{catalogId}', catalogId));
  },
  /**
   * unpublishCatalog
   * @param {any} catalogId
   * @public
   */
  unpublishCatalog(catalogId) {
    return httpClient.delete(import.meta.env.VITE_API_CATALOG_PUBLICATIONS.replace('{catalogId}', catalogId));
  },
  /**
   * addItemToCatalog
   * @param {any} catalogId
   * @param {any} data
   * @public
   */
  addItemToCatalog(catalogId, data) {

    return httpClient.post(import.meta.env.VITE_API_CATALOG_ITEMS.replace('{catalogId}', catalogId), data);
  },
  /**
   * removeItemFromCatalog
   * @param {any} catalogId
   * @param {any} productId
   * @public
   */
  removeItemFromCatalog(catalogId, productId) {
    return httpClient.delete(import.meta.env.VITE_API_CATALOG_ITEM_REMOVE.replace('{catalogId}', catalogId).replace('{productId}', productId));
  },
  /**
   * getAccountWithBusiness
   * @param {any} accountId
   * @public
   */
  getAccountWithBusiness(accountId) {
    return httpClient.get(`${import.meta.env.VITE_API_CATALOGS_WITH_BUSINESS}?accountId=${accountId}`);
  },
  /**
   * createCatalogForAccount
   * @param {any} accountId
   * @param {any} data
   * @public
   */
  createCatalogForAccount(accountId, data) {
    return httpClient.post(import.meta.env.VITE_API_ACCOUNT_CATALOGS.replace('{accountId}', accountId), data);
  },
  /**
   * getAllCatalogsByAccount
   * @param {any} accountId
   * @public
   */
  getAllCatalogsByAccount(accountId) {
    return httpClient.get(import.meta.env.VITE_API_ACCOUNT_CATALOGS.replace('{accountId}', accountId));
  }
};

export const PurchaseOrderService = {
  /**
   * getPurchaseOrderById
   * @param {any} purchaseOrderId
   * @public
   */
  getPurchaseOrderById(purchaseOrderId) {
    return httpClient.get(import.meta.env.VITE_API_PURCHASE_ORDER_DETAILS.replace('{purchaseOrderId}', purchaseOrderId));
  },
  /**
   * getAllPurchaseOrders
   * @public
   */
  getAllPurchaseOrders() {
    return httpClient.get(import.meta.env.VITE_API_PURCHASE_ORDERS);
  },
  /**
   * addItemToPurchaseOrder
   * @param {any} purchaseOrderId
   * @param {any} data
   * @public
   */
  addItemToPurchaseOrder(purchaseOrderId, data) {

    return httpClient.post(import.meta.env.VITE_API_PURCHASE_ORDER_ITEMS.replace('{purchaseOrderId}', purchaseOrderId), data);
  },
  /**
   * removeItemFromPurchaseOrder
   * @param {any} purchaseOrderId
   * @param {any} productId
   * @public
   */
  removeItemFromPurchaseOrder(purchaseOrderId, productId) {
    return httpClient.delete(import.meta.env.VITE_API_PURCHASE_ORDER_ITEM_REMOVE.replace('{purchaseOrderId}', purchaseOrderId).replace('{productId}', productId));
  },
  /**
   * confirmPurchaseOrder
   * @param {any} purchaseOrderId
   * @public
   */
  confirmPurchaseOrder(purchaseOrderId) {
    return httpClient.put(import.meta.env.VITE_API_PURCHASE_ORDER_CONFIRMATIONS.replace('{purchaseOrderId}', purchaseOrderId));
  },
  /**
   * shipPurchaseOrder
   * @param {any} purchaseOrderId
   * @public
   */
  shipPurchaseOrder(purchaseOrderId) {
    return httpClient.put(import.meta.env.VITE_API_PURCHASE_ORDER_SHIPMENTS.replace('{purchaseOrderId}', purchaseOrderId));
  },
  /**
   * receivePurchaseOrder
   * @param {any} purchaseOrderId
   * @public
   */
  receivePurchaseOrder(purchaseOrderId) {
    return httpClient.put(import.meta.env.VITE_API_PURCHASE_ORDER_RECEPTIONS.replace('{purchaseOrderId}', purchaseOrderId));
  },
  /**
   * cancelPurchaseOrder
   * @param {any} purchaseOrderId
   * @public
   */
  cancelPurchaseOrder(purchaseOrderId) {
    return httpClient.put(import.meta.env.VITE_API_PURCHASE_ORDER_CANCELLATIONS.replace('{purchaseOrderId}', purchaseOrderId));
  },
  /**
   * createPurchaseOrderForAccount
   * @param {any} accountId
   * @param {any} data
   * @public
   */
  createPurchaseOrderForAccount(accountId, data) {
    return httpClient.post(import.meta.env.VITE_API_ACCOUNT_PURCHASE_ORDERS.replace('{accountId}', accountId), data);
  },
  /**
   * getAllPurchaseOrdersByAccount
   * @param {any} accountId
   * @public
   */
  getAllPurchaseOrdersByAccount(accountId) {
    return httpClient.get(import.meta.env.VITE_API_ACCOUNT_PURCHASE_ORDERS.replace('{accountId}', accountId));
  }
};
