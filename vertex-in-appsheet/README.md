# Vertex Scripts for AppSheet
A series of AppsScript files that allow you to easily take advantage of various Vertex AI models to interact with your AppSheet data and associated Google Drive files

## Vertex Endpoints Supported
* Simple Text -> Text prompting - ```predictText(prompt)```
* Visual Question Asking for Image -> Text prompting - ```predictVQA(prompt, path)```

## Usage Guide
* Copy this [AI Scavenger Hunt Demo](https://www.appsheet.com/Template/AppDef?appName=AIScavengerHuntDEMO-4098054&utm_source=share_app_link) AppSheet App (save to AppSheet Database)
* Create a new AppsScript Project
* Copy in all files in this directory
* Setup a GCP project with Vertex AI platform enabled (Enable all APIs)
* Create a Service Account with [Vertex AI User](https://cloud.google.com/vertex-ai/docs/general/access-control#aiplatform.user) role granted
* Download the JSON Key
* Update the constants.gs file with all relevant GCP, AppSheet, and Drive properties
* Initialialize the script and Authorize by running the ``` quickVQATest()``` function
* Connect to AppSheet using an AppsScript Task inside of a Bot

### Special Notes
- Some of these functions rely on returning data to AppSheet through a followup API call instead of through the function return. Some use cases and avertex enpoints may be better suited for one or the other. 
