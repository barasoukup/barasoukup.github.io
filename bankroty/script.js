var rok = "2021";
var valUj = "kraje";
var valIndi = "pob";
var viewPrehled = 0;
var lOkresy;
var autoLayer = false;
var isComparing = false;
var showUJ = true;
var map = L.map('map', {
  zoomControl: false,
  doubleClickZoom: false
});
var l = "cs";
var redIcon = new L.Icon({
  iconUrl: 'images/marker-icon-2x-red.png',
  shadowUrl: 'images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
map.createPane('obrysy');
map.getPane('obrysy').style.zIndex = 550;
map.getPane('obrysy').style.pointerEvents = 'none';
L.Control.include({
  _refocusOnMap: L.Util.falseFn // Do nothing.
});
base = L.tileLayer('https://api.mapbox.com/styles/v1/soukupma/cjky0su5j3dz52roblmfh2c4o/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic291a3VwbWEiLCJhIjoiMGVjMjZjMWZmYzM1YjAxZDYwMmViNWU4NTQzZWNmYjUifQ.t-OJ7Re1gQXfP1vpY1ASVA', {
  minZoom: 5,
  maxZoom: 20,
  attribution: 'Podkladová mapa &copy; <a href="https://www.mapbox.com/">Mapbox</a>, &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, zdroj dat Insolvenční rejstřík',
  //mapid: 'soukupma.68f89de5'
});
map.addLayer(base);
function resetView() {
  map.fitBounds([
    [48.5, 12.0],
    [51.1, 21.5]
  ]);
}
resetView();
map.spin(true);
L.control.zoom({
  position: 'bottomright'
}).addTo(map);
var icko = L.control({
  position: 'bottomright'
});
icko.onAdd = function(map) {
  this._div = L.DomUtil.create('div', 'icko');
  this._div.innerHTML =
    '<a id="icko_rozbal" onclick="icko.rozbal()" href="#" ><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANOSURBVGhD7dlJyE1xHMbx15wMKcPCwspQosRCiR0bhOxQWIgdkQVhgQUZVpRiYSjTwsJYEtmQZAoRC0IiMhTKzPdZ3Hq7Pe85/+Hce6X3qc+C/r9z733vPf/hd9o6859nOOZjMw7jJC7gLI5jO5ZgArrhn8pE7MIL/InwHscwAz3QknTFXNyAe5Ox9EdYjt5oWsbhKtwbyvUMs9HQ6FtYjx9wb6JKur/6o/L0xTm4F22Ux9DkUVkG4TrcizXaa4xHdvRNXIN7kWZ5g6xvRvfEebiLx/qNl0i9vzQJDERS1sFdNNY+1N5EL6zGN7ixRc6gC6KiKfYn3AVjnIDLWrjxZZYhOPrUVa0TWrVdhsCNL/MOgxEUrdjuIimmwmUA3PgQOxGUqrYdshcuS+HGh/gELQmF0QbQFefYgJ6oZR4+w40NtQqF2Q1XmOsjtKi+avd/OW6jMLFb8VYaBhutnq7gX7UYNgvgCmL8gk6EOltMwhhMx0bo5+VqUu2BzSa4glA7MBQdZSS0DrjaFJdgcwiuIIR2AaMwB5qVtOC56Dzj6lM8gc0puIIQ+iD6WdX+fQcu09C+LscH2FyEK0ihRctlJtz4FPrj2Wh36QpSPISLJgE3PoUmD5ujcAUpDsIl5z6spzXPZhtcQYqFqI921TpcufEptEO3UQfQFcTSTe9mLZ1x3PhUB2CjNqYriHUTLmvgxqfS/WajXqzamK4ohvq+Lpfhxqcaiw6jXqwrijEZ9VE35jvc+BTPUXh+z53nv8I1pKtcCGULCtMd+rSuOMRduFS5fmgyGYHSrIC7QIiONnI60bnxKfScJShq7ash5i5S5h5ctCvWzuE+TiN1X6f7bDSCo12su1CIKSjLfrjaMlq0o3ME7mJl3mIW6mcVtYDUPUntmT1AH0SnHx7BXTSEPtAV6PnhLeQ8V/kCnTaTo3O8uuHu4s2i7bq+4ezo+USrPoy+xUWoLDrGPoV7sUZRE08LdOXRo4EqD19FdDDLuifKoplIrf0quyHt6aekKTZpdkqJmsjqiuf2cGu07dCGNWqxqzL6ua2EuibuDZbRDmIrgvZOzYp6sZph1AFUR0Z9J51v9NdWo0BnbD1Y1aqu/ZzOE4Vb8c50puVpa/sLVe+J6OGq49MAAAAASUVORK5CYII=" width="35px"></a>';
  return this._div;
};
icko.addTo(map);
icko.rozbal = function() {
  icko._div.innerHTML = '<div class="info"><h4>Zdroj dat</h4>' +
    '<ul><li><b>Insolvenční rejstřík</b></li>' +
    '<li><b>Český statistický úřad</b></li></ul>' +
    '<h4>Časová období</h4>' +
    '<ul><li><b>2018</b></li><li><b>2019</b></li></ul>' +
    'Údaje o počtu exekucí pochází z roku 2018 (kraje, okresy) a 2017 (nižší jednotky)' +
    '<div class="right"><a onclick="icko.sbal()" href="#" ><img src="images/70206.png" width="12px"></a></div></div>';
};
icko.sbal = function() {
  icko._div.innerHTML = '<a id="icko_rozbal" onclick="icko.rozbal()" href="#" ><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANOSURBVGhD7dlJyE1xHMbx15wMKcPCwspQosRCiR0bhOxQWIgdkQVhgQUZVpRiYSjTwsJYEtmQZAoRC0IiMhTKzPdZ3Hq7Pe85/+Hce6X3qc+C/r9z733vPf/hd9o6859nOOZjMw7jJC7gLI5jO5ZgArrhn8pE7MIL/InwHscwAz3QknTFXNyAe5Ox9EdYjt5oWsbhKtwbyvUMs9HQ6FtYjx9wb6JKur/6o/L0xTm4F22Ux9DkUVkG4TrcizXaa4xHdvRNXIN7kWZ5g6xvRvfEebiLx/qNl0i9vzQJDERS1sFdNNY+1N5EL6zGN7ixRc6gC6KiKfYn3AVjnIDLWrjxZZYhOPrUVa0TWrVdhsCNL/MOgxEUrdjuIimmwmUA3PgQOxGUqrYdshcuS+HGh/gELQmF0QbQFefYgJ6oZR4+w40NtQqF2Q1XmOsjtKi+avd/OW6jMLFb8VYaBhutnq7gX7UYNgvgCmL8gk6EOltMwhhMx0bo5+VqUu2BzSa4glA7MBQdZSS0DrjaFJdgcwiuIIR2AaMwB5qVtOC56Dzj6lM8gc0puIIQ+iD6WdX+fQcu09C+LscH2FyEK0ihRctlJtz4FPrj2Wh36QpSPISLJgE3PoUmD5ujcAUpDsIl5z6spzXPZhtcQYqFqI921TpcufEptEO3UQfQFcTSTe9mLZ1x3PhUB2CjNqYriHUTLmvgxqfS/WajXqzamK4ohvq+Lpfhxqcaiw6jXqwrijEZ9VE35jvc+BTPUXh+z53nv8I1pKtcCGULCtMd+rSuOMRduFS5fmgyGYHSrIC7QIiONnI60bnxKfScJShq7ash5i5S5h5ctCvWzuE+TiN1X6f7bDSCo12su1CIKSjLfrjaMlq0o3ME7mJl3mIW6mcVtYDUPUntmT1AH0SnHx7BXTSEPtAV6PnhLeQ8V/kCnTaTo3O8uuHu4s2i7bq+4ezo+USrPoy+xUWoLDrGPoV7sUZRE08LdOXRo4EqD19FdDDLuifKoplIrf0quyHt6aekKTZpdkqJmsjqiuf2cGu07dCGNWqxqzL6ua2EuibuDZbRDmIrgvZOzYp6sZph1AFUR0Z9J51v9NdWo0BnbD1Y1aqu/ZzOE4Vb8c50puVpa/sLVe+J6OGq49MAAAAASUVORK5CYII=" width="35px"></a>';
};
var prehled = L.control({
  position: 'topleft'
});
prehled.onAdd = function(map) {
  this._div = L.DomUtil.create('div', 'prehled');
  this._div.innerHTML =
    '<div id="prehledTable"><table><tr><td class="grey bold">ČESKÁ REPUBLIKA</td><td class="right grey bold">2020</td><td class="right grey bold">meziroční změna</td></tr>' +
    '<tr><td>Počet osob v osobním bankrotu</td><td class="right bold">115 tis.</td><td class="right">-1 %</td></tr>' +
    '<tr><td>Podíl osob v bankrotu</td><td class="right bold">1,27 %</td><td class="right">-0,02 p.b.</td></tr>' +
    '<tr><td>Podíl muži / ženy</td><td class="right bold">54 % / 46 %</td><td class="right">+2 p.b. muži</td></tr>' +
    '<tr><td>Podíl manželů</td><td class="right bold">27 %</td><td class="right">-2 p.b.</td></tr>' +
    '<tr><td>Průměrný / mediánový věk</td><td class="right bold">45,8 / 45</td><td class="right">+2,1 / +2</td></tr>' +
    '<tr><td>Osobní bankroty vs. exekuce</td><td class="right bold">14,02 %</td><td class="right">-0,16 p.b.</td></tr>' +
    '<tr><td><u>Věková struktura osob v bankrotu:</u></td></tr>' +
    '<tr><td>Podíl (počet) osob ve věku 18 až 29 let</td><td class="right bold">8 % (9 470)</td><td class="right">-5 283</td></tr>' +
    '<tr><td>Podíl (počet) osob ve věku 30 až 39 let</td><td class="right bold">26 % (29 898)</td><td class="right">-1 403</td></tr>' +
    '<tr><td>Podíl (počet) osob ve věku 40 až 49 let</td><td class="right bold">30 % (34 059)</td><td class="right">-153</td></tr>' +
    '<tr><td>Podíl (počet) osob ve věku 50 až 65 let</td><td class="right bold">27 % (31 458)</td><td class="right">+3 285</td></tr>' +
    '<tr><td>Podíl (počet) seniorů (65+ let)</td><td class="right bold">8 % (9 712)</td><td class="right">2 236</td></tr>'+
    '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td class="right"><a id="togglePrehledLink" onclick="togglePrehled()" href="#"><img src="images/70206.png" width="12px"></a></td></tr></table></div>'+
    '<div id="showSouhrnne" style="display:none"><a id="togglePrehledLink" onclick="togglePrehled()" href="#">Zobrazit souhrnné údaje</a></div> ';
  return this._div;
};
prehled.addTo(map);
var zrusit = L.control({
  position: 'topright'
});
zrusit.onAdd = function(map) {
  this._div = L.DomUtil.create('div', 'zrusit');
  this._div.innerHTML =
    '<a id="togglePrehledLink" onclick="cancelResults()" href="#"><img src="images/70206.png" width="12px"> Skrýt výsledky vyhledávání</a>';
  return this._div;
};
function cancelResults() {
  searchPoints.removeFrom(map);
  map.removeControl(zrusit);
}
var photonControlOptions = {
  limit: 20,
  resultsHandler: showSearchPoints,
  noResultLabel: 'žádné výsledky',
  placeholder: 'Vyhledej obec',
  position: 'topright',
  includePosition: false,
  feedbackEmail: null,
  osm_tag: 'boundary:administrative',
  formatResult: function(feature, el) {
    var title = L.DomUtil.create('strong', '', el),
      detailsContainer = L.DomUtil.create('small', '', el),
      details = [];
    title.innerHTML = feature.properties.name;
    if (feature.properties.city && feature.properties.city !== feature.properties.name) {
      details.push(feature.properties.city);
    }
    if (feature.properties.country) details.push(feature.properties.country);
    detailsContainer.innerHTML = details.join(', ');
  },
  onSelected: function(feature) {
    this.map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 12);
    valUj = "obce";
    var $radios = $('input:radio[name=uj]');
    $radios.filter('[value=obce]').prop('checked', true);
    switchMap([feature.geometry.coordinates[0], feature.geometry.coordinates[1]]);
  },
};
var searchControl = L.control.photon(photonControlOptions);
searchControl.addTo(map);
var searchPoints = L.geoJson(null, {
  onEachFeature: function(feature, layer) {
    layer.bindTooltip(feature.properties.name);
  }
});
function showSearchPoints(geojson) {
  searchPoints.clearLayers();
  searchPoints.addData(geojson);
  searchPoints.addTo(map);
  zrusit.addTo(map);
}
function getColor2(props) {
  try {
    if (valIndi == "pob") {
      d = props["b"+rok.substring(3,4)+"c"] * 100 / props["o"+rok.substring(3,4)];
    } else if (valIndi == "bve") {
      d = props["b"+rok.substring(3,4)+"c"] * 100 / props["poe"+rok.substring(3,4)];
    } else if (valIndi == "pob_change9") {
          if (props["b8c"] > 0) {
            d = (props["b9c"] / props["b8c"] - 1) * 100;
          } else {
            d = 0;
          }
    } else if (valIndi == "pob_change0") {
          if (props["b9c"] > 0) {
            d = (props["b0c"] / props["b9c"] - 1) * 100;
          } else {
            d = 0;
          }
    } else if (valIndi == "pob_change1") {
          if (props["b0c"] > 0) {
            d = (props["b1c"] / props["b0c"] - 1) * 100;
          } else {
            d = 0;
          }
    } else if (valIndi == "pob_changec") {
          if (props["b8c"] > 0) {
            d = (props["b1c"] / props["b8c"] - 1) * 100;
          } else {
            d = 0;
          }
    }
    return getColor3(d);
  } catch (err) {
    return getColor3(0);
  }
}
function getColor3(d) {
  if ($.isNumeric(d)) {
    for (i = 0; i < breaks[valIndi][valUj]['colors'].length; i++) {
      if (d < breaks[valIndi][valUj]['breaks'][i]) {
        return breaks[valIndi][valUj]['colors'][i];
      }
    }
    return breaks[valIndi][valUj]['colors'][breaks[valIndi][valUj]['colors'].length - 1];
  } else {
    return breaks[valIndi][valUj]['colors'][0];
  }
}
function style(feature) {
  if (comparingList.indexOf(feature) != -1) {
    return {
      weight: 5,
      opacity: 1,
      color: '#C44E37',
      dashArray: '',
      fillOpacity: 0.7,
      fillColor: getColor2(feature.properties)
    };
  } else {
    return {
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      fillColor: getColor2(feature.properties)
    };
  }
}
function styleK(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: '#666',
    dashArray: '',
    fillOpacity: 0
  };
}
function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}
function resetHighlight(e) {
  lyr.resetStyle(e.target);
}
function ntn(number, digits /*, units*/ ) {
  if (isNaN(number)) {
    numberText = "neposkytnuto";
  } else {
  if (digits === undefined) {
    digits = 0;
  };
  numberText = parseFloat(number).toLocaleString('cs-CZ', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}
  return numberText;
};
function onEachFeature(feature, layer) {
  layer.bindTooltip(generateTooltip(feature), {
    sticky: true
  });
  layer.on('mouseover', function(e) {
    layer.openTooltip();
  });
  layer.on('mouseout', function() {
    layer.closeTooltip();
  });
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: compare
  });
}
var comparingList = [];
function switchMap(coor) {
  map.spin(true);
  legendUpdate();
  loKraje.removeFrom(map); //krajske obrysy
  if (valUj == "kraje") {
    nlyr = lKraje;
  } else if (valUj == "okresy") {
    loKraje.addTo(map);
    if (typeof lOkresy === 'undefined') {
      lOkresy = new L.GeoJSON.AJAX("okresy.geojson", {
        style: style,
        onEachFeature: onEachFeature
      });
    }
    nlyr = lOkresy;
  } else if (valUj == "orp") {
    loKraje.addTo(map);
    if (typeof lOrp === 'undefined') {
      lOrp = new L.GeoJSON.AJAX("orp.geojson", {
        style: style,
        onEachFeature: onEachFeature
      });
    }
    nlyr = lOrp;
  } else if (valUj == "pou") {
    loKraje.addTo(map);
    if (typeof lPou === 'undefined') {
      lPou = new L.GeoJSON.AJAX("pou.geojson", {
        style: style,
        onEachFeature: onEachFeature
      });
    }
    nlyr = lPou;
  } else if (valUj == "obce") {
    loKraje.addTo(map);
    if (typeof lObce === 'undefined') {
      lObce = new L.GeoJSON.AJAX("obce.geojson", {
        style: style,
        onEachFeature: onEachFeature
      });
    }
    nlyr = lObce;
  }
  if (lyr != nlyr) {
    comparingList = [];
    comparing.update();
    lyr.removeFrom(map);
    lyr = nlyr;
  }
  lyr.setStyle(style);
  lyr.eachLayer(function(layer) {
    layer._tooltip.setContent(generateTooltip(layer.feature));
  });
  if (showUJ) {
  lyr.addTo(map);
  }
  map.spin(false);
}
function compare(e) {
  if (($(window).width() > 500) && ($(window).height() > 400)) {
    var index = comparingList.indexOf(e.target.feature);
    if (index != -1) {
      comparingList.splice(index, 1);
      if (comparingList.length == 0) {
        comparing.remove();
      }
      comparing.update();
      lyr.resetStyle(e.target);
    } else {
      if (comparingList.length == 0) {
        comparing.addTo(map);
      }
      comparingList.push(e.target.feature);
      comparing.update();
      var layer = e.target;
      layer.setStyle({
        weight: 5,
        color: '#C44E37',
        opacity: 1,
        dashArray: '',
        fillOpacity: 0.5
      });
    }
  }
}
function makeDivInfo(feature, index) {
  var div = L.DomUtil.create('div', 'uj right');
  props = feature.properties;
  if (valUj == "kraje" || valUj == "okresy" || valUj == "orp" || valUj == "pou") {
  heading = '<table><tr><td class="grey"><b>' + props.n.toUpperCase() + '</b>&nbsp;&nbsp;<a title="Resetovat" href="#" onclick="cancel(' + index + ');return false;"><img src="images/70206.png" width="12px"></a></td></tr>';
}
   if (valUj == "okresy" || valUj == "orp" || valUj == "pou") {
    heading += '<tr><td><span class="italic">' + props.k.replace(/ /g, '&nbsp;') + '</span></td></tr>';
  } else if (valUj == "obce") {
    heading = '<table><tr><td class="grey"><b>' + props.b.toUpperCase() + '</b>&nbsp;&nbsp;<a title="Resetovat" href="#" onclick="cancel(' + index + ');return false;"><img src="images/70206.png" width="12px"></a></td></tr>';
    heading += '<tr><td><span class="italic">okres ' + props.r.replace(/ /g, '&nbsp;') + ", " +  props.k.replace(/ /g, '&nbsp;') +'</span></td></tr>';
  }
  t = heading +'<tr><td>'+ ntn(props["b"+rok.substring(3,4)+"c"]) + '</td></tr>';
    t+=  '<tr><td>'+'<b>'+ntn(props["b"+rok.substring(3,4)+"c"] * 100 / props["o"+rok.substring(3,4)], 2) + ' %</b></td></tr>'+
      '<tr><td>'+ntn(props["b"+rok.substring(3,4)+"pv"], 1) + '</td></tr>'+
      '<tr><td>'+ntn(props["b"+rok.substring(3,4)+"m"]*100/props["b"+rok.substring(3,4)+"c"], 0)+" % / "+ ntn(props["b"+rok.substring(3,4)+"z"]*100/props["b"+rok.substring(3,4)+"c"], 0)+ ' %</td></tr>'+
      '<tr><td>'+ntn(props["b"+rok.substring(3,4)+"p"]*100/props["b"+rok.substring(3,4)+"c"],1) + ' %</td></tr>'+
      '<tr><td>'+ntn(props["b"+rok.substring(3,4)+"v_p"],1) +"/" + ntn(props["b"+rok.substring(3,4)+"v_m"],0) + '</td></tr>'+
      '<tr><td>'+ntn(props["b"+rok.substring(3,4)+"c"] * 100 / props["poe"+rok.substring(3,4)], 2)+'% </td></tr>'+
      '<tr class="odsadit"><td>&nbsp;</td></tr>'+
      '<tr><td>'+ntn(props["b"+rok.substring(3,4)+"v18_29"] * 100 / props["b"+rok.substring(3,4)+"c"],0) + ' % (' + ntn(props["b"+rok.substring(3,4)+"v18_29"]) + ')</td></tr>'+
      '<tr><td>'+ntn(props["b"+rok.substring(3,4)+"v30_39"] * 100 / props["b"+rok.substring(3,4)+"c"],0) + ' % (' + ntn(props["b"+rok.substring(3,4)+"v30_39"]) + ')</td></tr>'+
      '<tr><td>'+ntn(props["b"+rok.substring(3,4)+"v40_49"] * 100 / props["b"+rok.substring(3,4)+"c"],0) + ' % (' + ntn(props["b"+rok.substring(3,4)+"v40_49"]) + ')</td></tr>'+
      '<tr><td>'+ntn(props["b"+rok.substring(3,4)+"v50_64"] * 100 / props["b"+rok.substring(3,4)+"c"],0) + ' % (' + ntn(props["b"+rok.substring(3,4)+"v50_64"]) + ')</td></tr>'+
      '<tr><td>'+ntn(props["b"+rok.substring(3,4)+"v65_"] * 100 / props["b"+rok.substring(3,4)+"c"],0) + ' % (' + ntn(props["b"+rok.substring(3,4)+"v65_"]) + ')</td></tr></table>';
  div.innerHTML = t;
  return div;
};
function compareSecondColumn(a, b) {
  if (a[1] === b[1]) {
    return 0;
  } else {
    return a[1].localeCompare(b[1], "cs");
  }
}
lKraje = new L.GeoJSON.AJAX("kraje.geojson", {
  style: style,
  onEachFeature: onEachFeature
});
loKraje = new L.GeoJSON.AJAX("kraje.geojson", {
  style: styleK,
  pane: 'obrysy',
  interactive: false
});
lyr = lKraje;
lyr.addTo(map);
function togglePrehled() {
  $("#prehledTable").toggle(200);
  $("#showSouhrnne").toggle(200);
}
function legendUpdate() {
  labels = [];
  from = breaks[valIndi][valUj]['breaks'][0] - breaks[valIndi]['step'];
  if (from < 0) {
    labels.push(
      '<span style="width: 50px;float: left;background:' + getColor3(from).replace('rgb', 'rgba').replace(')', ',0.7)') + '">&nbsp;</span>&nbsp;' +
      parseFloat(from).toLocaleString('cs-CZ', {
        minimumFractionDigits: breaks[valIndi]['decimals'],
        maximumFractionDigits: breaks[valIndi]['decimals']
      }) + ' a méně');
  } else {
    from = 0;
    to = breaks[valIndi][valUj]['breaks'][0];
    labels.push(
      '<span style="width: 50px;float: left;background:' + getColor3((from + to) / 2).replace('rgb', 'rgba').replace(')', ',0.7)') + '">&nbsp;</span>&nbsp;' +
      parseFloat(from).toLocaleString('cs-CZ', {
        minimumFractionDigits: breaks[valIndi]['decimals'],
        maximumFractionDigits: breaks[valIndi]['decimals']
      }) + ' &ndash; ' + parseFloat(to - breaks[valIndi]['step']).toLocaleString('cs-CZ', {
        minimumFractionDigits: breaks[valIndi]['decimals'],
        maximumFractionDigits: breaks[valIndi]['decimals']
      })
    );
  }
  from = breaks[valIndi][valUj]['breaks'][0];
  for (var i = 1; i < breaks[valIndi][valUj]['colors'].length - 1; i++) {
    to = breaks[valIndi][valUj]['breaks'][i];
    labels.push(
      '<span style="width: 50px;float: left;background:' + getColor3((from + to) / 2).replace('rgb', 'rgba').replace(')', ',0.7)') + '">&nbsp;</span>&nbsp;' +
      parseFloat(from).toLocaleString('cs-CZ', {
        minimumFractionDigits: breaks[valIndi]['decimals'],
        maximumFractionDigits: breaks[valIndi]['decimals']
      }) + ' &ndash; ' + parseFloat(to - breaks[valIndi]['step']).toLocaleString('cs-CZ', {
        minimumFractionDigits: breaks[valIndi]['decimals'],
        maximumFractionDigits: breaks[valIndi]['decimals']
      })
    );
    from = to;
  };
  labels.push(
    '<span style="width: 50px;float: left;background:' + getColor3(from + breaks[valIndi]['step']).replace('rgb', 'rgba').replace(')', ',0.7)') + '">&nbsp;</span>&nbsp;' +
    parseFloat(from).toLocaleString('cs-CZ', {
      minimumFractionDigits: breaks[valIndi]['decimals'],
      maximumFractionDigits: breaks[valIndi]['decimals']
    }) + ' a více');
  $('#legenda').html('<b>' + breaks[valIndi]['title'] + '</b><br />' + labels.join('<br />'));
};
function cancel(index) {
  comparingList.splice(index, 1);
  if (comparingList.length == 0) {
    comparing.remove();
  }
  comparing.update();
  lyr.setStyle(style);
}
function generateTooltip(feature) {
  var props = feature.properties;
  var t;
  if (valIndi == "pob") {
    if (valUj == "kraje") {
      t = '<table><tr><td class="grey bold">' + props.n.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>';
    } else if (valUj == "okresy") {
      t = '<table><tr><td class="grey bold">okres ' + props.n.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey italic">' + props.k + '</td><td class="right grey">&nbsp;</td></tr>';
    } else if (valUj == "orp") {
      t = '<table><tr><td class="grey bold">SO ORP ' + props.n.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey italic">' + props.k + '</td><td class="right grey">&nbsp;</td></tr>';
    } else if (valUj == "pou") {
      t = '<table><tr><td class="grey bold">pověřená obec ' + props.n.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey italic">' + props.k + '</td><td class="right grey">&nbsp;</td></tr>';
    } else if (valUj == "obce") {
      t = '<table><tr><td class="grey bold">' + props.b.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey italic">okres ' +props.r +", "+props.k + '</td><td class="right grey">&nbsp;</td></tr>';
    }
    t += '<tr><td>Počet osob v osobním bankrotu</td><td class="right">' + ntn(props["b"+rok.substring(3,4)+"c"]) + '</td></tr>' +
      '<tr><td class="vybrano">Podíl osob v bankrotu</td><td class="right vybrano">' + ntn(props["b"+rok.substring(3,4)+"c"] * 100 / props["o"+rok.substring(3,4)], 2) + ' %</td></tr>' +
      '<tr><td>Průměrný počet věřitelů</td><td class="right">' + ntn(props["b"+rok.substring(3,4)+"pv"], 1) + '</td></tr>' +
      '<tr><td>Podíl muži / ženy</td><td class="right">' + ntn(props["b"+rok.substring(3,4)+"m"]*100/props["b"+rok.substring(3,4)+"c"], 0)+" % / "+ ntn(props["b"+rok.substring(3,4)+"z"]*100/props["b"+rok.substring(3,4)+"c"], 0)+ ' %</td></tr>' +
      '<tr><td>Podíl manželů</td><td class="right">' + ntn(props["b"+rok.substring(3,4)+"p"]*100/props["b"+rok.substring(3,4)+"c"],1) + ' %</td></tr>' +
      '<tr><td>Průměrný / mediánový věk</td><td class="right">' + ntn(props["b"+rok.substring(3,4)+"v_p"],1) +"/" + ntn(props["b"+rok.substring(3,4)+"v_m"],0) + '</td></tr>'+
      '<tr class="odsadit"><td><u>Věková struktura osob v bankrotu:</u></td></tr>' +
      '<tr><td>Podíl (počet) osob ve věku 18 až 29 let</td><td class="right">' + ntn(props["b"+rok.substring(3,4)+"v18_29"] * 100 / props["b"+rok.substring(3,4)+"c"],0) + ' % (' + ntn(props["b"+rok.substring(3,4)+"v18_29"]) + ')</td></tr>' +
      '<tr><td>Podíl (počet) osob ve věku 30 až 39 let</td><td class="right">' + ntn(props["b"+rok.substring(3,4)+"v30_39"] * 100 / props["b"+rok.substring(3,4)+"c"],0) + ' % (' + ntn(props["b"+rok.substring(3,4)+"v30_39"]) + ')</td></tr>' +
      '<tr><td>Podíl (počet) osob ve věku 40 až 49 let</td><td class="right">' + ntn(props["b"+rok.substring(3,4)+"v40_49"] * 100 / props["b"+rok.substring(3,4)+"c"],0) + ' % (' + ntn(props["b"+rok.substring(3,4)+"v40_49"]) + ')</td></tr>' +
      '<tr><td>Podíl (počet) osob ve věku 50 až 65 let</td><td class="right">' + ntn(props["b"+rok.substring(3,4)+"v50_64"] * 100 / props["b"+rok.substring(3,4)+"c"],0) + ' % (' + ntn(props["b"+rok.substring(3,4)+"v50_64"]) + ')</td></tr>' +
      '<tr><td>Podíl (počet) seniorů (65+ let)</td><td class="right">' + ntn(props["b"+rok.substring(3,4)+"v65_"] * 100 / props["b"+rok.substring(3,4)+"c"],0) + ' % (' + ntn(props["b"+rok.substring(3,4)+"v65_"]) + ')</td></tr>';
  }
  else if (valIndi == "bve") {
    if (valUj == "kraje") {
      t = '<table><tr><td class="grey bold">' + props.n.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>';
    } else if (valUj == "okresy") {
      t = '<table><tr><td class="grey bold">okres ' + props.n.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey italic">' + props.k + '</td><td class="right grey">&nbsp;</td></tr>';
    } else if (valUj == "orp") {
      t = '<table><tr><td class="grey bold">SO ORP ' + props.n.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey italic">' + props.k + '</td><td class="right grey">&nbsp;</td></tr>';
    } else if (valUj == "pou") {
      t = '<table><tr><td class="grey bold">pověřená obec ' + props.n.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey italic">' + props.k + '</td><td class="right grey">&nbsp;</td></tr>';
    } else if (valUj == "obce") {
      t = '<table><tr><td class="grey bold">' + props.b.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey italic">okres '+props.r +","+ props.k + '</td><td class="right grey">&nbsp;</td></tr>';
    }
    t += '<tr><td>Počet osob v osobním bankrotu</td><td class="right">' + ntn(props["b"+rok.substring(3,4)+"c"]) + '</td></tr>' +
    '<tr><td>Počet osob v exekuci</td><td class="right">' + ntn(props["poe"+rok.substring(3,4)]) + '</td></tr>' +
    '<tr><td class="vybrano">Osobní bankroty vs. exekuce</td><td class="right vybrano">' + ntn(props["b"+rok.substring(3,4)+"c"] * 100 / props["poe"+rok.substring(3,4)], 2) + ' %</td></tr>';
  }
 else if (valIndi == "pob_change9" || valIndi == "pob_change0" || valIndi == "pob_change1" || valIndi == "pob_changec") {
    if (valUj == "kraje") {
      t = '<table><tr><td class="grey bold">' + props.n.toUpperCase() + '</td><td class="right grey bold">2018</td><td class="right grey bold">2019</td><td class="right grey bold">2020</td><td class="right grey bold">2021</td></tr>';
    } else if (valUj == "okresy") {
      t = '<table><tr><td class="grey bold">okres ' + props.n.toUpperCase() + '</td><td class="right grey bold">2018</td><td class="right grey bold">2019</td><td class="right grey bold">2020</td><td class="right grey bold">2021</td></tr>' +
        '<tr><td class="grey italic">' + props.k + '</td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td></tr>';
    } else if (valUj == "orp") {
      t = '<table><tr><td class="grey bold">SO ORP ' + props.n.toUpperCase() + '</td><td class="right grey bold">2018</td><td class="right grey bold">2019</td><td class="right grey bold">2020</td><td class="right grey bold">2021</td></tr>' +
        '<tr><td class="grey italic">' + props.k + '</td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td></tr>';
    }  else if (valUj == "pou") {
      t = '<table><tr><td class="grey bold">pověřená obec ' + props.n.toUpperCase() + '</td><td class="right grey bold">2018</td><td class="right grey bold">2019</td><td class="right grey bold">2020</td><td class="right grey bold">2021</td></tr>' +
        '<tr><td class="grey italic">' + props.k + '</td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td></tr>';
    }  else if (valUj == "obce") {
        t = '<table><tr><td class="grey bold">' + props.b.toUpperCase() + '</td><td class="right grey bold">2018</td><td class="right grey bold">2019</td><td class="right grey bold">2020</td><td class="right grey bold">2021</td></tr>' +
          '<tr><td class="grey italic">okres '+props.r+", " + props.k + '</td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td></tr>';
    }
    t += '<tr><td class="vybrano">Počet osob v osobním bankrotu</td>'+
    '<td class="right vybrano">' + ntn(props["b8c"])+ '</td>'+
    '<td class="right vybrano">' + ntn(props["b9c"])+ ' (';
    if ((props["b9c"] - props["b8c"]) >= 0) {
      t += '+';
    }
    t += ntn((props["b9c"] / props["b8c"] - 1) * 100, 1) +" %)";
    t += '</td>'+
    '<td class="right vybrano">' + ntn(props["b0c"]) + ' (';
    if ((props["b0c"] - props["b9c"]) >= 0) {
      t += '+';
    }
    t += ntn((props["b0c"] / props["b9c"] - 1) * 100, 1) +" %)";
    t += '</td>'+
    '<td class="right vybrano">' + ntn(props["b1c"]) + " (";
    if ((props["b1c"] - props["b0c"]) >= 0) {
      t += '+';
    }
    t += ntn((props["b1c"] / props["b0c"] - 1) * 100, 1) +' %)</td></tr>';
    t+='<tr><td>Podíl osob v bankrotu</td>'+
    '<td class="right">' + ntn(props["b8c"] * 100 / props["o8"], 2) + ' %</td>'+
    '<td class="right">' + ntn(props["b9c"] * 100 / props["o9"], 2) + ' % (';
    if ((props["b9c"] - props["b8c"]) >= 0) {
      t += '+';
    }
    t += ntn((props["b9c"] - props["b8c"]) * 100 / props["o9"], 2) + ' p.b.)</td>'+
    '<td class="right">' + ntn(props["b0c"] * 100 / props["o0"], 2) + ' % (';
    if ((props["b0c"] - props["b9c"]) >= 0) {
      t += '+';
    }
    t += ntn((props["b0c"] - props["b9c"]) * 100 / props["o0"], 2) + ' p.b.)</td>'+
    '<td class="right">' + ntn(props["b1c"] * 100 / props["o1"], 2) + ' % (';
    if ((props["b1c"] - props["b0c"]) >= 0) {
      t += '+';
    }
    t += ntn((props["b1c"] - props["b0c"]) * 100 / props["o1"], 2) + ' p.b.)</td></tr>';
    t += '<tr><td>Průměrný počet věřitelů</td>'+
    '<td class="right">' + ntn(props["b8pv"], 1) + '</td>'+
    '<td class="right">' + ntn(props["b9pv"], 1) + '(';
    if ((props["b9pv"] - props["b8pv"]) >= 0) {
      t += '+';
    }
    t += ntn(props["b9pv"] - props["b8pv"],1) + ')</td><td class="right">-</td><td class="right">-</td></tr>';
    t += '<tr><td>Průměrný věk</td><td class="right">' + ntn(props["b8v_p"],1)+'</td>'+
    '<td class="right">' + ntn(props["b9v_p"],1)+' (';
    if ((props["b9v_p"] - props["b8v_p"]) >= 0) {
      t += '+';
    }
    t += ntn(props["b9v_p"] - props["b8v_p"],1)+ ' )</td>'+
    '<td class="right">' + ntn(props["b0v_p"],1)+' (';
    if ((props["b0v_p"] - props["b9v_p"]) >= 0) {
      t += '+';
    }
    t += ntn(props["b0v_p"] - props["b9v_p"],1)+ ' )'+
    '</td><td class="right">' + ntn(props["b1v_p"],1)+' (';
    if ((props["b1v_p"] - props["b0v_p"]) >= 0) {
      t += '+';
    }
    t += ntn(props["b1v_p"] - props["b0v_p"],1)+ ' )</td></tr>';
    t += '<tr class="odsadit"><td><u>Věková struktura osob v bankrotu:</u></td></tr>';
    t += '<tr><td>Počet osob ve věku 18 až 29 let</td>'+
    '<td class="right">' + ntn(props["b8v18_29"]) + '</td>'+
    '<td class="right">' + ntn(props["b9v18_29"]) + ' (';
    if ((props["b9v18_29"] - props["b8v18_29"]) >= 0) {
      t += '+';
    }
    t += ntn(props["b9v18_29"] - props["b8v18_29"]) + ')</td>'+
    '<td class="right">' + ntn(props["b0v18_29"]) + ' (';
    if ((props["b0v18_29"] - props["b9v18_29"]) >= 0) {
      t += '+';
    }
    t += ntn(props["b0v18_29"] - props["b9v18_29"]) + ')</td>'+
    '<td class="right">' + ntn(props["b1v18_29"]) + ' (';
    if ((props["b0v18_29"] - props["b9v18_29"]) >= 0) {
      t += '+';
    }
    t += ntn(props["b0v18_29"] - props["b9v18_29"]) + ')</td></tr>';
    t += '<tr><td>Počet osob ve věku 30 až 39 let</td>'+
    '<td class="right">' + ntn(props["b8v30_39"]) + '</td>'+
    '<td class="right">' + ntn(props["b9v30_39"]) + ' (';
    if ((props["b9v30_39"] - props["b8v30_39"]) >= 0) {
      t += '+';
    }
    t += ntn(props["b9v30_39"] - props["b8v30_39"]) + ')</td>'+
    '<td class="right">' + ntn(props["b0v30_39"]) + ' (';
    if ((props["b0v30_39"] - props["b9v30_39"]) >= 0) {
      t += '+';
    }
    t += ntn(props["b0v30_39"] - props["b9v30_39"]) + ')</td>'+
    '<td class="right">' + ntn(props["b1v30_39"]) + ' (';
    if ((props["b0v30_39"] - props["b9v30_39"]) >= 0) {
      t += '+';
    }
    t += ntn(props["b0v30_39"] - props["b9v30_39"]) + ')</td></tr>';
    t += '<tr><td>Počet osob ve věku 40 až 49 let</td>'+
    '<td class="right">' + ntn(props["b8v40_49"]) + '</td>'+
    '<td class="right">' + ntn(props["b9v40_49"]) + ' (';
    if ((props["b9v40_49"] - props["b8v40_49"]) >= 0) {
      t += '+';
    }
    t += ntn(props["b9v40_49"] - props["b8v40_49"]) + ')</td>'+
    '<td class="right">' + ntn(props["b0v40_49"]) + ' (';
    if ((props["b0v40_49"] - props["b9v40_49"]) >= 0) {
      t += '+';
    }
    t += ntn(props["b0v40_49"] - props["b9v40_49"]) + ')</td>'+
    '<td class="right">' + ntn(props["b1v40_49"]) + ' (';
    if ((props["b0v40_49"] - props["b9v40_49"]) >= 0) {
      t += '+';
    }
    t += ntn(props["b0v40_49"] - props["b9v40_49"]) + ')</td></tr>';
    t += '<tr><td>Počet osob ve věku 50 až 65 let</td>'+
    '<td class="right">' + ntn(props["b8v50_64"]) + '</td>'+
    '<td class="right">' + ntn(props["b9v50_64"]) + ' (';
    if ((props["b9v50_64"] - props["b8v50_64"]) >= 0) {
      t += '+';
    }
    t += ntn(props["b9v50_64"] - props["b8v50_64"]) + ')</td>'+
    '<td class="right">' + ntn(props["b0v50_64"]) + ' (';
    if ((props["b0v50_64"] - props["b9v50_64"]) >= 0) {
      t += '+';
    }
    t += ntn(props["b0v50_64"] - props["b9v50_64"]) + ')</td>'+
    '<td class="right">' + ntn(props["b1v50_64"]) + ' (';
    if ((props["b0v50_64"] - props["b9v50_64"]) >= 0) {
      t += '+';
    }
    t += ntn(props["b0v50_64"] - props["b9v50_64"]) + ')</td></tr>';
    t += '<tr><td>Počet seniorů (65+ let)</td>'+
    '<td class="right">' + ntn(props["b8v65_"]) + '</td>'+
    '<td class="right">' + ntn(props["b9v65_"]) + ' (';
    if ((props["b9v65_"] - props["b8v65_"]) >= 0) {
      t += '+';
    }
    t += ntn(props["b9v65_"] - props["b8v65_"]) + ')</td>'+
    '<td class="right">' + ntn(props["b0v65_"]) + ' (';
    if ((props["b0v65_"] - props["b9v65_"]) >= 0) {
      t += '+';
    }
    t += ntn(props["b0v65_"] - props["b9v65_"]) + ')</td>'+
    '<td class="right">' + ntn(props["b1v65_"]) + ' (';
    if ((props["b0v65_"] - props["b9v65_"]) >= 0) {
      t += '+';
    }
    t += ntn(props["b0v65_"] - props["b9v65_"]) + ')</td></tr>';}
  t += '</table>';
  return t;
}
var comparing = L.control({
  position: 'bottomleft'
});
comparing.onAdd = function(map) {
  isComparing = true;
  this._div = L.DomUtil.create('div', 'porov info');
  this._div.innerHTML = '';
  return this._div;
};
comparing.onRemove = function(map) {
  isComparing = false;
};
comparing.update = function() {
  if (isComparing) {
    comparing._div.innerHTML = '';
    if (comparingList.length > 0) {
      var div = L.DomUtil.create('div', 'uj');
      heading = '<table><tr>';
      if (valUj == "kraje") {
        heading += '<td class="grey"><b>Kraj ' + rok + '</b></td></tr>';
      } else if (valUj == "okresy") {
        heading += '<td class="grey"><b>Okres ' + rok + '</b>/td></tr><tr><td>&nbsp;</td></tr>';
      } else if (valUj == "orp") {
        heading += '<td class="grey"><b>SO ORP ' + rok + '</b>/td></tr><tr><td>&nbsp;</td></tr>';
      } else if (valUj == "pou") {
        heading += '<td class="grey"><b>Pověřená obec ' + rok + '</b></td></tr><tr><td>&nbsp;</td></tr>';
      } else if (valUj == "obce") {
        heading += '<td class="grey"><b>Obec ' + rok + '</b></td></tr><tr><td>&nbsp;</td></tr>';
      }
      t = heading + '<tr><td>Počet osob v osobním bankrotu</td></tr>'+
                    '<tr><td><b>Podíl osob v bankrotu</b></td></tr>'+
          '<tr><td>Průměrný počet věřitelů</td></tr>'+
          '<tr><td>Podíl muži / ženy</td></tr>'+
          '<tr><td>Podíl manželů</td></tr>'+
          '<tr><td>Průměrný / mediánový věk</td></tr>'+
          '<tr><td>Osobní bankroty vs. exekuce</td></tr>'+
          '<tr class="odsadit"><td><u>Věková struktura osob v bankrotu:</u></td></tr>'+
          '<tr><td>Podíl (počet) osob ve věku 18 až 29 let</td></tr>'+
          '<tr><td>Podíl (počet) osob ve věku 30 až 39 let</td></tr>'+
          '<tr><td>Podíl (počet) osob ve věku 40 až 49 let</td></tr>'+
          '<tr><td>Podíl (počet) osob ve věku 50 až 65 let</td></tr>'+
          '<tr><td>Podíl (počet) seniorů (65+ let)</td></tr></table>';
      div.innerHTML = t;
      comparing._div.appendChild(div);
      for (var i = 0; i < comparingList.length; i++) {
        var new_uj = makeDivInfo(comparingList[i], i);
        comparing._div.appendChild(new_uj);
      }
    }
  }
};
$('#uzemi').on('change', function() {
  map.spin(false);
  map.spin(true);
  v = $('input[name=uj]:checked', '#uzemi').val();
  if (v == "auto") {
    autoLayer = true;
    valUj = $("#uj_auto").html();
    switchMap();
  } else {
    autoLayer = false;
    valUj = v;
    switchMap();
  }
  map.spin(false);
});
$('#hodnota').on('change', function() {
  map.spin(false);
  map.spin(true);
  valIndi = $('input[name=indi]:checked', '#hodnota').val();
  lyr.eachLayer(function(layer) {
    layer._tooltip.setContent(generateTooltip(layer.feature))
  });
  legendUpdate();
  lyr.setStyle(style);
  map.spin(false);
});
$('#findbox').click(function() {
  map.spin(true);
  lyr.removeFrom(map);
  loKraje.addTo(map);
  showUJ = false;
  map.spin(false);
});
function toggleRight() {
  $("#right").toggle(200);
  $("#arrow_right").toggle(200);
  $("#arrow_left").toggle(200);
}
$('.year').click(function(e) {
  map.spin(false);
  map.spin(true);
  $('.year').css('font-weight', 'normal');
  $('.year').css('font-size', '18px');
  $('.year').css('text-decoration', 'none');
  $('.year').css('border-bottom', '0px');
  $('.year.change').css('font-size', '12px');
  $(this).css('font-weight', 'bold');
  if ($(this).attr("class") == "year change") {
    $(this).css('font-size', '16px');
  } else {
    $(this).css('font-size', '24px');
  }
  $(this).css('border-bottom', '5px solid #91375E');
  rok = $(this).attr("title");
  if ($('input[name=indi]:checked', '#hodnota').attr('disabled')) {
    valIndi = $('input[name=indi]:checked', '#hodnota').val();
    legendUpdate();
    alert("Pro danou kombinaci neexistují data");
  };
  comparingList = [];
  comparing.update();
  comparing.remove();
  lyr.setStyle(style);
  lyr.eachLayer(function(layer) {
    layer._tooltip.setContent(generateTooltip(layer.feature))
  });
  map.spin(false);
});
$('#sipka').on("click", function() {
  toggleRight();
});
map.on("zoomend", function(e) {
  zoom = map.getZoom();
  if (zoom < 8) {
    v = "kraje";
    title = "kraje";
  } else if (zoom < 9) {
    v = "okresy";
    title = "okresy";
  } else if (zoom < 10) {
    v = "orp";
    title = "ORP";
  } else if (zoom < 11){
    v = "pou";
    title = "pověřené obce";
  } else {
    v = "obce";
    title = "Obce";
  }
  $("#uj_auto").html(title);
  if (autoLayer) {
    valUj = v;
    switchMap();
  }
});


$(document).ready(function() {
  if ($(window).width() > 1000) {
    $("#right").show();
    $("#arrow_right").show();
    $("#arrow_left").hide();
  } else {
    togglePrehled();
    $("#right").hide();
    $("#arrow_right").hide();
    $("#arrow_left").show();
  }
  legendUpdate();
  map.spin(false);
  valUj == "kraje";
  var $radios = $('input:radio[name=uj]');
  $radios.filter('[value="kraje"]').prop('checked', true);
  valIndi == "pob";
  $radios = $('input:radio[name=indi]');
  $radios.filter('[value="pob"]').prop('checked', true);
  map.spin(false);
});
