// Sample data - you'll load real WDFW data later
const populationData = {
  years: [
    2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016,
    2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
  ],
  counts: [
    1850, 1720, 1950, 1680, 1520, 1450, 1380, 1290, 1410, 1240, 1180, 1050, 980,
    875, 920, 845, 780, 710, 745, 432,
  ],
};

// Initialize Leaflet map
const map = L.map("map").setView([48.35, -122.15], 9);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
  maxZoom: 19,
}).addTo(map);

// Add Skagit River (sample GeoJSON - replace with real data)
const skagitRiver = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Skagit River Watershed" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.3, 48.5],
            [-122.1, 48.45],
            [-121.95, 48.25],
            [-122.05, 48.1],
            [-122.25, 48.15],
            [-122.3, 48.5],
          ],
        ],
      },
    },
  ],
};

L.geoJSON(skagitRiver, {
  style: {
    color: "#1a5f7a",
    weight: 3,
    opacity: 0.8,
    fillOpacity: 0.2,
    fillColor: "#2ecc71",
  },
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<strong>" +
        feature.properties.name +
        "</strong><br>ESA-listed threatened species",
    );
  },
}).addTo(map);

// Add sample spawning habitat zones
const habitatZones = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Upper Skagit", suitability: "optimal" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.05, 48.4],
            [-122.0, 48.38],
            [-121.98, 48.3],
            [-122.03, 48.28],
            [-122.05, 48.4],
          ],
        ],
      },
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
            [-122.15, 48.32],
          ],
        ],
      },
    },
  ],
};

function getHabitatColor(suitability) {
  if (suitability === "optimal") return "#2ecc71";
  if (suitability === "marginal") return "#f39c12";
  return "#e74c3c";
}

L.geoJSON(habitatZones, {
  style: function (feature) {
    return {
      color: getHabitatColor(feature.properties.suitability),
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.4,
    };
  },
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<strong>" +
        feature.properties.name +
        "</strong><br>" +
        "Suitability: " +
        feature.properties.suitability,
    );
  },
}).addTo(map);

// Add legend
const legend = L.control({ position: "bottomright" });
legend.onAdd = function (map) {
  const div = L.DomUtil.create("div", "info");
  div.style.background = "white";
  div.style.padding = "10px";
  div.style.borderRadius = "5px";
  div.style.boxShadow = "0 0 15px rgba(0,0,0,0.2)";
  div.innerHTML = `
    <h4 style="margin: 0 0 10px 0; color: #1a5f7a;">Spawning Habitat</h4>
    <p style="margin: 5px 0;"><i style="background: #2ecc71; width: 18px; height: 18px; display: inline-block; border-radius: 3px;"></i> Optimal</p>
    <p style="margin: 5px 0;"><i style="background: #f39c12; width: 18px; height: 18px; display: inline-block; border-radius: 3px;"></i> Marginal</p>
    <p style="margin: 5px 0;"><i style="background: #e74c3c; width: 18px; height: 18px; display: inline-block; border-radius: 3px;"></i> Unsuitable</p>
  `;
  return div;
};
legend.addTo(map);

// Color watersheds by population health status
function getPopulationColor(population, target) {
  const percentOfTarget = (population / target) * 100;
  if (percentOfTarget < 5) return "#8b0000"; // Dark red - critical
  if (percentOfTarget < 10) return "#e74c3c"; // Red - endangered
  if (percentOfTarget < 15) return "#f39c12"; // Orange - threatened
  return "#2ecc71"; // Green - stable (unlikely)
}

// Population status update
const latestYear = populationData.years[populationData.years.length - 1];
const latestCount = populationData.counts[populationData.counts.length - 1];
const previousCount = populationData.counts[populationData.counts.length - 2];
const change = latestCount - previousCount;
const percentChange = ((change / previousCount) * 100).toFixed(1);

document.getElementById("status-content").innerHTML = `
  <p><strong>Current Year:</strong> ${latestYear}</p>
  <p><strong>Spawning Count:</strong> ${latestCount}</p>
  <p><strong>10-Year Average:</strong> ${Math.round(populationData.counts.slice(-10).reduce((a, b) => a + b) / 10)}</p>
  <p style="color: ${change < 0 ? "#e74c3c" : "#2ecc71"};">
    <strong>Change from ${latestYear - 1}:</strong> ${change > 0 ? "+" : ""}${change} (${percentChange}%)
  </p>
  <p style="font-size: 0.85rem; margin-top: 0.75rem; color: #666;">
    ⚠️ <strong>Critical:</strong> Populations remain well below recovery goals
  </p>
`;

// Calculate regional statistics
fetch("data/puget-sound-watersheds.geojson")
  .then((res) => res.json())
  .then((data) => {
    const features = data.features;
    const totalPop = features.reduce(
      (sum, f) => sum + f.properties.population_2024,
      0,
    );
    const totalTarget = features.reduce(
      (sum, f) => sum + f.properties.recovery_target,
      0,
    );
    const percentOfTarget = ((totalPop / totalTarget) * 100).toFixed(1);
    const gap = totalTarget - totalPop;

    document.getElementById("status-content").innerHTML = `
      <p><strong>Puget Sound Region (8 Watersheds)</strong></p>
      <p style="margin-top: 0.75rem;"><strong>Total Population:</strong> ${totalPop.toLocaleString()} spawning adults</p>
      <p><strong>Recovery Target:</strong> ${totalTarget.toLocaleString()}</p>
      <p><strong>Regional Status:</strong> ${percentOfTarget}% of target</p>
      <p style="color: #e74c3c; background: #ffe6e6; padding: 0.5rem; border-radius: 4px; margin-top: 0.75rem;">
        ⚠️ <strong>Critical Gap:</strong> ${gap.toLocaleString()} additional spawners needed
      </p>
      <p style="font-size: 0.85rem; margin-top: 0.75rem; color: #666;">
        📊 <strong>Most Endangered:</strong> Duwamish (4.2% of target)<br>
        📈 <strong>Least Endangered:</strong> Chambers-Clover (10.3% of target)
      </p>
    `;
  });

  // Load watershed comparison data
fetch('data/puget-sound-watersheds.geojson')
  .then(res => res.json())
  .then(data => {
    const watersheds = data.features.map(f => f.properties.name);
    const populations = data.features.map(f => f.properties.population_2024);
    const targets = data.features.map(f => f.properties.recovery_target);
    
    // Create comparison chart
    const ctx = document.getElementById('watershedChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: watersheds,
        datasets: [
          {
            label: 'Current Population',
            data: populations,
            backgroundColor: 'rgba(231, 76, 60, 0.7)',
            borderColor: '#e74c3c',
            borderWidth: 1
          },
          {
            label: 'Recovery Target',
            data: targets,
            backgroundColor: 'rgba(46, 204, 113, 0.3)',
            borderColor: '#2ecc71',
            borderWidth: 1
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: true, position: 'top' }
        },
        scales: {
          x: {
            stacked: false,
            ticks: { color: '#666' }
          }
        }
      }
    });
  });

