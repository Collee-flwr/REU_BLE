//Test Accessor for Collecting Heart Rate Data from supported Smart Watches
//Author: Jesuloluwa Eyitayo

'use strict';

//   SENSOR DATA and DEVICES variable declarations
var Sensors = ["HEART_RATE", "ACCELEROMETER"];
var Devices = ["WEAROS", "MSBAND", ];

var sensor_type = Sensors[1]; // HEARTRATE
var device_type = Devices[1]; // WEAROS
//console.log(device_type+ '  ' + sensor_type);


exports.setup = function() {
    //Set up connection with device (in plugins folder)

    if(device_type === "WEAROS") { // for WEAROS

         wearos.initialize(function(result) {}, function() { alert("not Initialized"); });
         wearos.connect(function(result) {}, function() { alert("not connected"); });

    }
    else if (device_type === "MSBAND") { // for MSBAND

         msband.initialize(function(result) {}, function() { alert("not Initialized"); });
         msband.connect(function(result) {}, function() { alert("not connected"); });
         // This asks for the users consent before receiving the heart rate data
         msband.consent(function(result) {
//            console.log("Consent result -> " + result.isGranted);
         }, function() { alert("not consented"); });


    }else if (device_type === "ARDUINO"){

          ble.connect();

    }



    //establish outputs
    this.output('dataOut');
};

exports.initialize = function() {

    //must use variable to represent this or else msband/wearos throws an error
    var self = this;

    function getSensorData(fn) {

        if(device_type === "WEAROS") { // subscribe to wearos

             wearos.subscribe(
             function(result){ fn(result);},
             function() {alert("notSubscribed");}, sensor_type);
        }
        else if (device_type === "MSBAND") { // subscribe to msband

             msband.subscribe(
             function(result){ fn(result);},
             function() {alert("notSubscribed");}, sensor_type);

        }

    }

    getSensorData(function(result){
        //sends data to outputs
        self.send('dataOut', result);
    });

};


