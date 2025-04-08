/**
 * Data Loader Module
 * 
 * Responsible for fetching and processing conflict data.
 */

import * as d3 from 'd3';

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
   * Loads conflict data from a CSV file
   * @param {string} csvUrl - URL to the CSV conflict data
   * @returns {Promise<Array>} - Array of conflict data objects
   */
  loadCSVConflictData: async function(csvUrl) {
    try {
      // Load CSV using d3's built-in CSV parser
      const csvData = await d3.csv(csvUrl);
      
      // Transform CSV data to match the expected format for the map
      const transformedData = csvData.map((row, index) => {
        // Generate a unique ID if one is not provided
        const id = `conflict-${index}`;
        
        // Map the intensity level from index_level
        let intensity = 'moderate';
        if (row.index_level === 'Extreme') {
          intensity = 'high';
        } else if (row.index_level === 'High') {
          intensity = 'moderate';
        } else if (row.index_level === 'Turbulent') {
          intensity = 'minor';
        }
        
        // Create a description from the metrics
        const description = `This country has experienced ${row.deadliness} fatalities in the past 12 months, with ${row.danger} violence targeting civilian events. ${row.diffusion * 100}% of inhabited areas have high levels of political violence. ${row.fragmentation} armed groups are active in the country.`;
        
        // Generate conflict data object
        return {
          id: id,
          name: `${row.country} Conflict`,
          type: determineConflictType(row),
          intensity: intensity,
          duration: 'ongoing',
          region: determineRegion(row.country),
          location: {
            lat: parseFloat(row.lat),
            lng: parseFloat(row.lng)
          },
          casualties: parseInt(row.deadliness),
          startDate: '2024-01-01', // Default to recent
          description: description,
          actors: [`Government of ${row.country}`, `Armed groups (${row.fragmentation})`],
          // Add additional metrics from the data
          metrics: {
            deadliness: parseInt(row.deadliness),
            diffusion: parseFloat(row.diffusion),
            danger: parseInt(row.danger),
            fragmentation: parseInt(row.fragmentation)
          }
        };
      });
      
      return _validateData(transformedData);
    } catch (error) {
      console.error('Error loading or parsing CSV conflict data:', error);
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

/**
 * Helper function to determine conflict type based on metrics
 * @param {Object} data - Row data from CSV
 * @returns {string} - Conflict type
 */
function determineConflictType(data) {
  const deadliness = parseInt(data.deadliness);
  const fragmentation = parseInt(data.fragmentation);
  const danger = parseInt(data.danger);
  
  if (fragmentation > 100) {
    return 'insurgency';
  } else if (danger > 3000) {
    return 'criminal violence';
  } else if (deadliness > 10000) {
    return 'civil war';
  } else {
    return 'civil conflict';
  }
}

/**
 * Helper function to determine the region based on country name
 * @param {string} country - Country name
 * @returns {string} - Region name
 */
function determineRegion(country) {
  const regionMap = {
    // Middle East
    'Syria': 'Middle East',
    'Lebanon': 'Middle East',
    'Israel': 'Middle East',
    'Palestine': 'Middle East',
    'Iraq': 'Middle East',
    'Iran': 'Middle East',
    'Yemen': 'Middle East',
    
    // Africa
    'Nigeria': 'Africa',
    'Sudan': 'Africa',
    'Cameroon': 'Africa',
    'Ethiopia': 'Africa',
    'Somalia': 'Africa',
    'Mali': 'Africa',
    'Kenya': 'Africa',
    'South Sudan': 'Africa',
    'Burkina Faso': 'Africa',
    'Burundi': 'Africa',
    'South Africa': 'Africa',
    'Niger': 'Africa',
    'Central African Republic': 'Africa',
    'Libya': 'Africa',
    'Mozambique': 'Africa',
    'Uganda': 'Africa',
    'Benin': 'Africa',
    'Madagascar': 'Africa',
    'Ghana': 'Africa',
    'Chad': 'Africa',
    
    // South Asia
    'Afghanistan': 'South Asia',
    'Pakistan': 'South Asia',
    'India': 'South Asia',
    'Bangladesh': 'South Asia',
    
    // Southeast Asia
    'Myanmar': 'Southeast Asia',
    'Philippines': 'Southeast Asia',
    'Indonesia': 'Southeast Asia',
    
    // Europe
    'Ukraine': 'Europe',
    'Russia': 'Europe',
    'Turkey': 'Europe',
    
    // North America
    'Mexico': 'North America',
    'Puerto Rico': 'North America',
    'Jamaica': 'North America',
    'Honduras': 'North America',
    'Guatemala': 'North America',
    'Trinidad and Tobago': 'North America',
    
    // South America
    'Brazil': 'South America',
    'Colombia': 'South America',
    'Venezuela': 'South America',
    'Ecuador': 'South America',
    'Peru': 'South America',
    
    // Default
    'Democratic Republic of Congo': 'Africa'
  };
  
  return regionMap[country] || 'Unknown';
}