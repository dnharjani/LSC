
var redwrap = require('redwrap');

var reddit = {};
reddit.posts = function(req, res){
    var subreddit = 'LondonSocialClub';
    redwrap.r(subreddit, function(err, data, res){
        res.json(data);
    });
};

exports = reddit;