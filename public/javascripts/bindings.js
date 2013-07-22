var AppModel = function(){
    var self = this;
    self.redditPosts = ko.observableArray();

    self.initialize = function(){
        $.getJSON('/posts')
            .done(function(data){

                _.each(data, function(item){
                    item.data.showSummary = ko.observable(false);
                    self.redditPosts.push(item.data);
                    console.log(item.data);
                });
            })
            .fail(function(){

            })
    };

    self.toggleSummary = function(item){
        item.showSummary(!item.showSummary());
    }

};

var appModel = new AppModel();
ko.applyBindings(appModel);
appModel.initialize();
