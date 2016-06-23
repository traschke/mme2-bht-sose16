/**
 * Created by paulineschmiechen + timo on 23.06.16.
 */
define(["backbone", "jquery", "underscore"], function(Backbone, $,  _){
    var VideoView = Backbone.View.extend({
        tagName: "li",
        template : _.template($("#video-template").text()),
        render: function () {
            this.$el.html(this.template(this.model.attributes));
            return this;
        },
        initialize : function () {
            this.listenTo(this.model, "change", this.render);
        }
    });
    return VideoView;
});