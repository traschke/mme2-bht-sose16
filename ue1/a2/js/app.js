window.addEventListener('load', function(){
   console.log('Loaded!');

    /**
     * Prototype for videos with controls.
     * @param videoElement A video-Element.
     */
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
});