define(["gmaps", "modernizr"], function(GMaps, Modernizr)
{
    var city = " London";
    var currentMap = null;

    var MapUtils = function(){
        this.geocodeAddress = function(address){
            GMaps.geocode({
                address: address + city,
                callback: function(results, status) {
                    if (status == 'OK') {
                        var latlng = {lat : results[0].geometry.location.jb, lng: results[0].geometry.location.kb};
                        currentMap.addMarker(latlng);
                    }
                }
            });
        };

        this.createMap = function(){
            currentMap = new GMaps({
                div: '#map-container',
                lat: 51.5,
                lng: -0.1
            });
            currentMap.setZoom(10);
        };

        this.getMap = function(){
            return currentMap;
        };

        this.cleanMap = function(){
            currentMap.removeMarkers();
            currentMap.removePolylines();
        };

        this.getUserLocation = function(){
            var success = function(position){
                currentMap.addMarker({lat: position.coords.latitude , lng: position.coords.longitude, icon : "http://maps.google.com/mapfiles/ms/icons/green-dot.png"});
            };

            var error = function(err){

            };

            if (Modernizr.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error);
            }
        };
    };

    return new MapUtils();

});