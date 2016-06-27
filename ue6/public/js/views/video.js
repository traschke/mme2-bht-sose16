/**
 * Created by paulineschmiechen + timo on 23.06.16.
 *
 * Backbone View creating new videos DOM representation.
 * needs model to be set from outside
 * template #video-template is used, but no element from DOM is used as direct anchor.
 * Thus rendered result must be manually (outside) be attached to DOM
 */
define(["backbone", "jquery", "underscore"], function(Backbone, $,  _){
    var VideoView = Backbone.View.extend({
        tagName: "section",
        template : _.template($("#video-template").text()),
        render: function () {
            this.$el.html(this.template(this.model.attributes));
            return this;
        },
        initialize : function () {
            this.listenTo(this.model, "change", this.render);
        },
        events: {
            'click .play': 'playVideo',
            'click .pause': 'pauseVideo',
            'click .stop': 'stopVideo',
            'ended .video': 'videoEnded'
        },
        playVideo: function () {
            this.$el.find('video').get(0).play();
            this.$el.find('.play').attr('disabled', true);
            this.$el.find('.pause').attr('disabled', false);
            this.$el.find('.stop').attr('disabled', false);
        },
        pauseVideo: function () {
            this.$el.find('video').get(0).pause();
            this.$el.find('.play').attr('disabled', false);
            this.$el.find('.pause').attr('disabled', true);
            this.$el.find('.stop').attr('disabled', false);
        },
        stopVideo: function () {
            this.$el.find('video').get(0).pause();
            this.$el.find('video').get(0).currentTime = 0.0;
            this.$el.find('.play').attr('disabled', false);
            this.$el.find('.pause').attr('disabled', true);
            this.$el.find('.stop').attr('disabled', true);
        },
        videoEnded: function () {
            console.log('FIRE');
            this.$el.find('video').get(0).currentTime = 0.0;
            this.$el.find('.play').attr('disabled', false);
            this.$el.find('.pause').attr('disabled', true);
            this.$el.find('.stop').attr('disabled', true);
        }
    });
    return VideoView;
});