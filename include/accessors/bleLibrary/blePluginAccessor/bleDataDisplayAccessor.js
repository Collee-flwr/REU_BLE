exports.setup = function() {

    this.input('dataIn');
};

exports.initialize = function() {
    this.addInputHandler("dataIn", display.bind(this));

};

function display(){
    var res = this.get('dataIn');
    document.querySelector('#found-devices').innerHTML = "Distance: " + res + " cm";

}
