/**
 * Created by Timo on 27.06.2016.
 *
 * Backbone View for the list of videos. Delegator View without any own template. Uses VideoView.
 * Needs collection to be set from outside.
 */

define(['backbone', 'jquery', 'underscore', 'views/video'], function (Backbone, $, _, VideoView) {
    var VideoListView = Backbone.View.extend({
        el: '#main-video',
        template: undefined,
        render: function () {
            this.$el.empty();
            this.collection.each(function (video) {
                var videoView = new VideoView({model: video});
                this.$el.prepend(videoView.render().$el);
            }, this);
            return this;
        },
        initialize: function () {
            this.listenTo(this.collection, 'add', this.render);
        }
    });
    return VideoListView;
});