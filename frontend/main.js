const map = L.map('map').setView([0.051774, 37.905596], 7);

const tileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'theaquarium/ckftpsbun4xqd19k2jfh2xzk1',
    tileSize: 512,
    zoomOffset: -1,
    accessToken,
});

tileLayer.addTo(map);

const layerControl = L.control.layers({
    Tile: tileLayer,
});
layerControl.addTo(map);

const windLayer = L.velocityLayer({
    displayValues: true,
    displayOptions: {
        velocityType: 'Global Wind',
        displayPosition: 'bottomLeft',
        displayEmptyString: 'No data',
    },
    data: windData,
    maxVelocity: 15,
    // lineWidth: 10,
    // particleAge: 1000,
});
layerControl.addOverlay(windLayer, 'Wind');

// const popLayer = L.geoJSON(popData, {
//     style: {
//         color: '#0000ff',
//     },
// });
// layerControl.addOverlay(popLayer, 'Population Density');

const cropLayer = L.geoJSON(cropLandData, {
    style: {
        color: '#82e554',
    },
    onEachFeature: (feature, layer) => {
        if (feature.properties) {
            let popupContent = '';
            if (feature.properties.Main_Crop) {
                popupContent += `Main Crop: ${feature.properties.Main_Crop}<br>`;
            }
            if (feature.properties.Area_Km2) {
                popupContent += `Area (km²): ${feature.properties.Area_Km2}<br>`;
            }
            if (feature.properties.Watering) {
                popupContent += `Watering: ${feature.properties.Watering}<br>`;
            }
            layer.bindPopup(popupContent);
        }
    },
});
layerControl.addOverlay(cropLayer, 'Cropland');

const popHeatMapLayer = L.heatLayer(heatmapPopData, {radius: 7});
layerControl.addOverlay(popHeatMapLayer, 'Population Density Heatmap');

const locustVelocityLayer = L.locustVelocityLayer({
    displayValues: true,
    displayOptions: {
        velocityType: 'Wind',
        displayPosition: 'bottomLeft',
        displayEmptyString: 'No data',
    },
    data: windData,
    maxVelocity: 15,
    maxParticles: locustPoints.length * 5,
    lineWidth: 8,
    locustPoints,
    particleAge: 5,
    speedScaler: 3.5,
});
const locustPointMarkers = [];

locustPoints.forEach((point) => {
    locustPointMarkers.push(L.circle(point, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 5000,
    }));
});

const locustLayerGroup = L.layerGroup([...locustPointMarkers, locustVelocityLayer]);


layerControl.addOverlay(locustLayerGroup, 'Locust Locations and Movement');
