/**
 * Utilizes D1 Mini and 2 hc-sr04 sensors to create a people counter device.
 * 
 * Firebase_ESP Library Credits:
 * mobizt
 **/

#include <Arduino.h>
#if defined(ESP32)
  #include <WiFi.h>
#elif defined(ESP8266)
  #include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>

//token generation process info
#include "addons/TokenHelper.h"
//realtime database printing info with other helper functions
#include "addons/RTDBHelper.h"

// Insert your network credentials
#define WIFI_SSID "HOME-9A94-2.4"
#define WIFI_PASSWORD "creek1912basket"

// project api key
#define API_KEY "AIzaSyAVmQSViMyumP4xeKjzcZ3DcKrPnX_z0Vw"

// database url
#define DATABASE_URL "https://theta-tau-cd254-default-rtdb.firebaseio.com" 

//Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
bool signupOK = false;

int liveCount = 0;

int sensor1Loc[] = {5,4};
int sensor2Loc[] = {14,12};

String order = "";

void setup(){
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  // api key assigned
  config.api_key = API_KEY;

  // database url assigned
  config.database_url = DATABASE_URL;

  // subscribing to realtime database
  if (Firebase.signUp(&config, &auth, "", "")){
    Serial.println("ok");
    signupOK = true;
  }
  else{
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  
}

void loop(){

  int sensor1New = getDistanceUltra(sensor1);
  int sensor2New = getDistanceUltra(sensor2);

  if(sequence.charAt(0) != '1'){
    order += "1";
  }else if(sequence.charAt(0) != '2'){
    order += "2";
  }
  
  if(order.equals("21")){
    liveCount--;  
    order="";
    delay(500);
  }else if(order.equals("12") && liveCount > 0){
    liveCount++;  
    order="";
    delay(500);
  }
  
  if(order.equals("11") || order.equals("22") || order.length() > 2){
    order="";  
  }

  // after check for sign up, firebase ready, and 1000 ms has passed, data is written to path defined ('value')
  if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 1000 || sendDataPrevMillis == 0)){
    sendDataPrevMillis = millis();
    
    // Write an int number on the database path 'value'
    if (Firebase.RTDB.setInt(&fbdo, "value", currentPeople)){
      Serial.println("sucessfully passed");
      Serial.println("path: " + fbdo.dataPath());
      Serial.println("type: " + fbdo.dataType());
    }
    else {
      Serial.println("error: " + fbdo.errorReason());
    }
  }
}

/**
* Returns an integer distance based on transmitted and received ultrasonic waves
* and known speed of sound.
*
* @param  int[] array of sensor's pin locations
* @return       the distance to the object
*/
int getDistanceUltra(int a[]) {
  pinMode(a[1], OUTPUT);
  digitalWrite(a[1], LOW);
  delayMicroseconds(2);
  digitalWrite(a[1], HIGH);
  delayMicroseconds(10);
  digitalWrite(a[1], LOW);
  pinMode(a[0], INPUT);
  long duration = pulseIn(a[0], HIGH, 100000);
  return duration / 29 / 2;
}
