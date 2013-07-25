var AppModel = function(){
    var self = this;
    self.redditPosts = ko.observableArray();
    self.showError = ko.observable(false);
    self.dateList = ko.observableArray();
    var monthNamesShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    self.calendarScroll = null;
    self.postScroll = null;
    self.currentMap = null;
	

    self.initialize = function(){
        if(navigator.onLine){
            $.getJSON('/posts')
                .done(function(data){
                    localStorage.setItem("lsc-events", JSON.stringify(data));
                    setupPostsArray(data);
                    setupDatesList(data);
					$('#loading-screen').hide();
                })
                .fail(function(){
                    // Error message
					$('#loading-screen').hide();
                })
        }
        else{
            var events = localStorage.getItem("lsc-events");
             if(events !== undefined && events !== null){
                 var parsedEvents = JSON.parse(events);
                 setupPostsArray(parsedEvents);
                 setupDatesList(parsedEvents);
                 $('#loading-screen').hide();
             }
            else{
                 // Error message
                 $('#loading-screen').hide();
             }
        }
    };

    self.toggleSummary = function(item, event){
        var parentElement = $(event.target).closest('.post-container');
		var summaryElement = parentElement.find('.summary');

        if(!item.showSummary()){
            var tempHtml = $('<div/>').html( item.selftext_html ).text();
            summaryElement.html(tempHtml);
        }

        item.showSummary(!item.showSummary());
        // parentElement.find('.icon-play').toggleClass('icon-rotate-90');
    };


    self.findIns = function(item, event){
        if(!item.insLoaded){
            $('#loading-screen').show();
			item.insLoaded = true;
            $.getJSON('/comments/'+item.id)
                .done(function(data){
                    if(data[1]){
                        _.each(data[1].data.children, function(comment){
							// remove non-alphanumeric chars
							var commentStr = comment.data.body.replace(/[^a-zA-Z0-9 ]/, '').toLowerCase();
                            var words = commentStr.split(' ');
                            if(words.indexOf("in") !== -1){
                                item.ins.push({author: comment.data.author});
                            }
                        });
                    }
                    $('#loading-screen').hide();
                })
                .fail(function(){
                    // Error message
                    $('#loading-screen').hide();
                })
        }
    };

    self.getRowClass = function(index){
        return (index() % 2 === 0 ? 'post-container even' : 'post-container odd')
    };

    self.showEventsOnDay = function(item, event){
		self.postScroll.refresh();
        if(item.events.length > 0){
			var domElement = document.getElementById(item.events[0].id);
			self.postScroll.scrollToElement(domElement,  400);
		}
    };

    self.showMap = function(item, event){
        if(self.currentMap !== null){
            geocodeAddress(item.scheduledPlace);
        }

        $('#map-modal').on('shown', function(){
            if(self.currentMap === null){
                self.currentMap = new GMaps({
                    div: '#map-container',
                    lat: 51,
                    lng: 32
                });
                geocodeAddress(item.scheduledPlace);
            }
        });

        $('#map-modal').modal();
    };

    var geocodeAddress = function(address){
        GMaps.geocode({
            address: address + " London",
            callback: function(results, status) {
                if (status == 'OK') {
                    var latlng = results[0].geometry.location;
                    self.currentMap.removeMarkers();
                    self.currentMap.setCenter(latlng.jb, latlng.kb);
                    self.currentMap.addMarker({lat: latlng.jb, lng: latlng.kb});
                }
            }
        });
    };

    var setupPostsArray = function(redditPostData){
        _.each(redditPostData, function(item){
            item.data.showSummary = ko.observable(false);
            item.data.ins = ko.observableArray();
            item.data.insLoaded = false;
            if(item.data.scheduledPlace === undefined || item.data.scheduledPlace === null ){
                item.data.showMapButton = ko.observable(false);
            }
            else{
                item.data.showMapButton = ko.observable(true);
            }

            self.redditPosts.push(item.data);
        });
		
		self.postScroll = new iScroll('posts-list-container', {useTransition:true, checkDOMChanges: true} );
    };

    var setupDatesList = function(redditPostData){
        var currentDate =  new Date().setHours(0,0,0,0);

        for(var i = 0; i<60 ; i++){
            var dayObject = {};
            var calendarDate = currentDate + (i*86400000);
            dayObject.day =  new Date(calendarDate).getDate();
            dayObject.month =  monthNamesShort[new Date(calendarDate).getMonth()];
            dayObject.year =  new Date(calendarDate).getFullYear();
            dayObject.events = [];
            _.each(redditPostData, function(item){
                var eventDate = new Date(item.data.scheduledDate);
                var calendarDateAsDate = new Date(calendarDate);
                if(eventDate.getDate() === calendarDateAsDate.getDate() && eventDate.getFullYear() === calendarDateAsDate.getFullYear() && eventDate.getMonth() === calendarDateAsDate.getMonth()){
                    dayObject.events.push(item.data);
                }
            });
            self.dateList.push(dayObject);
        }

        self.calendarScroll = new iScroll('posts-calendar-container', {vScroll: false, useTransition:true, checkDOMChanges: true });
    }
};

ko.bindingHandlers.slideVisible = {
    init: function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.utils.unwrapObservable(value) ? $(element).slideDown() : $(element).slideUp();
    }
};



var appModel = new AppModel();
ko.applyBindings(appModel);
appModel.initialize();

