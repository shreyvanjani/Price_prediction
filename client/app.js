function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for (var i in uiBHK) {
    if (uiBHK[i].checked) {
      return parseInt(uiBHK[i].value); 
    }
  }
  return -1; // Invalid Value
}

function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for (var i in uiBathrooms) {
    if (uiBathrooms[i].checked) {
      return parseInt(uiBathrooms[i].value);
    }
  }
  return -1; // Invalid Value
}

function getFloorValue() {
  var uifloor = document.getElementsByName("uifloor");
  for (var i in uifloor) {
    if (uifloor[i].checked) {
      return parseInt(uifloor[i].value);
    }
  }
  return -1; // Invalid Value
}


function validateInput() {
  const input = document.getElementById('numberInput').value;
  const minValue = 1; // Minimum allowed value
  const maxValue = 100; // Maximum allowed value

  // Check if the input is a valid number and within the specified range
  if (!/^\d+$/.test(input) || parseInt(input) < minValue || parseInt(input) > maxValue) {
      // Display a pop-up alert with the error message
      alert(`Please enter a valid number between ${minValue} and ${maxValue}.`);
      return false; // Prevent form submission
  }
  return true; // Allow form submission if input is valid
}



function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");
  var livingArea = parseInt(document.getElementById("uilivingSqft").value);
  var lotArea = parseInt(document.getElementById("uilotSqft").value);
  var distanceFromAirport = parseInt(document.getElementById("uidistance").value);
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var floors = getFloorValue();
  var postal = document.getElementById("uiLocations").value;
  var estPrice = document.getElementById("uiEstimatedPrice");

  if (isNaN(livingArea) || isNaN(lotArea) || isNaN(distanceFromAirport)) {
    alert("Please enter valid numeric values for living area, lot area, and distance from airport.");
    return;
  }

  // var url = "/api/predict_home_price";
  var url = "http://127.0.0.1:5000/predict_home_price"; 

  $.post(url, {
    bhk: bhk,
    bathrooms: bathrooms,
    living_area: livingArea,
    lot_area: lotArea,
    floors: floors,
    postal_code: postal,
    distance_from_airport: distanceFromAirport,
  }, function (data, status) {
    console.log(data.estimated_price);
    estPrice.innerHTML = "<h2>" + data.estimated_price.toString() + " Rupees</h2>";
    console.log(status);
  });
}

function onPageLoad() {
  console.log("document loaded");
  // var url = "/api/get_pincode";
  var url = "http://127.0.0.1:5000/get_pincode";

  $.get(url, function (data, status) {
    console.log("response for the pincode request");
    if (data) {
      var locations = data.pincodes;
      var uiLocations = document.getElementById("uiLocations");
      $("#uiLocations").empty();
      locations.forEach(location => {
        var opt = new Option(location);
        $("#uiLocations").append(opt);
      });
    }
  });

  // Initialize map
  initMap();
}

async function initMap() {
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

  const map = new Map(document.getElementById("map"), {
    center: { lat: 26.9124, lng: 75.7873 },
    zoom: 9,
    mapId: "4504f8b3736",
  });

  const markers = [
    { position: { lat: 26.9124, lng: 75.7873 }, title: "Jaipur" },
    { position: { lat: 26.4499, lng: 74.6399 }, title: "Ajmer" },
    { position: { lat: 27.553, lng: 76.6346 }, title: "Alwer" },
  ];

  const infoWindow = new InfoWindow();

  markers.forEach(({ position, title }, i) => {
    const pin = new PinElement({
      glyph: `${i + 1}`,
      scale: 1.5,
    });
    const m = new AdvancedMarkerElement({
      position,
      map,
      title: `${i + 1}. ${title}`,
      content: pin.element,
      gmpClickable: true,
      gmpDraggable: true,
    });

    m.addListener("click", () => {
      infoWindow.close();
      infoWindow.setContent(m.title);
      infoWindow.open(m.map, m);
    });

    m.addListener("dragend", () => {
      const position = m.position;
      infoWindow.close();
      infoWindow.setContent(`${position.lat()}, ${position.lng()}`);
      infoWindow.open(m.map);
    });
  });
}

window.onload = onPageLoad;
