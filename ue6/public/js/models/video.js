/**
 * Created by paulineschmiechen + timo on 23.06.16.
 */
define(["backbone" , "underscore"], function(Backbone, _){
    var result = {};
    var VideoSchema = {
        urlRoot: '/videos',
        idAttribute: "_id",
        defaults: {
            description : "",
            playcount : 0,
            ranking : 0
        },
        initialize: function () {

        },
        validate: function(attr){
            if(_.isEmpty(attr.title))
                return "Missing title";
            if(_.isEmpty(attr.length))
                return "Missing length";
            if(_.isEmpty(attr.src))
                return "Missing src";
        }
    };

    var VideoModel = Backbone.Model.extend(VideoSchema);

    var VideoCollection = Backbone.Collection.extend({
        model: VideoModel,
        url: "/videos",
        initialize: function () {
            this.on("add", function (video) {
                if(video.isValid() && video.isNew()) {
                    video.save();
                }
            })
        }
    });

    result.Model = VideoModel;
    result.Collection = VideoCollection;
    return result;
});

