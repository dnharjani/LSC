define(["./jquery"], function($)
{
    var ServerUtils = function(){

        this.getPosts = function(successCallback, failCallback){
            $.getJSON('/posts')
                .done(function(data){
                    successCallback(data);
                })
                .fail(function(error){
                    // Error message
                    failCallback(error);
                })
        };

        this.getComments = function(postId, successCallback, failCallback){
            $.getJSON('/comments/'+postId)
                .done(function(data){
                    successCallback(data);
                })
                .fail(function(error){
                    failCallback(error);
                })
        };


    };

    return new ServerUtils();

});