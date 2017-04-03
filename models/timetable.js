var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var timetable= new Schema({
_bed:{ type: Schema.ObjectId, ref: 'Bed'},
_medication:{ type: Schema.ObjectId, ref: 'medication'},
infused:String,
time:Number,
});

module.exports = mongoose.model('timetable',timetable);

