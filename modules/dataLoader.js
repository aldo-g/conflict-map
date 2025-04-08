/**
 * Data Loader Module
 * 
 * Responsible for fetching and processing conflict data.
 */

import * as d3 from 'd3';
import { ConflictDefinitions } from '../data/ConflictDefinitions.js';

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
   * Loads country-level data from CSV and groups it into actual conflicts
   * @param {string} csvUrl - URL to the CSV country data
   * @returns {Promise<Array>} - Array of conflict data objects
   */
  loadAndGroupConflictData: async function(csvUrl) {
    try {
      // Load CSV using d3's built-in CSV parser
      const countryData = await d3.csv(csvUrl);
      
      // Create a map to store metrics for each conflict
      const conflictMetrics = {};
      
      // Initialize with zeros for all conflicts
      ConflictDefinitions.forEach(conflict => {
        conflictMetrics[conflict.id] = {
          deadliness: 0,
          danger: 0,
          fragmentation: 0,
          diffusion: 0,
          countries: [],
          countryCount: 0,
          hasMetrics: false
        };
      });
      
      // Create a lookup of which country belongs to which conflict
      const countryToConflictMap = {};
      
      // Populate the map
      ConflictDefinitions.forEach(conflict => {
        conflict.countries.forEach(country => {
          if (!countryToConflictMap[country]) {
            countryToConflictMap[country] = [];
          }
          countryToConflictMap[country].push(conflict.id);
        });
      });
      
      // Aggregate metrics from country data to conflicts
      countryData.forEach(country => {
        const conflictIds = countryToConflictMap[country.country] || [];
        
        // If the country isn't mapped to any conflict, skip it
        if (conflictIds.length === 0) return;
        
        // Add metrics to each conflict this country is part of
        conflictIds.forEach(conflictId => {
          const metrics = conflictMetrics[conflictId];
          
          // Add this country's metrics
          metrics.deadliness += parseInt(country.deadliness) || 0;
          metrics.danger += parseInt(country.danger) || 0;
          metrics.fragmentation += parseInt(country.fragmentation) || 0;
          
          // For diffusion, we'll take the maximum value among the countries
          metrics.diffusion = Math.max(metrics.diffusion, parseFloat(country.diffusion) || 0);
          
          // Track included countries
          metrics.countries.push(country.country);
          metrics.countryCount++;
          metrics.hasMetrics = true;
        });
      });
      
      // Now transform the conflict definitions with the aggregated metrics
      const conflictData = ConflictDefinitions.map(conflict => {
        const metrics = conflictMetrics[conflict.id];
        
        // Generate default metrics for conflicts without data
        if (!metrics.hasMetrics) {
          console.log(`Using default metrics for conflict: ${conflict.name}`);
          
          // Set default values based on conflict type
          if (conflict.type === 'territorial' || conflict.type === 'interstate') {
            metrics.deadliness = 5000;
            metrics.danger = 1000;
            metrics.fragmentation = 20;
            metrics.diffusion = 0.05;
          } else if (conflict.type === 'insurgency') {
            metrics.deadliness = 3000;
            metrics.danger = 1500;
            metrics.fragmentation = 15;
            metrics.diffusion = 0.03;
          } else {
            metrics.deadliness = 1000;
            metrics.danger = 500;
            metrics.fragmentation = 10;
            metrics.diffusion = 0.02;
          }
        }
        
        // Map intensity based on deadliness or conflict type
        let intensity = 'moderate';
        if (metrics.deadliness > 20000) {
          intensity = 'high';
        } else if (metrics.deadliness < 1000) {
          intensity = 'minor';
        }
        
        // For conflicts without metrics data, use the type to determine intensity
        if (!metrics.hasMetrics) {
          if (conflict.type === 'interstate') {
            intensity = 'high';
          } else if (conflict.type === 'civil war') {
            intensity = 'high';
          }
        }
        
        return {
          id: conflict.id,
          name: conflict.name,
          type: conflict.type,
          intensity: intensity,
          duration: 'ongoing', // All current conflicts
          region: getRegionForConflict(conflict),
          location: conflict.location,
          casualties: metrics.deadliness,
          startDate: conflict.startDate,
          description: conflict.description,
          actors: conflict.primaryActors,
          background: conflict.background,
          countries: metrics.countries.length > 0 ? metrics.countries : conflict.countries,
          // Add additional metrics
          metrics: {
            deadliness: metrics.deadliness,
            diffusion: metrics.diffusion,
            danger: metrics.danger,
            fragmentation: metrics.fragmentation,
            estimated: !metrics.hasMetrics
          }
        };
      });
      
      return _validateData(conflictData);
    } catch (error) {
      console.error('Error loading or processing conflict data:', error);
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
 * Helper function to determine the region for a conflict based on its countries
 * @param {Object} conflict - Conflict definition
 * @returns {string} - Region name
 */
function getRegionForConflict(conflict) {
  const regionMap = {
    // Middle East
    'Syria': 'Middle East',
    'Lebanon': 'Middle East',
    'Israel': 'Middle East',
    'Palestine': 'Middle East',
    'Iraq': 'Middle East',
    'Iran': 'Middle East',
    'Yemen': 'Middle East',
    
    // Europe and Caucasus
    'Ukraine': 'Europe',
    'Russia': 'Europe',
    'Turkey': 'Europe',
    'Armenia': 'Europe',
    'Azerbaijan': 'Europe',
    
    // Africa
    'Nigeria': 'Africa',
    'Sudan': 'Africa',
    'South Sudan': 'Africa',
    'Cameroon': 'Africa',
    'Ethiopia': 'Africa',
    'Somalia': 'Africa',
    'Mali': 'Africa',
    'Niger': 'Africa',
    'Burkina Faso': 'Africa',
    'Chad': 'Africa',
    'Kenya': 'Africa',
    'Burundi': 'Africa',
    'South Africa': 'Africa',
    'Central African Republic': 'Africa',
    'Libya': 'Africa',
    'Mozambique': 'Africa',
    'Uganda': 'Africa',
    'Benin': 'Africa',
    'Madagascar': 'Africa',
    'Ghana': 'Africa',
    
    // South Asia
    'Afghanistan': 'South Asia',
    'Pakistan': 'South Asia',
    'India': 'South Asia',
    'Bangladesh': 'South Asia',
    
    // Southeast Asia
    'Myanmar': 'Southeast Asia',
    'Philippines': 'Southeast Asia',
    'Indonesia': 'Southeast Asia',
    
    // North America
    'Mexico': 'North America',
    'Puerto Rico': 'North America',
    'Jamaica': 'North America',
    'Honduras': 'North America',
    'Guatemala': 'North America',
    'Haiti': 'North America',
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
  
  // If we have at least one country with a defined region, use that
  for (const country of conflict.countries) {
    if (regionMap[country]) {
      return regionMap[country];
    }
  }
  
  return 'Unknown';
}