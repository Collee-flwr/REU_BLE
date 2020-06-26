 //Test Accessor for Collecting Accelerometer Data from smart watches
//Author: Jesuloluwa Eyitayo

'use strict';

//  SENSOR DATA and DEVICES variable declarations
var accl = 0.0;
var data_count = 0;
var data_sum = 0, data_avg = 0;
var DATA_SIZE = 300;
var THRESHOLD = 90;

exports.setup = function() {
//Set up connection
    //establish inputs and outputs
    this.input('dataIn');

    // most data processing have status as output (1/0 or true/false)
    this.output('status');

};

exports.initialize = function() {

//must use variable to represent this or else band throws an error
    var self = this;
    this.addInputHandler("dataIn", compute.bind(this));

};

function compute() {

    // define variables that would be received after processing
    var s = this;

    var processTimeStamp = "";
    var status = 0;

    // get data needed from the sensor input data
    var res = this.get("dataIn");

    // we are getting heartrate and timestamp
    var hr = res.heartRate;
    var timeStamp = res.timeStamp;

    // we send the data for processing and receive the result of the process
    s.status = processHeartRate(hr);

    // we output the status for use by the next accessor
    this.send("status", s.status);

}

// this uses the threshold method to process heartrate data
function processHeartRate(heartrate_data)
{
    if(data_count <= DATA_SIZE)
    {
        data_count++;
        data_sum += heartrate_data;
    }
    else
    {
        var heartrate_status = 0;
        data_avg = data_sum / DATA_SIZE;

        if(data_avg > THRESHOLD)
        {
            heartrate_status = 1;

        }


        data_count = 0;
        data_sum = 0;
        data_avg = 0;

        return heartrate_status;

    }
}