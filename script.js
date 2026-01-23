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
    console.log("Fetching WDFW data from Socrata API...");
    const response = await fetch(WDFW_SPI_API.metrics);

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    console.log("WDFW API response:", data);

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
    console.warn("Failed to fetch live WDFW data, using fallback:", error);
    return null;
  }
}

/* =========================
   LEAFLET MAP SETUP
   ========================= */

const map = L.map("map", {
  scrollWheelZoom: true,
  attributionControl: true
}).setView([48.0, -122.2], 8);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
  maxZoom: 18,
  minZoom: 7
}).addTo(map);

/* =========================
   HABITAT ZONES LAYER
   ========================= */

const habitatZones = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Upper Skagit Spawning Area", suitability: "optimal" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.05, 48.4],
            [-122.0, 48.38],
            [-121.98, 48.3],
            [-122.03, 48.28],
            [-122.05, 48.4]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "Sauk River Confluence", suitability: "marginal" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.15, 48.32],
            [-122.1, 48.3],
            [-122.08, 48.22],
            [-122.13, 48.2],
            [-122.15, 48.32]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "Skagit Estuary", suitability: "optimal" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.35, 48.5],
            [-122.3, 48.48],
            [-122.25, 48.45],
            [-122.3, 48.47],
            [-122.35, 48.5]
          ]
        ]
      }
    }
  ]
};

L.geoJSON(habitatZones, {
  style: function (feature) {
    return {
      color: getHabitatColor(feature.properties.suitability),
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.3
    };
  },
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<strong>🏞️ " +
        feature.properties.name +
        "</strong><br/>" +
        "Habitat Suitability: " +
        feature.properties.suitability
    );
  }
}).addTo(map);

/* =========================
   MAP LEGEND
   ========================= */

const legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
  const div = L.DomUtil.create("div", "info");
  div.style.background = "white";
  div.style.padding = "12px";
  div.style.borderRadius = "6px";
  div.style.boxShadow = "0 0 15px rgba(0,0,0,0.2)";
  div.style.fontFamily = "sans-serif";
  div.style.fontSize = "13px";

  div.innerHTML = `
    <div class="legend-title">Population Health Status</div>
    <div class="legend-item">
      <div class="legend-color" style="background-color: #dc2626;"></div>
      <span>Critical (&lt;5% of target)</span>
    </div>
    <div class="legend-item">
      <div class="legend-color" style="background-color: #ea580c;"></div>
      <span>Endangered (&lt;10%)</span>
    </div>
    <div class="legend-item">
      <div class="legend-color" style="background-color: #ca8a04;"></div>
      <span>Threatened (&lt;25%)</span>
    </div>
    <div class="legend-item">
      <div class="legend-color" style="background-color: #22c55e;"></div>
      <span>Stable (≥25%)</span>
    </div>
    <hr style="margin: 8px 0; border: none; border-top: 1px solid #e2e8f0;">
    <div class="legend-title" style="margin-top: 8px;">Habitat Suitability</div>
    <div class="legend-item">
      <div class="legend-color" style="background-color: #22c55e;"></div>
      <span>Optimal</span>
    </div>
    <div class="legend-item">
      <div class="legend-color" style="background-color: #ca8a04;"></div>
      <span>Marginal</span>
    </div>
    <div class="legend-item">
      <div class="legend-color" style="background-color: #dc2626;"></div>
      <span>Unsuitable</span>
    </div>
  `;
  return div;
};
legend.addTo(map);

/* =========================
   DASHBOARD INITIALIZATION
   ========================= */

async function initDashboard() {
  try {
    let watershedData = await fetchWDFWData();

    if (!watershedData || watershedData.length === 0) {
      console.log("Using fallback watershed data");
      watershedData = FALLBACK_WATERSHED_DATA;
    } else {
      console.log("Successfully loaded live WDFW data");
    }

    /* Build GeoJSON from watershed data */
    const geoJSON = {
      type: "FeatureCollection",
      features: watershedData.map((ws, idx) => ({
        type: "Feature",
        properties: {
          name: ws.watershed,
          population: ws.population,
          recoveryTarget: ws.recoveryTarget,
          latestYear: ws.latestYear,
          targetYear: ws.targetYear,
          status: ws.status,
          estuary: ws.estuary,
          tributaries: ws.tributaries || []
        },
        geometry: {
          type: "Point",
          coordinates: [-122.2 + (Math.random() - 0.5) * 0.5, 48.0 + idx * 0.15]
        }
      }))
    };

    /* Add watersheds to map */
    const watershedLayer = L.geoJSON(geoJSON, {
      pointToLayer: function (feature, latlng) {
        const radius = Math.sqrt((feature.properties.population || 1) / Math.PI) * 3000;
        return L.circle(latlng, {
          radius: Math.max(radius, 1000),
          color: "#1a5f7a",
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.6,
          fillColor: getPopulationColor(
            feature.properties.population,
            feature.properties.recoveryTarget
          )
        });
      },
      onEachFeature: function (feature, layer) {
        const name = feature.properties.name;
        const pop = feature.properties.population;
        const target = feature.properties.recoveryTarget;
        const pct = target > 0 ? ((pop / target) * 100).toFixed(1) + "%" : "—";

        const popup = `
          <strong>${name}</strong><br/>
          <strong>Population:</strong> ${pop.toLocaleString()} spawners<br/>
          <strong>Recovery Target:</strong> ${target.toLocaleString()}<br/>
          <strong>Status:</strong> ${statusLabel(pop, target)} (${pct})<br/>
          <strong>Estuary:</strong> ${feature.properties.estuary}<br/>
          <em style="font-size: 0.85rem; color: #666;">Click for more details</em>
        `;

        layer.bindPopup(popup);
        layer.on("click", function () {
          updateDetailedStatus(feature.properties);
        });
      }
    }).addTo(map);

    /* Fit map to data */
    try {
      const bounds = L.latLngBounds(
        geoJSON.features.map((f) =>
          L.latLng(f.geometry.coordinates[1], f.geometry.coordinates[0])
        )
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } catch (e) {
      console.log("Could not fit bounds:", e);
    }

    /* =========================
       REGIONAL STATUS CARD
       ========================= */

    const totalPop = watershedData.reduce((sum, ws) => sum + (ws.population || 0), 0);
    const totalTarget = watershedData.reduce((sum, ws) => sum + (ws.recoveryTarget || 0), 0);
    const percentOfTarget = totalTarget > 0 ? ((totalPop / totalTarget) * 100).toFixed(1) : "—";
    const gap = totalTarget - totalPop;

    document.getElementById("status-content").innerHTML = `
      <div class="status-card ${statusClass(totalPop, totalTarget)}">
        <p><strong>📊 Puget Sound Region (${watershedData.length} Watersheds)</strong></p>
        <p style="margin-top: 0.5rem;"><strong>Total Population:</strong> ${totalPop.toLocaleString()} spawning adults</p>
        <p><strong>Recovery Target:</strong> ${totalTarget.toLocaleString()}</p>
        <p><strong>Regional Status:</strong> <strong style="font-size: 1.1rem;">${percentOfTarget}%</strong> of target</p>
        <p style="margin-top: 0.75rem; font-size: 0.95rem; line-height: 1.5;">
          <strong>⚠️ Recovery Gap:</strong> ${gap.toLocaleString()} additional spawners needed to reach recovery targets across all watersheds
        </p>
      </div>

      <div style="margin-top: 1rem; padding: 0.75rem; background-color: #f0f9ff; border-radius: 6px; border-left: 3px solid #0284c7;">
        <p style="font-size: 0.9rem; margin: 0;"><strong>📈 Individual Watersheds:</strong></p>
        ${watershedData
          .map(
            (ws) => `
          <div style="margin-top: 0.5rem; font-size: 0.85rem; padding: 0.25rem 0;">
            ${ws.watershed}: <strong>${((ws.population / ws.recoveryTarget) * 100).toFixed(
              1
            )}%</strong> of target (${ws.status})
          </div>
        `
          )
          .join("")}
      </div>
    `;

    /* =========================
       WATERSHED COMPARISON CHART
       ========================= */

    const chartLabels = watershedData.map((ws) => ws.watershed.split(" ")[0]);
    const chartPops = watershedData.map((ws) => ws.population);
    const chartTargets = watershedData.map((ws) => ws.recoveryTarget);

    const ctx = document.getElementById("watershedChart").getContext("2d");

    if (window.watershedChartInstance) {
      window.watershedChartInstance.destroy();
    }

    window.watershedChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Current Population",
            data: chartPops,
            backgroundColor: "rgba(220, 38, 38, 0.7)",
            borderColor: "#dc2626",
            borderWidth: 1
          },
          {
            label: "Recovery Target",
            data: chartTargets,
            backgroundColor: "rgba(34, 197, 94, 0.3)",
            borderColor: "#22c55e",
            borderWidth: 2,
            borderDash: [5, 5]
          }
        ]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: true, position: "top", labels: { font: { size: 11 } } },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return `${ctx.dataset.label}: ${Number(ctx.raw).toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          x: {
            stacked: false,
            ticks: { color: "#666", font: { size: 11 } }
          },
          y: {
            ticks: { color: "#666", font: { size: 11 } }
          }
        }
      }
    });

    /* =========================
       TREND CHART
       ========================= */

    const years = [2020, 2021, 2022, 2023, 2024];
    const trendData = [8500, 9200, 9800, 10500, 11184];
    const trendCtx = document.getElementById("populationChart").getContext("2d");

    if (window.populationChartInstance) {
      window.populationChartInstance.destroy();
    }

    window.populationChartInstance = new Chart(trendCtx, {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: "Skagit River (Example Watershed)",
            data: trendData,
            borderColor: "#0284c7",
            backgroundColor: "rgba(2, 132, 199, 0.1)",
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: "#0284c7",
            pointBorderColor: "white",
            pointBorderWidth: 2,
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: true, position: "top", labels: { font: { size: 11 } } },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.8)",
            callbacks: {
              label: function (ctx) {
                return `Population: ${Number(ctx.raw).toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: { color: "#666", font: { size: 11 } },
            title: { display: true, text: "Spawning Adults", color: "#666" }
          },
          x: {
            ticks: { color: "#666", font: { size: 11 } },
            title: { display: true, text: "Year", color: "#666" }
          }
        }
      }
    });

    /* Update timestamp */
    const now = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    document.getElementById("update-time").textContent = now;
  } catch (error) {
    console.error("Error initializing dashboard:", error);
    document.getElementById("status-content").innerHTML = `
      <div class="error">
        <strong>⚠️ Error loading data:</strong> ${error.message}
      </div>
    `;
  }
}

/* =========================
   UPDATE DETAILED STATUS
   ========================= */

function updateDetailedStatus(properties) {
  const status = statusLabel(properties.population, properties.recoveryTarget);
  const pct = ((properties.population / properties.recoveryTarget) * 100).toFixed(1);

  document.getElementById("status-content").innerHTML = `
    <div class="status-card ${statusClass(properties.population, properties.recoveryTarget)}">
      <p><strong>🌊 ${properties.name}</strong></p>
      <p style="margin-top: 0.5rem;"><strong>Population:</strong> ${properties.population.toLocaleString()} spawners (${properties.latestYear})</p>
      <p><strong>Recovery Target:</strong> ${properties.recoveryTarget.toLocaleString()} (Goal Year: ${properties.targetYear})</p>
      <p><strong>Status:</strong> ${status}</p>
      <p><strong>Progress:</strong> ${pct}% of recovery target</p>
      <p style="margin-top: 0.75rem; font-size: 0.9rem;"><strong>Estuary:</strong> ${properties.estuary}</p>
      ${properties.tributaries && properties.tributaries.length > 0 ? `
        <p style="font-size: 0.9rem;"><strong>Key Tributaries:</strong> ${properties.tributaries.join(", ")}</p>
      ` : ""}
    </div>
  `;
}

/* =========================
   INITIALIZE ON PAGE LOAD
   ========================= */

document.addEventListener("DOMContentLoaded", initDashboard);
