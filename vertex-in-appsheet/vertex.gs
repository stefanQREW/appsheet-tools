const VQA_MODEL = "imagetext";
const TEXT_MODEL = "text-bison";
const MULTI_MODEL = "gemini-1.5-flash";
const RESPONSE_COUNT = 1;
const PROMPT_SCAVENGE_ITEMS = `You are giving suggestions of Items to look for during a Scavenger Hunt Game. Given a Number and an Area, generate that Number of items that could be commonly found in the Area in a comma separated list. 

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
  const imageData = getFileFromDrive(path)

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
  const instance = `${PROMPT_SCAVENGE_ITEMS} ${prompt}`
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

/** 
 * Compare a Resume File and Job Description using a Multi-modal prompt to Gemini. 
 * @param {string} resumeFileName Drive filePath to Resume file.
 * @param {string} resumeFileFolder Drive ID for folder containing the Resume file.
 * @param {string} jdFileName Drive filePath to second file.
 * @param {string} jdFileFolder Drive ID for folder containing the Job Description file.
 * @param {string} prompt Text prompt for the model to reason with.
 * @retrun {string} the result of the model generation
 */
function compareResumeAndJD(resumeFileName,resumeFileFolder, jdFileName, jdFileFolder) {
  //set VARS
  const prompt = TEST_MULTIMODAL_PROMPT   // replace with your prompt
  const returnObj = {                     // Return Object will be used to standarize function output and pass error status/messages back to appsheet. 
    "Error": false,
    "ErrorMessage": "",
    "Results": ""
  }
  const BASE = "https://us-central1-aiplatform.googleapis.com";
  const URL = `${BASE}/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/${MULTI_MODEL}:generateContent`; // https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/send-multimodal-prompts#send-images

  // Resume File in Drive and Convert to Base64
  const resumeFileData = getFileFromDrive(resumeFileName, resumeFileFolder)

  //If image conversion fails...
  if(resumeFileData == "File not found") { 
    returnObj.Error = true
    returnObj.ErrorMessage = resumeFileData
    return returnObj 
  }

  // JD File in Drive and Convert to Base64
  const jdFileData = getFileFromDrive(jdFileName, jdFileFolder)

  //If image conversion fails...
  if(jdFileData == "File not found") { 
    returnObj.Error = true
    returnObj.ErrorMessage = jdFileData
    return returnObj 
  }

  // Expected payload for call to Vertex AI. Includes two file datas and a text prompt
  const payload = JSON.stringify({
    contents: {
      role: "User",
      parts: [
        {
          "inlineData": {
            "mimeType": "application/pdf",
            "data": resumeFileData
          }
        },
        {
          "inlineData": {
            "mimeType": "application/pdf",
            "data": jdFileData
          }
        },
        {
          "text": prompt
        }
      ]
    },
    generationConfig: {
      temperature: 0.85,
      topP: 0.95,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    }
  })

  // Generate Auth Tokens to the GCP project based on your service account credentials provided in constants.gs
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

  // Make the call to Vertex AI
  const response = UrlFetchApp.fetch(URL, options);
  let content, candidateAnalysis;

  if (response.getResponseCode() == 200) {
    content = JSON.parse(response.getContentText());
    if(content.candidates[0].content.parts[0].text) {
      candidateAnalysis = JSON.parse(content.candidates[0].content.parts[0].text)
      returnObj.Results = candidateAnalysis
      return returnObj
    } else {
      console.error("The model returned an unexpected output: ", content);
      returnObj.Error = true
      returnObj.ErrorMessage = `The model returned an unexpected output: ${JSON.stringify(content)}`
      return returnObj
    }
    
     
  } else {
    console.error("Error in vertex call: ", response.getContentText());
    returnObj.Error = true
      returnObj.ErrorMessage = `Error in vertex call: ${JSON.stringify(content)}`
      return returnObj
  }
}
