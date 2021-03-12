// js functions
// Create the map object with a center and zoom level.

console.log("working");

console.log(state);
console.log(selection);
console.log(star_choice)

if (selection == "all categories") {
    selection = "all";
};




// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY

});

// We create the second tile layer that will be the background of our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

let night_preview = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/navigation-preview-night-v2/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

let map = L.map(
    'mapid', {
    center: [40.7, -94.5], 
    zoom: 4,
    layers: [night_preview]
});

let baseMaps = {
    "Streets": streets,
    "Satellite": satelliteStreets,
    "Night Preview":night_preview
  };


function add_state() {
    let addMe = document.getElementById("state_pred");
    console.log("clicked"); 
    let add_this_one = addMe.options[addMe.selectedIndex].text;
    document.getElementById("states_lst").value += add_this_one + ",";
};


function add_category() {
    let addMe2 = document.getElementById("category_pred")
    console.log("clicked"); 
    let add_this_one = addMe2.options[addMe2.selectedIndex].text;
    document.getElementById("categories_lst").value += add_this_one + ",";
};






if (state == "all" && selection == "all" && star_choice == "all") {
    d3.json("https://groupfour.ngrok.io/json_data/data.json").then(function(data) {
    console.log(data);
    for (var i = 0; i < data["lat"].length; i++) {
        {
        var marker = new L.marker([parseFloat(data["lat"][i]), parseFloat(data["lng"][i])]);
        marker.bindPopup( "<h3>"+ data["state"][i] +" "+ data['name'][i] + "</h3><b></b><h4>review count: " + data["review_count"][i] +"<b></b><h4> Star Rating: "+ data["stars"][i] +"</h4>").openPopup();
        marker.addTo(map)
        }
    }
    var loadan = document.getElementById("loader");
    loadan.remove()
});
};



if (state == "all" && selection != "all"  && star_choice != "all") {
    d3.json("https://groupfour.ngrok.io/json_data/data.json").then(function(data) {
    console.log(data);
    for (var i = 0; i < data["lat"].length; i++) {
        if (data[selection][i] == 1 && data["stars"][i] == star_choice) {
        var marker = new L.marker([parseFloat(data["lat"][i]), parseFloat(data["lng"][i])]);
        marker.bindPopup( "<h3>"+ data["state"][i] +" "+ data['name'][i] + "</h3><b></b><h4>review count: " + data["review_count"][i] +"<b></b><h4> Star Rating: "+ data["stars"][i] +"</h4>").openPopup();
        marker.addTo(map)
        }
    }
    var loadan = document.getElementById("loader");
    loadan.remove();
});
};

if (state == "all" && selection == "all"  && star_choice != "all") {
    d3.json("https://groupfour.ngrok.io/json_data/data.json").then(function(data) {
    console.log(data);
    for (var i = 0; i < data["lat"].length; i++) {
        if (data["stars"][i] == star_choice) {
        var marker = new L.marker([parseFloat(data["lat"][i]), parseFloat(data["lng"][i])]);
        marker.bindPopup( "<h3>"+ data["state"][i] +" "+ data['name'][i] + "</h3><b></b><h4>review count: " + data["review_count"][i] +"<b></b><h4> Star Rating: "+ data["stars"][i] +"</h4>").openPopup();
        marker.addTo(map)
        }
    }
    var loadan = document.getElementById("loader");
    loadan.remove();
});
};


if (state == "all" && selection != "all"  && star_choice == "all") {
    d3.json("https://groupfour.ngrok.io/json_data/data.json").then(function(data) {
    console.log(data);
    for (var i = 0; i < data["lat"].length; i++) {
        if (data["stars"][i] == star_choice && data[selection] == 1) {
        var marker = new L.marker([parseFloat(data["lat"][i]), parseFloat(data["lng"][i])]);
        marker.bindPopup( "<h3>"+ data["state"][i] +" "+ data['name'][i] + "</h3><b></b><h4>review count: " + data["review_count"][i] +"<b></b><h4> Star Rating: "+ data["stars"][i] +"</h4>").openPopup();
        marker.addTo(map)
        }
    }
    var loadan = document.getElementById("loader");
    loadan.remove();
});
};


if (selection == "all" && state != "all" && star_choice != "all")  {
    d3.json("https://groupfour.ngrok.io/json_data/data.json").then(function(data) {
        console.log(data);
        for (var i = 0; i < data["lat"].length; i++) {
            if (data["state"][i] == state && data["stars"][i] == star_choice ) {
            var marker = new L.marker([parseFloat(data["lat"][i]), parseFloat(data["lng"][i])]);
            marker.bindPopup( "<h3>"+ data["state"][i] +" "+ data['name'][i] + "</h3><b></b><h4>review count: " + data["review_count"][i] +"<b></b><h4> Star Rating: "+ data["stars"][i] +"</h4>").openPopup();
            marker.addTo(map)
            }
        }
        var loadan = document.getElementById("loader");
        loadan.remove();
    });
};


if (selection == "all" && state != "all" && star_choice == "all")  {
    d3.json("https://groupfour.ngrok.io/json_data/data.json").then(function(data) {
        console.log(data);
        for (var i = 0; i < data["lat"].length; i++) {
            if (data["state"][i] == state) {
            var marker = new L.marker([parseFloat(data["lat"][i]), parseFloat(data["lng"][i])]);
            marker.bindPopup( "<h3>"+ data["state"][i] +" "+ data['name'][i] + "</h3><b></b><h4>review count: " + data["review_count"][i] +"<b></b><h4> Star Rating: "+ data["stars"][i] +"</h4>").openPopup();
            marker.addTo(map)
            }
        }
        var loadan = document.getElementById("loader");
        loadan.remove();
    });
};


if (selection != "all" && state != "all" && star_choice == "all")  { 
d3.json("https://groupfour.ngrok.io/json_data/data.json").then(function(data) {
    console.log(data);
    for (var i = 0; i < data["lat"].length; i++) {
        if (data["state"][i] == state && data[selection][i] == 1) {
        var marker = new L.marker([parseFloat(data["lat"][i]), parseFloat(data["lng"][i])]);
        marker.bindPopup( "<h3>"+ data["state"][i] +" "+ data['name'][i] + "</h3><b></b><h4>review count: " + data["review_count"][i] +"<b></b><h4> Star Rating: "+ data["stars"][i] +"</h4>").openPopup();
        marker.addTo(map)
        }
    }
    var loadan = document.getElementById("loader");
    loadan.remove();
});
};



if (selection == "all" && state == "all" && star_choice != "all")   { 
    d3.json("https://groupfour.ngrok.io/json_data/data.json").then(function(data) {
        console.log(data);
        for (var i = 0; i < data["lat"].length; i++) {
            if (data["stars"][i] == star_choice) {
            var marker = new L.marker([parseFloat(data["lat"][i]), parseFloat(data["lng"][i])]);
            marker.bindPopup( "<h3>"+ data["state"][i] +" "+ data['name'][i] + "</h3><b></b><h4>review count: " + data["review_count"][i] +"<b></b><h4> Star Rating: "+ data["stars"][i] +"</h4>").openPopup();
            marker.addTo(map)
            }
        }
        var loadan = document.getElementById("loader");
        loadan.remove();
    });
    };


if (selection == "all" && state == "all" && star_choice != "all")  { 
    d3.json("https://groupfour.ngrok.io/json_data/data.json").then(function(data) {
        console.log(data);
        for (var i = 0; i < data["lat"].length; i++) {
            if (data["stars"][i] == star_choice) {
            var marker = new L.marker([parseFloat(data["lat"][i]), parseFloat(data["lng"][i])]);
            marker.bindPopup( "<h3>"+ data["state"][i] +" "+ data['name'][i] + "</h3><b></b><h4>review count: " + data["review_count"][i] +"<b></b><h4> Star Rating: "+ data["stars"][i] +"</h4>").openPopup();
            marker.addTo(map)
            }
        }
        var loadan = document.getElementById("loader");
        loadan.remove();
    });
    };

if (selection != "all" && selection != "all categories" && state == "all" && star_choice != "all")  { 
    d3.json("https://groupfour.ngrok.io/json_data/data.json").then(function(data) {
        console.log(data);
        for (var i = 0; i < data["lat"].length; i++) {
            if (data["stars"][i] == star_choice && data[selection][i] == 1) {
            var marker = new L.marker([parseFloat(data["lat"][i]), parseFloat(data["lng"][i])]);
            marker.bindPopup( "<h3>"+ data["state"][i] +" "+ data['name'][i] + "</h3><b></b><h4>review count: " + data["review_count"][i] +"<b></b><h4> Star Rating: "+ data["stars"][i] +"</h4>").openPopup();
            marker.addTo(map)
            }
        }
        var loadan = document.getElementById("loader");
        loadan.remove();
    });
    };
    

if (selection != "all" && state != "all" && star_choice != "all")  { 
    d3.json("https://groupfour.ngrok.io/json_data/data.json").then(function(data) {
        console.log(data);
        for (var i = 0; i < data["lat"].length; i++) {
            if (data["stars"][i] == star_choice && data["state"][i] == state && data[selection] == 1) {
            var marker = new L.marker([parseFloat(data["lat"][i]), parseFloat(data["lng"][i])]);
            marker.bindPopup( "<h3>"+ data["state"][i] +" "+ data['name'][i] + "</h3><b></b><h4>review count: " + data["review_count"][i] +"<b></b><h4> Star Rating: "+ data["stars"][i] +"</h4>").openPopup();
            marker.addTo(map)
            }
        }
        var loadan = document.getElementById("loader");
        loadan.remove();
    });
    };


L.control.layers(baseMaps).addTo(map);

var theMarker = {};

map.on('click',function(e){
  lat = e.latlng.lat;
  lon = e.latlng.lng;

  console.log("You clicked the map at LAT: "+ lat+" and LONG: "+lon );
      //Clear existing marker, 

      if (theMarker != undefined) {
            map.removeLayer(theMarker);
      };

  //Add a marker to show where you clicked.
   theMarker = L.marker([lat,lon]).bindPopup("<h3>Name</h3>").addTo(map);
   let element = document.getElementById("lat");
   element.value = lat;
   let element_2 = document.getElementById("lng");
   element_2.value = lon;

});


