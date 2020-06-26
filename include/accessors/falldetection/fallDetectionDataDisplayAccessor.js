// this accessor is responsible for displaying the Accelerometer values
//Author: Jesuloluwa Eyitayo

document.getElementById('title').innerHTML = "Fall Detection";

// Handle on click listeners
document.getElementById("btn_ok").addEventListener("click", function(){
    prediction.resetFall(function(result) {}, function() { alert("could not Reset"); });
});
document.getElementById("btn_help").addEventListener("click", function(){

});
document.getElementById("btn_feelok").addEventListener("click", function(){

});


exports.setup = function() {

    disableButtons();
    this.input('dataIn');
    this.input('status');

};

exports.initialize = function() {
    this.addInputHandler("status", display.bind(this));

};


function display() {
   var res = this.get('dataIn');
   var currentStatus = this.get('status');

   // get data from data input
   var currentAccelX = res.X;
   var currentAccelY = res.Y;
   var currentAccelZ = res.Z;
//   var currentTimeStamp = res.timeStamp;


   // set view to heart rate value collected from the smart watch
   var displayText =   "X-Axis :     " + currentAccelX.toFixed(5) + "<br/>" +
                       "Y-Axis :     " + currentAccelY.toFixed(5) + "<br/>" +
                       "Z-Axis :     " + currentAccelZ.toFixed(5);
    $('#display').html(displayText);

   // display status message based on the type of data received
   if(currentStatus == 1) // if there is a fall; display the option buttons
      enableButtons();

   else if(currentStatus == 0)
   {
       disableButtons();
   }


//    var results = "Fall Time:     " + timeConverter(currentTimeStamp);


}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}


function enableButtons()
{
    document.getElementById("ts").innerHTML = "Fall Detected";
    document.getElementById('btn_help').style.display = "block";
    document.getElementById('btn_feelok').style.display = "block";
    document.getElementById('btn_ok').style.display = "block";
}

function disableButtons()
{
    document.getElementById("ts").innerHTML = "No Fall Detected";
    document.getElementById('btn_help').style.display = "none";
    document.getElementById('btn_feelok').style.display = "none";
    document.getElementById('btn_ok').style.display = "none";
}