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
require(['jquery','backbone', 'models/video', 'views/video', 'views/video-list'],
        function($, Backbone, Video, VideoView, VideoListView) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'main',
            '*whatever': 'main'
        },
        main: function(){
            //$('body').prepend('<h1>Video App</h1>');

            var videoCollection = new Video.Collection();
            var videoListView = new VideoListView({collection: videoCollection});

            videoCollection.fetch({
                success: function(collection, response) {
                    if (response.length > 0) {
                        console.log("Number of videos : " + response.length);
                        console.log(videoCollection.at(0));
                        // var videoView = new VideoView({model: videoCollection.at(0)});
                        // $('main').append(videoView.render().el);
                        // juhu();
                        videoListView.render();
                    }
                },
                error: function(model, response) {
                    console.error("error ",model,response);
                }
            });
        }
    });

    var myRouter = new AppRouter();

    // finally start tracking URLs to make it a SinglePageApp (not really needed at the moment)
    Backbone.history.start({pushState: true}); // use new fancy URL Route mapping without #
});

function juhu() {
    function vid(videoElement) {
        var self = this;
        /**
         * The video-Element.
         */
        this.videoElement = videoElement;

        /**
         * The play-Button of the video (class play).
         * @type {*}
         */
        this.btnPlay = this.videoElement.parentNode.getElementsByClassName('play')[0];

        /**
         * The pause-Button of the video (class pause).
         * @type {*}
         */
        this.btnPause = this.videoElement.parentNode.getElementsByClassName('pause')[0];

        /**
         * The stop-Button of the video (class stop).
         * @type {*}
         */
        this.btnStop = this.videoElement.parentNode.getElementsByClassName('stop')[0];

        /**
         * Play event handler.
         */
        this.btnPlay.addEventListener('click', function(e) {
            self.videoElement.play();
            self.btnPlay.disabled = true;
            self.btnPause.disabled = false;
            self.btnStop.disabled = false;
        });

        /**
         * Pause event handler.
         */
        this.btnPause.addEventListener('click', function(e) {
            self.videoElement.pause();
            self.btnPlay.disabled = false;
            self.btnPause.disabled = true;
            self.btnStop.disabled = false;
        });

        /**
         * Stop event handler.
         */
        this.btnStop.addEventListener('click', function(e) {
            // Workaround, because there is no stop function
            self.videoElement.pause();
            self.videoElement.currentTime = 0.0;
            self.btnPlay.disabled = false;
            self.btnPause.disabled = true;
            self.btnStop.disabled = true;
        });

        /**
         * Event-handler for video ended.
         */
        this.videoElement.addEventListener('ended', function(e) {
            self.videoElement.currentTime = 0.0;
            self.btnPlay.disabled = false;
            self.btnPause.disabled = true;
            self.btnStop.disabled = true;
        });
    }

    // Find all video-Elements in the document
    var videos = document.getElementsByTagName('video');

    // Create video objects
    for (var i = 0; i < videos.length; i++) {
        var video = new vid(videos[i]);
    }
}
