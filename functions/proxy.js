const request = require('superagent');
const HTMLParser = require('node-html-parser');
const { URL } = require('url');

const ALLOWED_ORIGINS = [
  'https://nycplanning.carto.com',
  'https://nycplanning-web.carto.com',
  'https://dcpbuilder.carto.com',
];

const STYLES = `
  <style type="text/css">
    * {
      border-radius: 0;
    }

    .CDB-Widget-canvasInner {
      border-radius: 0;
    }

    .CDB-Embed-tab {
      padding: 0;
    }

    .CDB-Text {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    }

    .CDB-Widget--alert {
      padding: 0;
    }

    .CDB-Widget--error {
      padding: 0;
    }

    @media only screen and (max-width: 760px)  {
      .CDB-Embed-tab.is-active {
        flex-direction: column;
      }
    }

    @media only screen and (min-width: 760px)  {
      .CDB-Embed-tab.is-active {
        flex-direction: row-reverse;
      }
    }
  </style>
`;

const SCRIPTS = `
  <script>
    (function() {
      const getMapState = (window) => {
        const currentMapRef = window.location.href;
        const statefulMapUrl = new URL(decodeURIComponent(currentMapRef));

        return statefulMapUrl.searchParams.get('state');
      }

      window.addEventListener('click', () => {
        setTimeout(() => {
          const state = getMapState(window);

          window.parent.location.hash = state;
        }, 500);
      });

      // initial load. get the map state from parent frame and set it as current map state.
      if (window.parent.location.hash && !window.parent.location.hash.includes('null')) {
        const cleanedParentMapState = window.parent.location.hash.split('#')[1];
        history.pushState(null, '', window.location.search + '&state=' + cleanedParentMapState);
      }
    })(window)
  </script>
`;

const FONTS = '<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous"></link>'

const injectCode = (htmlText) => {
  try {
    const root = HTMLParser.parse(htmlText);
    const cdbDocHead = root.querySelector('head');

    cdbDocHead.insertAdjacentHTML("afterbegin", SCRIPTS);
    cdbDocHead.insertAdjacentHTML("beforeend", FONTS);
    cdbDocHead.insertAdjacentHTML("beforeend", STYLES);

    return root.toString();
  } catch (e) {
    console.log(e);
    console.log('Something went wrong restructuring iframe!');
  }
}

exports.handler = async (event) => {
  const site = event.queryStringParameters && event.queryStringParameters.site

  if (!site) {
    return {
      statusCode: 200,
      body: 'No site param.',
      site,
    }
  }

  const siteUrl = new URL(site);

  if (!ALLOWED_ORIGINS.includes(siteUrl.origin)) {
    return {
      statusCode: 500,
      body: 'Origin not allowed.',
    }
  }

  const response = await request
    .get(site);

  const restyledEmbed = injectCode(response.text);

  const {
    'cache-control': cacheControl,
    'content-type': contentType,
    'content-encoding': contentEncoding,
    ...theRest
  } = response.headers;

  return {
    'statusCode': 200,
    'headers': {
      'Cache-Control': cacheControl,
      'Content-Type': contentType,
      ...theRest,
    },
    'body': restyledEmbed,
  }
}
