import httpClient from '@/shared/infrastructure/axios.js';

/**
 * Service WarehouseService
 */
export const WarehouseService = {
  /**
   * getAccountWarehouses
   * @param {any} accountId
   * @public
   */
  getAccountWarehouses(accountId) {
    return httpClient.get(import.meta.env.VITE_API_ACCOUNT_WAREHOUSES.replace('{accountId}', accountId));
  },
  /**
   * getWarehouse
   * @param {any} warehouseId
   * @public
   */
  getWarehouse(warehouseId) {
    return httpClient.get(import.meta.env.VITE_API_WAREHOUSE_DETAILS.replace('{warehouseId}', warehouseId));
  },
  /**
   * registerWarehouse
   * @param {any} accountId
   * @param {any} formData
   * @public
   */
  registerWarehouse(accountId, formData) {
    return httpClient.post(import.meta.env.VITE_API_ACCOUNT_WAREHOUSES.replace('{accountId}', accountId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  /**
   * updateWarehouse
   * @param {any} warehouseId
   * @param {any} formData
   * @public
   */
  updateWarehouse(warehouseId, formData) {
    return httpClient.put(import.meta.env.VITE_API_WAREHOUSE_DETAILS.replace('{warehouseId}', warehouseId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  /**
   * deleteWarehouse
   * @param {any} warehouseId
   * @public
   */
  deleteWarehouse(warehouseId) {
    return httpClient.delete(import.meta.env.VITE_API_WAREHOUSE_DETAILS.replace('{warehouseId}', warehouseId));
  },
  /**
   * getWarehouseProducts
   * @param {any} warehouseId
   * @public
   */
  getWarehouseProducts(warehouseId) {
    return httpClient.get(import.meta.env.VITE_API_WAREHOUSE_PRODUCTS.replace('{warehouseId}', warehouseId));
  },
  /**
   * getWarehouseExits
   * @param {any} warehouseId
   * @public
   */
  getWarehouseExits(warehouseId) {
    return httpClient.get(import.meta.env.VITE_API_WAREHOUSE_EXITS.replace('{warehouseId}', warehouseId));
  },
  /**
   * getWarehouseProductExits
   * @param {any} warehouseId
   * @param {any} productId
   * @param {any} expirationDate
   * @public
   */
  getWarehouseProductExits(warehouseId, productId, expirationDate) {
    let url = import.meta.env.VITE_API_WAREHOUSE_PRODUCT_EXITS.replace('{warehouseId}', warehouseId).replace('{productId}', productId);
    if (expirationDate) url += `?expirationDate=${expirationDate}`;
    return httpClient.get(url);
  },
  /**
   * getWarehouseTransfers
   * @param {any} warehouseId
   * @public
   */
  getWarehouseTransfers(warehouseId) {
    return httpClient.get(import.meta.env.VITE_API_WAREHOUSE_TRANSFERS.replace('{warehouseId}', warehouseId));
  }
};

export const InventoryService = {
  /**
   * getInventoryById
   * @param {any} inventoryId
   * @public
   */
  getInventoryById(inventoryId) {
    return httpClient.get(import.meta.env.VITE_API_INVENTORY_DETAILS.replace('{inventoryId}', inventoryId));
  },
  /**
   * deleteInventory
   * @param {any} inventoryId
   * @public
   */
  deleteInventory(inventoryId) {
    return httpClient.delete(import.meta.env.VITE_API_INVENTORY_DETAILS.replace('{inventoryId}', inventoryId));
  },
  /**
   * getInventoryDetails
   * @param {any} warehouseId
   * @param {any} productId
   * @param {any} expirationDate
   * @public
   */
  getInventoryDetails(warehouseId, productId, expirationDate) {
    let url = import.meta.env.VITE_API_INVENTORY_PRODUCT_DETAILS.replace('{warehouseId}', warehouseId).replace('{productId}', productId);
    if (expirationDate) url += `?expirationDate=${expirationDate}`;
    return httpClient.get(url);
  },
  /**
   * addProducts
   * @param {any} warehouseId
   * @param {any} productId
   * @param {any} data
   * @public
   */
  addProducts(warehouseId, productId, data) {

    return httpClient.post(import.meta.env.VITE_API_INVENTORY_ADDITIONS.replace('{warehouseId}', warehouseId).replace('{productId}', productId), data);
  },
  /**
   * subtractProducts
   * @param {any} warehouseId
   * @param {any} productId
   * @param {any} data
   * @public
   */
  subtractProducts(warehouseId, productId, data) {

    return httpClient.post(import.meta.env.VITE_API_INVENTORY_SUBTRACTIONS.replace('{warehouseId}', warehouseId).replace('{productId}', productId), data);
  },
  /**
   * transferProducts
   * @param {any} warehouseId
   * @param {any} productId
   * @param {any} data
   * @public
   */
  transferProducts(warehouseId, productId, data) {

    return httpClient.post(import.meta.env.VITE_API_INVENTORY_TRANSFERS.replace('{warehouseId}', warehouseId).replace('{productId}', productId), data);
  }
};

export const ProductService = {
  /**
   * getAccountProducts
   * @param {any} accountId
   * @public
   */
  getAccountProducts(accountId) {
    return httpClient.get(import.meta.env.VITE_API_ACCOUNT_PRODUCTS.replace('{accountId}', accountId));
  },
  /**
   * registerProduct
   * @param {any} accountId
   * @param {any} formData
   * @public
   */
  registerProduct(accountId, formData) {
    return httpClient.post(import.meta.env.VITE_API_ACCOUNT_PRODUCTS.replace('{accountId}', accountId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  /**
   * getProductById
   * @param {any} id
   * @public
   */
  getProductById(id) {
    return httpClient.get(import.meta.env.VITE_API_PRODUCT_DETAILS.replace('{id}', id));
  },
  /**
   * updateProduct
   * @param {any} id
   * @param {any} formData
   * @public
   */
  updateProduct(id, formData) {
    return httpClient.put(import.meta.env.VITE_API_PRODUCT_DETAILS.replace('{id}', id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  /**
   * deleteProduct
   * @param {any} id
   * @public
   */
  deleteProduct(id) {
    return httpClient.delete(import.meta.env.VITE_API_PRODUCT_DETAILS.replace('{id}', id));
  },
  /**
   * updateMinimumStock
   * @param {any} id
   * @param {any} newMinimumStock
   * @public
   */
  updateMinimumStock(id, newMinimumStock) {
    return httpClient.patch(import.meta.env.VITE_API_PRODUCT_MIN_STOCK.replace('{id}', id), { newMinimumStock });
  },
  /**
   * getProductExits
   * @param {any} productId
   * @public
   */
  getProductExits(productId) {
    return httpClient.get(import.meta.env.VITE_API_PRODUCT_EXITS.replace('{productId}', productId));
  },
  /**
   * getProductTransfers
   * @param {any} productId
   * @public
   */
  getProductTransfers(productId) {
    return httpClient.get(import.meta.env.VITE_API_PRODUCT_TRANSFERS.replace('{productId}', productId));
  },
  /**
   * getCareGuideByProductId
   * @param {any} id
   * @public
   */
  getCareGuideByProductId(id) {
    return httpClient.get(import.meta.env.VITE_API_PRODUCT_CARE_GUIDE.replace('{id}', id));
  },
  /**
   * getProductsBySupplier
   * @param {any} supplierId
   * @public
   */
  getProductsBySupplier(supplierId) {
    return httpClient.get(`${import.meta.env.VITE_API_PRODUCTS_BY_SUPPLIER}?supplierId=${supplierId}`);
  },
  /**
   * getAllBrands
   * @public
   */
  getAllBrands() {
    return httpClient.get(import.meta.env.VITE_API_BRANDS);
  },
  /**
   * getAllProductTypes
   * @public
   */
  getAllProductTypes() {
    return httpClient.get(import.meta.env.VITE_API_PRODUCT_TYPES);
  }
};

export const CareGuideService = {
  /**
   * getCareGuideById
   * @param {any} careGuideId
   * @public
   */
  getCareGuideById(careGuideId) {
    return httpClient.get(import.meta.env.VITE_API_CARE_GUIDE_DETAILS.replace('{careGuideId}', careGuideId));
  },
  /**
   * updateCareGuide
   * @param {any} careGuideId
   * @param {any} data
   * @public
   */
  updateCareGuide(careGuideId, data) {
    return httpClient.put(import.meta.env.VITE_API_CARE_GUIDE_DETAILS.replace('{careGuideId}', careGuideId), data);
  },
  /**
   * deleteCareGuide
   * @param {any} careGuideId
   * @public
   */
  deleteCareGuide(careGuideId) {
    return httpClient.delete(import.meta.env.VITE_API_CARE_GUIDE_DETAILS.replace('{careGuideId}', careGuideId));
  },
  /**
   * uploadCareGuideFile
   * @param {any} careGuideId
   * @param {any} file
   * @public
   */
  uploadCareGuideFile(careGuideId, file) {
    const formData = new FormData();
    formData.append('File', file);
    return httpClient.post(import.meta.env.VITE_API_CARE_GUIDE_FILE.replace('{careGuideId}', careGuideId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  /**
   * createCareGuide
   * @param {any} accountId
   * @param {any} data
   * @public
   */
  createCareGuide(accountId, data) {
    return httpClient.post(import.meta.env.VITE_API_CARE_GUIDE_CREATE.replace('{accountId}', accountId), data);
  },
  /**
   * getAccountCareGuides
   * @param {any} accountId
   * @public
   */
  getAccountCareGuides(accountId) {
    return httpClient.get(import.meta.env.VITE_API_ACCOUNT_CARE_GUIDES.replace('{accountId}', accountId));
  },
  /**
   * getCareGuideByProductType
   * @param {any} accountId
   * @param {any} productType
   * @public
   */
  getCareGuideByProductType(accountId, productType) {
    let url = import.meta.env.VITE_API_CARE_GUIDE_BY_PRODUCT_TYPE.replace('{accountId}', accountId).replace('{productType}', productType);
    return httpClient.get(url);
  },
  /**
   * unassignCareGuide
   * @param {any} careGuideId
   * @public
   */
  unassignCareGuide(careGuideId) {
    return httpClient.put(import.meta.env.VITE_API_CARE_GUIDE_DEALLOCATIONS.replace('{careGuideId}', careGuideId));
  },
  /**
   * assignCareGuide
   * @param {any} careGuideId
   * @param {any} productId
   * @public
   */
  assignCareGuide(careGuideId, productId) {
    let url = import.meta.env.VITE_API_CARE_GUIDE_ALLOCATIONS.replace('{careGuideId}', careGuideId).replace('{productId}', productId);
    return httpClient.put(url);
  }
};
