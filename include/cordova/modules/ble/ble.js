// Below is the copyright agreement for the Ptolemy II system.
//
// Copyright (c) 2015-2016 The Regents of the University of California.
// All rights reserved.
//
// Permission is hereby granted, without written agreement and without
// license or royalty fees, to use, copy, modify, and distribute this
// software and its documentation for any purpose, provided that the above
// copyright notice and the following two paragraphs appear in all copies
// of this software.
//
// IN NO EVENT SHALL THE UNIVERSITY OF CALIFORNIA BE LIABLE TO ANY PARTY
// FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES
// ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF
// THE UNIVERSITY OF CALIFORNIA HAS BEEN ADVISED OF THE POSSIBILITY OF
// SUCH DAMAGE.
//
// THE UNIVERSITY OF CALIFORNIA SPECIFICALLY DISCLAIMS ANY WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE SOFTWARE
// PROVIDED HEREUNDER IS ON AN "AS IS" BASIS, AND THE UNIVERSITY OF
// CALIFORNIA HAS NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES,
// ENHANCEMENTS, OR MODIFICATIONS.
//
//
// Ptolemy II includes the work of others, to see those copyrights, follow
// the copyright link on the splash page or see copyright.htm.

/**
 * Module for BLE discovery and connection.
 *
 * @module ble
 * @author Colin Campbell, Ryan Wakabayashi
 * @version $$Id:
 */

var deviceName = "MKR1010";

var connectedDevice = {};


exports.requiredPlugins = ['cordova-plugin-ble'];

exports.connect = function (successCallback, errorCallback) {

    var devices = {};

    function startScan(fn){

          evothings.ble.startScan(
               function(device)
               {
                   device.timeStamp = Date.now();
                   devices[device.address] = device;
                   fn(devices);
               },
               function(error)
               {
                   console.log('BLE scan error: ' + error)
                   errorCallback();
               });

    }

    function connect (device){

         evothings.ble.connectToDevice(
                   device,
                   function(device){
                     document.querySelector('#found-devices').innerHTML = 'Connected to device: ' + device.name;
                     connectedDevice.device = device;
                   },
                   function(device){
                     console.log('Disconnected from device: ' + device.name);
                   },
                   function(errorCode){
                     console.log('Connect error: ' + errorCode);
                     errorCallback();
             });

    }

    startScan(function(devices){

         for (var key in devices)
         {
             var device = devices[key];
             var name = device.name || 'no name';
                   if (name == deviceName){
                        evothings.ble.stopScan();
                        connect(device);
                    }
         }
    });

};


exports.subscribe = function(successCallback, errorCallback, sensor_type){

   setTimeout(getServices, 2000);

   function getServices(){

        evothings.ble.readAllServiceData(
                 connectedDevice.device,
                 function(services){
                    connectedDevice.services = services;
                    getCharacteristic();
                 },
                 function(errorCode){
                    console.log('Services error: ' + errorCode);
                    errorCallback();
                 });

   }

   function getCharacteristic(){

        for (var sIndex in connectedDevice.services){
            var service = connectedDevice.services[sIndex];
            for (var cIndex in service.characteristics){
                var characteristic = service.characteristics[cIndex];
                getDescriptors(characteristic);
            }
        }
        

   }

   function getDescriptors(characteristic){

        evothings.ble.descriptors(
                connectedDevice.device,
                characteristic,
                function(descriptors)
                {

                    for( var i in descriptors){
                        var descriptor = descriptors[i];
                        discoverSensor(descriptor,function(){
                            connectedDevice.characteristic = characteristic;
                            getData();
                        });
                    }
                    console.log('found descriptors:');

                },
                function(errorCode)
                {
                    console.log('descriptors error: ' + errorCode);
                });

   }

   function discoverSensor(descriptor, subscribe){

         evothings.ble.readDescriptor(
                connectedDevice.device,
                descriptor,
                function(data)
                {
                    var cleanedData = String.fromCharCode.apply(null, new Uint8Array(data));
                    if (cleanedData == sensor_type){
                            subscribe();
                    }
                },
                function(errorCode)
                {
                    console.log('readDescriptor error: ' + errorCode);
                });

   }

   function getData(){

        evothings.ble.enableNotification(
                connectedDevice.device,
                connectedDevice.characteristic,
                function(data)
                {
                     var buff = new Uint8Array(data);
                     var cleanedData = buff[0];
                     successCallback(cleanedData);
                },
                function(errorCode)
                {
                    console.log('enableNotification error: ' + errorCode);
                    errorCallback();
                });
   }
};
