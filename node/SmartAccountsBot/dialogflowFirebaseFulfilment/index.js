// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const {google} = require('googleapis');
const cardBuilder = require('./cardBuilder');

const {
  WebhookClient,
  Payload,
} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const ACCOUNTS_SHEET_ID = '1HBcfIJMv7xhucMnAFrrXzjmRvbwz1iVpc-rfb26RAFg';

const CLUSTER_RANGES = {
  'CLUSTER1': 'Clusters!C1:D27',
  'CLUSTER2': 'Clusters!E1:F27',
  'CLUSTER3': 'Clusters!G1:H27',
  'CLUSTER4': 'Clusters!I1:J27',
};

const SKILL_ROWS = {
  'Infra': 7,
  'Hybrid': 8,
  'Data&Analytics': 9,
  'Data Management': 10,
  'Security': 11,
  'Networking': 12,
  'AI / ML': 13,
  'G Suite': 14,
  'SAP': 15,
};

const ACCOUNT_MANAGER = 'ACCOUNT MANAGER';
const ENGINEER = 'ENGINEER';
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

/**
 * Authenticates the Sheets API client for read-only access.
 *
 * @return {Object} sheets client
 */
async function getSheetsClient() {
  // Should change this to file.only probably
  const auth = await google.auth.getClient({
    scopes: [SCOPES],
  });
  return await google.sheets({version: 'v4', auth});
}

/**
 * Finds the Googler for the requested parameters.
 * @param {*} agent the Dialogflow agent
 */
async function findGoogler(agent) {
  const role = agent.parameters.role;
  const account = agent.parameters.account;
  const skill = agent.parameters.skill;
  const sheets = await getSheetsClient();

  console.log(`Looking up: ${role} ${account} ${skill}`);

  await lookupContact(agent, sheets, account, skill, role);
}

/**
 * Looks up the appropriate contact name.
 * @param {Object} agent The Dialogflow agent.
 * @param {*} sheets The sheets service.
 * @param {String} account The company name.
 * @param {String} skill The specialization.
 * @param {String} role Must be either 'Account Manager' or 'Engineer'.
 */
async function lookupContact(agent, sheets, account, skill, role) {
  // TODO: Refactor to return cluster values to save a 2nd read
  // in getContactName.
  let errorMessage = '';
  let cardJSON = {};
  const cluster = await getCluster(sheets, account);
  console.log(`Cluster: ${cluster}`);

  if (cluster === '') {
    errorMessage = `Cluster not found.`;
    console.error(errorMessage);
    cardJSON = cardBuilder.createErrorCard(account, errorMessage);
    addHangoutsCustomPayload(agent, cardJSON);
    return;
  }
  const skillIndex = getSkillRow(skill);
  if (skillIndex == -1) {
    errorMessage = `Skill not found.`;
    console.error(errorMessage);
    cardJSON = cardBuilder.createErrorCard(account, errorMessage);
    addHangoutsCustomPayload(agent, cardJSON);
    return;
  }
  const contact = await getContactName(sheets, cluster, role, skillIndex);

  if (contact !== '') {
    console.log(`found: ${contact}`);
    agent.add(`Please contact: ${contact}`);
    cardJSON = await cardBuilder.createContactCard(sheets, contact, cluster, account,
        role, skill);
  } else {
    errorMessage = `No contact person found.`;
    console.error(errorMessage);
    agent.add(errorMessage);
    cardJSON = cardBuilder.createErrorCard(account, errorMessage);
  }

  addHangoutsCustomPayload(agent, cardJSON);
  return contact;
}

/**
 * Adds the Hangouts Card response to the agent.
 *
 * @param {*} agent The Dialogflow agent
 * @param {*} cardJSON The structure of the Hangouts chat card.
 */
function addHangoutsCustomPayload(agent, cardJSON) {
  const payload = new Payload(
      'hangouts',
      cardJSON,
      {rawPayload: true, sendAsMessage: true},
  );
  agent.add(payload);
}

/**
 * Looks up which cluster the company belongs to
 * @param {sheets_v4.Sheets} sheets The sheets service.
 * @param {String} account The company name.
 * @return {String} The cluster name.
 */
async function getCluster(sheets, account) {
  console.log('in get cluster');
  // eslint-disable-next-line guard-for-in
  for (const [clusterKey, range] of Object.entries(CLUSTER_RANGES)) {
    console.log(`looking in clusterKey: ${clusterKey}`);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: ACCOUNTS_SHEET_ID,
      range,
    });
    const values = response.data.values;
    // TODO: change to map & filter
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      if (row[0] == account || row[1] == account) {
        return clusterKey;
      }
    }
    console.log(`cluster values: ${JSON.stringify(values)}`);
  }
  return '';
}

/**
   * Returns the row index for the given specialization.
   * This maps to Column A in the accounts Sheet.
   * @param {String} skill The specialization
   * @return {Integer} the index for the specialization or -1 if not found.
   */
function getSkillRow(skill) {
  for (const key in SKILL_ROWS) {
    if (skill == key) {
      return SKILL_ROWS[skill];
    }
  }
  return -1;
}

/**
  * Looks up the appropriate contact name in the cluster
   * @param {*} sheets The Sheets service.
   * @param {String} clusterKey The cluster key name.
   * @param {String} role Must be either 'Account Manager' or 'Engineer'
   * @param {Integer} skillIndex the index for the specialization.
   */
async function getContactName(sheets, clusterKey, role, skillIndex) {
  const range = CLUSTER_RANGES[clusterKey];
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: ACCOUNTS_SHEET_ID,
    range,
  });
  const values = response.data.values;
  const roleIndex = (role == ACCOUNT_MANAGER) ? 0 : 1;
  // Skills are indexed at 1.
  return values[skillIndex - 1][roleIndex];
}

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
    (request, response) => {
      const agent = new WebhookClient({request, response});
      console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
      console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

      function welcome(agent) {
        agent.add(`Welcome to my agent!`);
      }

      function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
      }
      // Run the proper function handler based on the matched Dialogflow intent name
      const intentMap = new Map();
      intentMap.set('Default Welcome Intent', welcome);
      intentMap.set('Default Fallback Intent', fallback);
      intentMap.set('Look up Googler', findGoogler);
      agent.handleRequest(intentMap);
    });
