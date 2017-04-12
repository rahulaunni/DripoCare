var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Patient = new Schema({
	name:String,
    age:Number,
    weight:Number,
    _bed:{ type: Schema.ObjectId, ref: 'Bed' },
    _medications:[{ type: Schema.ObjectId, ref: 'Medication'}],
    _tasks:[{ type: Schema.ObjectId, ref: 'Tasks'}],
    _timetable:[{ type: Schema.ObjectId, ref: 'Timetable'}],
});


module.exports = mongoose.model('Patient', Patient);

