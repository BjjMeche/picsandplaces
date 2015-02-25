function initialize() {
  var lat = 37.768
  var lng = -122.417
  var mapOptions = {
    center: { lat: lat, lng: lng},
    zoom: 12
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);

  var input = (document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox(input);

  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();
    lat = places[0]["geometry"]["location"]["k"]
    lng = places[0]["geometry"]["location"]["D"]
    placeName=places[0]["name"]
    return grabInstaPics(lat,lng,map,placeName)
  })
};

function grabInstaPics(lat, lng, map, placeName){
  var client_id = "44bc6fcf9a344b4ba7f7a5abc8540ba6"
  var lat = lat
  var lng = lng
  var media_data = []
  var minDelayMins = 15
  var MS_PER_MIN = 60000
  var MinTime = Date.now() - minDelayMins * MS_PER_MIN //all pics within 15mins
  var mediaResponseData = []
  $.ajax({
    url: "https://api.instagram.com/v1/media/search?lat="+lat+"&lng="+lng+"&MIN_TIMESTAMP="+MinTime+"&client_id="+client_id,
    dataType: "jsonp",
    type: "GET",
  }).done(function(data){
    mediaResponseData = data
    $("#pics-container").append("<div id='pics-location'><h3>" + placeName + "</h3></div>")
    var data_length = data.data.length
    for (var i = 0; i < data_length; i++) {
    var instaDescription
    if (data["data"][i]["caption"] == null){
      instaDescription = ""
    }else{
      instaDescription = data["data"][i]["caption"]["text"]
    }
      $("#pics-container").append("<div id='pics-inner'><div id='pics'><a target='_blank' href='" + data.data[i].link + "'><img src='" + data.data[i].images.standard_resolution.url.replace("http","https") + "'></img></a><div id='pic-description'>" +instaDescription +"</div></div></div>");
    }
    displayInstaPics(mediaResponseData,map)
  }).fail(function(){
    console.log("Failed at media location GET request")
  })
};

function displayInstaPics(mediaResponseData,map){
  for (var i = 0; i< mediaResponseData["data"].length; i++){
    var instaLat = mediaResponseData["data"][i]["location"]["latitude"]
    var instaLng = mediaResponseData["data"][i]["location"]["longitude"]
    var instaImg = mediaResponseData["data"][i]["images"]["low_resolution"]["url"].replace("http","https")
    var formatedInstaData = latLngImg(instaLat,instaLng,instaImg)
    var marker = new google.maps.Marker({
      position: formatedInstaData[0],
      map: map,
      icon: new google.maps.MarkerImage(
        formatedInstaData[2],
        null,
        null,
        null,
        new google.maps.Size(80, 80)
        )
    })
  };
  function latLngImg(instaLat,instaLng,instaImg){
    return ([{ lat: instaLat, lng: instaLng}, map, instaImg])
  }
};
