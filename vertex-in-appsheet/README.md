# Vertex Scripts for AppSheet
A series of AppsScript files that allow you to easily take advantage of various Vertex AI models to interact with your AppSheet data and associated Google Drive files

## Vertex Endpoints Supported
* Simple Text Generation -> Text prompting - ```predictText(prompt)```
* Visual Question Asking for Image -> Image prompting - ```predictVQA(prompt, path)```
* Compare 2 PDF files (job description & a resume) -> Multi-Modal prompting - ```compareResumeAndJD(resumeFileName,resumeFileFolder, jdFileName, jdFileFolder)```

## Usage Guide
### AI Scavenger Hunt - Visual Question Asking API
This simple game app allows you to generate a list of objects (text-bison model) that you might find in a particular location you specify. Then the game asks you to find those items by taking a picture of them. The Visual Question Asking API is used to determine if the picture you took matches the object description. 
* Copy this [AI Scavenger Hunt Demo](https://www.appsheet.com/Template/AppDef?appName=AIScavengerHuntDEMO-4098054&utm_source=share_app_link) AppSheet App (choose AppSheet Database as the Data Source)
* Create a new AppsScript Project
* Copy in all files in this directory
* Setup a GCP project with Vertex AI platform enabled (Enable all APIs)
* Create a Service Account with [Vertex AI User](https://cloud.google.com/vertex-ai/docs/general/access-control#aiplatform.user) role granted
* Download the JSON Key
* Update the constants.gs file with all relevant GCP, AppSheet, and Drive properties
* Initialialize the script and Authorize by running the ``` quickVQATest()``` function
* Connect the script to AppSheet by retargeting AppsScript Task inside of the Bots

### Resume Review - Compare PDF files with Gemini Multi-modal
Upload an applicant resume PDF, and select which Job opening you want to analyze it against. Gemini's multi modal model will:
1. Extract relevant applicant information fields: Name, Phone, Email, etc.
2. Compare the resume to the related job description and assign a score & summary to it based on relevance for the position.
 
That data then gets returned to AppSheet for your easy review! Happy highering.

* Copy this [Resume Review DEMO](https://www.appsheet.com/Template/AppDef?appName=ResumeReviewDEMO-4098054&utm_source=share_app_link) AppSheet App. **Be sure to copy the file data as well**
* Create a new AppsScript Project
* Copy in all files in this directory
* Setup a GCP project with Vertex AI platform enabled (Enable all APIs)
* Create a Service Account with [Vertex AI User](https://cloud.google.com/vertex-ai/docs/general/access-control#aiplatform.user) role granted
* Download the JSON Key
* Update the constants.gs file with all relevant GCP, AppSheet, and Drive properties
  * You'll need to find the folder IDs for the Resume and Job Description folders that AppSheet created during the clone step. 
* Initialialize the script and Authorize by running the ``` testMultiModal()``` function
* Connect the script to AppSheet by retargeting the *Gemini Resume Analysis* AppsScript Task inside of the *Analyze Resume* Bot

### Special Notes
- Some of these functions rely on returning data to AppSheet through a followup API call instead of through the function return. Some use cases and avertex enpoints may be better suited for one or the other. 
