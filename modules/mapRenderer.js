/**
 * Map Renderer Module
 * 
 * Responsible for rendering the map and conflict points.
 */

import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { TooltipController } from './tooltipController.js';

// Private variables moved to module scope
let _svg = null;
let _container = null;
let _width = 0;
let _height = 0;
let _projection = null;
let _path = null;
let _zoom = null;
let _g = null; // For zoom handling
let _pointsGroup = null; // Group for conflict points

// Modern color scale for conflict intensity
const _intensityColorScale = {
  'high': '#FF5A5F',
  'moderate': '#FFC857',
  'minor': '#54DEFD',
  'unknown': '#8675A9'
};

// Calculate point radius based on casualties with a more dramatic scale
const _calculateRadius = (casualties) => {
  if (!casualties || isNaN(casualties)) return 6;
  return Math.max(6, Math.min(18, Math.sqrt(casualties / 800)));
};

// Handler for zoom events - Modified to allow zooming at any point, not just center
const _handleZoom = (event) => {
  if (_g) {
    // Apply the transform directly from the event to allow zooming at any point
    _g.attr('transform', event.transform);
  }
};

// Setup map with more stylish land features
const _setupMap = (containerId, worldGeoData) => {
  // Get container dimensions
  _container = document.getElementById(containerId);
  _width = _container.clientWidth;
  _height = _container.clientHeight || 500;
  
  // Create SVG element
  _svg = d3.select(`#${containerId}`)
    .append('svg')
    .attr('width', _width)
    .attr('height', _height)
    .attr('class', 'conflict-map');
  
  // Create defs for gradients and filters
  const defs = _svg.append('defs');
  
  // Create ocean gradient with subtle blue tones
  const oceanGradient = defs.append('linearGradient')
    .attr('id', 'ocean-gradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '0%')
    .attr('y2', '100%');
    
  oceanGradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#E6EEF6')
    .attr('stop-opacity', 1);
    
  oceanGradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#D1E0EB')
    .attr('stop-opacity', 1);
  
  // Create land gradient for more stylish countries
  const landGradient = defs.append('linearGradient')
    .attr('id', 'land-gradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '100%');
    
  landGradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#E8E8E8')
    .attr('stop-opacity', 1);
    
  landGradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#D9D9D9')
    .attr('stop-opacity', 1);
    
  // Create land texture pattern
  const landTexture = defs.append('pattern')
    .attr('id', 'land-texture')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 10)
    .attr('height', 10)
    .attr('patternTransform', 'rotate(45)');
    
  landTexture.append('rect')
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', 'url(#land-gradient)');
    
  landTexture.append('path')
    .attr('d', 'M 0,0 L 10,10')
    .attr('stroke', '#EFEFEF')
    .attr('stroke-width', 0.5)
    .attr('stroke-opacity', 0.3);
    
  // Create glow filter for points
  const filter = defs.append('filter')
    .attr('id', 'glow')
    .attr('x', '-50%')
    .attr('y', '-50%')
    .attr('width', '200%')
    .attr('height', '200%');
    
  filter.append('feGaussianBlur')
    .attr('stdDeviation', '2')
    .attr('result', 'coloredBlur');
    
  const feMerge = filter.append('feMerge');
  feMerge.append('feMergeNode')
    .attr('in', 'coloredBlur');
  feMerge.append('feMergeNode')
    .attr('in', 'SourceGraphic');
  
  // Add background rectangle with gradient
  _svg.append('rect')
    .attr('width', _width)
    .attr('height', _height)
    .attr('fill', 'url(#ocean-gradient)')
    .attr('class', 'ocean-background');
  
  // Setup projection - using a Mercator projection
  _projection = d3.geoMercator()
    .scale(_width / 6.3)
    .center([0, 20]) // Center slightly north of the equator
    .translate([_width / 2, _height / 2]);
  
  _path = d3.geoPath().projection(_projection);
  
  // Setup zoom behavior with more elegant transitions
  _zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on('zoom', _handleZoom);
  
  // Apply zoom to SVG
  _svg.call(_zoom);
  
  // Create a group for all map elements to enable zooming
  _g = _svg.append('g');
  
  // Draw graticule (grid lines) with subtle styling
  const graticuleGroup = _g.append('g')
    .attr('class', 'graticule');
  
  const graticule = d3.geoGraticule().step([20, 20]);
  graticuleGroup.append('path')
    .datum(graticule)
    .attr('d', _path)
    .attr('fill', 'none')
    .attr('stroke', 'rgba(180,190,200,0.2)')
    .attr('stroke-width', 0.5)
    .attr('stroke-dasharray', '2,2');
  
  // Create a group for countries
  const countriesGroup = _g.append('g')
    .attr('class', 'countries');
  
  // Draw country boundaries with stylish effects
  const countries = topojson.feature(worldGeoData, worldGeoData.objects.countries);
  
  // Add country shadows for depth
  countriesGroup.selectAll('.country-shadow')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('class', 'country-shadow')
    .attr('d', _path)
    .attr('fill', 'none')
    .attr('stroke', '#AAAAAA')
    .attr('stroke-width', 1.5)
    .attr('stroke-opacity', 0.1)
    .attr('transform', 'translate(1,1)');
  
  // Add countries with fill
  countriesGroup.selectAll('.country')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('d', _path)
    .attr('class', 'country')
    .attr('fill', 'url(#land-gradient)')
    .attr('stroke', '#B0B0B0')
    .attr('stroke-width', 0.5)
    .attr('stroke-opacity', 0.8);
  
  // Create a group for conflict points
  _pointsGroup = _g.append('g')
    .attr('class', 'conflict-points');
  
  return _svg;
};

// Exported object with public methods
export const MapRenderer = {
  /**
   * Initialize the map with geographical data
   * @param {string} containerId - ID of the container element
   * @param {Object} worldGeoData - TopoJSON world geographical data
   */
  initializeMap: function(containerId, worldGeoData) {
    return _setupMap(containerId, worldGeoData);
  },
  
  /**
   * Render conflict points on the map
   * @param {Array} conflicts - Array of conflict data objects
   */
  renderConflicts: function(conflicts) {
    if (!_pointsGroup) {
      console.error('Map has not been initialized');
      return;
    }
    
    // Clear existing points
    _pointsGroup.selectAll('*').remove();
    
    // Add conflict point halos (for glow effect)
    _pointsGroup.selectAll('.point-halo')
      .data(conflicts)
      .enter()
      .append('circle')
      .attr('class', 'point-halo')
      .attr('cx', d => {
        const coords = _projection([d.location.lng, d.location.lat]);
        return coords ? coords[0] : 0;
      })
      .attr('cy', d => {
        const coords = _projection([d.location.lng, d.location.lat]);
        return coords ? coords[1] : 0;
      })
      .attr('r', d => _calculateRadius(d.casualties) * 1.5)
      .attr('fill', d => _intensityColorScale[d.intensity] || _intensityColorScale.unknown)
      .attr('opacity', 0.2)
      .attr('filter', 'url(#glow)');
    
    // Add conflict points with enhanced styling
    _pointsGroup.selectAll('.conflict-point')
      .data(conflicts)
      .enter()
      .append('circle')
      .attr('cx', d => {
        const coords = _projection([d.location.lng, d.location.lat]);
        return coords ? coords[0] : 0;
      })
      .attr('cy', d => {
        const coords = _projection([d.location.lng, d.location.lat]);
        return coords ? coords[1] : 0;
      })
      .attr('r', d => _calculateRadius(d.casualties))
      .attr('class', 'conflict-point')
      .attr('fill', d => _intensityColorScale[d.intensity] || _intensityColorScale.unknown)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.9)
      .attr('data-intensity', d => d.intensity)
      .attr('data-id', d => d.id)
      // Add mouse events for tooltips with enhanced interactions
      .on('mouseover', function(event, d) {
        // Highlight the point with more dramatic effect
        d3.select(this)
          .attr('stroke-width', 3)
          .attr('opacity', 1)
          .transition()
          .duration(300)
          .ease(d3.easeCubicOut)
          .attr('r', d => _calculateRadius(d.casualties) * 1.3);
        
        // Also highlight the halo
        _pointsGroup.selectAll('.point-halo')
          .filter(h => h.id === d.id)
          .transition()
          .duration(300)
          .attr('opacity', 0.5)
          .attr('r', d => _calculateRadius(d.casualties) * 2);
        
        // Dim other points
        _pointsGroup.selectAll('.conflict-point')
          .filter(p => p.id !== d.id)
          .transition()
          .duration(200)
          .attr('opacity', 0.3);
        
        // Show tooltip
        TooltipController.show(d, event.pageX, event.pageY);
      })
      .on('mouseout', function(event, d) {
        // Reset point styling with smooth transition
        d3.select(this)
          .attr('stroke-width', 1.5)
          .transition()
          .duration(300)
          .ease(d3.easeCubicOut)
          .attr('r', d => _calculateRadius(d.casualties))
          .attr('opacity', 0.9);
        
        // Reset halo
        _pointsGroup.selectAll('.point-halo')
          .filter(h => h.id === d.id)
          .transition()
          .duration(300)
          .attr('opacity', 0.2)
          .attr('r', d => _calculateRadius(d.casualties) * 1.5);
        
        // Restore other points
        _pointsGroup.selectAll('.conflict-point')
          .filter(p => p.id !== d.id)
          .transition()
          .duration(200)
          .attr('opacity', 0.9);
        
        // Hide tooltip
        TooltipController.hide();
      });
      
    // Add pulsing animation for high intensity conflicts
    _pointsGroup.selectAll('.conflict-point')
      .filter(d => d.intensity === 'high')
      .each(function(d) {
        const point = d3.select(this);
        const baseRadius = _calculateRadius(d.casualties);
        
        function pulseAnimation() {
          point
            .transition()
            .duration(1500)
            .ease(d3.easeSinInOut)
            .attr('r', baseRadius * 1.2)
            .transition()
            .duration(1500)
            .ease(d3.easeSinInOut)
            .attr('r', baseRadius)
            .on('end', pulseAnimation);
        }
        
        pulseAnimation();
      });
  },
  
  /**
   * Resize the map when container size changes
   */
  resizeMap: function() {
    if (!_svg || !_container) return;
    
    // Get new container dimensions
    _width = _container.clientWidth;
    _height = _container.clientHeight || 500;
    
    // Update SVG dimensions
    _svg.attr('width', _width)
      .attr('height', _height);
    
    // Update ocean background
    _svg.select('.ocean-background')
      .attr('width', _width)
      .attr('height', _height);
    
    // Update projection
    _projection.scale(_width / 6.3)
      .translate([_width / 2, _height / 2]);
    
    // Update all paths with new projection
    _svg.selectAll('path')
      .attr('d', _path);
    
    // Update all conflict points and halos
    _pointsGroup.selectAll('circle')
      .attr('cx', d => {
        const coords = _projection([d.location.lng, d.location.lat]);
        return coords ? coords[0] : 0;
      })
      .attr('cy', d => {
        const coords = _projection([d.location.lng, d.location.lat]);
        return coords ? coords[1] : 0;
      });
  }
};