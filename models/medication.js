var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var medication= new Schema({
_bed:{ type: Schema.ObjectId, ref: 'Bed'},
_station:{ type: Schema.ObjectId, ref: 'Station'},
name:String,
rate:Number,
});



module.exports = mongoose.model('medication',medication);

