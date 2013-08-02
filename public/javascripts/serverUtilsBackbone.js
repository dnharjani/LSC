define(["./backbone", "./underscore"], function(Backbone, _)
{
    var ServerUtils = function(){
        var Post = Backbone.Model.extend({});
        var Posts = Backbone.Collection.extend({
            model: Post,
            url: '/posts'
        });
        var posts = new Posts();

        this.getPosts = function(successCallback, failCallback){
            posts.fetch(
                {
                    success : function(data){
                        var postItems = [];
                        _.each(data.models, function(item){ postItems.push(item.attributes) });
                        successCallback(postItems);
                    },
                    error : function(err){

                    }
                }

            );
        };

        this.getComments = function(postId, successCallback, failCallback){

        };


    };

    return new ServerUtils();

});