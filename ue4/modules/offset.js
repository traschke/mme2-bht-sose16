/**
 * Created by Timo on 09.06.2016.
 */

var getOffset = function(offset, video) {
    if (offset !== undefined) {
        var temp = parseInt(offset);
        if (isNaN(temp)) {
            var err = new Error('error: {"message": "Offset must be a number", "code": 400}');
            err.status = 400;
            throw err;
        }
        if (offset != 0) {
            if (offset < 0) {
                var err = new Error('error: {"message": "Offset must be positive", "code": 400}');
                err.status = 400;
                throw err;
            }
            if (offset >= video.length) {
                var err = new Error('error: {"message": "Offset must smaller than length of video list", "code": 400}');
                err.status = 400;
                throw err;
            }
            video = video.slice(offset, video.length);
        }
    }
    return video;
};

module.exports = getOffset;