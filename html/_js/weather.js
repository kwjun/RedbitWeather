var geocoder;

//Using google map api for geolocation
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
} 
//Get the current weather on success
function successFunction(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
	setWeather(lat, lng);
}

function errorFunction(){
    alert("Geocoder failed");
}

function initialize() {
    geocoder = new google.maps.Geocoder();
}

function getByCity(city) {
    geocoder.geocode({'address': city}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
			//find country name
			//$("#hidn_lat").val(results[0].geometry.location.lat());
			setWeather(results[0].geometry.location.lat(), results[0].geometry.location.lng());
        } else {
          alert("No results found");
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
}
//Get weather information from http://www.wunderground.com/ based on longitude and latitude
function setWeather(lat, lnt){
	$.ajax({
			url : "http://api.wunderground.com/api/75ab98a81f0e3f15/geolookup/conditions/q/"+ lat +"," +lnt+".json",
			dataType : "jsonp",
			success : function(parsed_json) {
			var location = parsed_json['location']['city'];
			var temp_c = parsed_json['current_observation']['temp_c'];
			var icon_url = parsed_json['current_observation']['icon_url'];
			var weather = parsed_json['current_observation']['weather'];
			var feelslike_c = parsed_json['current_observation']['feelslike_c'];
			var icon = parsed_json['current_observation']['icon'];
			$(".location").html(location);
			$(".temp-c").html(temp_c);
			$(".weather-icon").attr("src", icon_url);
			$(".weather").html(weather);
			$(".feelslike-c").html(feelslike_c);

			//change background of the body based on name of the icon
			switch(icon){
				case 'clear':
					document.body.style.background = "url(../_img/bg_sunny.jpg)"
				break;
				case 'cloudy':
				case 'mostlycloudy':
					document.body.style.background = "url(../_img/bg_cloudy.jpg)"
				break;
				//to handle omitted icons for weather condition
				default:
					document.body.style.background = "url(../_img/bg_rainy.jpg)"
			}
		}
	});
}