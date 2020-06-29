"use strict";

var Sensors = ["HEART_RATE", "ACCELEROMETER", "ULTRASONIC"];
var Devices = ["WEAROS", "MSBAND", "ARDUINO"];

var ble = require("@accessors-modules/ble"); // Ble module object

var device_type = Devices[2]; // Arduino
var sensor_type = Sensors[2]; // Ultra-Sonic Sensor

exports.setup = function() {

    //Set up connection with device (in plugins or module folder)
    if(device_type === "ARDUINO") { // for ARDUINO

        ble.connect(function(result) {}, function() { alert("not connected"); });
    }

    //establish outputs
    this.output('dataOut');
};

exports.initialize = function() {

    var self = this;

    function getSensorData(fn) {
        if(device_type === "ARDUINO") { // subscribe to arduino

            ble.subscribe(function(result){ fn(result);}, function() {alert("notSubscribed");}, sensor_type);
        }
    }

    getSensorData(function(result){
        //sends data to outputs
        self.send('dataOut', result);
    });

};
