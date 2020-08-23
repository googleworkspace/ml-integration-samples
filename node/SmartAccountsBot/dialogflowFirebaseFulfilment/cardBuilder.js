const ACCOUNT_IMAGE_URL = 'https://www.gstatic.com/images/icons/material/system_gm/1x/account_circle_black_18dp.png';
const ACCOUNTS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1HBcfIJMv7xhucMnAFrrXzjmRvbwz1iVpc-rfb26RAFg/edit';
const ACCOUNTS_SHEET_ID = '1HBcfIJMv7xhucMnAFrrXzjmRvbwz1iVpc-rfb26RAFg';
const MAPS_IMAGE_BASE_URL = 'https://maps.googleapis.com/maps/api/staticmap?';
const API_KEY = 'YOUR_API_KEY';

const LOCATION_VARS = {
  'AMS' : 'center=Claude%20Debussylaan%2034,%201082%20MD%20Amsterdam,%20Netherlands&zoom=14&size=400x400',
  'MTV' : 'center=Googleplex&zoom=14&size=200x200',
  'SFO' : 'center=345%20Spear%20Street,%20San%20Francisco,%20CA&zoom=14&size=200x200',
  'LON' : 'center=6%20Pancras%20Square,%20Kings%20Cross,%20London%20N1C%204AG,%20UK&zoom=14&size=200x200',
  'NYC' : 'center=111%208th%20Ave,%20New%20York,%20NY%2010011&zoom=14&size=200x200'
}

const createContactCard = async (sheets, contact, cluster,
  account, role, skill) => {
  const contactRow = await getContactInfo(sheets, contact);
  const email = contactRow[1];
  const location = contactRow[2];

  // For production use, we recommend restricting and signing your API Key
  // See: https://developers.google.com/maps/documentation/maps-static/get-api-key
  const mapsImageURL = MAPS_IMAGE_BASE_URL + LOCATION_VARS[location] + '&key=' + API_KEY;

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
