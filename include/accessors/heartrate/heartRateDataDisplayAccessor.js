// this accessor is responsible for displaying the Heartrate values
//Author: Jesuloluwa Eyitayo

document.getElementById('ts').innerHTML = "";
document.getElementById('title').innerHTML = "Heart Rate Monitor";

exports.setup = function() {

    document.getElementById('btn_help').style.display = "none";
    document.getElementById('btn_feelok').style.display = "none";
    document.getElementById('btn_ok').style.display = "none";

    this.input('dataIn');
    this.input('status');

};

exports.initialize = function() {

    this.addInputHandler("dataIn", display.bind(this));

};

function display() {

    var res = this.get('dataIn');
    var currentStatus = this.get('status');

    // get data from data input
    var heartRate = res.heartRate;
    var currentTimeStamp = res.timeStamp;

    // set view to heart rate value collected from the smart watch
    document.getElementById("display").innerHTML = "Heart Rate :     " + heartRate.toFixed(1);
//    $('#display').html("Heart Rate :     " + heartRate.toFixed(1));

    // display status message based on the type of data received
    // if there is a high heart rate
    if(currentStatus == 1)
        document.getElementById("ts").innerHTML = " High Heart Rate Detected";

    else if(currentStatus == 0)  document.getElementById("ts").innerHTML = "";

}
