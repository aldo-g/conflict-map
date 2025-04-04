/**
 * Data Loader Module
 * 
 * Responsible for fetching and processing conflict data.
 */

// Private functions moved outside the exported object (module scope)
const _validateData = (data) => {
    // Basic validation to ensure data has required properties
    if (!Array.isArray(data)) {
      throw new Error('Conflict data must be an array');
    }
    
    // Validate each conflict entry
    data.forEach((conflict, index) => {
      if (!conflict.id) {
        console.warn(`Conflict at index ${index} is missing an id`);
      }
      if (!conflict.name) {
        console.warn(`Conflict at index ${index} is missing a name`);
      }
      if (!conflict.location || !conflict.location.lat || !conflict.location.lng) {
        console.warn(`Conflict at index ${index} is missing valid location coordinates`);
      }
    });
    
    return data;
  };
  
  // Exported object with public methods
  export const DataLoader = {
    /**
     * Loads conflict data from a JSON source
     * @param {string} dataUrl - URL to the conflict JSON data
     * @returns {Promise<Array>} - Array of conflict data objects
     */
    loadConflictData: async function(dataUrl) {
      try {
        const response = await fetch(dataUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return _validateData(data);
      } catch (error) {
        console.error('Error loading conflict data:', error);
        // Return an empty array as fallback
        return [];
      }
    },
    
    /**
     * Updates the existing conflict data with new data (e.g., from an API)
     * @param {Array} existingData - Current conflict data
     * @param {Array} newData - New conflict data to merge
     * @returns {Array} - Updated conflict data
     */
    updateConflictData: function(existingData, newData) {
      if (!Array.isArray(existingData) || !Array.isArray(newData)) {
        console.error('Both existing and new data must be arrays');
        return existingData;
      }
      
      // Merge the data based on conflict IDs
      const mergedData = [...existingData];
      const existingIds = new Set(existingData.map(item => item.id));
      
      newData.forEach(newItem => {
        if (existingIds.has(newItem.id)) {
          // Update existing item
          const index = mergedData.findIndex(item => item.id === newItem.id);
          mergedData[index] = { ...mergedData[index], ...newItem };
        } else {
          // Add new item
          mergedData.push(newItem);
        }
      });
      
      return _validateData(mergedData);
    }
  };