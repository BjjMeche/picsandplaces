var client_id = "44bc6fcf9a344b4ba7f7a5abc8540ba6"
var lat = "37.765"
var lng = "-122.4383"
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
  initialize(mediaResponseData)
  var data_length = data.data.length
  for (var i = 0; i < data_length; i++) {
    $("#pics").append("<a href='" + data.data[i].link + "'><img src='" + data.data[i].images.low_resolution.url + "'></img></a>");
  }
}).fail(function(){
  console.log("Failed at media location GET request")
})


function initialize(mediaResponseData) {
  var mapOptions = {
    center: { lat: 37.765, lng: -122.41833},
    zoom: 12
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);

  console.log(mediaResponseData.length)
  for (var i = 0; i< mediaResponseData["data"].length; i++){
    var instaLat = mediaResponseData["data"][i]["location"]["latitude"]
    var instaLng = mediaResponseData["data"][i]["location"]["longitude"]
    var instaImg = mediaResponseData["data"][i]["images"]["low_resolution"]["url"]
    var formatedInstaData = latLngImg(instaLat,instaLng,instaImg)
      console.log(formatedInstaData[0])
      var marker = new google.maps.Marker({
      position: formatedInstaData[0],
      map: map,
      icon: new google.maps.MarkerImage(
                                        formatedInstaData[2],
                                        null,
                                        null,
                                        null,
                                        new google.maps.Size(100, 100)
                                        )

    })
  }
  function latLngImg(instaLat,instaLng,instaImg){
    return ([{ lat: instaLat, lng: instaLng}, map, instaImg])
  }
}


