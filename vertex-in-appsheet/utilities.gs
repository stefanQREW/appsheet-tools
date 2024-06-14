/**
 * Configures the service.
 */
function getGCPService() {
    return OAuth2.createService('GCP')
        // Set the endpoint URL.
        .setTokenUrl('https://accounts.google.com/o/oauth2/token')

        // Set the private key and issuer.
        .setPrivateKey(SERVICE_ACCOUNT_PRIVATE_KEY)
        .setIssuer(SERVICE_ACCOUNT_EMAIL)

        // Set the property store where authorized tokens should be persisted.
        .setPropertyStore(PropertiesService.getScriptProperties())

        // Set the scope. This must match one of the scopes configured during the
        // setup of domain-wide delegation.
        .setScope(['https://www.googleapis.com/auth/cloud-platform']);
}

function quickPromptTest() {
    const prompt = `Number: 4
  Area: Bar`
    const res = predictText(prompt)
    console.log(res)
    return res
}

function quickVQATest() {
    const res = predictVQA(TEST_PROMT_DRIVE.prompt, TEST_PROMT_DRIVE.imagePath)
    console.log(res)
    return res
}

function testMultiModal() {
    const res = compareResumeAndJD(TEST_MULTIMODAL_RESUME_FILE, TEST_MULTIMODAL_RESUME_FOLDER,TEST_MULTIMODAL_JD_FILE, TEST_MULTIMODAL_JD_FOLDER)
    console.log(res)
    return res
  }
  
  /**
   * Get a Drive File and return in Base64.
   * @param {string} asFileName File name as provided by AppSheet
   * @param {string} parentFolder Folder ID of the direct parent Folder that contains the File.
   * @return {string} Base64 file data 
   */
  function getFileFromDrive(asFileName, parentFolder = APP_FOLDER_ID) {
      // Pass in your own ID for the parentFolder if you want to target a different folder. Must be the direct parent of the file you want to pull. 
    const rootFolder = DriveApp.getFolderById(parentFolder);
    const fileName = parsePath(asFileName)
    // Search for files with names matching the partial path
    const files = rootFolder.searchFiles(`title contains "${fileName}"`);
    
    // Check if any files were found
    if (files.hasNext()) {
      const file = files.next();
      
      // Get the file blob
      const blob = file.getBlob();
      
      // Encode the blob to base64 string
      const encodedString = Utilities.base64Encode(blob.getBytes());
      
      return encodedString;
    } else {
      // No file found, return an error message (optional)
      return "File not found";
    }
  }
  
  /** 
   * Gets just the filename from the path (which should be unique to all files uploaded through AppSheet)
   * @param {string} path File Name that may or may not include file path. 
   * @return {string} the trailing file name
   */
  function parsePath(path = "st/rin/g") { 
    const splitPath = path.split("/")
    return splitPath[splitPath.length-1]
  }