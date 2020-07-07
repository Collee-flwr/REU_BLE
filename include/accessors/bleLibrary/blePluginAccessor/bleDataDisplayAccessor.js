exports.setup = function() {

    this.input('dataIn');
};

exports.initialize = function() {
    this.addInputHandler("dataIn", display.bind(this));

};

function display(){
    var res = this.get('dataIn');
    document.getElementById("data-container").style.display = "flex";
    document.querySelector('#data').innerHTML =  res;
    document.querySelector('#cm').innerHTML =  "cm";


}
