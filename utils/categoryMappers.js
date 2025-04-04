/**
 * Category Mappers Module
 * 
 * Utility functions for mapping and categorizing conflict data.
 */

// Define conflict type categories and their display names
const _conflictTypes = {
    'civil war': 'Civil War',
    'insurgency': 'Insurgency',
    'interstate': 'Interstate Conflict',
    'territorial': 'Territorial Dispute',
    'criminal violence': 'Criminal Violence',
    'ethnic conflict': 'Ethnic Conflict',
    'religious conflict': 'Religious Conflict'
  };
  
  // Define intensity levels and thresholds
  const _intensityLevels = {
    'minor': { label: 'Minor', thresholdCasualties: 1000 },
    'moderate': { label: 'Moderate', thresholdCasualties: 10000 },
    'high': { label: 'High', thresholdCasualties: null } // Above moderate
  };
  
  // Define duration categories based on years
  const _durationCategories = {
    'recent': { label: 'Recent', maxYears: 3 },
    'ongoing': { label: 'Ongoing', maxYears: 10 },
    'protracted': { label: 'Protracted', maxYears: null } // More than ongoing
  };
  
  // Region groupings
  const _regionGroups = {
    'Africa': ['North Africa', 'West Africa', 'East Africa', 'Central Africa', 'Southern Africa'],
    'Middle East': ['Middle East', 'Gulf States'],
    'Europe': ['Western Europe', 'Eastern Europe', 'Southern Europe', 'Northern Europe', 'Balkans'],
    'Asia': ['East Asia', 'Central Asia'],
    'North America': ['North America', 'Central America', 'Caribbean'],
    'South America': ['South America'],
    'Southeast Asia': ['Southeast Asia'],
    'South Asia': ['South Asia'],
    'Oceania': ['Australia and New Zealand', 'Pacific Islands']
  };
  
  /**
   * Categorize conflict intensity based on casualties
   * @param {number} casualties - Number of casualties
   * @returns {string} - Intensity category
   */
  const _categorizeIntensity = (casualties) => {
    if (!casualties || isNaN(casualties)) return 'unknown';
    
    if (casualties < _intensityLevels.minor.thresholdCasualties) {
      return 'minor';
    } else if (casualties < _intensityLevels.moderate.thresholdCasualties) {
      return 'moderate';
    } else {
      return 'high';
    }
  };
  
  /**
   * Categorize conflict duration based on start date
   * @param {string} startDateStr - Conflict start date string
   * @returns {string} - Duration category
   */
  const _categorizeDuration = (startDateStr) => {
    if (!startDateStr) return 'unknown';
    
    try {
      const startDate = new Date(startDateStr);
      const currentDate = new Date();
      
      // Calculate years since start
      const yearsSinceStart = (currentDate - startDate) / (1000 * 60 * 60 * 24 * 365.25);
      
      if (yearsSinceStart < _durationCategories.recent.maxYears) {
        return 'recent';
      } else if (yearsSinceStart < _durationCategories.ongoing.maxYears) {
        return 'ongoing';
      } else {
        return 'protracted';
      }
    } catch (e) {
      console.error('Error parsing date:', e);
      return 'unknown';
    }
  };
  
  /**
   * Get the parent region for a subregion
   * @param {string} region - Region or subregion name
   * @returns {string} - Parent region name or original region if not found
   */
  const _getParentRegion = (region) => {
    if (!region) return 'unknown';
    
    // Check if it's already a top-level region
    if (Object.keys(_regionGroups).includes(region)) {
      return region;
    }
    
    // Look for subregion in region groups
    for (const [parentRegion, subregions] of Object.entries(_regionGroups)) {
      if (subregions.includes(region)) {
        return parentRegion;
      }
    }
    
    // Return original if not found
    return region;
  };
  
  // Exported object with public methods
  export const CategoryMappers = {
    /**
     * Get conflict type display name
     * @param {string} type - Conflict type code
     * @returns {string} - Display name for conflict type
     */
    getConflictTypeLabel: function(type) {
      return _conflictTypes[type] || 'Unknown';
    },
    
    /**
     * Get intensity level label
     * @param {string} intensity - Intensity level code
     * @returns {string} - Display label for intensity
     */
    getIntensityLabel: function(intensity) {
      return _intensityLevels[intensity]?.label || 'Unknown';
    },
    
    /**
     * Get duration category label
     * @param {string} duration - Duration category code
     * @returns {string} - Display label for duration
     */
    getDurationLabel: function(duration) {
      return _durationCategories[duration]?.label || 'Unknown';
    },
    
    /**
     * Enhance conflict data with derived category information
     * @param {Object} conflict - Conflict data object
     * @returns {Object} - Enhanced conflict data
     */
    enhanceConflictData: function(conflict) {
      const enhanced = { ...conflict };
      
      // Add derived categories if missing
      if (!enhanced.intensity) {
        enhanced.intensity = _categorizeIntensity(enhanced.casualties);
      }
      
      if (!enhanced.duration) {
        enhanced.duration = _categorizeDuration(enhanced.startDate);
      }
      
      // Normalize region to parent region
      enhanced.parentRegion = _getParentRegion(enhanced.region);
      
      // Add display labels
      enhanced.typeLabel = this.getConflictTypeLabel(enhanced.type);
      enhanced.intensityLabel = this.getIntensityLabel(enhanced.intensity);
      enhanced.durationLabel = this.getDurationLabel(enhanced.duration);
      
      return enhanced;
    },
    
    /**
     * Get all available conflict types
     * @returns {Object} - Object with conflict type codes and labels
     */
    getAllConflictTypes: function() {
      return { ..._conflictTypes };
    },
    
    /**
     * Get all available intensity levels
     * @returns {Object} - Object with intensity level information
     */
    getAllIntensityLevels: function() {
      return { ..._intensityLevels };
    },
    
    /**
     * Get all available duration categories
     * @returns {Object} - Object with duration category information
     */
    getAllDurationCategories: function() {
      return { ..._durationCategories };
    },
    
    /**
     * Get all region groups
     * @returns {Object} - Object with region group information
     */
    getAllRegionGroups: function() {
      return { ..._regionGroups };
    }
  };