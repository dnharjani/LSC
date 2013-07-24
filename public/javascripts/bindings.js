var AppModel = function(){
    var self = this;
    self.redditPosts = ko.observableArray();
    self.showError = ko.observable(false);

    self.initialize = function(){
        if(navigator.onLine){
            $.getJSON('/posts')
                .done(function(data){
                    localStorage.setItem("lsc-events", JSON.stringify(data));

                    setupPostsArray(data);
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

    var setupPostsArray = function(redditPostData){
        _.each(redditPostData, function(item){
            item.data.showSummary = ko.observable(false);
            item.data.ins = ko.observableArray();
            item.data.insLoaded = false;
            self.redditPosts.push(item.data);
        });
    }

};


var appModel = new AppModel();
ko.applyBindings(appModel);
appModel.initialize();
