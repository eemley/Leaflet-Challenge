
var quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

d3.json(quakeURL, function(data) {
  createFeatures(data.features);
  console.log(data.features)
});

function createFeatures(quakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  var earthquakes = L.geoJSON(quakeData, {
    pointToLayer: function(quakeData, latlng) {
      return L.circle(latlng, {
        radius: radiusSize(quakeData.properties.mag),
        fillColor: circlefillColor(quakeData.properties.mag),
        color: "white",
        fillOpacity: 1,
      });
    },
    
    onEachFeature: onEachFeature
  });

  function radiusSize(magnitude) {
    return magnitude * 20000;
  }
  
  function circlefillColor(magnitude) {
    if (magnitude < 1) {
      return "#ffe7e7"
    }
    else if (magnitude < 2) {
      return "#ffff33"
    }
    else if (magnitude < 3) {
      return "#ff9999"
    }
    else if (magnitude < 4) {
      return "#ff6666"
    }
    else if (magnitude < 5) {
      return "#ff3333"
    }
    else {
      return "#ff0000"
    }
  }

  createMap(earthquakes);
}

function createMap(earthquakes) {
  
  var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  
  var baseMaps = {
    "Grayscalemap": grayscalemap,
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    zoom: 5,
    layers: [grayscalemap, earthquakes]
  });


  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

function getColor(d) {
  return d > 5 ? "#ff0000" :
         d > 4  ? "#ff3333" :
         d > 3  ? "#ff6666" :
         d > 2  ? "#ff9999" :
         d > 1  ? "#ffcccc" :
                  "#ffe7e7" ;
}

var legend = L.control({ position: "bottomright" });
legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "info legend");
      mags = [0, 1, 2, 3, 4, 5];
      labels = [];

  for (var i = 0; i < mags.length; i++) {
    div.innerHTML +=
        '<i style="background:' + getColor(mags[i] + 1) + '"></i> ' +
        mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
}

    return div;
}; 

legend.addTo(myMap);

};