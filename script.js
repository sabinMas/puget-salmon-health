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
   DASHBOARD INITIALIZATION
   ========================= */
async function initDashboard() {
  await loadWatershedBoundaries();
  
  try {
    let watershedData = await fetchWDFWData();
    if (!watershedData || watershedData.length === 0) {
      watershedData = FALLBACK_WATERSHED_DATA;
    }

    /* Add population points to map */
    watershedData.forEach((ws, idx) => {
      // Approximate coordinates for watersheds
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
      
      // Fixed: Translucent circles with proper scaling
      const radius = Math.sqrt((ws.population || 1) / Math.PI) * 150; // Adjusted scaling factor
      
      L.circle(latlng, {
        radius: Math.max(radius, 5000), // Minimum radius for visibility
        color: "#1e293b",
        weight: 1,
        opacity: 0.5,
        fillOpacity: 0.4, // Translucent
        fillColor: getPopulationColor(ws.population, ws.recoveryTarget)
      }).addTo(map).bindPopup(`
        <strong>${ws.watershed}</strong><br/>
        Population: ${ws.population.toLocaleString()}<br/>
        Target: ${ws.recoveryTarget.toLocaleString()}<br/>
        Status: ${statusLabel(ws.population, ws.recoveryTarget)}
      `).on('click', () => updateDetailedStatus(ws));
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
    new Chart(ctx, {
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
  } catch (error) {
    console.error("Error initializing dashboard:", error);
  }
}

function updateDetailedStatus(ws) {
  const pct = ((ws.population / ws.recoveryTarget) * 100).toFixed(1);
  document.getElementById("status-content").innerHTML = `
    <div class="status-card ${statusClass(ws.population, ws.recoveryTarget)}">
      <p><strong>🌊 ${ws.watershed}</strong></p>
      <p>Population: ${ws.population.toLocaleString()} (${ws.latestYear})</p>
      <p>Target: ${ws.recoveryTarget.toLocaleString()}</p>
      <p>Status: ${statusLabel(ws.population, ws.recoveryTarget)}</p>
      <p>Progress: ${pct}%</p>
      <p>Estuary: ${ws.estuary}</p>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", initDashboard);
