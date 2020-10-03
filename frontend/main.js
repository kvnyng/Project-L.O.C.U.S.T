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

const popHeatMapLayer = L.heatLayer(heatmapPopData, {radius: 5});
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
    maxParticles: 10,
    lineWidth: 100,
    locustPoints: [
        [0.8130, 39.5728],
        [1.8130, 38.5728],
    ],
    // lineWidth: 10,
    particleAge: 200,
});
layerControl.addOverlay(locustVelocityLayer, 'Locust Velocity Layer');
