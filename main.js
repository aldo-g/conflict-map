/**
 * Global Conflict Map - Main Application File
 * 
 * This file coordinates all modules and initializes the application.
 */

// Import external libraries
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

// Import modules
import { DataLoader } from './modules/dataLoader.js';
import { FilterController } from './modules/filterController.js';
import { MapRenderer } from './modules/mapRenderer.js';
import { TooltipController } from './modules/tooltipController.js';
import { CategoryMappers } from './utils/categoryMappers.js';
import { DataTransformers } from './utils/dataTransformers.js';

// Make libraries available globally for modules that expect them
window.d3 = d3;
window.topojson = topojson;

// Global variables
let conflictData = [];
let worldGeoData = null;
let filteredData = [];

// Initialize the application
async function initializeApp() {
  try {
    console.log('Initializing Global Conflict Map application...');
    
    // Load world map data (from a common GeoJSON source)
    worldGeoData = await d3.json('https://unpkg.com/world-atlas@2/countries-110m.json');
    console.log('World map data loaded');
    
    // Load conflict data using the new conflict-centric approach
    conflictData = await DataLoader.loadAndGroupConflictData('./data/ConflictData.csv');
    console.log(`Loaded ${conflictData.length} conflicts`);
    
    // Initialize filtered data
    filteredData = [...conflictData];
    
    // Initialize the map
    MapRenderer.initializeMap('map-container', worldGeoData);
    console.log('Map initialized');
    
    // Render conflict points
    MapRenderer.renderConflicts(filteredData);
    console.log('Conflicts rendered on map');
    
    // Initialize filter controller with updated config (no duration filter)
    FilterController.initializeFilters({
      typeFilterId: 'conflict-type',
      intensityFilterId: 'conflict-intensity',
      regionFilterId: 'conflict-region',
      resetButtonId: 'reset-filters'
    });
    console.log('Filters initialized');
    
    // Initialize tooltip controller
    TooltipController.initialize('tooltip');
    console.log('Tooltip initialized');
    
    // Initialize UI controls
    initializeUIControls();
    
    console.log('Global Conflict Map initialized successfully.');
  } catch (error) {
    console.error('Error initializing application:', error);
  }
}

// Handle filter changes
function handleFilterChange(filters) {
  console.log('Filters changed:', filters);
  
  // Apply filters to the data
  filteredData = DataTransformers.applyFilters(conflictData, filters);
  
  // Update the map with filtered data
  MapRenderer.renderConflicts(filteredData);
}

// Initialize UI controls for the modern interface
function initializeUIControls() {
  // Get DOM elements
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const closeSidebar = document.getElementById('close-sidebar');
  const filterSidebar = document.getElementById('filter-sidebar');
  
  // Toggle sidebar when clicking the filter button
  sidebarToggle.addEventListener('click', () => {
    filterSidebar.classList.toggle('active');
  });
  
  // Close sidebar when clicking the close button
  closeSidebar.addEventListener('click', () => {
    filterSidebar.classList.remove('active');
  });
  
  // Close sidebar when clicking outside
  document.addEventListener('click', (event) => {
    const isClickInsideSidebar = filterSidebar.contains(event.target);
    const isClickOnToggle = sidebarToggle.contains(event.target);
    
    if (!isClickInsideSidebar && !isClickOnToggle && filterSidebar.classList.contains('active')) {
      filterSidebar.classList.remove('active');
    }
  });
  
  // Prevent clicks inside sidebar from closing it
  filterSidebar.addEventListener('click', (event) => {
    event.stopPropagation();
  });
  
  // Also prevent clicks on toggle from propagating
  sidebarToggle.addEventListener('click', (event) => {
    event.stopPropagation();
  });
}

// Register event listeners
function registerEventListeners() {
  // Subscribe to filter changes
  document.addEventListener('filtersChanged', (event) => {
    handleFilterChange(event.detail.filters);
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    MapRenderer.resizeMap();
  });
}

// Load the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing application...');
  registerEventListeners();
  initializeApp();
});