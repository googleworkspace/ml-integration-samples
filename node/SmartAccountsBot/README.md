# SmartAccountsBot
Smart accounts bot is an example Dialogflow chat bot that extracts information
a sales team uses in a Google Sheet. The user can quickly figure out the best
contact for any account requests they might encounter.

Co-Authors: Anu Srivastava, Lee Boonstra

[![demo video](https://img.youtube.com/vi/n99sQBtYulQ/0.jpg)](https://www.youtube.com/watch?v=n99sQBtYulQ)

## Prerequisites 

The set up instructions are below assume experience with Google Cloud and Dialogflow.
We suggest completing this [codelab][codelab] on fulfillment with Dialogflow prior to
setting up this demo.

[codelab]: https://codelabs.developers.google.com/codelabs/dialogflow-assistant-tvguide/index.html?index=..%2F..index#3

## Set up

1. Download the zip file of the Dialogflow agent and import into your own project
in the Dialogflow console.

1. Find the GCP project for your agent and enable the Maps Static API and create
an API key. Copy this API key into the `cardBuilder.js` file. 

1. Enable fulfillment through Dialoglow console and run the default function for set up.
Next deploy this function to your project. 
`gcloud functions deploy dialogflowFirebaseFulfillment`

1. If your code encounters permissions issues for the source sheet, make a copy of
the sheet in your Drive:
`https://docs.google.com/spreadsheets/d/1HBcfIJMv7xhucMnAFrrXzjmRvbwz1iVpc-rfb26RAFg/copy`
Then share the Sheet with the service account your function runs as. You an find the
account in the `Settings` page of the Dialogflow console for your agent.

For questions or set up help, tweet at us: @ladysign and @asrivas_dev
