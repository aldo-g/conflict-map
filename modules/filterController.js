/**
 * Filter Controller Module
 * 
 * Manages the filtering system for conflict data.
 */

// Private variables moved to module scope
let _typeFilterElement = null;
let _intensityFilterElement = null;
let _durationFilterElement = null;
let _regionFilterElement = null;
let _resetButtonElement = null;

// Current filter state
let _filters = {
  type: 'all',
  intensity: 'all',
  duration: 'all',
  region: 'all'
};

// Private methods
const _updateFilters = () => {
  // Get current filter values from DOM elements
  _filters.type = _typeFilterElement.value;
  _filters.intensity = _intensityFilterElement.value;
  _filters.duration = _durationFilterElement.value;
  _filters.region = _regionFilterElement.value;
  
  // Dispatch custom event with filter data
  const event = new CustomEvent('filtersChanged', {
    detail: {
      filters: { ..._filters }  // Create a copy of the filters object
    }
  });
  document.dispatchEvent(event);
};

const _resetFilters = () => {
  // Reset DOM elements
  _typeFilterElement.value = 'all';
  _intensityFilterElement.value = 'all';
  _durationFilterElement.value = 'all';
  _regionFilterElement.value = 'all';
  
  // Update filter state
  _filters = {
    type: 'all',
    intensity: 'all',
    duration: 'all',
    region: 'all'
  };
  
  // Trigger update
  _updateFilters();
};

// Event listeners setup
const _setupEventListeners = () => {
  _typeFilterElement.addEventListener('change', _updateFilters);
  _intensityFilterElement.addEventListener('change', _updateFilters);
  _durationFilterElement.addEventListener('change', _updateFilters);
  _regionFilterElement.addEventListener('change', _updateFilters);
  _resetButtonElement.addEventListener('click', _resetFilters);
};

// Exported object with public methods
export const FilterController = {
  /**
   * Initialize filter controls
   * @param {Object} config - Filter element IDs
   */
  initializeFilters: function(config) {
    // Get DOM elements
    _typeFilterElement = document.getElementById(config.typeFilterId);
    _intensityFilterElement = document.getElementById(config.intensityFilterId);
    _durationFilterElement = document.getElementById(config.durationFilterId);
    _regionFilterElement = document.getElementById(config.regionFilterId);
    _resetButtonElement = document.getElementById(config.resetButtonId);
    
    // Make sure all elements exist
    if (!_typeFilterElement || !_intensityFilterElement || 
        !_durationFilterElement || !_regionFilterElement || 
        !_resetButtonElement) {
      console.error('Some filter elements were not found');
      return false;
    }
    
    // Setup event listeners
    _setupEventListeners();
    
    return true;
  },
  
  /**
   * Get current filter settings
   * @returns {Object} - Object with current filter values
   */
  getCurrentFilters: function() {
    return { ..._filters };
  },
  
  /**
   * Set filters programmatically
   * @param {Object} filterConfig - Object with filter values to set
   */
  setFilters: function(filterConfig) {
    // Update filter state with provided values
    if (filterConfig.type) {
      _filters.type = filterConfig.type;
      _typeFilterElement.value = filterConfig.type;
    }
    
    if (filterConfig.intensity) {
      _filters.intensity = filterConfig.intensity;
      _intensityFilterElement.value = filterConfig.intensity;
    }
    
    if (filterConfig.duration) {
      _filters.duration = filterConfig.duration;
      _durationFilterElement.value = filterConfig.duration;
    }
    
    if (filterConfig.region) {
      _filters.region = filterConfig.region;
      _regionFilterElement.value = filterConfig.region;
    }
    
    // Trigger update
    _updateFilters();
  }
};