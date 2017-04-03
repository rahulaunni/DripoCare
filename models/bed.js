var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Bed = new Schema({
    bname: String,
    _station:{ type: Schema.ObjectId, ref: 'Station' },
    _patient:{ type: Schema.ObjectId, ref: 'Patient' },
    medications:[{ type: Schema.ObjectId, ref: 'Medication'}],
    tasks:[{ type: Schema.ObjectId, ref: 'Tasks'}]
});


module.exports = mongoose.model('Bed', Bed);

