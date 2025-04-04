/**
 * Data Transformers Module
 * 
 * Utility functions for transforming and filtering conflict data.
 */

import { CategoryMappers } from './categoryMappers.js';

/**
 * Apply filters to conflict data
 * @param {Array} conflicts - Array of conflict data objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered conflict data
 */
const applyFilters = (conflicts, filters) => {
  return conflicts.filter(conflict => {
    // Filter by type
    if (filters.type !== 'all' && conflict.type !== filters.type) {
      return false;
    }
    
    // Filter by intensity
    if (filters.intensity !== 'all' && conflict.intensity !== filters.intensity) {
      return false;
    }
    
    // Filter by duration
    if (filters.duration !== 'all' && conflict.duration !== filters.duration) {
      return false;
    }
    
    // Filter by region
    if (filters.region !== 'all') {
      // Check if conflict region exactly matches or is a subregion
      const parentRegion = CategoryMappers.enhanceConflictData(conflict).parentRegion;
      if (conflict.region !== filters.region && parentRegion !== filters.region) {
        return false;
      }
    }
    
    // Conflict passes all filters
    return true;
  });
};

/**
 * Group conflicts by specified property
 * @param {Array} conflicts - Array of conflict data objects
 * @param {string} groupBy - Property to group by
 * @returns {Object} - Grouped conflicts
 */
const groupConflicts = (conflicts, groupBy) => {
  if (!conflicts || !Array.isArray(conflicts)) {
    return {};
  }
  
  return conflicts.reduce((grouped, conflict) => {
    const key = conflict[groupBy] || 'unknown';
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    
    grouped[key].push(conflict);
    return grouped;
  }, {});
};

/**
 * Calculate statistics for conflict data
 * @param {Array} conflicts - Array of conflict data objects
 * @returns {Object} - Statistics object
 */
const calculateStatistics = (conflicts) => {
  if (!conflicts || !Array.isArray(conflicts) || conflicts.length === 0) {
    return {
      totalConflicts: 0,
      typeDistribution: {},
      intensityDistribution: {},
      regionDistribution: {},
      totalCasualties: 0,
      averageCasualties: 0
    };
  }
  
  // Count conflicts by type
  const typeDistribution = groupConflicts(conflicts, 'type');
  const typeStats = Object.keys(typeDistribution).reduce((stats, type) => {
    stats[type] = typeDistribution[type].length;
    return stats;
  }, {});
  
  // Count conflicts by intensity
  const intensityDistribution = groupConflicts(conflicts, 'intensity');
  const intensityStats = Object.keys(intensityDistribution).reduce((stats, intensity) => {
    stats[intensity] = intensityDistribution[intensity].length;
    return stats;
  }, {});
  
  // Count conflicts by region
  const regionDistribution = groupConflicts(conflicts, 'region');
  const regionStats = Object.keys(regionDistribution).reduce((stats, region) => {
    stats[region] = regionDistribution[region].length;
    return stats;
  }, {});
  
  // Calculate casualty statistics
  const casualtiesArray = conflicts
    .map(conflict => conflict.casualties || 0)
    .filter(casualties => !isNaN(casualties));
  
  const totalCasualties = casualtiesArray.reduce((sum, casualties) => sum + casualties, 0);
  const averageCasualties = casualtiesArray.length > 0 ? 
    Math.round(totalCasualties / casualtiesArray.length) : 0;
  
  return {
    totalConflicts: conflicts.length,
    typeDistribution: typeStats,
    intensityDistribution: intensityStats,
    regionDistribution: regionStats,
    totalCasualties,
    averageCasualties
  };
};

/**
 * Create timeline data for conflicts
 * @param {Array} conflicts - Array of conflict data objects
 * @returns {Array} - Formatted timeline data
 */
const createTimelineData = (conflicts) => {
  if (!conflicts || !Array.isArray(conflicts)) {
    return [];
  }
  
  // Filter conflicts with valid start dates
  const validConflicts = conflicts.filter(conflict => conflict.startDate);
  
  // Sort conflicts by start date
  return validConflicts
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .map(conflict => ({
      id: conflict.id,
      name: conflict.name,
      startDate: conflict.startDate,
      type: conflict.type,
      intensity: conflict.intensity,
      region: conflict.region
    }));
};

// Exported object with public methods
export const DataTransformers = {
  /**
   * Apply filters to conflict data
   * @param {Array} conflicts - Array of conflict data objects
   * @param {Object} filters - Filter criteria
   * @returns {Array} - Filtered conflict data
   */
  applyFilters,
  
  /**
   * Group conflicts by specified property
   * @param {Array} conflicts - Array of conflict data objects
   * @param {string} groupBy - Property to group by
   * @returns {Object} - Grouped conflicts
   */
  groupConflicts,
  
  /**
   * Calculate statistics for conflict data
   * @param {Array} conflicts - Array of conflict data objects
   * @returns {Object} - Statistics object
   */
  calculateStatistics,
  
  /**
   * Create timeline data for conflicts
   * @param {Array} conflicts - Array of conflict data objects
   * @returns {Array} - Formatted timeline data
   */
  createTimelineData,
  
  /**
   * Enhance all conflicts with category information
   * @param {Array} conflicts - Array of conflict data objects
   * @returns {Array} - Enhanced conflict data
   */
  enhanceAllConflicts: function(conflicts) {
    if (!conflicts || !Array.isArray(conflicts)) {
      return [];
    }
    
    return conflicts.map(conflict => CategoryMappers.enhanceConflictData(conflict));
  }
};