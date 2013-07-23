var AppModel = function(){
    var self = this;
    self.redditPosts = ko.observableArray();

    self.initialize = function(){
        $.getJSON('/posts')
            .done(function(data){

                _.each(data, function(item){
                    item.data.showSummary = ko.observable(false);
                    self.redditPosts.push(item.data);
                });
            })
            .fail(function(){

            })
    };

    self.toggleSummary = function(item, event){
        item.showSummary(!item.showSummary());
        $(event.target).parent().find('.icon-play').toggleClass('icon-rotate-90');

        if(item.showSummary()){
            var tempHtml = $('<div/>').html( item.selftext_html ).text();
            $(event.target).parent().parent().find('.summary').html(tempHtml);
        }

    }

};

var appModel = new AppModel();
ko.applyBindings(appModel);
appModel.initialize();
