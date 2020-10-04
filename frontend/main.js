const map = L.map('map', {zoomControl: false}).setView([0.051774, 37.905596], 7);

const tileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'theaquarium/ckftpsbun4xqd19k2jfh2xzk1',
    tileSize: 512,
    zoomOffset: -1,
    accessToken,
});

tileLayer.addTo(map);

const layerControl = L.control.layers();
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

const oldPredictionLayer = L.heatLayer(oldPrediction, { radius: 20, max: 1, minOpacity: 0.7, gradient: { 0.1: 'red', 1: 'yellow' } });
layerControl.addOverlay(oldPredictionLayer, 'June Prediction Heatmap');

const newPredictionLayer = L.heatLayer(newPrediction, { radius: 20, max: 1, minOpacity: 0.7, gradient: { 0.1: 'cyan', 1: 'purple' } });
layerControl.addOverlay(newPredictionLayer, 'September Prediction Heatmap');

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
    const dotLayer = L.circle(point, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 6000,
    });
    locustPointMarkers.push(dotLayer);
    const min = 50;
    const max = 240;
    const cost = Math.floor(Math.random() * (max - min + 1) + min);
    dotLayer.bindPopup(`Estimated Economic Impact: $${cost},000`);
});

const locustLayerGroup = L.layerGroup([...locustPointMarkers, locustVelocityLayer]);

layerControl.addOverlay(locustLayerGroup, 'Locust Locations and Movement');

const controlCode = `
    <h2>Find Locust Risk</h2>
    <label for="latitude">Latitude:</label>
    <input type="text" id="latfield" name="latitude" size="10">
    <br><br>
    <label for="longitude">Longitude:</label>
    <input type="text" id="longfield" name="longitude" size="10">
    <br><br>
    <label for="datepicker">Date:</label>
    <input type="text" name="datepicker" id="datefield" size="10">
    <br><br>
    <button id="goButton" onclick="zoomMap()">Go</button>
`;

const finder = L.control.custom({
    position: 'topright',
    content: controlCode,
    style: {
        margin: '10px',
        padding: '10px',
        background: '#eee',
        borderRadius: '5px',
        textAlign: 'center',
    },
    classes: 'findercontrol',
    events: {
        dblclick: (data) => {
            document.querySelector('.findercontrol').style.display = 'none';
        },
    }
});

finder.addTo(map);

L.control.custom({
    position: 'topleft',
    content: '<img src="logo.png" height="150px" style="border-radius: 15px">',
}).addTo(map);

function zoomMap() {
    const latField = document.getElementById('latfield');
    const longField = document.getElementById('longfield');
    const lat = parseFloat(latField.value);
    const long = parseFloat(longField.value);
    if (!(isNaN(lat) || isNaN(long))) {
        try {
            map.setView(L.latLng(lat, long), 7, { animate: true, duration: 1 });
            const markerOptions = [
                {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5,
                    radius: 20000,
                },
                {
                    color: 'green',
                    fillColor: '#0f3',
                    fillOpacity: 0.5,
                    radius: 20000,
                },
            ];
            // 0.7 chance it will say no
            // Connect this to the actual model in the future
            const good = Math.random() > 0.7;
            L.circle(L.latLng(lat, long),
                markerOptions[good ? 1 : 0],
            ).bindPopup(`Area ${good ? 'OK' : 'at Risk'}`).addTo(map);
        } catch (e) {
            console.error('error:', e);
        }
    }
}

const elem = document.querySelector('input[name="datepicker"]');
const datepicker = new Datepicker(elem);
