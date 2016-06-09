/**
 * Created by Timo on 09.06.2016.
 */

var getLimit = function(limit, videoArray) {
    if (limit !== undefined) {
        var temp = parseInt(limit);
        if (isNaN(temp)) {
            var err = new Error('error: {"message": "Limit must be a number", "code": 400}');
            err.status = 400;
            throw err;
        }
        if (limit != 0) {
            if (limit < 0) {
                var err = new Error('error: {"message": "Limit must be positive", "code": 400}');
                err.status = 400;
                throw err;
            }
            videoArray = videoArray.slice(0, limit);
        } else {
            var err = new Error('error: {"message": "Limit cannot be 0", "code": 400}');
            err.status = 400;
            throw err;
        }
    }
    return videoArray;
};

module.exports = getLimit;