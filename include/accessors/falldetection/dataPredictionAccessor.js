//Test Accessor for Collecting Accelerometer Data from Wear os
//Author: Jesuloluwa Eyitayo

'use strict';

exports.setup = function() {
//Set up connection
    prediction.initialize(function(result) {}, function() { alert("not Initialized"); });

    //establish inputs and outputs
    this.input('dataIn');
    this.output('status');

};

exports.initialize = function() {

//must use variable to represent this or else band throws an error
    var self = this;
    this.addInputHandler("dataIn", sendPredict.bind(this));

};

function sendPredict() {

    var s = this;
    var fallTimeStamp = "";
    var status = 0;

    var res = this.get("dataIn");

    var x_accel = res.X;
    var y_accel = res.Y;
    var z_accel = res.Z;
    var timeStamp = res.timeStamp;

    var data = {
        "accelerator":
        {
            "xAccel": x_accel,
            "yAccel": y_accel,
            "zAccel": z_accel,
            "timeStamp": timeStamp
        }
    };


//    sends each accelerometer value for prediction
    prediction.subscribe(function(result){
        s.status = result.status;
        s.fallTimeStamp = result.fallTimeStamp;

    }, function() {console.log("not - Displaying");}, data);

// output values
    this.send("status", s.status);
}