var AppModel = function(){
    var self = this;
    self.redditPosts = ko.observableArray();

    self.initialize = function(){
        $.getJSON('/posts')
            .done(function(data){
                _.each(data, function(item){
                    item.data.showSummary = ko.observable(false);
                    item.data.ins = ko.observableArray();
                    item.data.insLoaded = false;
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

                })

        }
    };

    self.getRowClass = function(index){
        return (index() % 2 === 0 ? 'post-container even' : 'post-container odd')
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
