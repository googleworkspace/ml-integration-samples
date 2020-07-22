
API_KEY = "your API key"

function CloudVisionAPI(image_bytes) {

  const payload = JSON.stringify({
    requests: [{
      image: {
        content: Utilities.base64Encode(image_bytes)
      },
      features: [
        {
          type:"LABEL_DETECTION",
          maxResults: 10
        }
      ]
    }]
  });
  
  
  const url = 'https://vision.googleapis.com/v1/images:annotate?key=' + API_KEY;
  
  const response = UrlFetchApp.fetch(url, {
    method: 'POST',
    contentType: 'application/json',
    payload: payload,
    muteHttpExceptions: true
  }).getContentText();
  
  const json_resp = JSON.parse(response)
  
  Logger.log(json_resp)
  
  var labels = []
  
  json_resp.responses[0].labelAnnotations.forEach(function (label) {
    labels.push(label.description)
  })
  
  return labels
}
