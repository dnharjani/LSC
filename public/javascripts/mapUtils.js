define(["./gmaps", "./modernizr"], function(GMaps, Modernizr)
{
    var city = " London";

    var MapUtils = function(){
        this.geocodeAddress = function(currentMap, address){
            GMaps.geocode({
                address: address + city,
                callback: function(results, status) {
                    if (status == 'OK') {
                        var latlng = {lat : results[0].geometry.location.jb, lng: results[0].geometry.location.kb};
                        currentMap.addMarker(latlng);
                        currentMap.fitZoom();
                        if(currentMap.getZoom() > 15){
                            currentMap.setZoom(15);
                        }
                    }
                }
            });
        };

        this.createMap = function(){
            return new GMaps({
                div: '#map-container',
                lat: 51,
                lng: 32
            });
        };

        this.cleanMap = function(currentMap){
            currentMap.removeMarkers();
            currentMap.removePolylines();
        };

        this.getUserLocation = function(currentMap){
            var success = function(position){
                currentMap.addMarker({lat: position.coords.latitude , lng: position.coords.longitude, icon : "http://maps.google.com/mapfiles/ms/icons/green-dot.png"});
                currentMap.fitZoom();
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