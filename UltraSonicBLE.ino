// ---------------------------------------------------------------- //
// Arduino Ultrasoninc Sensor HC-SR04 BLE
// Re-writed by Colin Campbell
// Using Arduino IDE 1.8.12
// Using HC-SR04 Module
// Tested on 19 June 2020
// ---------------------------------------------------------------- //

#include <ArduinoBLE.h>

#define echoPin 2 // attach pin D2 Arduino to pin Echo of HC-SR04
#define trigPin 3 //attach pin D3 Arduino to pin Trig of HC-SR04

// BLE distance service
BLEService ultraSonicService("19B10000-E8F2-537E-4F6C-D104768A1214");

BLEByteCharacteristic ultraSonicCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1214", BLERead | BLEWrite | BLENotify);
BLEDescriptor ultraSonicSensorDescriptor("19B10002-E8F2-537E-4F6C-D104768A1214", "ULTRASONIC");


// defines variables
long duration; // variable for the duration of sound wave travel
int distance; // variable for the distance measurement

void setup() {
  pinMode(trigPin, OUTPUT); // Sets the trigPin as an OUTPUT
  pinMode(echoPin, INPUT); // Sets the echoPin as an INPUT
  Serial.begin(9600); // // Serial Communication is starting with 9600 of baudrate speed

  if (!BLE.begin()) {
    Serial.println("starting BLE failed!");

    while (1); 
  }

  BLE.setLocalName("MKR1010");
  BLE.setAdvertisedService(ultraSonicService);
  ultraSonicCharacteristic.addDescriptor(ultraSonicSensorDescriptor);
  ultraSonicService.addCharacteristic(ultraSonicCharacteristic);
  BLE.addService(ultraSonicService);
  
  BLE.advertise();
}
void loop() {
  BLEDevice central = BLE.central();
  
  //if (central){

     // while(central.connect()){
          // Clears the trigPin condition
          digitalWrite(trigPin, LOW);
          delayMicroseconds(2);
          
          // Sets the trigPin HIGH (ACTIVE) for 10 microseconds
          digitalWrite(trigPin, HIGH);
          delayMicroseconds(10);
          digitalWrite(trigPin, LOW);
          
          // Reads the echoPin, returns the sound wave travel time in microseconds
          duration = pulseIn(echoPin, HIGH);
          
          // Calculating the distance
          distance = duration * 0.034 / 2; // Speed of sound wave divided by 2 (go and back)
          
          // Displays the distance on the Serial Monitor
          Serial.print("Distance: ");
          Serial.print(distance);
          Serial.println(" cm");
          ultraSonicCharacteristic.writeValue(distance);
     // }
 // }
}
