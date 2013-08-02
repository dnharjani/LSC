define(["./knockout", "./underscore", "./modernizr", "./mapUtils", "./serverUtilsJquery"], function(ko, _, Modernizr, MapUtils, ServerUtils)
{
    var AppModel = function(){
        var self = this;
        self.redditPosts = ko.observableArray();
        self.showError = ko.observable(false);
        self.dateList = ko.observableArray();
        self.loadingScreen = ko.observable(true);
        var dayNamesShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        self.calendarScroll = null;
        self.postScroll = null;

        self.initialize = function(){
            if(navigator.onLine){
                ServerUtils.getPosts(
                    function(data){
                        localStorage.setItem("lsc-events", JSON.stringify(data));
                        setupPostObservables(data);
                        setupDatesList(data);
                        self.loadingScreen(false);
                    },
                    function(error){
                        // Error message
                        self.loadingScreen(false);
                    }
                );
            }
            else{
                var events = localStorage.getItem("lsc-events");
                 if(events !== undefined && events !== null){
                     var parsedEvents = JSON.parse(events);
                     setupPostObservables(parsedEvents);
                     setupDatesList(parsedEvents);
                     self.loadingScreen(false);
                 }
                else{
                     // Error message
                     self.loadingScreen(false);
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
        };


        self.findIns = function(item, event){
            if(!item.insLoaded){
                self.loadingScreen(true);
                item.insLoaded = true;

                ServerUtils.getComments(
                    item.id,
                    function(data){
                        if(data[1]){
                            _.each(data[1].data.children, function(comment){
                                // remove non-alphanumeric chars
                                var commentStr = comment.data.body.replace(/[^a-zA-Z0-9 ]/, '').toLowerCase();
                                var words = commentStr.split(' ');
                                if(words.indexOf("out") !== -1){
                                    // figure something to do with outs
                                }
                                else if(words.indexOf("in") !== -1){
                                    item.ins.push({author: comment.data.author , status: 'in'});
                                }
                                else if(words.indexOf("maybe") !== -1){
                                    item.ins.push({author: comment.data.author , status: 'maybe'});
                                }


                            });
                        }
                        self.loadingScreen(false);
                    },
                    function(error){
                        // Error message
                        self.loadingScreen(false);
                    }
                );
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
            if(MapUtils.getMap() !== null){
                MapUtils.cleanMap();
                MapUtils.geocodeAddress(item.scheduledPlace);
                MapUtils.getUserLocation();
            }

            $('#map-modal').on('shown', function(){
                if(MapUtils.getMap() === null){
                    MapUtils.createMap();
                    MapUtils.cleanMap();
                    MapUtils.geocodeAddress(item.scheduledPlace);
                    MapUtils.getUserLocation();
                }
            });

            $('#map-modal').modal();
        };

        var setupPostObservables = function(redditPostData){
            _.each(redditPostData, function(item){
                item.showSummary = ko.observable(false);
                item.ins = ko.observableArray();
                item.insLoaded = false;
                if(item.scheduledPlace === undefined || item.scheduledPlace === null ){
                    item.showMapButton = ko.observable(false);
                }
                else{
                    item.showMapButton = ko.observable(true);
                }

                self.redditPosts.push(item);
            });

            self.postScroll = new iScroll('posts-list-container', {useTransition:true, checkDOMChanges: true} );
        };

        var setupDatesList = function(redditPostData){
            var currentDate =  new Date().setHours(0,0,0,0);

            for(var i = 0; i<60 ; i++){
                var dayObject = {};
                var calendarDate = currentDate + (i*86400000);
                dayObject.date =  new Date(calendarDate).getDate();
                dayObject.day =  dayNamesShort[new Date(calendarDate).getDay()];
                dayObject.year =  new Date(calendarDate).getFullYear();
                dayObject.events = [];
                _.each(redditPostData, function(item){
                    var eventDate = new Date(item.scheduledDate);
                    var calendarDateAsDate = new Date(calendarDate);
                    if(eventDate.getDate() === calendarDateAsDate.getDate() && eventDate.getFullYear() === calendarDateAsDate.getFullYear() && eventDate.getMonth() === calendarDateAsDate.getMonth()){
                        dayObject.events.push(item);
                    }
                });
                self.dateList.push(dayObject);
            }

            self.calendarScroll = new iScroll('posts-calendar-container', {vScroll: false, useTransition:true, checkDOMChanges: true });
        }
    };

    return new AppModel();
});

