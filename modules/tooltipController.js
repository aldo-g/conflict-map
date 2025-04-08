/**
 * Tooltip Controller Module
 * 
 * Manages the display of tooltips for conflict points.
 */

// Private variables moved to module scope
let _tooltipElement = null;

// Format date string
const _formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString; // Return original if parsing fails
  }
};

// Format large numbers with commas
const _formatNumber = (number) => {
  if (number === undefined || number === null) return 'Unknown';
  return number.toLocaleString();
};

// Format percentage value
const _formatPercentage = (value) => {
  if (value === undefined || value === null) return 'Unknown';
  return (value * 100).toFixed(1) + '%';
};

// Create tooltip content - Enhanced for conflict-centric display
const _createTooltipContent = (conflict) => {
  const metrics = conflict.metrics || {};
  const isEstimated = metrics.estimated;
  
  return `
    <div class="tooltip-header">
      <h3>${conflict.name}</h3>
      <span class="conflict-type">${conflict.type}</span>
    </div>
    <div class="tooltip-body">
      <p><strong>Countries:</strong> ${conflict.countries ? conflict.countries.join(', ') : 'Unknown'}</p>
      <p><strong>Region:</strong> ${conflict.region}</p>
      <p><strong>Intensity:</strong> ${conflict.intensity}</p>
      <p><strong>Started:</strong> ${_formatDate(conflict.startDate)}</p>
      <p><strong>Fatalities:</strong> ${_formatNumber(conflict.casualties)}${isEstimated ? '*' : ''}</p>
      <p><strong>Key Actors:</strong> ${conflict.actors ? conflict.actors.join(', ') : 'Unknown'}</p>
      ${metrics.diffusion ? `<p><strong>Area Affected:</strong> ${_formatPercentage(metrics.diffusion)}${isEstimated ? '*' : ''}</p>` : ''}
      ${metrics.danger ? `<p><strong>Civilian Targeting:</strong> ${_formatNumber(metrics.danger)} events${isEstimated ? '*' : ''}</p>` : ''}
      ${metrics.fragmentation ? `<p><strong>Armed Groups:</strong> ${_formatNumber(metrics.fragmentation)}${isEstimated ? '*' : ''}</p>` : ''}
      ${isEstimated ? '<p class="estimated-note">* Estimated values</p>' : ''}
    </div>
    <div class="tooltip-footer">
      <p>${conflict.description || ''}</p>
      ${conflict.background ? `<p class="background-info"><strong>Background:</strong> ${conflict.background}</p>` : ''}
    </div>
  `;
};

// Calculate tooltip position
const _calculatePosition = (x, y) => {
  if (!_tooltipElement) return { left: 0, top: 0 };
  
  const tooltipWidth = _tooltipElement.offsetWidth;
  const tooltipHeight = _tooltipElement.offsetHeight;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  // Default position is to the right and below the cursor
  let left = x + 15;
  let top = y + 15;
  
  // Check if tooltip would go off the right edge
  if (left + tooltipWidth > windowWidth) {
    left = x - tooltipWidth - 15; // Position to the left of cursor
  }
  
  // Check if tooltip would go off the bottom edge
  if (top + tooltipHeight > windowHeight) {
    top = y - tooltipHeight - 15; // Position above cursor
  }
  
  // Ensure tooltip stays within viewport
  left = Math.max(0, Math.min(windowWidth - tooltipWidth, left));
  top = Math.max(0, Math.min(windowHeight - tooltipHeight, top));
  
  return { left, top };
};

// Exported object with public methods
export const TooltipController = {
  /**
   * Initialize the tooltip controller
   * @param {string} tooltipId - ID of the tooltip element
   */
  initialize: function(tooltipId) {
    _tooltipElement = document.getElementById(tooltipId);
    
    if (!_tooltipElement) {
      console.error(`Tooltip element with ID '${tooltipId}' not found`);
      return false;
    }
    
    return true;
  },
  
  /**
   * Show the tooltip with conflict information
   * @param {Object} conflict - Conflict data object
   * @param {number} x - X position for tooltip
   * @param {number} y - Y position for tooltip
   */
  show: function(conflict, x, y) {
    if (!_tooltipElement) return;
    
    // Set tooltip content
    _tooltipElement.innerHTML = _createTooltipContent(conflict);
    
    // Position the tooltip (do this before showing it to get correct dimensions)
    _tooltipElement.classList.remove('hidden');
    
    // Calculate position after making visible to get dimensions
    const position = _calculatePosition(x, y);
    
    // Apply position
    _tooltipElement.style.left = `${position.left}px`;
    _tooltipElement.style.top = `${position.top}px`;
  },
  
  /**
   * Hide the tooltip
   */
  hide: function() {
    if (!_tooltipElement) return;
    _tooltipElement.classList.add('hidden');
  },
  
  /**
   * Update tooltip position (e.g., when moving cursor)
   * @param {number} x - New X position
   * @param {number} y - New Y position
   */
  updatePosition: function(x, y) {
    if (!_tooltipElement || _tooltipElement.classList.contains('hidden')) return;
    
    const position = _calculatePosition(x, y);
    
    _tooltipElement.style.left = `${position.left}px`;
    _tooltipElement.style.top = `${position.top}px`;
  }
};