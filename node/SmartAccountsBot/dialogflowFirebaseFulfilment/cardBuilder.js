const ACCOUNT_IMAGE_URL = 'https://www.gstatic.com/images/icons/material/system_gm/1x/account_circle_black_18dp.png';
const ACCOUNTS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1HBcfIJMv7xhucMnAFrrXzjmRvbwz1iVpc-rfb26RAFg/edit';
const ACCOUNTS_SHEET_ID = '1HBcfIJMv7xhucMnAFrrXzjmRvbwz1iVpc-rfb26RAFg';
const API_KEY = 'YOUR_API_KEY';

// TODO: make this a map
const AMS_IMAGE_URL = 'https://maps.googleapis.com/maps/api/staticmap?center=Claude%20Debussylaan%2034,%201082%20MD%20Amsterdam,%20Netherlands&zoom=14&size=400x400&key=' + API_KEY;
const MTV_IMAGE_URL = 'https://maps.googleapis.com/maps/api/staticmap?center=Googleplex&zoom=14&size=200x200&key=' + API_KEY;
const SFO_IMAGE_URL = 'https://maps.googleapis.com/maps/api/staticmap?center=345%20Spear%20Street,%20San%20Francisco,%20CA&zoom=14&size=200x200&key=' + API_KEY;
const LON_IMAGE_URL = 'https://maps.googleapis.com/maps/api/staticmap?center=https://maps.googleapis.com/maps/api/staticmap?center=6%20Pancras%20Square,%20Kings%20Cross,%20London%20N1C%204AG,%20UK&zoom=14&size=200x200&key=' + API_KEY;
const NYC_IMAGE_URL = 'https://maps.googleapis.com/maps/api/staticmap?center=111%208th%20Ave,%20New%20York,%20NY%2010011&zoom=14&size=200x200&key=AIzaSyDcsevYCzekvFi6HygkEW2YeojxjW8prH4&zoom=14&size=200x200&key=' + API_KEY;

const createContactCard = async (sheets, contact, cluster,
  account, role, skill) => {
  console.log(`in createContactCard`);
  const contactRow = await getContactInfo(sheets, contact);
  const email = contactRow[1];
  const location = contactRow[2];
  console.log(`location ${location}`);
  let mapsImageURL = MTV_IMAGE_URL;

  if (location == 'AMS') {
    mapsImageURL = AMS_IMAGE_URL;
  } else if (location == 'NYC') {
    mapsImageURL = NYC_IMAGE_URL;
  } else if (location == 'SFO') {
    mapsImageURL = SFO_IMAGE_URL;
  } else if (location == 'LON') {
    mapsImageURL = LON_IMAGE_URL;
  }
  // leave default as MTV.

  const cardHeader = {
    title: account + ' ' + role + ' ' + 'Contact',
    subtitle: skill + ': ' + contact,
    imageUrl: ACCOUNT_IMAGE_URL,
    imageStyle: 'IMAGE',
  };

  const clusterWidget = {
    keyValue: {
      content: 'Cluster',
      bottomLabel: cluster,
    },
  };

  const emailWidget = {
    keyValue: {
      content: 'Email',
      bottomLabel: email,
    },
  };

  const locationWidget = {
    keyValue: {
      content: 'Location',
      bottomLabel: location,
    },
  };

  const mapImageWidget = {
    'image': {
      'imageUrl': mapsImageURL,
      'onClick': {
        'openLink': {
          'url': mapsImageURL,
        },
      },
    },
  };

  const infoSection = {widgets: [clusterWidget, emailWidget,
    locationWidget, mapImageWidget]};

  return {
    'hangouts': {
      'name': 'Contact Card',
      'header': cardHeader,
      'sections': [infoSection],
    },
  };
};

const createErrorCard = (accountName, errorMessage) => {
  console.log(`in createErrorCard`);
  const cardHeader = {
    title: 'Account Information Not Found',
    subtitle: 'Account requested: ' + accountName,
    imageUrl: ACCOUNT_IMAGE_URL,
    imageStyle: 'IMAGE',
  };

  const errorWidget = {
    textParagraph: {
      text: errorMessage,
    },
  };

  const textWidget = {
    textParagraph: {
      text: 'Please check the account data is up to date',
    },
  };

  const buttonWidget = {
    buttons: [
      {
        textButton: {
          text: 'Account Data',
          onClick: {
            openLink: {
              url: ACCOUNTS_SHEET_URL,
            },
          },
        },
      },
    ],
  };

  const infoSection = {widgets: [errorWidget, textWidget, buttonWidget]};
  return {
    'hangouts': {
      'name': 'No Owner Found',
      'header': cardHeader,
      'sections': [infoSection],
    },
  };
};

/**
 * Looks up the email address for the given contact name.
 * 
 * @param {Object} sheets The Sheets client
 * @param {*} name The name of the contact to look up
 */
async function getContactInfo(sheets, name) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: ACCOUNTS_SHEET_ID,
    range: 'Contacts!A:D',
  });
  const contactTable = response.data.values;
  const contactRow = contactTable.find((entry) => entry[0] === name);
  return contactRow;
}

exports.createContactCard = createContactCard;
exports.createErrorCard = createErrorCard;
