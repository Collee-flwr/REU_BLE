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
var distanceService = "19b10000-e8f2-537e-4f6c-d104768a1214";

var connectedDevice = {};


exports.requiredPlugins = ['cordova-plugin-ble'];

exports.connect = function () {
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


exports.subscribe = function(onSuccess){

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
                 });
   }

   function getCharacteristic(){
        for (var index in connectedDevice.services){
           var service = connectedDevice.services[index];
                if (service.uuid == distanceService){
                   connectedDevice.characteristic = service.characteristics[0];
                }
        }
        getData();
   }

   function getData(){
        evothings.ble.enableNotification(
              connectedDevice.device,
              connectedDevice.characteristic,
              function(data)
              {
                 var buff = new Uint8Array(data);
                 var cleanedData = buff[0];
                 onSuccess(cleanedData);

              },
              function(errorCode)
              {
                console.log('enableNotification error: ' + errorCode);
              });
   }
};

