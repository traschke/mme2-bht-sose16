/**
 * Created by Khaled Reguieg <a href="mailto:Khaled.Reguieg@gmail.com">Khaled.Reguieg@gmail.com</a> on 14.06.2016.
 * This .js-file represents a mongoose model for a video for our mongoDB.
 * It holds the following :
 *
 * <ul>
 *      _id (String, von Außen nicht setzbar, automatisch bei POST)
 *      title (String, required)
 *      description (String, optional, default „“)
 *      src (String, required)
 *      length (Number; nicht negative Zahl für Sekundenangabe, required)
 *      timestamp (String, nicht von Außen setzbar, automatisch bei POST)
 *      playcount (Number; nicht negative Zahl, optional, default 0)
 *      ranking (Number; nicht negative Zahl, optional, default 0)
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timestamp = timestamps = require('mongoose-time');

var VideoSchema     = new Schema({
    title:          { type: String, required: true },
    description:    { type: String, default: "" },
    src:            { type: String, required: true },
    length:         { type: Number, required: true },
    playcount:      { type: Number, default: 0},
    ranking:        { type: Number, default: 0}
    }, {
    timestamps: {createdAt: 'timestamp'}
});

module.exports = mongoose.model('Video', VideoSchema);
