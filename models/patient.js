var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Patient = new Schema({
	name:String,
    age:Number,
    weight:Number,
    _bed:{ type: Schema.ObjectId, ref: 'Bed' },
});


module.exports = mongoose.model('Patient', Patient);

