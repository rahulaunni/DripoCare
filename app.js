var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var routes = require('./routes/index');
var users = require('./routes/users');
var http = require("http");
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://localhost/dripov2');

app.use(session({secret: "Shhsssh"}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

// mqtt part*******************************************************************************************************************
var Account = require('./models/account');
var Station = require('./models/stations');
var Bed = require('./models/bed');
var Patient = require('./models/patient');
var Medication = require('./models/medication');
var Timetable = require('./models/timetable');
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost:1883')
var bedg=[];

client.on('connect', function() {
    console.log("started");
    client.subscribe('dripo/#');
    Timetable.find({}).sort({time:1}).exec(function(err,tim){
    if (err) return console.error(err);
    var arr_bed=[];
    for (var key in tim) {
        arr_bed[key]=tim[key]._bed;

    }
    var arr_bed_new=[];
    var n=arr_bed.length;
    var count=0;
    for(var c=0;c<n;c++) //For removing duplicate bed ids 
        { 
            for(var d=0;d<count;d++) 
            { 
                if(arr_bed[c].toString()==arr_bed_new[d].toString()) 
                    break; 
            } 
            if(d==count) 
            { 
                arr_bed_new[count] = arr_bed[c]; 
                count++; 
            } 
        } 
    Bed.find({'_id': {$in:arr_bed_new}}).populate({path:'_patient',model:'Patient',populate:{path:'_medication',model:'Medication',populate:{path:'_timetable',model:'Timetable'}}}).exec(function(err,bedd){
    // reordering to sorted order
    for (var key in arr_bed_new)
    {
        for (var key2 in bedd)
        {
            if(arr_bed_new[key].toString()==bedd[key2]._id.toString())
            {
                bedg.push(bedd[key2])

            }
        }

    }

});
});

})


client.on('message', function(topic, message) {

    var res = topic.split("/");
    var id = res[1];
     console.log(JSON.stringify(bedg[0]._patient._medication[0].name));
    //For publishing Bed Name from database
    var pub_bedd=[];
    for (var key in bedg)
    {
      pub_bedd.push(bedg[key].bname); 
      pub_bedd.push('&'); 
      pub_bedd.push(bedg[key].bname); 
      pub_bedd.push('&');  
    }
    var pub_bed_slicer=pub_bedd.slice(0,19);
    var pub_bed=pub_bed_slicer.join('');

if(id=="DRIPO-3574172"){

    if (res[2] == 'req') {
            if (message == "df") {
                client.publish('dripo/' + id + '/df', "60&60&20&20&15&15&10&10&");
            } 
        }
    else if(res[2]=='bed_req'){
        if(message == "bed"){
            client.publish('dripo/' + id + '/bed', pub_bed);
        }
      }
    else if(res[2]== 'med_req'){
        // var medd=[];
        // for(var key in bedg){
        //     if(message==bedg[key].bname)
        //         for(var key2 in bedg[key]._patient._medication)
        //         medd.push(bedg[key]._patient._medication[key2].name)
        // }
        // console.log(JSON.stringify(medd));
            client.publish('dripo/' + id + '/med', "Rum&Rum&Brandy&Brandy&Beer&Beer&");
        
    }
   else if (res[2]== 'rate_req'){
       if(message == "Beer"){
           client.publish('dripo/' + id + '/rate2set', "Patient&100&100&100&");
       }
   } 
    
 //console.log(message);
}

});

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return  hour + ":" + min + ":" + sec;

}
