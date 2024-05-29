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

function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");
  var livingArea = parseInt(document.getElementById("uilivingSqft").value);
  var lotArea = parseInt(document.getElementById("uilotSqft").value);
  var distanceFromAirport = parseInt(
      document.getElementById("uidistance").value
  );
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var floors = getFloorValue();
  var postal = document.getElementById("uiLocations").value;
  var bestPrice = document.getElementById("uiEstimatedPrice");

  if (isNaN(livingArea) || isNaN(lotArea) || isNaN(distanceFromAirport)) {
      alert(
          "Please enter valid numeric values for living area, lot area, and distance from airport."
      );
      return;
  }

  if (livingArea < 400 || lotArea < 600) {
      alert("minimu value for living area is 400 and lot area is 600");
      return;
  }
  if (livingArea < 400 || lotArea < 600 || livingArea > lotArea) {
      alert("Living Area should be less than Lot Area");
      return;
  }

  var url = "http://127.0.0.1:5000/predict_home_price";

  $.post(
      url,
      {
          bhk: bhk,
          bathrooms: bathrooms,
          living_area: livingArea,
          lot_area: lotArea,
          floors: floors,
          postal_code: postal,
          distance_from_airport: distanceFromAirport,
      },
      function (data, status) {
          console.log(data.estimated_price);
          bestPrice.innerHTML =
              "<h2>" + data.estimated_price.toString() + " Rupees</h2>";
          console.log(status);
      }
  );
}

function onPageLoad() {
  console.log("document loaded");
  var url = "http://127.0.0.1:5000/get_pincode";

  $.get(url, function (data, status) {
      console.log("response for the pincode request");
      if (data) {
          var locations = data.pincodes;
          var uiLocations = document.getElementById("uiLocations");
          $("#uiLocations").empty();
          locations.forEach((location) => {
              var opt = new Option(location);
              $("#uiLocations").append(opt);
          });
      }
  });

  // Initialize map
  initMap();
}

let map;
let markers = [];
let infoWindow;

async function initMap() {
  var postal = document.getElementById("uiLocations").value;
  var url = "http://127.0.0.1:5000/fetch-pincode-data?pincode=" + postal;
  console.log(url);
  $.get(url, function (data, status) {
      console.log(data);

      // Clear the existing markers
      markers.forEach((marker) => marker.setMap(null));
      markers = [];

      if (data.coordinates) {
          if (!map) {
              map = new google.maps.Map(document.getElementById("map"), {
                  center: { lat: data.coordinates[0].latitude, lng: data.coordinates[0].longitude },
                  zoom: 15,
                  mapId: "4504f8b3736",
              });
              infoWindow = new google.maps.InfoWindow();
          } else {
              map.setCenter({ lat: data.coordinates[0].latitude, lng: data.coordinates[0].longitude });
          }

          markers = data.coordinates.map((coord, i) => {
              const marker = new google.maps.Marker({
                  position: { lat: coord.latitude, lng: coord.longitude },
                  map: map,
                  title: `${i + 1}. Location ${i + 1}`,
              });

              marker.addListener("click", () => {
                  infoWindow.close();
                  infoWindow.setContent(marker.title);
                  infoWindow.open(map, marker);
              });

              return marker;
          });
      } else {
          console.error("Unexpected response format:", data);
      }

      console.log(status);
  });
}

window.onload = onPageLoad;


