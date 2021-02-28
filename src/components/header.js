import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Header = ({ siteTitle }) => {
  const data = useStaticQuery(graphql`
    query MapPages {
      allMdx(sort: {fields: frontmatter___position}) {
        edges {
          node {
            slug
            frontmatter {
              title
              path
            }
          }
        }
      }
    }
  `)

  const mapPages = data.allMdx.edges.map((page, i) => (
    <li key={i}>
      <Link activeClassName="is-active" to={`/${page.node.slug}`}>{page.node.frontmatter.title}</Link>
    </li>
  ));

  return (
    <header className="site-header" role="banner">
      <div href="https://planninglabs.nyc/" className="labs-beta-notice hide-for-print"></div>
      <div className="grid-x grid-padding-x">
        <div className="branding cell medium-auto shrink">
          <a href="http://www1.nyc.gov/site/planning/index.page" className="dcp-link">
            <img src="https://raw.githubusercontent.com/NYCPlanning/logo/master/dcp_logo_772.png" alt="NYC Planning" className="dcp-logo" />
          </a>
          <Link to="/" className="site-title">{siteTitle}</Link>
        </div>
        <div className="cell auto hide-for-medium text-right">
          <button className="responsive-nav-toggler hide-for-print" data-toggle="menu">Menu</button>
        </div>
        <nav role="navigation" className="cell medium-shrink responsive show-for-medium hide-for-print" id="menu" data-toggler=".show-for-medium">
          <ul className="menu vertical medium-horizontal">
            {mapPages}
            <li><Link activeClassName="is-active" to="/blog">Gallery</Link></li>
            <li><a target="_blank">Login</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
