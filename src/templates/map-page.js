/* eslint no-undef: 0 */
import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

// specially combines URL with current map state
const constructCartoProxyUrl = (cartoMapUrl, stateParam = '') => {
  // the base URL (without query params) must be encoded
  const cartoProxyEmbedUrl = `/.netlify/functions/proxy?site=${encodeURIComponent(cartoMapUrl)}`;

  if (!stateParam.includes('state')) {
    return cartoProxyEmbedUrl;
  }

  // if there are filters being passed through the parent site, they need to be decoded
  const dynamicFilters = decodeURIComponent(stateParam.split('?state=')[1]);

  // start with the encoded base URL and append the filters
  return `${cartoProxyEmbedUrl}&state=${dynamicFilters}`;
}

class MapPage extends React.PureComponent {
  constructor(props) {
    super(props);

    const combinedUrl = constructCartoProxyUrl(
      props.pageContext.mapUrl,
      props.location.search,
    );

    this.state = {
      url: combinedUrl,
    };
  }

  render() {
    return (
      <Layout
        location={this.props.location}
        title={this.props.siteTitle}
      >
        <SEO
          title="Map"
          keywords={this.props.keywords}
        />
        <iframe
          className="carto-embedded-iframe"
          title="Embedded Map"
          src={this.state.url}
        />
      </Layout>
    )
  }
}

export default MapPage;
