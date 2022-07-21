/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Sets API key for accessing Cloud Natural Language API.
var myApiKey = "YOUR_API_KEY_HERE";

/**
 * Calls the Cloud Natural Language API with a string of text to analyze
 * entities and sentiment present in the string.
 * @param {String} line - the string for entity sentiment analysis
 * @return {Object} the entities and related sentiment present in the string
 */
function retrieveEntitySentiment(line) {
  var apiKey = myApiKey;
  var apiEndpoint = 'https://language.googleapis.com/v1/documents:analyzeEntitySentiment?key=' + apiKey;
  // Creates a JSON request, with text string, language, type and encoding
  var nlData = {
    document: {
      language: 'en-us',
      type: 'PLAIN_TEXT',
      content: line,
    },
    encodingType: 'UTF8',
  };
  // Packages all of the options and the data together for the API call.
  var nlOptions = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(nlData),
  };
  // Makes the API call.
  var response = UrlFetchApp.fetch(apiEndpoint, nlOptions);
  return JSON.parse(response);
};
