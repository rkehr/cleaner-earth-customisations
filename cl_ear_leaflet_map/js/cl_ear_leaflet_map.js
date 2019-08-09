let pluginDir = '../wp-content/plugins/cleaner-earth-customisations/cl_ear_leaflet_map/'
let projStyle = {
  radius: 20,
  weight: .5,
  fillOpacity: .7
};
let projColors = {
  perspective:  'rgb(126,174,67)',
  ongoing:      'rgb(201,212,57)',
  planned:      'rgb(229,182,54)',
  previous:     'rgb(158,158,158)'
}
//clamp a value between a min and a max
function clamp(v, min, max){
  if(min > max){
    var tmp = max;
    max = min;
    min = tmp;
  }
  return Math.min(Math.max(v, min), max);
}
//map a value between two ranges
function mapRange(value, x1, y1, x2, y2){
  var r=(value - x1) * (y2 - x2) / (y1 - x1) + x2;
  return clamp(r, x2, y2);
}

//Highlight a hovered country or project
var highlightLayer;
function highlightFeature(e) {
  highlightLayer = e.target;
  highlightLayer.setStyle({
    fillOpacity: .6,
    color: 'rgba(0,0,0,0.6)',
    weight: .5
  });
}

//Inititalize the map
var map = L.map('map', {
    zoomControl:true, maxZoom:8, minZoom:1 ,zoomSnap: 0
}).fitWorld();
var hash = new L.Hash(map);
map.attributionControl.setPrefix('<a href="https://github.com/tomchadwin/qgis2web" target="_blank">qgis2web</a> &middot; <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');
var bounds_group = new L.featureGroup([]);

function setBounds() {
}

//Project Popups
function popProjects(feature, layer) {
    layer.on({
        mouseout: function(e) {
            for (i in e.target._eventParents) {
                e.target._eventParents[i].resetStyle(e.target);
            }
            if (typeof layer.closePopup == 'function') {
                layer.closePopup();
            } else {
                layer.eachLayer(function(feature){
                    feature.closePopup()
                });
            }
        },
        mouseover: highlightFeature,
    });
}

//Project Styles
function styleProjects(feature, type = 'previous'){
  return {
      pane: 'pane_' + type + 'projects',
      radius: projStyle.radius,
      opacity: .7,
      color: 'rgba(35,35,35,1.0)',
      // dashArray: '',
      // lineCap: 'butt',
      // lineJoin: 'miter',
      weight: projStyle.weight,
      fill: true,
      fillOpacity: projStyle.fillOpacity,
      fillColor: projColors[type],
  }
}

map.createPane('pane_allprojects');
map.getPane('pane_allprojects').style.zIndex = 408;
map.getPane('pane_allprojects').style['mix-blend-mode'] = 'normal';



//=================================================
//===Perspective Projects

map.createPane('pane_perspectiveprojects');
map.getPane('pane_perspectiveprojects').style.zIndex = 407;
map.getPane('pane_perspectiveprojects').style['mix-blend-mode'] = 'normal';
var layer_perspectiveprojects = new L.geoJson(json_perspectiveprojects_0, {
    attribution: '',
    pane: 'pane_allprojects',
    onEachFeature: popProjects,
    pointToLayer: function (feature, latlng) {
        var context = {
            feature: feature,
            variables: {}
        };
        return L.circleMarker(latlng, styleProjects(feature, 'perspective'));
    },
});
bounds_group.addLayer(layer_perspectiveprojects);
map.addLayer(layer_perspectiveprojects);




//=================================================
//===Ongoing Projects

map.createPane('pane_ongoingprojects');
map.getPane('pane_ongoingprojects').style.zIndex = 406;
map.getPane('pane_ongoingprojects').style['mix-blend-mode'] = 'normal';
var layer_ongoingprojects = new L.geoJson(json_ongoingprojects_1, {
    attribution: '',
    pane: 'pane_allprojects',
    onEachFeature: popProjects,
    pointToLayer: function (feature, latlng) {
        var context = {
            feature: feature,
            variables: {}
        };
        console.log(feature);
        return L.circleMarker(latlng, styleProjects(feature, 'ongoing'));
    },
});
bounds_group.addLayer(layer_ongoingprojects);
map.addLayer(layer_ongoingprojects);

//=================================================
//===Previous Projects


map.createPane('pane_previousprojects');
map.getPane('pane_previousprojects').style.zIndex = 403;
map.getPane('pane_previousprojects').style['mix-blend-mode'] = 'normal';
var layer_previousprojects = new L.geoJson(json_previousprojects_2, {
    attribution: '',
    pane: 'pane_allprojects',
    onEachFeature: popProjects,
    pointToLayer: function (feature, latlng) {
        var context = {
            feature: feature,
            variables: {}
        };
        return L.circleMarker(latlng, styleProjects(feature, 'previous'));
    },
});
bounds_group.addLayer(layer_previousprojects);
map.addLayer(layer_previousprojects);

//=================================================
//===Planned Projects

map.createPane('pane_plannedprojects');
map.getPane('pane_plannedprojects').style.zIndex = 404;
map.getPane('pane_plannedprojects').style['mix-blend-mode'] = 'normal';
var layer_plannedprojects = new L.geoJson(json_plannedprojects_3, {
    attribution: '',
    pane: 'pane_allprojects',
    onEachFeature: popProjects,
    pointToLayer: function (feature, latlng) {
        var context = {
            feature: feature,
            variables: {}
        };
        return L.circleMarker(latlng, styleProjects(feature, 'planned'));
    },
});
bounds_group.addLayer(layer_plannedprojects);
map.addLayer(layer_plannedprojects);
// var layer_StamenWatercolor_4 = L.tileLayer('http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
//     opacity: 1.0,
//     attribution: '',
// });
var layer_StamenWatercolor_4 = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
layer_StamenWatercolor_4;
map.addLayer(layer_StamenWatercolor_4);


function pop_World_Countries_5(feature, layer) {
  var tCo2PerCapita = feature.properties['tCO2 per capita (2017)_tCO2 per capita (2017)'];
  var countryHue = mapRange(tCo2PerCapita, 0, 21, 120, 0);
  var countrySaturation = 75;
  var countryAlpha = mapRange(tCo2PerCapita, 0, 21, .3, 1);
  if(tCo2PerCapita == null){
    countrySaturation = 0;
    countryAlpha = .9;
  }
  var countryColor = 'hsla(' + countryHue + ', ' + countrySaturation + '%, 50%, ' + countryAlpha + ')';
  var countryName = feature.properties['COUNTRY'];
  var countryCO2 = tCo2PerCapita + ' tCO2 per capita';
  if(!(countryName == undefined)){
    if( tCo2PerCapita == null ){
      countryCO2 = 'No data available.';
    }
    layer.bindTooltip('test', {sticky:true}).addTo(map);
    layer.getTooltip().setContent('<h4>'+ countryName +'</h4>' + '<p>' + countryCO2 + '</p>');
  }

    layer.on({
        mouseout: function(e) {

            for (i in e.target._eventParents) {
                e.target._eventParents[i].resetStyle(e.target);
                layer.setStyle({fillColor: countryColor});
            }
            if (typeof layer.closePopup == 'function') {
                layer.closePopup();
            } else {
                layer.eachLayer(function(feature){
                    feature.closePopup()
                });
            }
        },
        mouseover: highlightFeature,
    });
    layer.setStyle({
      fillColor: countryColor
    });
}

function style_World_Countries_5_0() {
    return {
        pane: 'pane_World_Countries_5',
        opacity: 1,
        color: 'rgba(0,0,0,0)',
        dashArray: '',
        lineCap: 'butt',
        lineJoin: 'miter',
        weight: 0,
        fillOpacity: 1,
    }
}
map.createPane('pane_World_Countries_5');
map.getPane('pane_World_Countries_5').style.zIndex = 401;
map.getPane('pane_World_Countries_5').style['mix-blend-mode'] = 'multiply';
var layer_World_Countries_5 = new L.geoJson(json_World_Countries_5, {
    attribution: '',
    pane: 'pane_World_Countries_5',
    onEachFeature: pop_World_Countries_5,
    style: style_World_Countries_5_0,
});
bounds_group.addLayer(layer_World_Countries_5);
map.addLayer(layer_World_Countries_5);

map.createPane('pane_chlorophyll');
map.getPane('pane_chlorophyll').style.zIndex = 400;
map.getPane('pane_chlorophyll').style['mix-blend-mode'] = 'multiply';
var NASAGIBS_ModisTerraChlorophyll = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_Chlorophyll_A/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
	attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
  pane: 'pane_chlorophyll',
  bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
	minZoom: 1,
	maxZoom: 7,
	format: 'png',
	time: '',
	tilematrixset: 'GoogleMapsCompatible_Level',
	opacity: 0.5
});

var baseMaps = {};
L.control.layers(baseMaps,{
  '<img src="../wp-content/plugins/cleaner-earth-customisations/cl_ear_leaflet_map/legend/World_Countries_5.png" /> CO2 per capita per year': layer_World_Countries_5,
  'Chlorophyll A Concentration' : NASAGIBS_ModisTerraChlorophyll,
  '<img src="../wp-content/plugins/cleaner-earth-customisations/cl_ear_leaflet_map/legend/plannedprojects_3.png" /> Planned projects': layer_plannedprojects,
  '<img src="../wp-content/plugins/cleaner-earth-customisations/cl_ear_leaflet_map/legend/previousprojects_2.png" /> Previous projects': layer_previousprojects,
  '<img src="../wp-content/plugins/cleaner-earth-customisations/cl_ear_leaflet_map/legend/ongoingprojects_1.png" /> Ongoing projects': layer_ongoingprojects,
  '<img src="../wp-content/plugins/cleaner-earth-customisations/cl_ear_leaflet_map/legend/perspectiveprojects_0.png" /> Perspective projects': layer_perspectiveprojects,
},{
  collapsed: false,
  hideSingleBase: true
}).addTo(map);

setBounds();
var i = 0;
layer_perspectiveprojects.eachLayer(function(layer) {
    var context = {
        feature: layer.feature,
        variables: {}
    };
    totalMarkers += 1;
      layer.added = true;
      i++;
});
var i = 0;
layer_ongoingprojects.eachLayer(function(layer) {
    var context = {
        feature: layer.feature,
        variables: {}
    };
    totalMarkers += 1;
      layer.added = true;
      i++;
});
var i = 0;
layer_previousprojects.eachLayer(function(layer) {
    var context = {
        feature: layer.feature,
        variables: {}
    };
    totalMarkers += 1;
      layer.added = true;
      i++;
});
var i = 0;
layer_plannedprojects.eachLayer(function(layer) {
    var context = {
        feature: layer.feature,
        variables: {}
    };
    totalMarkers += 1;
      layer.added = true;
      i++;
});
var i = 0;
map.on("zoomend", function(){});
map.on("layeradd", function(){});
map.on("layerremove", function(){});
map.scrollWheelZoom.disable();
