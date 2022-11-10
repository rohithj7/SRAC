#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>

#include "Config.h"
#include "errorCodes.h";

#include "TofSensor.h"
#include "PeopleCounter.h"

#define FIREBASE_HOST "theta-tau-cd254-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "XSA3ViGeMSmnBYj6nDsKq6TbuUz1FfUSfz9uzBan"
const char* ssid = STASSID;
const char* password = STAPSK;

#define ENABLE_DEBUG

TofSensor myTofSensor;
PeopleCounter peopleCounter;

void blinkLed(int times, int interval = 500);

void setup() {

  Serial.begin(9600);
  /*
  // connect to wifi.
  WiFi.begin(ssid, password);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());
  */
  Serial.println("Ready 1");
  
  myTofSensor.setup();
  Serial.println("Ready 2");
  peopleCounter.setSensor(&myTofSensor);
  Serial.println("Ready 3");
  Serial.println(peopleCounter.getCount());
  //Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Serial.println("Ready 4");
}

unsigned long lastLedUpdate = 0;
int count = 0, lastCount = 0;

void loop() {

  Serial.println("Ready 7");
  if( (millis() - lastLedUpdate) > 1000 ){
    digitalWrite(LED_BUILTIN,!digitalRead(LED_BUILTIN));
    lastLedUpdate = millis();
  }
  Serial.println("Ready 8");
  
  //yield();

  Serial.println("Ready 9");
  myTofSensor.update();
  peopleCounter.update(); 
  count = peopleCounter.getCount();
  Serial.println(count);
  /*
  if(count != lastCount){
    String countMsg = String(count);
    
    Firebase.setString("LiveCount", "hello");
    // handle error
    if (Firebase.failed()) {
      Serial.print("setting /number failed:");
      Serial.println(Firebase.error());  
      return;
    }
    delay(1000);
    Serial.print("count: ");
    Serial.println(countMsg);
  }
  lastCount = count;
  */
  /*
  Firebase.setString("message", "hello world");
  // handle error
  if (Firebase.failed()) {
      Serial.println("setting /message failed:");
      Serial.println(Firebase.error());  
      return;
  }
  delay(1000);
  */
  /*
  Firebase.setInt("LiveCount/Value", count);
  // handle error
  if (Firebase.failed()) {
      Serial.print("setting /number failed:");
      Serial.println(Firebase.error());  
      return;
  }
  delay(1000);*/

  delay(4000);
  
}


void blinkLed(int times, int interval){
  for(int i = 0; i < times; i++){
    digitalWrite(LED_BUILTIN,LOW);
    delay(interval);
    digitalWrite(LED_BUILTIN,HIGH);
    delay(interval);
  }
}
