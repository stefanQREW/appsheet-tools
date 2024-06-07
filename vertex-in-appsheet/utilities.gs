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

function getImageFromDrive(path) {
    // Get the root folder (change this if you want to search a specific folder)
    const rootFolder = DriveApp.getFolderById(APP_FOLDER_ID);
    const fileName = parsePath(path)
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
 */
function parsePath(path = "st/rin/g") {
    const splitPath = path.split("/")
    return splitPath[splitPath.length - 1]
}
