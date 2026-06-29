#define ENABLE_SERVICE_AUTH
#define ENABLE_FIRESTORE

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <FirebaseClient.h>
#include <ArduinoJson.h>

// =========================
// Device config
// =========================

int relayPin = 99;
#define DOCUMENT_PATH "devices/LabHottaLuzesEstufa1"

void turnPowerOn()  { digitalWrite(relayPin, LOW ); }
void turnPowerOff() { digitalWrite(relayPin, HIGH); }

void hardwareSetup(){

}

void tick(JsonDocument doc)
{
    // Update relayPin
    if (relayPin != doc["fields"]["relayPin"]["integerValue"]){
        relayPin = doc["fields"]["relayPin"]["integerValue"];
        pinMode(relayPin, OUTPUT);
    }

    // Calculate elapsed time
    time_t now = time(nullptr);
    time_t startAt = doc["fields"]["experimentStartDate"]["integerValue"];
    double elapsedHours = difftime(now, startAt) / 3600.0;
    
    Serial.println("============ [ Device Info ] ============");
    Serial.print("Relay pin: ");
    Serial.println(relayPin);

    Serial.print("Elapsed Hours: ");
    Serial.println(elapsedHours);

    Serial.println("------------ [   Schedule  ] ------------");

    // Calculate current state
    JsonArray toggles =
        doc["fields"]["toggles"]
           ["arrayValue"]
           ["values"];

    bool enabled = false;
    bool alternate = false;
    for (JsonObject value : toggles)
    {
        double toggle = value["doubleValue"].as<double>();
        alternate = !alternate;

        Serial.print(toggle);
        if (alternate){
          Serial.print("h: Turn relay ON ");
        } else {
          Serial.print("h: Turn relay OFF");
        }    
        if (toggle < elapsedHours) {
          enabled = !enabled;
          Serial.println(" [X]");
        } else {
          Serial.println(" [ ]");
        }

        
    }

    if (enabled){
        Serial.println("Currently ON");
        turnPowerOn();
    } else{
        Serial.println("Currently OFF");
        turnPowerOff();
    }
}

// =========================
// WiFi
// =========================

#define WIFI_SSID     "wifi-n"
#define WIFI_PASSWORD "#patagonia"

// =========================
// Firebase
// =========================

#define PROJECT_ID "usplabquimicaautomation"
#define CLIENT_EMAIL "esp32readonlyclient@usplabquimicaautomation.iam.gserviceaccount.com"
#define PRIVATE_KEY "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC54VRtsDWIAFnq\na9CO7QcFjwJmPF2P4XZfKpWU9GyAO/jaPuBlXriYONHo99/BQUjDGUtq3tpXC9wp\n4Q1wWy2NMvx4RT+9v2vRjxDN/7zbKpNGBj158io+QfHHg2MvLZCg2U3CBs5f8DE3\naTSZyj2O4mCxwCMJ3JVyAX8IhGsQQmb4GTOBcRh/7HUi30ZvxV+gFPZ3nZKjvKuB\ncfONyx+LM+oH/cbdijJFmAWoHbfKbUewrl3iVyLKZwneCi+ceOsRXfZo+2+pLyds\nZ7sXCfJxlLxTHYYigg+gt5GosQA3fHkc1X+mSAPedMfGtXgg2Q3+PO+6SYbbTaZs\nNotFPJIlAgMBAAECggEAXLo1aZDFa6atNF37iUliPtokOsczb4Lsj7YJL+ktNV11\nm75RKBC0Kq/xu3PoShqcx0MXleU9a74tYzDziNDbbPx56S+2iBx1l3F00ycYWgcn\nt/+F7I8rlqpECKEZOiBTbYJqIXhOvJpwmvFfPbcftWdmEFZGxHUnklt/uUqBtHZp\nHDdbU9+2dh+EnWVDpB7FYyICloSTLV1kONKqQm6Lvv1AsnCrDc+n4txUSdK3gCVs\n482pcKfdv5JvzzmEWlnIhsB3T2rm65HW6kMtOSMn6oxVuKlnvkzKTlsTRINqq3tA\nLVZ+Cb9iQHdwZsdEjmb5/Sx3aaQotXp+diGhEIswswKBgQDvajQrMwLCjfTqvSeO\ncg5/Fb2fh1ho5dELjcYWUC89uchWq94H+ZI6WXs1ujNeUwQaQd5RwZqy07xeBa9q\nHXMvPBOI3Kuf100AwggDhewYPgoKEaHBg4t7eVSMqHuYwrPFOPfjOmdcCv8CBRLa\nie2q8HBf1Spr0GIWJg5dS8oNpwKBgQDGwb1GE+wziEQPdVYNEnchbEwO7k2xUPMQ\nG4VInunn39/9vqhda0dNtAG53cTxC+jBnZotSWZ+IgmLTRcP7pxoxuEOF/yuwrLL\nIeUZOlSU8tOHG2BV2BPA7CbHsVki4xQObmLlPsiQzlxsRB04R50pviRJyBkR1Ehb\nZyIxGOtTUwKBgQDIHkHVCiJ4dSgPPmTeEEBFwepqejtQEykVO0AkTonuUmg+6hIB\nIH81/q2aTzW41jNLr1shg27Ho2yEOsRRMqShCtpZP/rE9LYMuCLyrvKVoOXLXMmU\nc1wXrWca24nUOosBg4jQinTy3s4g5hTITxo2FBwaPpfi3p/eW5kOKteNaQKBgEbq\nIzUYsKLmUJpPXCeH2heDw1NkdTX50u+BUjnJ8Vz5BLtNRlcmiqdPvXnqhXUXsbE7\nISJdWQNR86PPGpZlpUrBAtV7e32DHDXb3xj0Ne97ADvpaaLXWJzx5RhEz6/h42sO\nuZxfnUIFTvaWCvLkok+dducYTNGOs05hatKnuHbfAoGAUkwI/p1ggpQBDjWF8soh\nA7dmqWjfVYxTutCY2kTshSkkQOG7LVFt+qZnCKg3H7Mp3a00h2PZMen+wiphGqGM\nngNKJc3oQgLeRVVrKv0JiBzFvDWGWrTzSQgeZ9LS8IHGaQWZzv/B8J8PxY/80pzv\nyQcftrRej116LQyMDc0nTwI=\n-----END PRIVATE KEY-----\n"


// =========================
// Firebase Objects
// =========================

ServiceAuth auth(
    CLIENT_EMAIL,
    PROJECT_ID,
    PRIVATE_KEY,
    3000
);

FirebaseApp app;

WiFiClientSecure ssl;

using AsyncClient = AsyncClientClass;
AsyncClient client(ssl);

Firestore::Documents Docs;

// =========================
// Polling
// =========================

unsigned long nextFetch = 0;
const unsigned long FETCH_INTERVAL = 8000;

unsigned long nextProcess = 0;
const unsigned long PROCESS_INTERVAL = 2000;

// =========================

uint32_t getTime()
{
    Serial.print("Synchronizing time... ");

    configTime(0, 0, "pool.ntp.org");

    int retry = 0;

    while (time(nullptr) < FIREBASE_DEFAULT_TS && retry < 20)
    {
        delay(500);
        retry++;
    }

    Serial.println(time(nullptr) > FIREBASE_DEFAULT_TS ? "OK" : "FAILED");

    return time(nullptr);
}

// =========================

JsonDocument lastWellFormedDoc;

void authCallback(AsyncResult &result)
{
    if (!result.isResult())
        return;

    if (result.isError())
    {
        Firebase.printf(
            "Auth Error: %s (%d)\n",
            result.error().message().c_str(),
            result.error().code());
    }

    if (result.isDebug())
    {
        Serial.println(result.debug());
    }
}

void setup()
{
    hardwareSetup();
    Serial.begin(115200);

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    Serial.print("Connecting WiFi");

    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.print(".");
        delay(300);
    }

    Serial.println();
    Serial.println("Connected!");

    ssl.setInsecure();
    ssl.setConnectionTimeout(1000);
    ssl.setHandshakeTimeout(5);

    app.setTime(getTime());

    initializeApp(
        client,
        app,
        getAuth(auth),
        authCallback,
        "Auth"
    );

    app.getApp<Firestore::Documents>(Docs);
}

// =========================

void loop()
{
    app.loop();

    if (!app.ready())
        return;

    if (millis() > nextProcess){
        nextProcess = millis() + PROCESS_INTERVAL;
        if (!lastWellFormedDoc.isNull()){
            tick(lastWellFormedDoc);
        }
   }

    if (millis() < nextFetch)
        return;

    nextFetch = millis() + FETCH_INTERVAL;

    Serial.println("Fetching Firestore...");

    String payload = Docs.get(
        client,
        Firestore::Parent(PROJECT_ID),
        DOCUMENT_PATH,
        GetDocumentOptions()
    );

    if (client.lastError().code() == 0)
    {
        JsonDocument tDoc;
        DeserializationError err = deserializeJson(tDoc, payload);
        if (err) {
            Serial.print("JSON Error: "); Serial.println(err.c_str());
        }  else {
            lastWellFormedDoc = tDoc;
        }
        
    }
    else
    {
        Firebase.printf(
            "Firestore Error %d: %s\n",
            client.lastError().code(),
            client.lastError().message().c_str());
    }
}