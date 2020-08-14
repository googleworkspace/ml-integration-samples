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
