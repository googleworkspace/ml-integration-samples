# Docs2Speech Demo

Turn your meeting notes into an audio file you can list to on the go! This application
converts a Google Doc into an .mp3 file using the [Cloud Text-to-Speech API][text-speech-api]. We use the
[Google Docs API][docs-api] to extract the text of the document then produce a high quality 
recording of natural human speech.

# Set up instructions

1. Create a GCP project and enable the Google Docs API and the Cloud Text-to-Speech API in the
[cloud console][cloud-console].

1. Replace the variable `DOCUMENT_ID` placeholder in DocsToSpeech.java with the ID of the
file you wish to transcribe. For more information on document ids, please see [here][doc-ids].

1. You will need to authenticate with OAuth to access your Google Doc. Follow the instructions
[here][docs-java] on how to get a client configuration (credentials.json) and save it to this directory.

1. ```gradle run``` and you should see an output file stored to your local directory. The first 
time you run this, you should be asked to authenticate in the browser.

# Next steps

We suggest expanding this sample to read multiple files from a Drive folder or uploading the 
output files to Google Cloud Storage. 

[cloud-console]: https://console.cloud.google.com/
[docs-java]: https://developers.google.com/docs/api/quickstart/java
[docs-ids]: https://developers.google.com/docs/api/how-tos/overview
[docs-api]: https://cloud.google.com/text-to-speech/docs
[text-speech-api]: https://cloud.google.com/text-to-speech/docs
