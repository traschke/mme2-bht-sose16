/** Main application file to start the client side single page app for tweets
 *
 * @author Johannes Konert
 */

requirejs.config({
    baseUrl: "/js",
    paths: {
        jquery: './_lib/jquery-1.11.3',
        underscore: './_lib/underscore-1.8.3',
        backbone: './_lib/backbone-1.2.3'
    },
    shim: {
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

// AMD conform require as provided by require.js
require(['jquery','backbone', 'models/tweet', 'models/user', 'views/user', 'views/tweet-list', 'views/tweet-create'],
        function($, Backbone, Tweet, User, UserView, TweetListView, TweetCreateView) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'main',
            '*whatever': 'main'
        },
        main: function(){
            var user = new User.Model({_id : '57554efd6c5edc1f5c9a2778'}); // FIXME add correct user id here
                                                                            // hard coded instead of login..
            var userView = new UserView({model: user});
            var that = this;
            user.fetch( {
               error: function(model, response) {
                   console.error("no user fetched");
                   userView.render();
               },
                success: function(model, response) {
                   userView.render();
                    that.user = user;
                }
            });

            var tweets = new Tweet.Collection();
            var tweetListView = new TweetListView({collection: tweets});
            tweets.fetch({
                error: function (model, response) {
                    console.error("no user fetched");
                    userView.render();
                },
                success: tweetListView.render
            });
            var tweetCreateView = new TweetCreateView({collection:tweets, app: this});
        }
    });

    var myRouter = new AppRouter();

    // finally start tracking URLs to make it a SinglePageApp (not really needed at the moment)
    Backbone.history.start({pushState: true}); // use new fancy URL Route mapping without #
});
