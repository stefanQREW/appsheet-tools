const VQA_MODEL = "imagetext";
const TEXT_MODEL = "text-bison"
const RESPONSE_COUNT = 1;
const PROMPT_BASE = `You are giving suggestions of Items to look for during a Scavenger Hunt Game. Given a Number and an Area, generate that Number of items that could be commonly found in the Area in a comma separated list. 

-- Example Prompt 1 --
Number: 2
Area: Home Kitchen 

-- Example Response 1 --
Spoon, Sink

-- Example Prompt 2 --
Number: 4
Area: Bar & Grill 

-- Example Response 2--
Wine Bottle, Lime Wedge, Napkin Square, Stir Stick
`

function createScavengerHuntItems(prompt = TEST_PROMT_TEXT,gameID = "KsjGOw1zjT4j2DnpiTmzhf") {
  const items = predictText(prompt)
  const objects = []
  items.split(',').forEach(i => objects.push({"Description": i.trim(), "GameID": gameID}))
  const appsheetRes = postAppSheet(objects, "Game Objects")
  console.log(appsheetRes)
  return items
}

function predictVQA(prompt, path) {
  //set VARS
  const returnObj = {
    "Error": false,
    "ErrorMessage": "",
    "VQA": ""
  }
  const BASE = "https://us-central1-aiplatform.googleapis.com";
  const URL = `${BASE}/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/${VQA_MODEL}:predict`;
  
  //Fild File in Drive and Convert to Base64
  const imageData = getImageFromDrive(path)

  //If image conversion fails...
  if(imageData == "File not found") { 
    returnObj.Error = true
    returnObj.ErrorMessage = imageData
    return returnObj 
  }

  const payload = JSON.stringify({
    "instances": [
      {
        "prompt": prompt,
        "image": {
            "bytesBase64Encoded": imageData
        }
      }
    ],
    "parameters": {
      "sampleCount": RESPONSE_COUNT
    }
  });

  const service = getGCPService();
  if (!service.hasAccess()) {
    console.log(service.getLastError());
    return 'Sorry, something went wrong accessing GCP.';
  }

  const accessToken = service.getAccessToken();

  const options = {
    method: "post",
    headers: { Authorization: `Bearer ${accessToken}` },
    muteHttpExceptions: true,
    contentType: "application/json",
    payload,
  };

  const response = UrlFetchApp.fetch(URL, options);

  if (response.getResponseCode() == 200) {
    let content = JSON.parse(response.getContentText());
    return content.predictions.join(",")
  } else {
    throw new Error(response.getContentText());
  }
}

function predictText(prompt) {
  const BASE = "https://us-central1-aiplatform.googleapis.com";
  const URL = `${BASE}/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/${TEXT_MODEL}:predict`;
  const instance = `${PROMPT_BASE} ${prompt}`
  const payload = JSON.stringify({
    instances: [{ "prompt": instance }],
    parameters: {
      temperature: 0.2,
      maxOutputTokens: 1000,
      top: 40,
      topP: 0.95,
    },
  });

  const service = getGCPService();
  if (!service.hasAccess()) {
    console.log(service.getLastError());
    return 'Sorry, something went wrong accessing GCP.';
  }

  const accessToken = service.getAccessToken()

  const options = {
    method: "post",
    headers: { Authorization: `Bearer ${accessToken}` },
    muteHttpExceptions: true,
    contentType: "application/json",
    payload,
  };

  const response = UrlFetchApp.fetch(URL, options);

  if (response.getResponseCode() == 200) {
    let content = JSON.parse(response.getContentText());
    return  content.predictions[0].content 
  } else {
    throw new Error(response.getContentText());
  }
}
