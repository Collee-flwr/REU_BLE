"use strict";

var Devices = ["WEAROS", "MSBAND", "ARDUINO"];

var ble = require("@accessors-modules/ble");


var device_type = Devices[2]; // Arduino

exports.setup = function() {

    if(device_type === "ARDUINO") { // for Arduino

        ble.connect();
    }

    this.output('dataOut');
};

exports.initialize = function() {

    var self = this;

    function getSensorData(fn) {
        if(device_type === "ARDUINO") {

            ble.subscribe(function(result){ fn(result);});
        }
    }

    getSensorData(function(result){
        //sends data to outputs
        self.send('dataOut', result);
    });

};



