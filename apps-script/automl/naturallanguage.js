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

/**
 * Set variables for GCP project containing AutoML NL model.
 */
var PROJECT_ID = 'YOUR_PROJECT_ID';
var MODEL_ID = 'YOUR_MODEL_ID';

/**
 * Creates variables for the service account key and email address.
 * Authorization to AutoML requires a GCP service account with role of 'AutoML Predictor'.
 */
// Sets variable for service account key.
var PRIVATE_KEY = 'YOUR_PRIVATE_KEY';
// Sets variable for service account email address.
var CLIENT_EMAIL = 'YOUR_SVCACCT_EMAIL';

/**
 * Calls the AutoML NL service API with a string
 * @param {String} line the line of string
 * @return {Object} prediction for the string based on model type
 */
function retrieveSentiment (line) {
  var service = getService();
  if (service.hasAccess()) {
    var apiEndPoint = 'https://automl.googleapis.com/v1beta1/projects/' + 
        PROJECT_ID + '/locations/us-central1/models/' + 
        MODEL_ID + ':predict';    
    // Creates a structure with the text and request type.
    var nlData = {
      payload: {
        textSnippet: {
          content: line,
          mime_type: 'text/plain'
        },
      }
    };
    // Packages all of the options and the data together for the call.
    var nlOptions = {
      method : 'post',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken()               
      },
      payload : JSON.stringify(nlData)
    };
    //  And makes the call.
    var response = UrlFetchApp.fetch(apiEndPoint, nlOptions);
    var nlData = JSON.parse(response);
    return nlData;
  }  else {
    Logger.log(service.getLastError());
  }
}

/**
 * Reset the authorization state, so that it can be re-tested.
 */
function reset() {
  var service = getService();
  service.reset();
}

/**
 * Configures the service.
 */
function getService() {
  return OAuth2.createService('GCP')
      // Set the endpoint URL.
      .setTokenUrl('https://accounts.google.com/o/oauth2/token')

      // Set the private key and issuer.
      .setPrivateKey(PRIVATE_KEY)
      .setIssuer(CLIENT_EMAIL)

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getScriptProperties())

      // Set the scope. This must match one of the scopes configured during the
      // setup of domain-wide delegation.
      .setScope(['https://www.googleapis.com/auth/cloud-platform']);
}
