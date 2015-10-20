var map;

// Function to draw your map
var drawMap = function() {

	// Create map and set view
	map = L.map('map').setView([40, -96], 4);

	// Create a tile layer variable using the appropriate url
	var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');

	// Add the layer to your map
	layer.addTo(map);

	// Execute your function to get data
	getData();
 
}

// Function for getting data
var getData = function() {

	// Execute an AJAX request to get the data in data/response.js
	$.ajax({url: 'data/response.json',
		dataType: 'json',
		success: function(data) {
			customBuild(data)
		}
	});
}

// Loop through your data and add the appropriate layers and points
var customBuild = function(data) {
	// Be sure to add each layer to the map
	layers = {};
	metrics = {};

	console.log(data);

	for (dat in data) {
		var d = data[dat];
		var circle = new L.circleMarker([d.lat, d.lng], {
			color: (d['Hit or Killed?'] ? (d['Hit or Killed?'].toLowerCase() == 'killed' ? 'red' : 'blue') : 'grey')
		});

		var str = '<p>' + dat;
		str+= (d['Victim Name'] ? d['Victim Name'] : 'An Unknown Individual');
		str+= (d['Hit or Killed?'] ? ' was ' + d['Hit or Killed?'].toLowerCase() : '');
		str+= (d['Timestamp'] ? ' on ' + d['Timestamp'] : '');
		str+= (d['Name of Officer or Officers'] ? ' by ' + d['Name of Officer or Officers'] : '');
		str+= (d['Agency Name'] ? ' of the ' + d['Agency Name'] : '');
		str+= '.</p>';

		str+= '<p>';
		str+= (d["Victim's Age"] ? '<b>Age: </b>' + d["Victim's Age"] : '') + '<br>';
		str+= (d["Victim's Gender"] ? '<b>Gender: </b>' + d["Victim's Gender"] : '') + '<br>';
		str+= (d['Race'] ? '<b>Race: </b>' + d['Race'] : '') + '<br>';
		str+= (d['Hispanic or Latino Origin'] ? '<b>Latin or Hispanic: </b>' + d['Hispanic or Latino Origin'] : '') + '<br>';
		str+= (d['Summary'] ? '<b>Summary: </b>' + d['Summary'] : '') + '<br>';
		str+= '.</p>';

		var race = d['Race'];
		if (race === undefined) {
			race = 'Unknown';
		}

		var layer = layers[race]
		if (!layer) {
			layers[race] = new L.LayerGroup([])
			layer = layers[race];
			console.log('created layer ' + race);
			metrics[race] = {};
			metrics[race]['Male'] = 0;
			metrics[race]['Female'] = 0;
			metrics[race]['Unknown'] = 0;
		}
		metrics[race][d["Victim's Gender"]]++;
		circle.bindPopup(str);
		circle.addTo(layer);

	console.log('hello');
	
	}

	for (l in layers) {
		layers[l].addTo(map);		
	}

	// Once layers are on the map, add a leaflet controller that shows/hides layers
	L.control.layers(null, layers).addTo(map);
	
	tabulate(metrics);

	
}

//Put metrics data in the tabulated table area
var tabulate = function(metrics) {
	
	var table = document.getElementById('table');
	
	for (metric in metrics) {		
		var row = document.createElement('tr');
		
		var race = document.createElement('td');
		race.innerHTML = metric;
		var male = document.createElement('td');
		male.innerHTML = metrics[metric]['Male'];
		var female = document.createElement('td');
		female.innerHTML = metrics[metric]['Female'];
		var other = document.createElement('td');
		other.innerHTML = metrics[metric]['Unknown'];
	
		row.appendChild(race);
		row.appendChild(male);
		row.appendChild(female);
		row.appendChild(other);
		console.log(row)

		table.appendChild(row);
	}
}