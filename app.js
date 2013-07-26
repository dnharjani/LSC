
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    request = require('request'),
    _ = require('underscore');

// Start app
var app = express();

// all environments
app.set('views', __dirname + '/views');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);
app.use(express.errorHandler());

var redwrap = require('redwrap');
var reddit = {};
reddit.posts = function(req, res){
    var subreddit = 'LondonSocialClub';
    redwrap.r(subreddit).limit(100).exe(function(err, data){
        var returnedPosts = data.data.children;

        // Find the scheduled date for the event
        _.each(returnedPosts, function(item){
                                    var post = item.data,
                                        dateRegex = /\d{1,2}\/\d{1,2}\/\d{2,4}/,
                                        dateResult = post.title.match(dateRegex);

                                    if(dateResult !== null){
                                        var dateParts = dateResult[0].split('/'),
                                            currentDate = new Date(),
                                            dateYear = (dateParts[2].length == 2 ? '20'+dateParts[2] : dateParts[2]),
                                            scheduledDate =  new Date(dateYear, dateParts[1]-1, dateParts[0]);

                                            currentDate.setDate(currentDate.getDate() - 1);

                                        if(!(currentDate >= scheduledDate)){
                                            post.scheduledDate = scheduledDate;
                                        }
                                    }
                              });

        // Find the place of the event
        _.each(returnedPosts, function(item){
            var post = item.data,
                placeSeparator = post.title.indexOf('@');

            if(placeSeparator !== null){
                var placeSplitTitle = post.title.split('@');
                post.scheduledPlace =  placeSplitTitle[1];
            }
        });

        _.each(returnedPosts, function(item){
            var post = item.data;
            post.permalink = 'http://www.reddit.com'+post.permalink;
        });

        //remove posts without dates
        returnedPosts = _.reject(returnedPosts, function(item){ return item.data.scheduledDate === undefined });
        returnedPosts = _.sortBy(returnedPosts, function(item){ return item.data.scheduledDate });

        res.json(returnedPosts);
    });
};

reddit.comments = function(req, res){
    http.get('http://api.reddit.com/comments/'+req.params.post_id, function(response){
        var data = '';
        response.on('data', function(d){
            data += d;
        });

        response.on('end', function(){
            res.json(JSON.parse(data));
        });
    }).on('error', function(e){
        console.log('Error ' + e.message);
    })
};



app.get('/', routes.index);
app.get('/posts', reddit.posts);
app.get('/comments/:post_id', reddit.comments);

app.listen(process.env.PORT || 3100);

exports = module.exports = app;


