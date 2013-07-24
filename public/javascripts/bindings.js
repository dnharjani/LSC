var AppModel = function(){
    var self = this;
    self.redditPosts = ko.observableArray();
    self.showError = ko.observable(false);
    self.dateList = ko.observableArray();
    var monthNamesShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    self.calendarScroll = null;

    self.initialize = function(){
        if(navigator.onLine){
            $.getJSON('/posts')
                .done(function(data){
                    localStorage.setItem("lsc-events", JSON.stringify(data));
                    setupPostsArray(data);
                    setupDatesList(data);
                })
                .fail(function(){
                    // Error message
                })
        }
        else{
            var events = localStorage.getItem("lsc-events");
             if(events !== undefined && events !== null){
                 var parsedEvents = JSON.parse(events);
                 setupPostsArray(parsedEvents);
                 setupDatesList(parsedEvents);
             }
            else{
                 // Error message
             }
        }
    };

    self.toggleSummary = function(item, event){
        item.showSummary(!item.showSummary());
        var parentElement = $(event.target).closest('.post-container');
        parentElement.find('.icon-play').toggleClass('icon-rotate-90');
        // TODO Rewrite this as a Knockout BindingHandler
        var summaryElement =  parentElement.find('.summary');
        summaryElement.toggleClass('open closed');

        if(item.showSummary()){
            var tempHtml = $('<div/>').html( item.selftext_html ).text();
            summaryElement.html(tempHtml);
        }
    };

    self.findIns = function(item, event){
        if(!item.insLoaded){
            $.getJSON('/comments/'+item.id)
                .done(function(data){
                    if(data[1]){
                        _.each(data[1].data.children, function(comment){
                            var words = comment.data.body.toLowerCase().split(' ');
                            if(words.indexOf("in") !== -1){
                                item.insLoaded = true;
                                item.ins.push({author: comment.data.author});
                            }
                        });
                    }

                })
                .fail(function(){
                    // Error message
                })

        }
    };

    self.getRowClass = function(index){
        return (index() % 2 === 0 ? 'post-container even' : 'post-container odd')
    };

    self.showEventsOnDay = function(item, event){
        if(item.events.length > 0){
            $(document.body).animate({
                'scrollTop':   $('#'+item.events[0].id).offset().top
            }, 400);
        }

    };

    var setupPostsArray = function(redditPostData){
        _.each(redditPostData, function(item){
            item.data.showSummary = ko.observable(false);
            item.data.ins = ko.observableArray();
            item.data.insLoaded = false;
            self.redditPosts.push(item.data);
        });
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
                if(Date.parse(item.data.scheduledDate) === calendarDate){
                    dayObject.events.push(item.data);
                }
            });
            self.dateList.push(dayObject);
        }

        self.calendarScroll = new iScroll('posts-calendar-container', {vScroll: false});
    }

};


var appModel = new AppModel();
ko.applyBindings(appModel);
appModel.initialize();
