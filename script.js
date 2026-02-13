/* =========================
   CONFIGURATION & API ENDPOINTS
   ========================= */
const WDFW_SPI_API = {
  metrics: "https://data.wa.gov/api/views/x25s-cxg8/rows.json?$limit=50000",
  escapement: "https://data.wa.gov/api/views/fgyz-n3uk/rows.json?$limit=50000",
  populations: "https://data.wa.gov/api/views/ncqh-ypvf/rows.json?$limit=50000",
  recoveryGoals: "https://data.wa.gov/api/views/d8mu-pcf6/rows.json?$limit=50000"
};

/* =========================
   WSDOT FISH PASSAGE BARRIERS API
   Data Source: WSDOT Fish Passage Uncorrected Barriers - Statewide
   API Documentation: https://data.wsdot.wa.gov/arcgis/rest/services/Shared/FishPassageData/MapServer/8
   ========================= */
const WSDOT_BARRIERS_API = "https://data.wsdot.wa.gov/arcgis/rest/services/Shared/FishPassageData/MapServer/8/query";

/* Puget Sound watershed boundaries for filtering barriers */
const PUGET_SOUND_WATERSHEDS = [
  "Skagit",
  "Stillaguamish", 
  "Snohomish",
  "Cedar",
  "Sammamish",
  "Duwamish",
  "Green",
  "Puyallup",
  "White",
  "Nisqually",
  "Skokomish"
];

/* Layer group for barriers (for toggle control) */
let barriersLayer;
let barriersVisible = true;

/* =========================
   USGS STREAM TEMPERATURE MONITORING
   ========================= */

/* USGS Water Services API Configuration */
const USGS_WATER_API = "https://waterservices.usgs.gov/nwis/iv/";

/* Puget Sound Region Bounding Box */
const PUGET_SOUND_BOUNDS = {
    minLat: 46.8,
    maxLat: 48.5,
    minLon: -123.2,
    maxLon: -121.5
};

/* Temperature parameter code (00010 = Temperature, water, degrees Celsius) */
const TEMP_PARAMETER_CODE = "00010";

/* Layer group for temperature stations */
let temperatureLayer;
let temperatureVisible = true;
let temperatureRefreshInterval;

/* Temperature thresholds for salmon health (in Celsius) */
const TEMP_THRESHOLDS = {
    optimal: 15,    // < 15°C - Blue (optimal for salmon)
    marginal: 18,   // 15-18°C - Yellow (marginal)
    stressful: 20   // 18-20°C - Orange (stressful), > 20°C - Red (lethal)
};

/* =========================
   HELPER FUNCTIONS FOR TEMPERATURE
   ========================= */

function getTemperatureColor(temp) {
    if (temp === null || temp === undefined) return "#94a3b8";
    if (temp < TEMP_THRESHOLDS.optimal) return "#3b82f6";      // Blue - optimal
    if (temp < TEMP_THRESHOLDS.marginal) return "#eab308";     // Yellow - marginal
    if (temp < TEMP_THRESHOLDS.stressful) return "#f97316";    // Orange - stressful
    return "#dc2626";                                           // Red - lethal
}

function getTemperatureStatus(temp) {
    if (temp === null || temp === undefined) return "No data";
    if (temp < TEMP_THRESHOLDS.optimal) return "Optimal";
    if (temp < TEMP_THRESHOLDS.marginal) return "Marginal";
    if (temp < TEMP_THRESHOLDS.stressful) return "Stressful";
    return "Lethal";
}

function getTemperatureIcon(temp) {
    const color = getTemperatureColor(temp);
    return L.divIcon({
        className: 'temperature-marker',
        html: `<div class="thermometer-icon" style="background-color: ${color};">🌡️</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
}

/* =========================
   FETCH USGS TEMPERATURE DATA
   ========================= */

async function fetchUSGSTemperatureData() {
    try {
        console.log("Fetching stream temperature data from USGS...");
        
        // Show loading indicator
        showTemperatureLoading(true);
        
        const params = new URLSearchParams({
            format: "json",
            stateCd: "WA",  // Washington state
            parameterCd: TEMP_PARAMETER_CODE,
            siteStatus: "active",
            bBox: `${PUGET_SOUND_BOUNDS.minLon},${PUGET_SOUND_BOUNDS.minLat},${PUGET_SOUND_BOUNDS.maxLon},${PUGET_SOUND_BOUNDS.maxLat}`
        });
        
        const response = await fetch(`${USGS_WATER_API}?${params}`);
        
        if (!response.ok) {
            throw new Error(`USGS API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.value || !data.value.timeSeries || data.value.timeSeries.length === 0) {
            console.warn("No temperature data received from USGS API");
            showTemperatureLoading(false);
            return [];
        }
        
        console.log(`Received ${data.value.timeSeries.length} temperature stations from USGS API`);
        
        // Parse and filter temperature data
        const tempStations = data.value.timeSeries
            .map(station => {
                try {
                    const site = station.sourceInfo;
                    const values = station.values && station.values[0] && station.values[0].value;
                    
                    if (!values || values.length === 0) return null;
                    
                    const latestValue = values[values.length - 1];
                    const temperature = parseFloat(latestValue.value);
                    
                    return {
                        siteCode: site.siteCode[0].value,
                        siteName: site.siteName,
                        latitude: parseFloat(site.geoLocation.geogLocation.latitude),
                        longitude: parseFloat(site.geoLocation.geogLocation.longitude),
                        temperature: temperature,
                        dateTime: latestValue.dateTime,
                        streamName: site.siteName
                    };
                } catch (error) {
                    console.warn("Error parsing station data:", error);
                    return null;
                }
            })
            .filter(station => station !== null && !isNaN(station.temperature));
        
        console.log(`Parsed ${tempStations.length} valid temperature stations`);
        showTemperatureLoading(false);
        return tempStations;
        
    } catch (error) {
        console.error("Error fetching USGS temperature data:", error);
        showTemperatureLoading(false);
        return [];
    }
}

/* =========================
   ADD TEMPERATURE STATIONS TO MAP
   ========================= */

async function loadTemperatureStations() {
    try {
        const stations = await fetchUSGSTemperatureData();
        
        if (stations.length === 0) {
            console.warn("No temperature stations to display");
            return;
        }
        
        // Remove existing layer if present
        if (temperatureLayer) {
            map.removeLayer(temperatureLayer);
        }
        
        // Create new layer group for temperature stations
        temperatureLayer = L.layerGroup();
        
        stations.forEach(station => {
            const icon = getTemperatureIcon(station.temperature);
            const status = getTemperatureStatus(station.temperature);
            const color = getTemperatureColor(station.temperature);
            
            // Format date/time
            const dateTime = new Date(station.dateTime).toLocaleString();
            
            // Create marker with popup
            const marker = L.marker([station.latitude, station.longitude], { icon: icon })
                .bindPopup(`
                    <div class="temperature-popup">
                        <strong style="color: ${color}; font-size: 1.1rem;">🌡️ ${station.siteName}</strong><br/>
                        <hr style="margin: 0.5rem 0; border: none; border-top: 1px solid #e5e7eb;"/>
                        <strong>Stream:</strong> ${station.streamName}<br/>
                        <strong>Temperature:</strong> <span style="color: ${color}; font-weight: bold;">${station.temperature.toFixed(1)}°C (${(station.temperature * 9/5 + 32).toFixed(1)}°F)</span><br/>
                        <strong>Status:</strong> <span style="color: ${color}; font-weight: bold;">${status}</span><br/>
                        <strong>Measured:</strong> ${dateTime}<br/>
                        <strong>Site Code:</strong> ${station.siteCode}
                    </div>
                `, {
                    maxWidth: 350,
                    className: 'temperature-popup-content'
                });
            
            temperatureLayer.addLayer(marker);
        });
        
        // Add temperature layer to map if visible
        if (temperatureVisible) {
            temperatureLayer.addTo(map);
        }
        
        console.log(`Successfully added ${stations.length} temperature stations to map`);
        
    } catch (error) {
        console.error("Error loading temperature stations to map:", error);
    }
}

/* =========================
   TEMPERATURE LEGEND
   ========================= */

function createTemperatureLegend() {
    const tempLegend = L.control({ position: "topleft" });
    
    tempLegend.onAdd = function () {
        const div = L.DomUtil.create("div", "temperature-legend");
        div.style.background = "white";
        div.style.padding = "12px";
        div.style.borderRadius = "6px";
        div.style.boxShadow = "0 0 15px rgba(0,0,0,0.2)";
        div.style.fontFamily = "sans-serif";
        div.style.fontSize = "13px";
        
        div.innerHTML = `
            <div style="font-weight:bold;margin-bottom:8px;">🌡️ Stream Temperature</div>
            <div style="display:flex;align-items:center;margin-bottom:4px;">
                <div style="width:18px;height:18px;background-color:#3b82f6;margin-right:8px;border-radius:50%;"></div>
                <span>< 15°C (Optimal)</span>
            </div>
            <div style="display:flex;align-items:center;margin-bottom:4px;">
                <div style="width:18px;height:18px;background-color:#eab308;margin-right:8px;border-radius:50%;"></div>
                <span>15-18°C (Marginal)</span>
            </div>
            <div style="display:flex;align-items:center;margin-bottom:4px;">
                <div style="width:18px;height:18px;background-color:#f97316;margin-right:8px;border-radius:50%;"></div>
                <span>18-20°C (Stressful)</span>
            </div>
            <div style="display:flex;align-items:center;margin-bottom:4px;">
                <div style="width:18px;height:18px;background-color:#dc2626;margin-right:8px;border-radius:50%;"></div>
                <span>> 20°C (Lethal)</span>
            </div>
        `;
        
        return div;
    };
    
    tempLegend.addTo(map);
}

/* =========================
   LOADING INDICATOR
   ========================= */

function showTemperatureLoading(show) {
    const loadingDiv = document.getElementById('temperature-loading');
    if (loadingDiv) {
        loadingDiv.style.display = show ? 'block' : 'none';
    }
}

/* =========================
   AUTO-REFRESH TEMPERATURE DATA
   ========================= */

function startTemperatureRefresh() {
    // Refresh every 30 minutes (1800000 milliseconds)
    temperatureRefreshInterval = setInterval(() => {
        console.log("Auto-refreshing temperature data...");
        loadTemperatureStations();
    }, 1800000);
}

function stopTemperatureRefresh() {
    if (temperatureRefreshInterval) {
        clearInterval(temperatureRefreshInterval);
        temperatureRefreshInterval = null;
    }
}

/* =========================
   TOGGLE TEMPERATURE VISIBILITY
   ========================= */

function toggleTemperature() {
    if (!temperatureLayer) {
        console.warn("Temperature layer not initialized");
        return;
    }
    
    if (temperatureVisible) {
        map.removeLayer(temperatureLayer);
        temperatureVisible = false;
        const btn = document.getElementById('toggle-temperature');
        if (btn) btn.textContent = '🔲 Show Temperature';
        console.log("Temperature stations hidden");
    } else {
        temperatureLayer.addTo(map);
        temperatureVisible = true;
        const btn = document.getElementById('toggle-temperature');
        if (btn) btn.textContent = '✅ Hide Temperature';
        console.log("Temperature stations visible");
    }
}



/* =========================
   FALLBACK WATERSHED DATA
   ========================= */
const FALLBACK_WATERSHED_DATA = [
  {
    watershed: "Skagit River",
    population: 11184,
    latestYear: 2023,
    recoveryTarget: 42000,
    targetYear: 2022,
    status: "Critical",
    estuary: "Skagit Bay",
    tributaries: ["Sauk", "Suiattle", "Upper Cascade", "Lower Cascade"]
  },
  {
    watershed: "Stillaguamish River",
    population: 2278,
    latestYear: 2024,
    recoveryTarget: 33000,
    targetYear: 2022,
    status: "Critical",
    estuary: "Port Gardner",
    tributaries: ["North Fork", "South Fork"]
  },
  {
    watershed: "Snohomish River",
    population: 1194,
    latestYear: 2024,
    recoveryTarget: 20600,
    targetYear: 2022,
    status: "Critical",
    estuary: "Port of Everett",
    tributaries: ["Skykomish", "Snoqualmie", "Pilchuck", "Sultan"]
  },
  {
    watershed: "Cedar-Sammamish River",
    population: 5964,
    latestYear: 2024,
    recoveryTarget: 12200,
    targetYear: 2022,
    status: "Threatened",
    estuary: "Lake Washington Ship Canal",
    tributaries: ["Sammamish River"]
  },
  {
    watershed: "Duwamish River",
    population: 11288,
    latestYear: 2024,
    recoveryTarget: 27000,
    targetYear: 2022,
    status: "Endangered",
    estuary: "Elliott Bay",
    tributaries: ["Green River", "White River Upper"]
  },
  {
    watershed: "Puyallup-White River",
    population: 13132,
    latestYear: 2024,
    recoveryTarget: 19000,
    targetYear: 2022,
    status: "Stable",
    estuary: "Commencement Bay",
    tributaries: ["Carbon River", "White River"]
  },
  {
    watershed: "Nisqually River",
    population: 4200,
    latestYear: 2023,
    recoveryTarget: 12000,
    targetYear: 2022,
    status: "Endangered",
    estuary: "Nisqually Delta",
    tributaries: ["Upper Nisqually"]
  },
  {
    watershed: "Skokomish River",
    population: 2100,
    latestYear: 2023,
    recoveryTarget: 8500,
    targetYear: 2022,
    status: "Endangered",
    estuary: "Hood Canal",
    tributaries: ["North Fork", "South Fork"]
  }
];
/* =========================
   HISTORICAL TIME SLIDER DATA
   ========================= */

// Generate historical data for time slider (1990-2024)
function generateHistoricalData() {
  const historicalData = [];
  const startYear = 1990;
  const endYear = 2024;
  
  FALLBACK_WATERSHED_DATA.forEach(watershed => {
    const basePopulation = watershed.population;
    const recoveryTarget = watershed.recoveryTarget;
    
    // Generate realistic historical variations
    for (let year = startYear; year <= endYear; year++) {
      // Create decline pattern from 1990-2010, then gradual recovery
      let populationMultiplier;
      
      if (year <= 2000) {
        // Decline period (1990-2000): 150% to 100% of current
        populationMultiplier = 1.5 - ((2000 - year) / 10) * 0.5;
      } else if (year <= 2010) {
        // Continued decline (2000-2010): 100% to 70% of current
        populationMultiplier = 1.0 - ((2010 - year) / 10) * 0.3;
      } else {
        // Recovery period (2010-2024): 70% to 100% of current
        populationMultiplier = 0.7 + ((year - 2010) / 14) * 0.3;
      }
      
      // Add realistic year-to-year variations (±10%)
      const randomVariation = 0.9 + Math.random() * 0.2;
      const population = Math.round(basePopulation * populationMultiplier * randomVariation);
      
      historicalData.push({
        year: year,
        watershed: watershed.watershed,
        population: population,
        recoveryTarget: recoveryTarget
      });
    }
  });
  
  return historicalData;
}

// Store historical data globally
let historicalTimeSeries = [];
let watershedCircles = {}; // Store circle markers for updates
let currentAnimationYear = 2024;
let isAnimating = false;
let animationInterval = null;
let populationChart = null; // Store chart reference

/* =========================
   TIME SLIDER FUNCTIONS
   ========================= */

function updateYearDisplay(year) {
  document.getElementById('current-year').textContent = year;
  currentAnimationYear = year;
  
  // Update map circles for selected year
  updateMapForYear(year);
  
  // Update chart highlight
  updateChartHighlight(year);
  
  // Calculate and display year-over-year change
  displayYearChange(year);
}

function updateMapForYear(year) {
  const yearData = historicalTimeSeries.filter(d => d.year === year);
  
  yearData.forEach(data => {
    const circleKey = data.watershed;
    
    if (watershedCircles[circleKey]) {
      const circle = watershedCircles[circleKey];
      
      // Update circle radius based on population
      const radius = Math.sqrt((data.population || 1) / Math.PI) * 150;
      circle.setRadius(Math.max(radius, 5000));
      
      // Update circle color based on status
      const color = getPopulationColor(data.population, data.recoveryTarget);
      circle.setStyle({
        fillColor: color,
        color: "#1e293b"
      });
      
      // Update popup content
      const status = statusLabel(data.population, data.recoveryTarget);
      circle.setPopupContent(`
        <strong>${data.watershed}</strong><br/>
        Year: ${year}<br/>
        Population: ${data.population.toLocaleString()}<br/>
        Target: ${data.recoveryTarget.toLocaleString()}<br/>
        Status: ${status}
      `);
    }
  });
}

function displayYearChange(year) {
  const indicator = document.getElementById('year-change-indicator');
  
  if (year === 1990) {
    indicator.textContent = '';
    indicator.className = '';
    return;
  }
  
  const currentYearData = historicalTimeSeries.filter(d => d.year === year);
  const previousYearData = historicalTimeSeries.filter(d => d.year === year - 1);
  
  // Calculate total population change
  const currentTotal = currentYearData.reduce((sum, d) => sum + d.population, 0);
  const previousTotal = previousYearData.reduce((sum, d) => sum + d.population, 0);
  const change = currentTotal - previousTotal;
  
  if (change > 0) {
    indicator.textContent = `↗ +${change.toLocaleString()} spawners from ${year - 1}`;
    indicator.className = 'increase';
  } else if (change < 0) {
    indicator.textContent = `↘ ${change.toLocaleString()} spawners from ${year - 1}`;
    indicator.className = 'decrease';
  } else {
    indicator.textContent = `→ No change from ${year - 1}`;
    indicator.className = '';
  }
}

function updateChartHighlight(year) {
  // Update status content with selected year data
  const yearData = historicalTimeSeries.filter(d => d.year === year);
  const totalPop = yearData.reduce((sum, d) => sum + d.population, 0);
  const totalTarget = yearData.reduce((sum, d) => sum + d.recoveryTarget, 0);
  const percentOfTarget = totalTarget > 0 ? ((totalPop / totalTarget) * 100).toFixed(1) : "—";
  
  document.getElementById("status-content").innerHTML = `
    <div class="status-card ${statusClass(totalPop, totalTarget)}">
      <p><strong>📊 Puget Sound Region - ${year}</strong></p>
      <p>Total Population: ${totalPop.toLocaleString()}</p>
      <p>Regional Target: ${totalTarget.toLocaleString()}</p>
      <p>Progress: ${percentOfTarget}% of recovery target</p>
    </div>
  `;
}

/* =========================
   ANIMATION CONTROLS
   ========================= */

function toggleAnimation() {
  const btn = document.getElementById('play-pause-btn');
  
  if (isAnimating) {
    // Pause animation
    clearInterval(animationInterval);
    isAnimating = false;
    btn.textContent = '▶️ Play';
  } else {
    // Start animation
    isAnimating = true;
    btn.textContent = '⏸️ Pause';
    
    animationInterval = setInterval(() => {
      const slider = document.getElementById('year-slider');
      let nextYear = parseInt(slider.value) + 1;
      
      if (nextYear > 2024) {
        nextYear = 1990; // Loop back to start
      }
      
      slider.value = nextYear;
      updateYearDisplay(nextYear);
    }, 1000); // 1 year per second
  }
}

/* =========================
   RECOVERY TARGET REFERENCE LINE
   ========================= */

function addRecoveryTargetLayer() {
  const recoveryLegend = L.control({ position: "topright" });
  
  recoveryLegend.onAdd = function () {
    const div = L.DomUtil.create("div", "recovery-legend");
    div.style.background = "white";
    div.style.padding = "12px";
    div.style.borderRadius = "6px";
    div.style.boxShadow = "0 0 15px rgba(0,0,0,0.2)";
    div.style.fontFamily = "sans-serif";
    div.style.fontSize = "13px";
    div.style.maxWidth = "200px";
    
    div.innerHTML = `
      <div style="font-weight:bold;margin-bottom:8px;color:#0f172a;">🎯 Recovery Target</div>
      <div style="font-size:0.85rem;color:#64748b;line-height:1.5;">
        Circle sizes represent spawner population. Colors show status relative to recovery goals.
      </div>
    `;
    
    return div;
  };
  
  recoveryLegend.addTo(map);
}

/* =========================
   INITIALIZE TIME SLIDER
   ========================= */

function initializeTimeSlider() {
  // Generate historical data
  historicalTimeSeries = generateHistoricalData();
  
  // Set up event listener for slider
  const slider = document.getElementById('year-slider');
  slider.addEventListener('input', (e) => {
    const year = parseInt(e.target.value);
    updateYearDisplay(year);
  });
  
  // Set up play/pause button
  const playBtn = document.getElementById('play-pause-btn');
  playBtn.addEventListener('click', toggleAnimation);
  
  // Add recovery target reference
  addRecoveryTargetLayer();
  
  console.log('Time slider initialized with data from 1990-2024');
}

/* =========================
   HELPER FUNCTIONS
   ========================= */
function getPopulationColor(population, target) {
  if (!Number.isFinite(population) || !Number.isFinite(target) || target <= 0) {
    return "#94a3b8";
  }
  const percentOfTarget = (population / target) * 100;
  if (percentOfTarget < 5) return "#dc2626";
  if (percentOfTarget < 10) return "#ea580c";
  if (percentOfTarget < 25) return "#ca8a04";
  return "#22c55e";
}

function statusLabel(population, target) {
  if (!Number.isFinite(population) || !Number.isFinite(target) || target <= 0) {
    return "Data unavailable";
  }
  const pct = (population / target) * 100;
  if (pct < 5) return "🔴 Critical";
  if (pct < 10) return "🟠 Endangered";
  if (pct < 25) return "🟡 Threatened";
  return "🟢 Stable";
}

function statusClass(population, target) {
  if (!Number.isFinite(population) || !Number.isFinite(target) || target <= 0) {
    return "";
  }
  const pct = (population / target) * 100;
  if (pct < 5) return "critical";
  if (pct < 10) return "endangered";
  if (pct < 25) return "threatened";
  return "stable";
}

function getHabitatColor(suitability) {
  if (suitability === "optimal") return "#22c55e";
  if (suitability === "marginal") return "#ca8a04";
  return "#dc2626";
}

/* =========================
   FETCH WDFW DATA FROM API
   ========================= */
async function fetchWDFWData() {
  try {
    const response = await fetch(WDFW_SPI_API.metrics);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    if (Array.isArray(data)) {
      return data
        .filter(
          (row) =>
            row["ESU/DPS Name"]?.includes("Puget Sound") &&
            row["Species"] === "Chinook"
        )
        .slice(0, 8);
    }
    return null;
  } catch (error) {
    return null;
  }
}

/* =========================
   LEAFLET MAP SETUP
   ========================= */
const map = L.map("map", {
  scrollWheelZoom: true,
  attributionControl: true
}).setView([47.6, -122.3], 9);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
  maxZoom: 18,
  minZoom: 7
}).addTo(map);

/* =========================
   WATERSHED BOUNDARIES (POLYGONS)
   ========================= */
let watershedLayer;

async function loadWatershedBoundaries() {
  try {
    const response = await fetch('data/puget-sound-watersheds.geojson');
    const geoData = await response.json();
    
    watershedLayer = L.geoJSON(geoData, {
      style: function(feature) {
        return {
          color: "#1a5f7a",
          weight: 2,
          opacity: 0.6,
          fillOpacity: 0.1,
          fillColor: "#3b82f6"
        };
      },
      onEachFeature: function(feature, layer) {
        const name = feature.properties.name || feature.properties.NAME || "Unknown Watershed";
        layer.bindPopup(`<strong>Watershed: ${name}</strong>`);
        
        layer.on('mouseover', function() {
          this.setStyle({ fillOpacity: 0.3, weight: 3 });
        });
        layer.on('mouseout', function() {
          this.setStyle({ fillOpacity: 0.1, weight: 2 });
        });
      }
    }).addTo(map);
  } catch (error) {
    console.error("Error loading watershed boundaries:", error);
  }
}

/* =========================
   MAP LEGEND
   ========================= */
const legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
  const div = L.DomUtil.create("div", "info");
  div.className = 'map-legend';
  div.style.background = "white";
  div.style.padding = "12px";
  div.style.borderRadius = "6px";
  div.style.boxShadow = "0 0 15px rgba(0,0,0,0.2)";
  div.style.fontFamily = "sans-serif";
  div.style.fontSize = "13px";
  div.innerHTML = `
    <div class="legend-title" style="font-weight:bold;margin-bottom:8px;">Population Status</div>
    <div class="legend-item" style="display:flex;align-items:center;margin-bottom:4px;">
      <div class="legend-color" style="width:18px;height:18px;background-color:#dc2626;margin-right:8px;border-radius:50%;"></div>
      <span>Critical (<5% of target)</span>
    </div>
    <div class="legend-item" style="display:flex;align-items:center;margin-bottom:4px;">
      <div class="legend-color" style="width:18px;height:18px;background-color:#ea580c;margin-right:8px;border-radius:50%;"></div>
      <span>Endangered (<10%)</span>
    </div>
    <div class="legend-item" style="display:flex;align-items:center;margin-bottom:4px;">
      <div class="legend-color" style="width:18px;height:18px;background-color:#ca8a04;margin-right:8px;border-radius:50%;"></div>
      <span>Threatened (<25%)</span>
    </div>
    <div class="legend-item" style="display:flex;align-items:center;margin-bottom:4px;">
      <div class="legend-color" style="width:18px;height:18px;background-color:#22c55e;margin-right:8px;border-radius:50%;"></div>
      <span>Stable (≥25%)</span>
    </div>
  `;
  return div;
};
legend.addTo(map);


/* =========================
   FETCH WSDOT FISH PASSAGE BARRIERS
   ========================= */
async function fetchFishBarriers() {
  try {
    console.log("Fetching fish passage barriers from WSDOT...");
    
    const params = new URLSearchParams({
      where: "1=1",
      outFields: "Stream_Name,Road_Name,Barrier_Status_Desc,Source_Name,LinealGain_Meas,Species,FUCriteria_Desc",
      outSR: "4326",
      f: "json",
      returnGeometry: "true"
    });
    
    const response = await fetch(`${WSDOT_BARRIERS_API}?${params}`);
    
    if (!response.ok) {
      throw new Error(`WSDOT API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.features || data.features.length === 0) {
      console.warn("No barrier data received from WSDOT API");
      return [];
    }
    
    console.log(`Received ${data.features.length} barriers from WSDOT API`);
    
    // Filter barriers to only include those in Puget Sound watersheds
    const pugetSoundBarriers = data.features.filter(feature => {
      const streamName = feature.attributes.Stream_Name || "";
      const roadName = feature.attributes.Road_Name || "";
      const sourceName = feature.attributes.Source_Name || "";
      
      // Check if any Puget Sound watershed name appears in the barrier data
      return PUGET_SOUND_WATERSHEDS.some(watershed => 
        streamName.toLowerCase().includes(watershed.toLowerCase()) ||
        roadName.toLowerCase().includes(watershed.toLowerCase()) ||
        sourceName.toLowerCase().includes(watershed.toLowerCase())
      );
    });
    
    console.log(`Filtered to ${pugetSoundBarriers.length} barriers in Puget Sound watersheds`);
    return pugetSoundBarriers;
    
  } catch (error) {
    console.error("Error fetching fish passage barriers:", error);
    return [];
  }
}

/* =========================
   ADD FISH BARRIERS TO MAP
   ========================= */
async function loadFishBarriers() {
  try {
    const barriers = await fetchFishBarriers();
    
    if (barriers.length === 0) {
      console.warn("No fish passage barriers to display");
      return;
    }
    
    // Create layer group for barriers
    barriersLayer = L.layerGroup();
    
    barriers.forEach((feature) => {
      const attrs = feature.attributes;
      const geometry = feature.geometry;
      
      // Extract coordinates
      const lng = geometry.x;
      const lat = geometry.y;
      
      if (!lat || !lng) {
        return; // Skip if coordinates are missing
      }
      
      // Extract barrier information
      const barrierName = attrs.Road_Name || "Unnamed Barrier";
      const barrierType = attrs.FUCriteria_Desc || "Culvert";
      const streamName = attrs.Stream_Name || "Unknown Stream";
      const habitatMiles = attrs.LinealGain_Meas || 0;
      const status = attrs.Barrier_Status_Desc || "Uncorrected";
      const species = attrs.Species || "Multiple species";
      
      // Create custom red triangle marker
      const triangleIcon = L.divIcon({
        className: 'barrier-marker',
        html: '<div class="barrier-triangle"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      
      // Create marker with popup
      const marker = L.marker([lat, lng], { icon: triangleIcon })
        .bindPopup(`
          <div class="barrier-popup">
            <strong style="color: #dc2626; font-size: 1.05rem;">🚧 ${barrierName}</strong><br/>
            <hr style="margin: 0.5rem 0; border: none; border-top: 1px solid #e5e7eb;"/>
            <strong>Type:</strong> ${barrierType}<br/>
            <strong>Stream:</strong> ${streamName}<br/>
            <strong>Habitat Blocked:</strong> ${parseFloat(habitatMiles).toFixed(2)} miles<br/>
            <strong>Status:</strong> ${status}<br/>
            <strong>Species:</strong> ${species}
          </div>
        `, {
          maxWidth: 300,
          className: 'barrier-popup-content'
        });
      
      barriersLayer.addLayer(marker);
    });
    
    // Add barriers layer to map
    barriersLayer.addTo(map);
    
    console.log(`Successfully added ${barriers.length} fish passage barriers to map`);
    
  } catch (error) {
    console.error("Error loading fish barriers to map:", error);
  }
}

/* =========================
   TOGGLE FISH BARRIERS VISIBILITY
   ========================= */
function toggleBarriers() {
  if (!barriersLayer) {
    console.warn("Barriers layer not initialized");
    return;
  }
  
  if (barriersVisible) {
    map.removeLayer(barriersLayer);
    barriersVisible = false;
    document.getElementById('toggle-barriers').textContent = '🔲 Show Fish Barriers';
    console.log("Fish barriers hidden");
  } else {
    barriersLayer.addTo(map);
    barriersVisible = true;
    document.getElementById('toggle-barriers').textContent = '✅ Hide Fish Barriers';
    console.log("Fish barriers visible");
  }
}


/* =========================
   DASHBOARD INITIALIZATION
   ========================= */
async function initDashboard() {
  await loadWatershedBoundaries();
  await loadFishBarriers();
  await loadTemperatureStations();
  createTemperatureLegend();
  startTemperatureRefresh();
  
  try {
    let watershedData = await fetchWDFWData();
    if (!watershedData || watershedData.length === 0) {
      watershedData = FALLBACK_WATERSHED_DATA;
    }

    /* Add population points to map and store references */
    watershedData.forEach((ws, idx) => {
      const coords = {
        "Skagit River": [48.4, -121.5],
        "Stillaguamish River": [48.2, -121.8],
        "Snohomish River": [47.8, -121.8],
        "Cedar-Sammamish River": [47.5, -122.0],
        "Duwamish River": [47.3, -122.1],
        "Puyallup-White River": [47.1, -122.0],
        "Nisqually River": [46.9, -122.3],
        "Skokomish River": [47.3, -123.2]
      };

      const latlng = coords[ws.watershed] || [48.0, -122.0];
      const radius = Math.sqrt((ws.population || 1) / Math.PI) * 150;
      
      // Create circle and store reference for time slider updates
      const circle = L.circle(latlng, {
        radius: Math.max(radius, 5000),
        color: "#1e293b",
        weight: 1,
        opacity: 0.5,
        fillOpacity: 0.4,
        fillColor: getPopulationColor(ws.population, ws.recoveryTarget)
      }).addTo(map).bindPopup(`
        <strong>${ws.watershed}</strong><br/>
        Population: ${ws.population.toLocaleString()}<br/>
        Target: ${ws.recoveryTarget.toLocaleString()}<br/>
        Status: ${statusLabel(ws.population, ws.recoveryTarget)}
      `).on('click', () => updateDetailedStatus(ws));
      
      // Store circle reference for time slider updates
      watershedCircles[ws.watershed] = circle;
    });

    /* Regional Status */
    const totalPop = watershedData.reduce((sum, ws) => sum + (ws.population || 0), 0);
    const totalTarget = watershedData.reduce((sum, ws) => sum + (ws.recoveryTarget || 0), 0);
    const percentOfTarget = totalTarget > 0 ? ((totalPop / totalTarget) * 100).toFixed(1) : "—";
    
    document.getElementById("status-content").innerHTML = `
      <div class="status-card ${statusClass(totalPop, totalTarget)}">
        <p><strong>📊 Puget Sound Region Overview</strong></p>
        <p>Total Population: ${totalPop.toLocaleString()}</p>
        <p>Regional Target: ${totalTarget.toLocaleString()}</p>
        <p>Progress: ${percentOfTarget}% of recovery target</p>
      </div>
    `;

    /* Comparison Chart */
    const chartLabels = watershedData.map(ws => ws.watershed.split(" ")[0]);
    const chartPops = watershedData.map(ws => ws.population);
    const chartTargets = watershedData.map(ws => ws.recoveryTarget);
    
    const ctx = document.getElementById("watershedChart").getContext("2d");
    populationChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Current",
            data: chartPops,
            backgroundColor: "rgba(220, 38, 38, 0.6)"
          },
          {
            label: "Target",
            data: chartTargets,
            backgroundColor: "rgba(34, 197, 94, 0.2)",
            borderColor: "#22c55e",
            borderWidth: 1
          }
        ]
      },
      options: { indexAxis: 'y', responsive: true }
    });

    document.getElementById("update-time").textContent = new Date().toLocaleString();
    
    // Initialize time slider after map and data are ready
    initializeTimeSlider();
    
  } catch (error) {
    console.error("Error initializing dashboard:", error);
  }
}
