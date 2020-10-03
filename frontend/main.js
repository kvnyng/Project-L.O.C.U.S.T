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

// const popDensityRenderer = L.LeafletGeotiff.plotty({
//     colorScale: 'viridis',
// });

// const popDensityDataUrl = 'data/kenyapop/population_ken_2018-10-01.tif';
// // create layer
// const popDensityLayer = L.leafletGeotiff(popDensityDataUrl, {
//     renderer: popDensityRenderer,
// });
// layerControl.addOverlay(popDensityLayer, 'Population Density');

const popLayer = L.geoJSON(popData, {
    style: {
        color: '#0000ff',
    },
});
layerControl.addOverlay(popLayer, 'Population Density');
