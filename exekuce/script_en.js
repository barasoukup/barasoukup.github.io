var rok = "2022";
var valUj = "kraje";
var valIndi = "poe";
var viewPrehled = 0;
var lObce;
var lOkresy;
var lEU;
var detail = 0;
var autoLayer = false;
var isComparing = false;
var showUJ = true;
var map = L.map('map', {
  zoomControl: false,
  doubleClickZoom: false
});


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

function preklad(slovo) {
  switch (slovo) {
    case "regions":
      return "kraje";
      break;
    case "districts":
      return "okresy";
      break;
    case "municipalities with extended powers":
      return "ORP";
      break;
    case "municipalities":
      return "obce";
      break;
    default:
      return slovo
  }
}

base = L.tileLayer('https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=CA9jkYsvrAOGl2YSpa5x7n43tiWMiS4jKLMCLCRlzrKrsdUER1yROrONSmeedP3c', {
  minZoom: 5,
  maxZoom: 20,
  attribution: '<a href=\"https://www.jawg.io\" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org\" target=\"_blank\">&copy; OpenStreetMap</a> contributors, data <a href="http://www.ekcr.cz/">Exekutorská komora ČR</a>, map creator <a href="mailto:bara.so@email.cz">Bára Soukupová</a>'
 
});

map.addLayer(base);

function resetView() {
  map.fitBounds([
    [48.5, 12.0],
    [51.1, 21.5]
  ]);
};
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
  icko._div.innerHTML = '<div class="info"><h4>Data source</h4>' +
    '<ul><li><b>Central Register of Executions</b> – managed by Bailiff Chamber of the Czech Republic</li>' +
    '<li><b>Czech Statistical Office</b></li></ul>' +
    '<h4>Periods covered</h4>' +
    '<ul><li><b>2016</b>,<b> 2017</b>,<b> 2018</b>,<b> 2019</b> and <b>2021</b></li></ul>' +
    '<h4>This map contains</h4>' +
    '<ul><li><b>natural persons only</b></li>' +
    '<li><b>N° of inhabitants 15+</b></li>' +
    '<li><b>N° of people in enforcement proceedings</b></li>' +
    '<li><b>total number of enforcement proceedings</b></li>' +
    '<li><b>debt principal</b> (amount without interest on late payment and enforcement costs)</li>' +
    '<li><b>age detail</b></li>' +
    '<li><b>multiple enforcement proceedings detail</b></li>' +
    '<li><b>indicators</b></li></ul>' +
    '<p>* Debt principal in 2016 covers both natural persons and legal entities while debt principal in 2017 includes natural persons only.</p>' +
    '<div style="text-align: center"><img src="images/ekcr.jpg" height="100">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="images/csu.png" height="40" style="vertical-align: top;"></div>' +
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
    '<div id="prehledTable"><table><tr><td class="grey bold">The Czech Republic</td><td class="right grey bold">2022</td><td class="grey right bold">change since 2021</td></tr>' +
    '<tr><td>N° of people in enforcement proceedings (EP)</td><td class="right bold">668k</td><td class="right green">-5.5%</td></tr>' +
    '<tr><td>N° of people with 10 or more EPs</td><td class="right bold">149k</td><td class="right green">-9.3%</td></tr>' +
    '<tr><td>Percentage of people in EPs</td><td class="right bold">7.6%</td><td class="right green">-0.3 PP</td></tr>' +
    '<tr><td>Total number of EPs</td><td class="right bold">4,1M</td><td class="right green">-8.0%</td></tr>' +
    '<tr><td><span class="italic">The published data covers only natural persons;<br>EP = enforcement proceeding<br>Data for 2019 are from April 24, 2020, other years from December 31</span></td><td>&nbsp;</td><td class="right"><a id="togglePrehledLink" onclick="togglePrehled()" href="#"><img src="images/70206.png" width="12px"></a></td></tr></table></div>' +
    '<div id="showSouhrnne" style="display:none"><a id="togglePrehledLink" onclick="togglePrehled()" href="#">Show info</a></div> ';
  return this._div;
};

prehled.addTo(map);



var zrusit = L.control({
  position: 'topright'
});
zrusit.onAdd = function(map) {
  this._div = L.DomUtil.create('div', 'zrusit');
  this._div.innerHTML =
    '<a id="cancelResults" onclick="cancelResults()" href="#"><img src="images/70206.png" width="12px"> Hide results</a>';
  return this._div;
};

function cancelResults() {
  searchPoints.removeFrom(map);
  map.removeControl(zrusit);
}

var photonControlOptions = {
  limit: 20,
  resultsHandler: showSearchPoints,
  noResultLabel: 'not found',
  placeholder: 'Search municipality',
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
}

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
    if (valIndi == "pj") {
      d = props["c" + rok.slice(3, 4)] / props["poe" + rok.slice(3, 4)];
    } else if (valIndi == "vc") {
      d = props["vc" + rok.slice(3, 4)] / props["poe" + rok.slice(3, 4)];
    } else if (valIndi == "poe") {
      d = props["poe" + rok.slice(3, 4)] * 100 / props["o"+ rok.slice(3, 4)];
    } else if (valIndi == "pove") {
      d = (props["p2e" + rok.slice(3, 4)] + props["p3e" + rok.slice(3, 4)] + props["p4e" + rok.slice(3, 4)] + props["p5e" + rok.slice(3, 4)]) * 100 / props["poe" + rok.slice(3, 4)];
    } else if (valIndi == "poe_change7") {
      if (props["poe6"] > 0) {
        d = (props["poe7"] / props["poe6"] - 1) * 100;
      } else {
        d = 0
      }
    } else if (valIndi == "poe_change8") {
      if (props["poe7"] > 0) {
        d = (props["poe8"] / props["poe7"] - 1) * 100;
      } else {
        d = 0
      }
    } else if (valIndi == "poe_change9") {
      if (props["poe8"] > 0) {
        d = (props["poe9"] / props["poe8"] - 1) * 100;
      } else {
        d = 0
      }
    } else if (valIndi == "poe_change1") {
        if (props["poe9"] > 0) {
          d = (props["poe1"] / props["poe9"] - 1) * 100;
        } else {
          d = 0
        }
	} else if (valIndi == "poe_change2") {
        if (props["poe1"] > 0) {
          d = (props["poe2"] / props["poe1"] - 1) * 100;
        } else {
          d = 0
        }
    } else if (valIndi == "poe_changec") {
      if (props["poe6"] > 0) {
        d = (props["poe1"] / props["poe6"] - 1) * 100;
      } else {
        d = 0
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
        return breaks[valIndi][valUj]['colors'][i]
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
  }
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


function ntn(number, digits) {
  if (isNaN(number) || number == 0) {
    number = 0;
  }
  if (digits === undefined) {
    digits = 0;
  };
  numberText = parseFloat(number).toLocaleString('en-us', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })
  if (isNaN(number) || number == 0) {
    numberText = "0/no data";
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
    layer._tooltip.setContent(generateTooltip(layer.feature))
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
  heading = '<table><tr>';
  if (valUj == "kraje") {
    heading += '<td class="grey"><b>' + props.k.toUpperCase() + '</b>&nbsp;&nbsp;<a title="Remove" href="#" onclick="cancel(' + index + ');return false;"><img src="images/70206.png" width="12px"></a></td></tr>';
  } else if (valUj == "okresy") {
    heading += '<td class="grey"><b>' + props.r.toUpperCase() + '</b>&nbsp;&nbsp;<a title="Remove" href="#" onclick="cancel(' + index + ');return false;"><img src="images/70206.png" width="12px"></a></td></tr><tr><td class="italic">' + props.k.replace(/ /g, '&nbsp;') + '</td></tr>';
  } else if (valUj == "orp") {
    heading += '<td class="grey"><b>' + props.n.toUpperCase() + '</b>&nbsp;&nbsp;<a title="Remove" href="#" onclick="cancel(' + index + ');return false;"><img src="images/70206.png" width="12px"></a></td></tr><tr><td class="italic">' + props.k.replace(/ /g, '&nbsp;') + '</td></tr>';
  } else if (valUj == "obce") {
    heading += '<td class="grey"><b>' + props.b.toUpperCase() + '</b>&nbsp;&nbsp;<a title="Remove" href="#" onclick="cancel(' + index + ');return false;"><img src="images/70206.png" width="12px"></a></td></tr><tr><td class="italic">' + props.r.replace(/ /g, '&nbsp;') + '</td></tr><tr><td class="italic">' + props.k.replace(/ /g, '&nbsp;') + '</td></tr>';
  }
  t = heading + '<tr><td><b>' + ntn(feature.properties["poe" + rok.slice(3, 4)] * 100 / feature.properties["o"+ rok.slice(3, 4)], 2) + '%</b></td></tr>';
  if (rok != "2016") {
    poe_act = props["poe" + rok.slice(3, 4)];
    o_act = props["o" + rok.slice(3, 4)];
    if (rok == "2021") {
      poe_last = props["poe9"];
      o_last = props["o9"];
    } else {
      poe_last = props["poe" + (parseInt(rok.slice(3, 4)) - 1).toString()];
      o_last = props["o" + (parseInt(rok.slice(3, 4)) - 1).toString()];
    }
    if (poe_act >= poe_last) {
      plus = "+";
    } else {
      plus = "";
    }
    t += '<tr><td>' + plus + ntn((poe_act / poe_last - 1) * 100, 1) + '% (' + plus + ntn((poe_act / o_act - poe_last / o_last) * 100, 2) + ' PP)</td></tr>';
  }

  t += '<tr><td>' + ntn(props["pe" + rok.slice(3, 4)] / props["poe" + rok.slice(3, 4)], 1) + '</td></tr>'
  if (rok == "2017" || rok == "2016") {
    t += '<tr><td>' + ntn(props["c" + rok.slice(3, 4)] / props["poe" + rok.slice(3, 4)]) + ' CZK </td></tr>'
  }
  if (rok != "2016" && rok != "2021") {
    t += '<tr class="maly_detail "><td>&nbsp;</td></tr>' +
      '<tr class="maly_detail odsadit"><td>' + ntn((props["p3e" + rok.slice(3, 4)] + props["p4e" + rok.slice(3, 4)] + props["p5e" + rok.slice(3, 4)]) * 100 / props["poe" + rok.slice(3, 4)]) + '%</td></tr>' +
      '<tr class="maly_detail"><td>' + ntn(props["pse" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '%</td></tr>'
  }
  if (rok == "2021") {
      t += '<tr><td>' + ntn(props["p45e" + rok.slice(3, 4)]  * 100 / props["poe" + rok.slice(3, 4)]) + '%</td></tr>'
  }
  if (rok == "2017" ) {
    t += '<tr class="plny_detail"><td>' + ntn(props["m7"]) + ' CZK</td></tr>';
  }
  t += '<tr class="plny_detail"><td>' + ntn(props["o"+ rok.slice(3, 4)]) + '</td></tr>' +
    '<tr class="plny_detail"><td>' + ntn(props["poe" + rok.slice(3, 4)]) + '</td></tr>' +
    '<tr class="plny_detail"><td>' + ntn(props["pe" + rok.slice(3, 4)]) + '</td></tr>';
  if (rok != "2016" && rok != "2021") {
    t += '<tr class="plny_detail odsadit"><td>&nbsp;</td></tr>' +
      '<tr class="plny_detail odsadit"><td>' + ntn(props["pde" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '%</td></tr>' +
      '<tr class="plny_detail "><td>' + ntn(props["pme" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '%</td></tr>';
      if (rok == "2022") {
	  t+='<tr class="plny_detail "><td>' + ntn(props["pa3" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '%</td></tr>' +
      '<tr class="plny_detail "><td>' + ntn(props["pa4" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '%</td></tr>' +
      '<tr class="plny_detail "><td>' + ntn(props["pa5" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '%</td></tr>';
      }
	  t+='<tr class="plny_detail "><td>' + ntn(props["pse" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '%</td></tr>' +
      '<tr class="plny_detail odsadit"><td>' + ntn(props["p1e" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '%</td></tr>' +
      '<tr class="plny_detail "><td>' + ntn(props["p2e" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '%</td></tr>' +
      '<tr class="plny_detail "><td>' + ntn(props["p3e" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '%</td></tr>' +
      '<tr class="plny_detail "><td>' + ntn(props["p4e" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '%</td></tr>' +
      '<tr class="plny_detail "><td>' + ntn(props["p5e" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '%</td></tr>';
  }
  t += '<tr class="odsadit"><td>&nbsp;</td></tr></table>';
  div.innerHTML = t;
  return div
};

function compareSecondColumn(a, b) {

  if (a[1] === b[1]) {
    return 0;
  } else {
    return a[1].localeCompare(b[1], "en-us");
  }
}

lKraje = new L.GeoJSON.AJAX("kraje_en.geojson", {
  style: style,
  onEachFeature: onEachFeature
});

loKraje = new L.GeoJSON.AJAX("kraje_en.geojson", {
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

function toggleDetail() {
  $(".maly_detail").toggle(200);
  $(".plny_detail").toggle(200);
  if (detail) {
    detail = false;
    $("#detailLink").text("Show details");
  } else {
    detail = true;
    $("#detailLink").text("Hide details");
  }
}



function legendUpdate() {
  labels = [];
  from = breaks[valIndi][valUj]['breaks'][0] - breaks[valIndi]['step'];
  if (from < 0) {
    labels.push(
      '<span style="width: 50px;float: left;background:' + getColor3(from).replace('rgb', 'rgba').replace(')', ',0.7)') + '">&nbsp;</span>&nbsp;' +
      parseFloat(from).toLocaleString('en-us', {
        minimumFractionDigits: breaks[valIndi]['decimals'],
        maximumFractionDigits: breaks[valIndi]['decimals']
      }) + '-');
  } else {
    from = 0
    to = breaks[valIndi][valUj]['breaks'][0];
    labels.push(
      '<span style="width: 50px;float: left;background:' + getColor3((from + to) / 2).replace('rgb', 'rgba').replace(')', ',0.7)') + '">&nbsp;</span>&nbsp;' +
      parseFloat(from).toLocaleString('en-us', {
        minimumFractionDigits: breaks[valIndi]['decimals'],
        maximumFractionDigits: breaks[valIndi]['decimals']
      }) + '&ndash;' + parseFloat(to - breaks[valIndi]['step']).toLocaleString('en-us', {
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
      parseFloat(from).toLocaleString('en-us', {
        minimumFractionDigits: breaks[valIndi]['decimals'],
        maximumFractionDigits: breaks[valIndi]['decimals']
      }) + '&ndash;' + parseFloat(to - breaks[valIndi]['step']).toLocaleString('en-us', {
        minimumFractionDigits: breaks[valIndi]['decimals'],
        maximumFractionDigits: breaks[valIndi]['decimals']
      })
    );
    from = to;
  };
  labels.push(
    '<span style="width: 50px;float: left;background:' + getColor3(from + breaks[valIndi]['step']).replace('rgb', 'rgba').replace(')', ',0.7)') + '">&nbsp;</span>&nbsp;' +
    parseFloat(from).toLocaleString('en-us', {
      minimumFractionDigits: breaks[valIndi]['decimals'],
      maximumFractionDigits: breaks[valIndi]['decimals']
    }) + '+');
  $('#legenda').html('<span class="nadpis">' + breaks[valIndi]['title'] + '</span><br />' + labels.join('<br />'));

};

function cancel(index) {
  comparingList.splice(index, 1);
  if (comparingList.length == 0) {
    comparing.remove();
  }
  comparing.update();
  lyr.setStyle(style);
}

function generateChangeTooltip(props, secondYear, firstYear) {
  var t;
  if (valUj == "kraje") {
    t = '<table><tr><td class="grey bold">' + props.k.toUpperCase() + '</td><td class="right grey bold">'+secondYear+'</td><td class="right grey bold">'+firstYear+'</td><td class="right grey bold">YtY change</td></tr>';
  } else if (valUj == "okresy") {
    t = '<table><tr><td class="grey bold">district ' + props.r.toUpperCase() + '</td><td class="right grey bold">'+secondYear+'</td><td class="right grey bold">'+firstYear+'</td><td class="right grey bold">YtY change</td></tr>' +
      '<tr><td class="grey"><i>' + props.k + '</i></td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td></tr>';
  } else if (valUj == "orp") {
    t = '<table><tr><td class="grey bold">municipality ' + props.n.toUpperCase() + '</td><td class="right grey bold">'+secondYear+'</td><td class="right grey bold">'+firstYear+'</td><td class="right grey bold">YtY change</td></tr>' +
      '<tr><td class="grey"><i>' + props.k + '</i></td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td></tr>';
  } else if (valUj == "obce") {
    t = '<table><tr><td class="grey bold">municipality ' + props.b.toUpperCase() + '</td><td class="right grey bold">'+secondYear+'</td><td class="right grey bold">'+firstYear+'</td><td class="right grey bold">YtY change</td></tr>' +
      '<tr><td class="grey"><i>district ' + props.r + ', ' + props.k + '</i></td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td></tr>';
  }
  poe_second = props["poe"+secondYear.slice(3, 4)];
  poe_first = props["poe"+firstYear.slice(3, 4)];
  podil_second = poe_second * 100 / props["o"+secondYear.slice(3, 4)];
  podil_first = poe_first * 100 / props["o"+firstYear.slice(3, 4)];
  pe_second = props["pe"+secondYear.slice(3, 4)];
  pe_first = props["pe"+firstYear.slice(3, 4)];
  t += '<tr><td class="vybrano">N° of people in enforcement proceedings (EP)</td><td class="right vybrano">' + ntn(poe_second) + '</td><td class="right vybrano">' + ntn(poe_first) + '</td>';
  if (poe_second >= poe_first) {
    t += '<td class="right red vybrano">+';
  } else {
    t += '<td class="right green vybrano">'
  }
  t += ntn((poe_second / poe_first - 1) * 100, 1) + '% ('
  if (poe_second >= poe_first) {
    t += '+';
  }
  t += ntn(poe_second - poe_first) + ' persons)</td>';
  t += '<tr><td>Percentage of people in EPs</td><td class="right">' + ntn(podil_second,2) + '% </td><td class="right">' + ntn(podil_first,2) + '% </td>';
  if (podil_second >= podil_first) {
    t += '<td class="right red">+';
  } else {
    t += '<td class="right green">'
  }
  t += ntn(podil_second-podil_first, 2) + ' p.b.</td></tr>' +
    '<tr><td>Total number of EPs</td><td class="right">' + ntn(pe_second) + '</td><td class="right">' + ntn(pe_first) + '</td>';
  if (pe_second >= pe_first) {
    t += '<td class="right red">+';
  } else {
    t += '<td class="right green">'
  }
  t += ntn((pe_second / pe_first - 1) * 100, 1) + '% (';
  if (pe_second >= pe_first) {
    t += '+';
  }
  t += ntn(pe_second - pe_first) + ' EPs)</td></tr>' +
    '<tr><td>Average N° of EPs per person</td><td class="right">' + ntn(pe_second / poe_second, 1) + '</td><td class="right">' + ntn(pe_first / poe_first, 1) + '</td>';
  if (pe_second / poe_second >= pe_first / poe_first) {
    t += '<td class="right red">+';
  } else {
    t += '<td class="right green">';
  }
  t += ntn((pe_second / poe_second) - (pe_first / poe_first), 1) + '</td></tr>';
  return t;
}

function generateTooltip(feature) {
  var props = feature.properties;
  var t;
  if (valIndi == "poe") {
    if (valUj == "kraje") {
      t = '<table><tr><td class="grey bold">' + props.k.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>';
      if (rok != "2016") {
        t += '<tr><td class="poradi">Region ranking <span class="netucne">(1 = the worst)</span></td><td class="right poradi">' + props["poe" + rok.slice(3, 4) + "p"] + ' of 14</td></td>';
      }
    } else if (valUj == "okresy") {
      t = '<table><tr><td class="grey bold">district ' + props.r.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey italic">' + props.k + '</td><td class="right grey">&nbsp;</td></tr>';
      if (rok != "2016") {
        t += '<tr><td class="poradi">District ranking <span class="netucne">(1 = the worst)</span></td><td class="right poradi">' + props["poe" + rok.slice(3, 4) + "p"] + ' of 77</td></td>';
      }
    } else if (valUj == "orp") {
      t = '<table><tr><td class="grey bold">municipality ' + props.n.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey italic">' + props.k + '</td><td class="right grey">&nbsp;</td></tr>';
      if (rok != "2016" && rok != "2018") {
        t += '<tr><td class="poradi">Municipalities with extended powers ranking <span class="netucne">(1 = the worst)</span></td><td class="right poradi">' + props["poe" + rok.slice(3, 4) + "p"] + ' of 206</td></td>';
      }
    } else if (valUj == "obce") {
      t = '<table><tr><td class="grey bold">municipality ' + props.b.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey italic">district ' + props.r + ', ' + props.k + '</td><td class="right grey">&nbsp;</td></tr>';
    }
    t += '<tr><td>N° of people 15+ y/o</td><td class="right">' + ntn(props["o"+ rok.slice(3, 4)]) + '</td></tr>' +
      '<tr><td>N° of people in enforcement proceedings (EP)</td><td class="right">' + ntn(props["poe" + rok.slice(3, 4)]) + '</td></tr>' +
      '<tr><td class="vybrano">Percentage of people in EPs</td><td class="vybrano right">' + ntn(props["poe" + rok.slice(3, 4)] * 100 / props["o"+ rok.slice(3, 4)], 2) + '%</td></tr>' +
      '<tr><td>Total number of EPs</td><td class="right">' + ntn(props["pe" + rok.slice(3, 4)]) + '</td></tr>' +
      '<tr><td>Average N° of EPs per person</td><td class="right">' + ntn(props["pe" + rok.slice(3, 4)] / props["poe" + rok.slice(3, 4)], 1) + '</td></tr>';

    if (rok != "2016" && rok != "2021" && rok != "2022") {
      t += '<tr><td><u>People in EPs details:</u></td></tr>' +
        '<tr><td>Percentage (N°) of children</td><td class="right">' + ntn(props["pde" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '% (' + ntn(props["pde" + rok.slice(3, 4)]) + ')</td></tr>' +
        '<tr><td>Percentage (N°) of young adults (18-29 y/o)</td><td class="right">' + ntn(props["pme" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '% (' + ntn(props["pme" + rok.slice(3, 4)]) + ')</td></tr>' +
        '<tr><td>Percentage (N°) of seniors (65+ y/o)</td><td class="right">' + ntn(props["pse" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '% (' + ntn(props["pse" + rok.slice(3, 4)]) + ')</td></tr>'
      }
	  if (rok== "2022"){
	  t += '<tr><td><u>People in EPs details:</u></td></tr>' +
        '<tr><td>Percentage (N°) of children</td><td class="right">' + ntn(props["pde" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '% (' + ntn(props["pde" + rok.slice(3, 4)]) + ')</td></tr>' +
        '<tr><td>Percentage (N°) of young adults (15-29 y/o)</td><td class="right">' + ntn(props["pme" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '% (' + ntn(props["pme" + rok.slice(3, 4)]) + ')</td></tr>' +
        '<tr><td>Percentage (N°) of people 30-39 y/o</td><td class="right">' + ntn(props["pa3" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '% (' + ntn(props["pa3" + rok.slice(3, 4)]) + ')</td></tr>' +
        '<tr><td>Percentage (N°) of people 40-49 y/o</td><td class="right">' + ntn(props["pa4" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '% (' + ntn(props["pa4" + rok.slice(3, 4)]) + ')</td></tr>' +
        '<tr><td>Percentage (N°) of people 50-64 y/o</td><td class="right">' + ntn(props["pa5" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '% (' + ntn(props["pa5" + rok.slice(3, 4)]) + ')</td></tr>' +
        '<tr><td>Percentage (N°) of seniors (65+ y/o)</td><td class="right">' + ntn(props["pse" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '% (' + ntn(props["pse" + rok.slice(3, 4)]) + ')</td></tr>'
     
	  }
      if (rok== "2021"){
          t += '<tr><td class="bold">Including:</td></tr>' +
            '<tr><td>Percentage (N°) of people with 1 - 9 EPs</td><td class="right">' + ntn((props["poe" + rok.slice(3, 4)]-props["p45e" + rok.slice(3, 4)]) * 100 / props["poe" + rok.slice(3, 4)]) + '% (' + ntn((props["poe" + rok.slice(3, 4)]-props["p45e" + rok.slice(3, 4)])) + ')</td></tr>' +
            '<tr><td>Percentage (N°) of people with 10+ EPs</td><td class="right">' + ntn(props["p45e" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '% (' + ntn(props["p45e" + rok.slice(3, 4)]) + ')</td></tr>';
        }
  } else if (valIndi == "pove") {
    if (valUj == "kraje") {
      t = '<table><tr><td class="grey bold">' + props.k.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>';
      if (rok != "2016") {
        t += '<tr><td class="poradi">Region ranking <span class="netucne">(1 = the worst)</span></td><td class="right poradi">' + ntn(props["pv" + rok.slice(3, 4) + "p"]) + ' of 14</td></tr>';
      }
    } else if (valUj == "okresy") {
      t = '<table><tr><td class="grey bold">district ' + props.r.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey"><i>' + props.k + '</i></td><td class="right grey">&nbsp;</td></tr>';
      if (rok != "2016") {
        t += '<tr><td class="poradi">District ranking <span class="netucne">(1 = the worst)</span></td><td class="right poradi">' + ntn(props["pv" + rok.slice(3, 4) + "p"]) + ' of 77</td></tr>';
      }
    } else if (valUj == "orp") {
      t = '<table><tr><td class="grey bold">municipality ' + props.n.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey"><i>' + props.k + '</i></td><td class="right grey">&nbsp;</td></tr>';
      if (rok != "2016" && rok != "2018") {
        t += '<tr><td class="poradi">Municipalities with extended powers ranking <span class="netucne">(1 = the worst)</span></td><td class="right poradi">' + ntn(props["pv" + rok.slice(3, 4) + "p"]) + ' of 206</td></tr>';
      }
    } else if (valUj == "obce") {
      t = '<table><tr><td class="grey bold">municipality ' + props.b.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey"><i>district ' + props.r + ', ' + props.k + '</i></td><td class="right grey">&nbsp;</td></tr>';
    }
    t += '<tr><td>Percentage (N°) of people in EPs</td><td class="right">' + ntn(props["poe" + rok.slice(3, 4)] * 100 / props["o"+ rok.slice(3, 4)], 2) + '% (' + ntn(props["poe" + rok.slice(3, 4)]) + ')</td></tr>' +
      '<tr><td class="bold">Including:</td></tr>' +
      '<tr><td class="bold border_down">Percentage (N°) of people with 1 EP</td><td class="bold border_down right">' + ntn(props["p1e" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '% (' + ntn(props["p1e" + rok.slice(3, 4)]) + ')</td></tr>' +
      '<tr><td>Percentage (N°) of people with 2 EPs</td><td class="right">' + ntn(props["p2e" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '% (' + ntn(props["p2e" + rok.slice(3, 4)]) + ')</td></tr>' +
      '<tr><td>Percentage (N°) of people with 3 - 9 EPs</td><td class="right">' + ntn(props["p3e" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '% (' + ntn(props["p3e" + rok.slice(3, 4)]) + ')</td></tr>' +
      '<tr><td>Percentage (N°) of people with 10 - 29 EPs</td><td class="right">' + ntn(props["p4e" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '% (' + ntn(props["p4e" + rok.slice(3, 4)]) + ')</td></tr>' +
      '<tr><td class="border_down">Percentage (N°) of people with 30+ EPs</td><td class="right border_down">' + ntn(props["p5e" + rok.slice(3, 4)] * 100 / props["poe" + rok.slice(3, 4)]) + '% (' + ntn(props["p5e" + rok.slice(3, 4)]) + ')</td></tr>' +
      '<tr><td class="vybrano">Multiple EPs</td><td class="right vybrano">' + ntn((props["p2e" + rok.slice(3, 4)] + props["p3e" + rok.slice(3, 4)] + props["p4e" + rok.slice(3, 4)] + props["p5e" + rok.slice(3, 4)]) * 100 / props["poe" + rok.slice(3, 4)]) + '% (' + ntn(props["p2e" + rok.slice(3, 4)] + props["p3e" + rok.slice(3, 4)] + props["p4e" + rok.slice(3, 4)] + props["p5e" + rok.slice(3, 4)]) + ')</td></tr>';
  } else if (valIndi == "pj") {
    if (valUj == "kraje") {
      t = '<table><tr><td class="grey bold">' + props.k.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>';
      if (rok == "2017") {
        t += '<tr><td class="poradi">Region ranking <span class="netucne">(1 = the worst)</span></td><td class="right poradi">' + props["pjo" + rok.slice(3, 4) + "p"] + ' of 14</td></td>';
      }
    } else if (valUj == "okresy") {
      t = '<table><tr><td class="grey bold">district ' + props.r.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey"><i>' + props.k + '</i></td><td class="right grey">&nbsp;</td></tr>';
      if (rok == "2017") {
        t += '<tr><td class="poradi">District ranking <span class="netucne">(1 = the worst)</span></td><td class="right poradi">' + props["pjo" + rok.slice(3, 4) + "p"] + ' of 77</td></td>';
      }
    } else if (valUj == "orp") {
      t = '<table><tr><td class="grey bold">municipality ' + props.n.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey"><i>' + props.k + '</i></td><td class="right grey">&nbsp;</td></tr>';
      if (rok == "2017") {
        t += '<tr><td class="poradi">Municipalities with extended powers ranking <span class="netucne">(1 = the worst)</span></td><td class="right poradi">' + props["pjo" + rok.slice(3, 4) + "p"] + ' of 206</td></td>';
      }
    } else if (valUj == "obce") {
      t = '<table><tr><td class="grey bold">municipality ' + props.b.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey"><i>district ' + props.r + ', ' + props.k + '</i></td><td class="right grey">&nbsp;</td></tr>';
    }
    t += '<tr><td>Debt principal</td><td class="right">' + props["c" + rok.slice(3, 4)].toLocaleString('en-us', {
        maximumFractionDigits: 0
      }) + ' CZK</td></tr>' +
      '<tr><td class="vybrano">Average debt principal per person</td><td class="right vybrano">' + ntn(props["c" + rok.slice(3, 4)] / props["poe" + rok.slice(3, 4)]) + ' CZK</td></tr>';
    if (rok == "2017") {
      t += '<tr><td>Median debt principal per person</td><td class="right">' + (props["m" + rok.slice(3, 4)]).toLocaleString('en-us', {
        maximumFractionDigits: 0
      }) + ' CZK</td></tr>';
    }
    t += '<tr><td>Average debt principal per EP</td><td class="right">' + ntn(props["c" + rok.slice(3, 4)] / props["pe" + rok.slice(3, 4)]) + ' CZK</td></tr>';
  } else if (valIndi == "vc") {
      if (valUj == "kraje") {
        t = '<table><tr><td class="grey bold">' + props.k.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>';
        t += '<tr><td class="poradi">Region ranking <span class="netucne">(1 = the worst)</span></td><td class="right poradi">' + props["pvc" + rok.slice(3, 4) + "p"] + ' of 14</td></td>';
      } else if (valUj == "okresy") {
        t = '<table><tr><td class="grey bold">district ' + props.r.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
          '<tr><td class="grey"><i>' + props.k + '</i></td><td class="right grey">&nbsp;</td></tr>';
          t += '<tr><td class="poradi">District ranking <span class="netucne">(1 = the worst)</span></td><td class="right poradi">' + props["pvc" + rok.slice(3, 4) + "p"] + ' of 77</td></td>';
      } else if (valUj == "orp") {
        t = '<table><tr><td class="grey bold">municipality ' + props.n.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
          '<tr><td class="grey"><i>' + props.k + '</i></td><td class="right grey">&nbsp;</td></tr>';
          t += '<tr><td class="poradi">Municipalities with extended powers ranking <span class="netucne">(1 = the worst)</span></td><td class="right poradi">' + props["pvc" + rok.slice(3, 4) + "p"] + ' of 206</td></td>';
      } else if (valUj == "obce") {
        t = '<table><tr><td class="grey bold">municipality ' + props.b.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
          '<tr><td class="grey"><i>district ' + props.r + ', ' + props.k + '</i></td><td class="right grey">&nbsp;</td></tr>';
      }
      t += '<tr><td>Debt with interest </td><td class="right">' + props["vc" + rok.slice(3, 4)].toLocaleString('en-us', {
          maximumFractionDigits: 0
        }) + ' CZK</td></tr>' +
        '<tr><td class="vybrano">Average debt with interest per person</td><td class="right vybrano">' + ntn(props["vc" + rok.slice(3, 4)] / props["poe" + rok.slice(3, 4)]) + ' CZK</td></tr>';
      
        t += '<tr><td>Median debt with interest per person</td><td class="right">' + (props["mvc" + rok.slice(3, 4)]).toLocaleString('en-us', {
          maximumFractionDigits: 0
        }) + ' CZK</td></tr>';

      t += '<tr><td>Average debt with interest per EP</td><td class="right">' + ntn(props["vc" + rok.slice(3, 4)] / props["pe" + rok.slice(3, 4)]) + ' Kč</td></tr>';
  } else if (valIndi == "poe_change7") {
    t = generateChangeTooltip(props,"2017","2016");
  } else if (valIndi == "poe_change8") {
    t = generateChangeTooltip(props,"2018","2017");
  } else if (valIndi == "poe_change9") {
    t = generateChangeTooltip(props,"2019","2018");
  } else if (valIndi == "poe_change1") {
    t = generateChangeTooltip(props,"2021","2019");
  } else if (valIndi == "poe_change2") {
    t = generateChangeTooltip(props,"2022","2021");
  } else if (valIndi == "poe_changec") {
    t = generateChangeTooltip(props,"2021","2016");
  }
  t += '<tr></table>';
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
        heading += '<td class="grey"><b>Region ' + rok + '</b></td></tr>';
      } else if (valUj == "okresy") {
        heading += '<td class="grey"><b>District ' + rok + '</b></td></tr><tr><td>&nbsp;</td></tr>';
      } else if (valUj == "orp") {
        heading += '<td class="grey"><b>Municipality with extended powers' + rok + '</b></td></tr><tr><td>&nbsp;</td></tr>';
      } else if (valUj == "obce") {
        heading += '<td class="grey"><b>Municipality ' + rok + '</b></td></tr><tr><td>&nbsp;</td></tr><tr><td>&nbsp;</td></tr>';
      }
      t = heading + '<tr><td><b>Percentage of people in EPs</b></td></tr>';
      if (rok != "2016") {
        t += '<tr><td>YtY change of percentage of people in EPs';
      }
      t += '<tr><td>Average N° of EPs per person</td></tr>';
      if (rok == "2017" || rok == "2016" ) {
        t += '<tr><td>Average debt principal per person</td></tr>';
      }
      if (rok != "2016" && rok != "2021") {
        t += '<tr class="maly_detail odsadit"><td><u>People in EPs details:</u></td></tr>' +
          '<tr class="maly_detail"><td>Percentage (N°) of people with 3+ EPs</td></tr>' +
          '<tr class="maly_detail"><td>Percentage (N°) of seniors (65+ y/o)</td></tr>';
      }
      if (rok == "2021") {
          t += '<tr><td>Percentage (N°) of people with 10+ EPs</td></tr>';
        }
      if (rok == "2017") {
        t += '<tr class="plny_detail"><td>Median debt principal per person</td></tr>';
      }
      t += '<tr class="plny_detail"><td>N° of people 15+ y/o</td></tr>' +
        '<tr class="plny_detail"><td>N° of people in enforcement proceedings (EP)</td></tr>' +
        '<tr class="plny_detail"><td>Total number of EPs</td></tr>';
      if (rok != "2016" && rok != "2021" && rok != "2022") {
        t += '<tr class="plny_detail odsadit"><td><u>People in EPs details:</u></td></tr>' +
          '<tr class="plny_detail odsadit"><td>Percentage (N°) of children</td></tr>' +
          '<tr class="plny_detail"><td>Percentage of young adults (18-29 y/o)</td></tr>' +
          '<tr class="plny_detail"><td>Percentage of seniors (65+ y/o)</td></tr>' +
          '<tr class="plny_detail odsadit"><td>Percentage (N°) of people with 1 EP</td></tr>' +
          '<tr class="plny_detail"><td>Percentage of people with 2 EPs</td></tr>' +
          '<tr class="plny_detail"><td>Percentage of people with 3 - 9 EPs</td></tr>' +
          '<tr class="plny_detail"><td>Percentage of people with 10 - 29 EPs</td></tr>' +
          '<tr class="plny_detail"><td>Percentage of people with 30+ EPs</td></tr>';
      }
	  if (rok == "2022") {
        t += '<tr class="plny_detail odsadit"><td><u>People in EPs details:</u></td></tr>' +
          '<tr class="plny_detail odsadit"><td>Percentage (N°) of children</td></tr>' +
          '<tr class="plny_detail"><td>Percentage of young adults (15-29 y/o)</td></tr>' +
          '<tr class="plny_detail"><td>Percentage of people 30-39 y/o</td></tr>' +
          '<tr class="plny_detail"><td>Percentage of people 40-49 y/o</td></tr>' +
          '<tr class="plny_detail"><td>Percentage of people 50-64 y/o</td></tr>' +
          '<tr class="plny_detail"><td>Percentage of seniors (65+ y/o)</td></tr>' +
          '<tr class="plny_detail odsadit"><td>Percentage (N°) of people with 1 EP</td></tr>' +
          '<tr class="plny_detail"><td>Percentage of people with 2 EPs</td></tr>' +
          '<tr class="plny_detail"><td>Percentage of people with 3 - 9 EPs</td></tr>' +
          '<tr class="plny_detail"><td>Percentage of people with 10 - 29 EPs</td></tr>' +
          '<tr class="plny_detail"><td>Percentage of people with 30+ EPs</td></tr>';
      }
      t += '<tr class="odsadit"><td><a id="detailLink" onclick="toggleDetail()" href="#">Show details</a></td></tr></table>';
      div.innerHTML = t;
      comparing._div.appendChild(div);
      for (var i = 0; i < comparingList.length; i++) {
        var new_uj = makeDivInfo(comparingList[i], i);
        comparing._div.appendChild(new_uj);
        if (detail) {
          $(".maly_detail").hide();
          $(".plny_detail").show();
          $("#detailLink").text("Hide details");
        } else {
          $(".maly_detail").show();
          $(".plny_detail").hide();
          $("#detailLink").text("Show details");
        }
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
    valUj = preklad($("#uj_auto").html());
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
  year_disabling();
  if (valIndi == "poe_change8" || valIndi == "poe_change9") {
    $('#rad_orp').attr('disabled', true);
    $('#rad_obce').attr('disabled', true);
  } else if (valIndi == "poe_change7" || valIndi == "poe_changec") {
    $('#rad_orp').attr('disabled', false);
    $('#rad_obce').attr('disabled', false);
  }
  if ($('input[name=uj]:checked', '#uzemi').attr('disabled')) {
    $('#rad_okresy').prop('checked', true);
    v = $('input[name=uj]:checked', '#uzemi').val();
    autoLayer = false;
    valUj = v;
    switchMap();
    alert("No data");
  };
  lyr.eachLayer(function(layer) {
    layer._tooltip.setContent(generateTooltip(layer.feature))
  });

  legendUpdate();
  lyr.setStyle(style);
  map.spin(false);
});

onEachFeatureEU = function(feature, layer) {
  var text = "<table style=\"min-width:300px\"><tr><td class=\"grey bold\">" + feature.properties.jmeno + "</td></tr><tr><td>" + feature.properties.ulice + "," + feature.properties.mesto + "," + feature.properties.psc + "</td></tr><tr><td>Tel.: " + feature.properties.telefon + "</td></tr><tr><td><a href=\"" + feature.properties.www + "\"  target=\"_blank\">" + feature.properties.www + "</a></td></tr><tr><td><a href=\"mailto:" + feature.properties.email + "\">" + feature.properties.email + "</a></td></tr><tr><td>&nbsp;</td></tr><tr><td  class=\" bold\">ID number: " + feature.properties.cislo_su + "</td></tr><tr><td class=\" bold\">District: " + feature.properties.obvod + "</td></tr></table>";
  layer.bindTooltip(text);
  layer.bindPopup(text);
  var p = layer.feature.properties;
  p.index = p.cislo_su + " " + p.obvod + " | " + p.jmeno;
  layer.on('click', function() {
    map.setView(L.GeoJSON.coordsToLatLng(feature.geometry.coordinates), 15);
  });
}


$('#findbox').click(function() {
  map.spin(true);
  $('#eu_check')[0].checked = true;
  lEU.addTo(map);
  lyr.removeFrom(map);
  loKraje.addTo(map);
  showUJ = false;
  map.spin(false);
});

$('#eu_check').change(function() {
  if (this.checked) {
    map.spin(true);
    lEU.addTo(map);
    loKraje.addTo(map);
    lyr.removeFrom(map);
    showUJ = false;
    map.spin(false);
  } else {
    map.spin(true);
    lEU.removeFrom(map);
    lyr.addTo(map);
    showUJ = true;
    map.spin(false);
  }
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
  year_disabling();
  comparingList = [];
  comparing.update();
  comparing.remove();
  lyr.setStyle(style);
  lyr.eachLayer(function(layer) {
    layer._tooltip.setContent(generateTooltip(layer.feature))
  });
  map.spin(false);
});

function year_disabling() {
if (rok == "2022") {
    $('#rad_poe').attr('disabled', false);	
    $('#rad_pj').attr('disabled', true);
    $('#rad_vc').attr('disabled', false);
    $('#rad_pove').attr('disabled', false);
    $('#rad_poe_change7').attr('disabled', false);
    $('#rad_poe_change8').attr('disabled', false);
    $('#rad_poe_change9').attr('disabled', false);
    $('#rad_poe_changec').attr('disabled', false);
    $('#rad_orp').attr('disabled', false);
    $('#rad_obce').attr('disabled', false);
 } else if (rok == "2021") {
    $('#rad_poe').attr('disabled', false);
    $('#rad_pj').attr('disabled', true);
    $('#rad_vc').attr('disabled', true);
    $('#rad_pove').attr('disabled', true);
    $('#rad_poe_change7').attr('disabled', false);
    $('#rad_poe_change8').attr('disabled', false);
    $('#rad_poe_change9').attr('disabled', false);
    $('#rad_poe_changec').attr('disabled', false);
    $('#rad_orp').attr('disabled', false);
    $('#rad_obce').attr('disabled', false);
  } else if (rok == "2019") {
    $('#rad_poe').attr('disabled', false);
    $('#rad_pj').attr('disabled', true);
    $('#rad_vc').attr('disabled', true);
    $('#rad_pove').attr('disabled', false);
    $('#rad_poe_change7').attr('disabled', false);
    $('#rad_poe_change8').attr('disabled', false);
    $('#rad_poe_change9').attr('disabled', false);
    $('#rad_poe_changec').attr('disabled', false);
    $('#rad_orp').attr('disabled', false);
    $('#rad_obce').attr('disabled', false);
  } else if (rok == "2018") {
    $('#rad_poe').attr('disabled', false);
    $('#rad_pj').attr('disabled', true);
    $('#rad_vc').attr('disabled', true);
    $('#rad_pove').attr('disabled', false);
    $('#rad_poe_change7').attr('disabled', false);
    $('#rad_poe_change8').attr('disabled', false);
    $('#rad_poe_change9').attr('disabled', false);
    $('#rad_poe_changec').attr('disabled', false);
    $('#rad_orp').attr('disabled', true);
    $('#rad_obce').attr('disabled', true);
  } else if (rok == "2017") {
    $('#rad_poe').attr('disabled', false);
    $('#rad_pj').attr('disabled', false);
    $('#rad_vc').attr('disabled', true);
    $('#rad_pove').attr('disabled', false);
    $('#rad_poe_change7').attr('disabled', false);
    $('#rad_poe_change8').attr('disabled', false);
    $('#rad_poe_change9').attr('disabled', false);
    $('#rad_poe_changec').attr('disabled', false);
    $('#rad_orp').attr('disabled', false);
    $('#rad_obce').attr('disabled', false);
  } else if (rok == "2016") {
    $('#rad_poe').attr('disabled', false);
    $('#rad_pj').attr('disabled', false);
    $('#rad_vc').attr('disabled', true);
    $('#rad_pove').attr('disabled', true);
    $('#rad_poe_change7').attr('disabled', false);
    $('#rad_poe_change8').attr('disabled', false);
    $('#rad_poe_change9').attr('disabled', false);
    $('#rad_poe_changec').attr('disabled', false);
    $('#rad_orp').attr('disabled', false);
    $('#rad_obce').attr('disabled', false);
  }
  if ($('input[name=indi]:checked', '#hodnota').attr('disabled')) {

    $('#rad_poe').prop('checked', true);
    valIndi = $('input[name=indi]:checked', '#hodnota').val();
    legendUpdate();

    alert("No data");
  };
  if ($('input[name=uj]:checked', '#uzemi').attr('disabled')) {
    $('#rad_okresy').prop('checked', true);
    v = $('input[name=uj]:checked', '#uzemi').val();
    autoLayer = false;
    valUj = v;
    switchMap();
    alert("No data");
  };
}
$('#sipka').on("click", function() {
  toggleRight();
});

map.on("zoomend", function(e) {
  zoom = map.getZoom();
  if (zoom < 8) {
    v = "kraje";
    title = "regions";
  } else if (zoom < 9) {
    v = "okresy";
    title = "districts";
  } else if (zoom < 11 && (rok !== "2018" && valIndi !== "poe_change8" && valIndi !== "poe_change9")) {
    v = "orp";
    title = "ORP";
  } else if (rok !== "2018" && valIndi !== "poe_change8" && valIndi !== "poe_change9") {
    v = "obce";
    title = "obce";
  } else {
    v = "okresy";
    title = "districts";
  }
  $("#uj_auto").html(title);
  if (autoLayer) {
    valUj = v;
    switchMap();
  }
});

lEU = new L.GeoJSON.AJAX("eu.geojson", {
  onEachFeature: onEachFeatureEU,
  pointToLayer: function(feature, latLng) {
    return new L.Marker(latLng, {
      icon: redIcon
    })
  }
});

var searchControl = new L.Control.Search({
  container: 'findbox',
  layer: lEU,
  propertyName: 'index',
  textErr: 'Not found',
  textCancel: 'Cancel',
  textPlaceholder: 'Search',

  initial: false,
  collapsed: false
});

map.addControl(searchControl);
searchControl.on('search:locationfound', function(e) {

  if (e.layer._popup)
    e.layer.openPopup();

});

$(document).ready(function() {
  lEU.removeFrom(map);
  if ($(window).width() > 500) {
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
  valIndi == "poe";
  $radios = $('input:radio[name=indi]');
  $radios.filter('[value="poe"]').prop('checked', true);
  $(".plny_detail").hide();
  map.spin(false);
  year_disabling();
});
