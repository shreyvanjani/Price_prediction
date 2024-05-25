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
  var livingArea = document.getElementById("uilivingSqft").value;
  var lotArea = document.getElementById("uilotSqft").value;
  var distanceFromAirport = document.getElementById("uidistance").value;
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var floors = getFloorValue();
  var postal = document.getElementById("uiLocations").value;
  var estPrice = document.getElementById("uiEstimatedPrice");

  var url = "http://127.0.0.1:5000/predict_home_price"; 
  // var url = "/api/predict_home_price"; // Use this if  you are using nginx. i.e tutorial 8 and onwards

  $.post(
    url,
    {
      bhk: bhk,
      bathrooms: bathrooms,
      living_area: parseInt(livingArea),
      lot_area: parseInt(lotArea),
      floors: floors,
      postal_code: postal,
      distance_from_airport: parseInt(distanceFromAirport),
    },
    function (data, status) {
      console.log(data.estimated_price);
      estPrice.innerHTML = "<h2>" + data.estimated_price.toString() + " Rupees</h2>";
      console.log(status);
    }
  );
}
// here we load the pages(fist load the location)
function onPageLoad() {
  console.log("document loaded");
  var url = "http://127.0.0.1:5000/get_pincode"; 
  $.get(url, function (data, status) {
    console.log("response for the pincode request ");
    if (data) {
      var locations = data.pincodes;
      var uiLocations = document.getElementById("uiLocations");
      $("#uiLocations").empty();
      for (var i in locations) {
        var opt = new Option(locations[i]);
        $("#uiLocations").append(opt);
      }
    }
  });
}

window.onload = onPageLoad;