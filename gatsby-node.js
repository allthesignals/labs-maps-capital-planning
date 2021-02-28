const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

const path = require(`path`)


exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return graphql(
    `
      {
        allMdx(
          sort: { fields: [frontmatter___position], order: DESC }
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                embed
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }
    const mapPage = path.resolve(`./src/templates/map-page.js`);
    const maps = result.data.allMdx.edges

    maps.forEach((post) => {
      createPage({
        path: post.node.fields.slug,
        component: mapPage,
        context: {
          mapUrl: post.node.frontmatter.embed,
        },
      })
    })

    return null
  })
}
