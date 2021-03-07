var scales = {
  green: ['#edf8fb','#b2e2e2','#66c2a4','#2ca25f','#006d2c'],
  purple: ['#edf8fb','#b3cde3','#8c96c6','#8856a7','#810f7c'],
  greenblue: ['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac'],
  red: ['#fef0d9','#fdcc8a','#fc8d59','#e34a33','#b30000'],
  redgreen: ['#d73027','#fc8d59','#fee08b','#ffffbf','#d9ef8b','#91cf60','#1a9850']
};

var strany = {
    vol_ucast: {
      name: "Volební účast",
      breaks: [45,55,65,75]
    },
    pirati: {
      name: "Piráti",
      breaks: [14,18,22,26]
    },
    stan: {
      name: "STAN",
      breaks: [3,5,7,9]
    },
    pirstan: {
      name: "Piráti+STAN",
      breaks: [30,35,40,45]
    },
    stan_top09:{
      name: "STAN+TOP09",
      breaks: [14,18,22,26]
    },
    top09: {
      name: "TOP09",
      breaks: [8,12,16,20]
    },
    ods: {
      name: "ODS",
      breaks: [14,18,22,26]
    },
    "kdu-csl": {
      name: "KDU-ČSL",
      breaks: [3,5,7,9]
    },
    spolu: {
      name: "Spolu",
      breaks: [30,35,40,45]
    },
    ano: {
      name: "ANO",
      breaks: [14,18,22,26]
    },
    cssd: {
      name: "ČSSD",
      breaks: [3,5,7,9]
    },
    zeleni: {
      name: "Zelení",
      breaks: [2,4,6,8]
    },
    spd: {
      name: "SPD",
      breaks: [3,5,7,9]
    },
    kscm: {
      name: "KSČM",
      breaks: [3,5,7,9]
    },
    ps: {
      name: "Praha sobě",
      breaks: [12,17,22,27]
    },
    hpp: {
      name: "Hnutí pro Prahu 11",
      breaks: [20,25,30,35]
    },
    jmnd: {
      name: "Jižní Město - náš domov",
      breaks: [3,5,7,9]
    }
}

var volby = ["ps17","mhmp18","mc18","ep19","pps21"];
//var viewPrehled = 0;
var valUj = "okrsky";
//var autoLayer = false;
//var isComparing = false;
//var showUJ = true;
var map = L.map('map')/*, {
  //zoomControl: false,
  //doubleClickZoom: false
});*/

var l = "cs";

var valVolby = "ps17";
var valStrana = "pirati";
var valScale = "purple";

/*var redIcon = new L.Icon({
  iconUrl: 'images/marker-icon-2x-red.png',
  shadowUrl: 'images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
map.createPane('obrysy');
map.getPane('obrysy').style.zIndex = 550;
map.getPane('obrysy').style.pointerEvents = 'none';*/


L.Control.include({
  _refocusOnMap: L.Util.falseFn // Do nothing.
});


// https://api.mapbox.com/styles/v1/soukupma/cjky0su5j3dz52roblmfh2c4o/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic291a3VwbWEiLCJhIjoiMGVjMjZjMWZmYzM1YjAxZDYwMmViNWU4NTQzZWNmYjUifQ.t-OJ7Re1gQXfP1vpY1ASVA
base = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
  minZoom: 5,
  maxZoom: 20,
  //attribution: 'Podkladová mapa &copy; <a href="https://www.mapbox.com/">Mapbox</a>, &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, zdroj dat Insolvenční rejstřík',
  //mapid: 'soukupma.68f89de5'
});

map.addLayer(base);

function resetView() {
  map.fitBounds([
    [50.02, 14.47],
    [50.05, 14.55]
  ]);
};
resetView();

//map.spin(true);

/*L.control.zoom({
  position: 'bottomright'
}).addTo(map);

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
    'Údaje o počtu exekucí pochází z roku 2018 (kraje, okresy) a 2017 (nižší jednotky)'
    '<div class="right"><a onclick="icko.sbal()" href="#" ><img src="images/70206.png" width="12px"></a></div></div>';
};

icko.sbal = function() {
  icko._div.innerHTML = '<a id="icko_rozbal" onclick="icko.rozbal()" href="#" ><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANOSURBVGhD7dlJyE1xHMbx15wMKcPCwspQosRCiR0bhOxQWIgdkQVhgQUZVpRiYSjTwsJYEtmQZAoRC0IiMhTKzPdZ3Hq7Pe85/+Hce6X3qc+C/r9z733vPf/hd9o6859nOOZjMw7jJC7gLI5jO5ZgArrhn8pE7MIL/InwHscwAz3QknTFXNyAe5Ox9EdYjt5oWsbhKtwbyvUMs9HQ6FtYjx9wb6JKur/6o/L0xTm4F22Ux9DkUVkG4TrcizXaa4xHdvRNXIN7kWZ5g6xvRvfEebiLx/qNl0i9vzQJDERS1sFdNNY+1N5EL6zGN7ixRc6gC6KiKfYn3AVjnIDLWrjxZZYhOPrUVa0TWrVdhsCNL/MOgxEUrdjuIimmwmUA3PgQOxGUqrYdshcuS+HGh/gELQmF0QbQFefYgJ6oZR4+w40NtQqF2Q1XmOsjtKi+avd/OW6jMLFb8VYaBhutnq7gX7UYNgvgCmL8gk6EOltMwhhMx0bo5+VqUu2BzSa4glA7MBQdZSS0DrjaFJdgcwiuIIR2AaMwB5qVtOC56Dzj6lM8gc0puIIQ+iD6WdX+fQcu09C+LscH2FyEK0ihRctlJtz4FPrj2Wh36QpSPISLJgE3PoUmD5ujcAUpDsIl5z6spzXPZhtcQYqFqI921TpcufEptEO3UQfQFcTSTe9mLZ1x3PhUB2CjNqYriHUTLmvgxqfS/WajXqzamK4ohvq+Lpfhxqcaiw6jXqwrijEZ9VE35jvc+BTPUXh+z53nv8I1pKtcCGULCtMd+rSuOMRduFS5fmgyGYHSrIC7QIiONnI60bnxKfScJShq7ash5i5S5h5ctCvWzuE+TiN1X6f7bDSCo12su1CIKSjLfrjaMlq0o3ME7mJl3mIW6mcVtYDUPUntmT1AH0SnHx7BXTSEPtAV6PnhLeQ8V/kCnTaTo3O8uuHu4s2i7bq+4ezo+USrPoy+xUWoLDrGPoV7sUZRE08LdOXRo4EqD19FdDDLuifKoplIrf0quyHt6aekKTZpdkqJmsjqiuf2cGu07dCGNWqxqzL6ua2EuibuDZbRDmIrgvZOzYp6sZph1AFUR0Z9J51v9NdWo0BnbD1Y1aqu/ZzOE4Vb8c50puVpa/sLVe+J6OGq49MAAAAASUVORK5CYII=" width="35px"></a>';
};
*/



/*var prehled = L.control({
  position: 'topleft'
});
prehled.onAdd = function(map) {
  this._div = L.DomUtil.create('div', 'prehled');
  this._div.innerHTML =
    '<div id="prehledTable"><table><tr><td class="grey bold">ČESKÁ REPUBLIKA</td><td class="right grey bold">2019</td><td class="right grey bold">meziroční změna</td></tr>' +
    '<tr><td>Počet osob v osobním bankrotu</td><td class="right bold">116 tis.</td><td class="right">+1,6 %</td></tr>' +
    '<tr><td>Podíl osob v bankrotu</td><td class="right bold">1,29 %</td><td class="right">+0,01 p.b.</td></tr>' +
    '<tr><td>Průměrný počet věřitelů</td><td class="right bold">9,8</td><td class="right">+0,2</td></tr>' +
    '<tr><td>Podíl muži / ženy</td><td class="right bold">52 % / 48 %</td><td class="right">+1 p.b. muži</td></tr>' +
    '<tr><td>Podíl manželů</td><td class="right bold">29 %</td><td class="right">-</td></tr>' +
    '<tr><td>Průměrný / mediánový věk</td><td class="right bold">43,7 / 43</td><td class="right">-1,2 / -1</td></tr>' +
    '<tr><td>Osobní bankroty vs. exekuce</td><td class="right bold">14,18 %</td><td class="right">+0,9 p.b.</td></tr>' +
    '<tr><td><u>Věková struktura osob v bankrotu:</u></td></tr>' +
    '<tr><td>Podíl (počet) osob ve věku 18 až 29 let</td><td class="right bold">13 % (14 753)</td><td class="right">+3 168</td></tr>' +
    '<tr><td>Podíl (počet) osob ve věku 30 až 39 let</td><td class="right bold">27 % (31 301)</td><td class="right">+753</td></tr>' +
    '<tr><td>Podíl (počet) osob ve věku 40 až 49 let</td><td class="right bold">29 % (34 212)</td><td class="right">-288</td></tr>' +
    '<tr><td>Podíl (počet) osob ve věku 50 až 65 let</td><td class="right bold">24 % (28 173)</td><td class="right">-1 523</td></tr>' +
    '<tr><td>Podíl (počet) seniorů (65+ let)</td><td class="right bold">6 % (7 476)</td><td class="right">-1 289</td></tr>'+
    '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td class="right"><a id="togglePrehledLink" onclick="togglePrehled()" href="#"><img src="images/70206.png" width="12px"></a></td></tr></table></div>'+
    '<div id="showSouhrnne" style="display:none"><a id="togglePrehledLink" onclick="togglePrehled()" href="#">Zobrazit souhrnné údaje</a></div> ';

  return this._div;
};

prehled.addTo(map);*/


/*
var zrusit = L.control({
  position: 'topright'
});
zrusit.onAdd = function(map) {
  this._div = L.DomUtil.create('div', 'zrusit');
  this._div.innerHTML =
    '<a id="togglePrehledLink" onclick="cancelResults()" href="#"><img src="images/70206.png" width="12px"> Skrýt výsledky vyhledávání</a>';
  return this._div;
};*/


function getColor(props) {
  if  ($.isNumeric(props)) {
    d = props;
  } else {
    if (valStrana=="vol_ucast") {
      d = (props[valVolby+"_platnych"]/props[valVolby+"_volicu"])*100;
    } else {
      d = (props[valVolby+"_"+valStrana]/props[valVolby+"_platnych"])*100;
    }
  }//alert(d);
  if ($.isNumeric(d)) {
    for (i = 0; i < strany[valStrana]['breaks'].length; i++) {
      if (d < strany[valStrana]['breaks'][i]) {
        return scales[valScale][i]
      }
    }
  return scales[valScale][scales[valScale].length - 1];
  } else {
  return 'white';
  }
}

function style(feature) {


    return {
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      fillColor: getColor(feature.properties)
    };
}

/*
function styleK(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: '#666',
    dashArray: '',
    fillOpacity: 0
  }
}
*/
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

/*
function ntn(number, digits /*, units*//* ){
  if (isNaN(number)) {
    numberText = "neposkytnuto";
  } else {
  if (digits === undefined) {
    digits = 0;
  };
  numberText = parseFloat(number).toLocaleString('cs-CZ', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })
}
  return numberText;
};*/

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
    //click: compare
  });
}


//var comparingList = [];

function switchMap(coor) {
  map.spin(true);
  legendUpdate();
  //loKraje.removeFrom(map); //krajske obrysy
  if (valUj == "mc") {
    nlyr = lMC;
  } else if (valUj == "okrsky") {
    nlyr = lOkrsky;
  }

  if (lyr != nlyr) {
    lyr.removeFrom(map);
    lyr = nlyr;
  }
  lyr.setStyle(style);
  lyr.eachLayer(function(layer) {
    layer._tooltip.setContent(generateTooltip(layer.feature))
  });
  lyr.addTo(map);
  map.spin(false);
}


/*
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
*/
/*
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
  if (props["b9c"] >= props["b8c"]) {
    t += '<tr><td>+'+ntn(props["b9c"] - props["b8c"]) + '</b></td></tr>';
  } else {
    t += '<tr><td>'+ntn(props["b9c"] - props["b8c"]) + '</b></td></tr>';
  }
    t+=  '<tr><td>'+'<b>'+ntn(props["b"+rok.substring(3,4)+"c"] * 100 / props["o"], 2) + ' %</b></td></tr>'+
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
  return div
};
*/
/*
function compareSecondColumn(a, b) {

  if (a[1] === b[1]) {
    return 0;
  } else {
    return a[1].localeCompare(b[1], "cs");
  }
}
*/
var lOkrsky = new L.GeoJSON.AJAX("okrsky.geojson", {
style: style,
  onEachFeature: onEachFeature
});

/*var lMC = new L.GeoJSON.AJAX("mc.geojson", {
  style: style,
  onEachFeature: onEachFeature
});*/

var lyr = lOkrsky;
lyr.addTo(map);

function togglePrehled() {
  $("#prehledTable").toggle(200);
  $("#showSouhrnne").toggle(200);
}


function legendUpdate() {
  labels = [];
  //step = 0.5;
  from = 0;
  to = strany[valStrana]['breaks'][0];
  labels.push(
      '<span style="width: 50px;float: left;background:' + getColor((from + to) / 2) + ';opacity:0.7">&nbsp;</span>&nbsp;' +
      parseFloat(from).toLocaleString('cs-CZ') + ' &ndash; ' + parseFloat(to).toLocaleString('cs-CZ')
    );
  for (var i = 1; i <= strany[valStrana]['breaks'].length - 1; i++) {
    from = to;
    to = strany[valStrana]['breaks'][i];
    labels.push(
      '<span style="width: 50px;float: left;background:' + getColor((from + to) / 2)  + ';opacity:0.7">&nbsp;</span>&nbsp;' +
      parseFloat(from).toLocaleString('cs-CZ') + ' &ndash; ' + parseFloat(to).toLocaleString('cs-CZ')
    );
  };
  from = to;
  to = 100;
  labels.push(
    '<span style="width: 50px;float: left;background:' + getColor((from + to) / 2) + ';opacity:0.7">&nbsp;</span>&nbsp;' +
    parseFloat(from).toLocaleString('cs-CZ') + ' a více');

  $('#legenda').html(labels.join('<br />'));

};

/*
function cancel(index) {
  comparingList.splice(index, 1);
  if (comparingList.length == 0) {
    comparing.remove();
  }
  comparing.update();
  lyr.setStyle(style);
}
*/


function generateTooltip(feature) {
  var props = feature.properties;
  var t;

  function formatStranaResult(election,stranaHlasy,platneHlasy){
    if (isNaN(stranaHlasy)){
    v = "-";} else if(election=="mhmp18"){
        v = String(Math.round((stranaHlasy/platneHlasy)*100))+' % ('+String(Math.round(stranaHlasy/65))+')';
    } else if(election=="mc18"){
        v = String(Math.round((stranaHlasy/platneHlasy)*100))+' % ('+String(Math.round(stranaHlasy/45))+')';
    } else {
      v = String(Math.round((stranaHlasy/platneHlasy)*100))+' % ('+String(stranaHlasy)+')';
    }
    return v;
  }



  t = '<table><tr><td class="grey bold">' + props["OBEC_CISLO"]+ ' ('+String(props["ep19_volicu"]) + ' voličů)</td>';
  volby.forEach(function (item, index) {
  t += '<td class="right grey bold">'+item.toUpperCase()+'</td>';
  });
  t+='</tr>';
  t += '<tr><td class="grey">Volební účast</td>';
  volby.forEach(function (item, index) {
    if(item=="mhmp18" || item=="mc18" ){
      t += '<td class="grey">'+String(Math.round((props[item+"_oo"]/props[item+"_volicu"])*100))+'% ('+String(props[item+"_oo"])+')</td>';
    }else{
  t += '<td class="grey">'+String(Math.round((props[item+"_platnych"]/props[item+"_volicu"])*100))+'% ('+String(props[item+"_platnych"])+')</td>';
  }});
  t+='</tr>';

  for (const [key, value] of Object.entries(strany)) {
    if (key !== "vol_ucast"){
    t += '<tr><td>'+value.name+'</td>';
    volby.forEach(function (item, index) {
    t += '<td class="right">'+formatStranaResult(item,props[item+"_"+key],props[item+"_platnych"])+'</td>';
    });
    t+='</tr>';
}
}
  t += '</tr></table>';

  return t;
}


/*
var comparing = L.control({
  position: 'bottomleft'
});

*/
/*
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
          '<tr><td>Meziroční změna počtu osob v bankrotu</td></tr>'+
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
*/

$('#uzemi').on('change', function() {

  map.spin(false);
  map.spin(true);
  v = $('input[name=uj]:checked', '#uzemi').val();
  valUj = v;
  switchMap();
  map.spin(false);

});

$('#barva').on('change', function() {
  map.spin(false);
  map.spin(true);
  valScale = $('#color_Select').children("option:selected").val();
  switchMap();
  legendUpdate();
  map.spin(false);
});


// */

$('#strana').on('change', function() {
  map.spin(false);
  map.spin(true);
valStrana = $('#strana_Select').children("option:selected").val();

  /*lyr.eachLayer(function(layer) {
    layer._tooltip.setContent(generateTooltip(layer.feature))
  });*/

  legendUpdate();
  lyr.setStyle(style);
  map.spin(false);
});

$('#volby').on('change', function() {
  map.spin(false);
  map.spin(true);
  valVolby = $('input[name=volby]:checked').val();
  //alert(valVolby);
  lyr.eachLayer(function(layer) {

    layer._tooltip.setContent(generateTooltip(layer.feature))

  });
  legendUpdate();
  lyr.setStyle(style);
  map.spin(false);

});






/*$('#findbox').click(function() {
  map.spin(true);
  lyr.removeFrom(map);
  loKraje.addTo(map);
  showUJ = false;
  map.spin(false);
});*/


function toggleRight() {
  $("#right").toggle(200);
  $("#arrow_right").toggle(200);
  $("#arrow_left").toggle(200);
}

/*$('.year').click(function(e) {

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
    //legendUpdate();

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
});*/

$('#sipka').on("click", function() {
  toggleRight();
});

/*map.on("zoomend", function(e) {
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
  /*if (autoLayer) {

    valUj = v;
    //switchMap();
  }
});*/


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
  valUj == "okrsky";
  //var $radios = $('input:radio[name=uj]');
  //$radios.filter('[value="okrsky"]').prop('checked', true);
  //valIndi == "vol_ucast";
  //$radios = $('input:radio[name=indi]');
  //$radios.filter('[value="pob"]').prop('checked', true);
  map.spin(false);

});
