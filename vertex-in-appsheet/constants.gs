// GCP Account Configuration
const PROJECT_ID = "project-id-12345"; //GCP project ID that your Vertex APIs are enabled in.
const SERVICE_ACCOUNT_EMAIL = 'your-service-account@your-project.iam.gserviceaccount.com';
const SERVICE_ACCOUNT_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nthe key value goes here\n-----END PRIVATE KEY-----\n';

// AppSheet Configuration
const APP_ID = 'xxxx-xxxx-xxxx-xxxx-xxxxxxxx'; // Under Settings > Integrations
const ACCESS_KEY = 'xxxx-xxxx-xxxx-xxxx-xxxxxxxx'; // Under Settings > Integrations
const APP_FOLDER_ID = "xxxxxxxxxxxxxxxxxxxxx" // Drive folder that The Appsheet app stores its uploaded files in. Used in this script to restrict file search to relevant areas.
const TIMEZONE = 'Central Standard Time'; // https://support.google.com/appsheet/answer/11445911?hl=en


// Variables for Testing values
const TEST_PAYLOAD_BASE_64 = {
    "instances": [
        {
            "prompt": "how would you describe this picture?",
            "image": {
                "bytesBase64Encoded": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="
            }
        }
    ],
    "parameters": {
        "sampleCount": 1
    }
}

const TEST_DRIVE_FILE_PATH = "folder-name/file-name.jpg" // A test file within the AppSheet file folder
const TEST_PROMT_DRIVE = {
    "prompt": "Is this a picture of a Coffee Cup? Answer Y for yes or N for no.",
    "imagePath": TEST_DRIVE_FILE_PATH
}

const TEST_PROMT_TEXT = `Number: 5
Area: Hanger`

// Multimodal Test Variables
const TEST_MULTIMODAL_PROMPT = "Analyze this Resume against the Job Description provided. Return the following analysis items in JSON format: \nName\nPhone\nEmail\nScore: Return a numerical score of applicant's fitness for the role (1 being lowest and 10 being highest)\nSummary: A 30 word summary describing the applicant's fitness for the role and the most standout applicant attribute.\n\nHere is an example response format for a highly fit applicant:\n{\n  \"Name\": \"Jane Doe\",\n  \"Phone\": \"(555) 555-5555\",\n  \"Email\": \"jane.doe@email.com\",\n  \"Score\": 9,\n  \"Summary\": \"Jane Doe is a highly qualified candidate for the Entry-Level Software Engineer (Python) position. Her strong foundation in Python, Django, Flask, and Google Cloud Platform, coupled with her experience in machine learning, web development, and software engineering, makes her a strong match for the role. Her accomplishments, including a successful internship at XYZ Corporation and winning Stanford TreeHacks, highlight her technical prowess and teamwork abilities. Doe's commitment to open-source contributions and active engagement in online coding communities further demonstrate her passion for software development.\"\n}"

const TEST_MULTIMODAL_RESUME_FOLDER = "1eYyKjVp8xW773nLKePDd7p8JwFMu21bT" // Google Drive folder ID where AppSheet saves the Resume Files
const TEST_MULTIMODAL_JD_FOLDER = "1GYb4-n7aGZKVkG20N2Vshrhw52cWYauL" // Google Drive folder ID where AppSheet saves the Job Description Files
const TEST_MULTIMODAL_RESUME_FILE = "6275f224-3226-4baa-bee1-2466da3377d3.File.205948.pdf" // example Resume File Name
const TEST_MULTIMODAL_JD_FILE = "432c8d65-38ff-454f-8e72-3c3867bb0a97.Job Description File.193327.pdf" // example Job Description File Name