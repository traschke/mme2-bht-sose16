/**
 * Created by Khale on 09.06.2016.
 */
module.exports = function (filterOptions, video) {
    var err;
    var newVideo = {};
    filterOptions.forEach(function (filter) {
        if (video.hasOwnProperty(filter)) {
            newVideo[filter] = video[filter];
        } else {
            err = new Error('{"error": { "message": "Attribut does not exist.", "code": 400 } }');
            err.status = 400;
            throw err;
        }
    });
    return newVideo;
};
