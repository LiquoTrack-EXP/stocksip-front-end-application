import httpClient from '@/shared/infrastructure/axios.js';


/**
 * Service CatalogService
 */
export const CatalogService = {
  
  /**
   * getAllCatalogsByAccount
   * @param {any} accountId
   * @public
   */
  getAllCatalogsByAccount(accountId) {
    return httpClient.get(`/accounts/${accountId}/catalogs`);
  },

  
  /**
   * getCatalogsWithBusiness
   * @param {any} accountId
   * @public
   */
  getCatalogsWithBusiness(accountId) {
    const url = accountId
      ? `/catalogs/with-business?accountId=${accountId}`
      : '/catalogs/with-business';
    return httpClient.get(url);
  },

  
  /**
   * getPublishedCatalogs
   * @public
   */
  getPublishedCatalogs() {
    return httpClient.get('/catalogs/published');
  },

  
  /**
   * getAllCatalogs
   * @public
   */
  getAllCatalogs() {
    return httpClient.get('/catalogs');
  },

  
  /**
   * getCatalogById
   * @param {any} catalogId
   * @public
   */
  getCatalogById(catalogId) {
    return httpClient.get(`/catalogs/${catalogId}`);
  },

  
  /**
   * createCatalogForAccount
   * @param {any} accountId
   * @param {any} data
   * @public
   */
  createCatalogForAccount(accountId, data) {
    return httpClient.post(`/accounts/${accountId}/catalogs`, data);
  },

  
  /**
   * updateCatalog
   * @param {any} catalogId
   * @param {any} data
   * @public
   */
  updateCatalog(catalogId, data) {
    return httpClient.put(`/catalogs/${catalogId}`, data);
  },

  
  /**
   * publishCatalog
   * @param {any} catalogId
   * @public
   */
  publishCatalog(catalogId) {
    return httpClient.put(`/catalogs/${catalogId}/publications`);
  },

  
  /**
   * unpublishCatalog
   * @param {any} catalogId
   * @public
   */
  unpublishCatalog(catalogId) {
    return httpClient.delete(`/catalogs/${catalogId}/publications`);
  },

  
  /**
   * addItemToCatalog
   * @param {any} catalogId
   * @param {any} data
   * @public
   */
  addItemToCatalog(catalogId, data) {
    return httpClient.post(`/catalogs/${catalogId}/items`, data);
  },

  
  /**
   * removeItemFromCatalog
   * @param {any} catalogId
   * @param {any} productId
   * @public
   */
  removeItemFromCatalog(catalogId, productId) {
    return httpClient.delete(`/catalogs/${catalogId}/items/${productId}`);
  },
};
