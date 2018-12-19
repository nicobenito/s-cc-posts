var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    name: {type: String, required: true, max: 100},
    url: {type: String, required: true},
    orderPos: {type: Number, required: true},
});


module.exports = mongoose.model('Post', PostSchema);