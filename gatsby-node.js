const path = require(`path`)
const fs = require('fs')
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode })
    createNodeField({
      node,
      name: `slug`,
      value: slug
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allIndexJson {
          edges {
            node {
              id
            }
          }
        }
      }
    `)
      .then(result => {
        const courses = result.data.allIndexJson.edges
        courses.map(({ node }) => {
          // 创建课程页面的时候，应该读取 SUMMARY.md 文件，获取到课程目录
          // const content = fs.readFileSync()
          createPage({
            path: node.id,
            component: path.resolve(`./src/templates/course.js`),
            context: {
              content: content
            }
          })
        })
      })
      .then(() => {
        return graphql(`
          allMarkdownRemark {
            edges {
              node {
                fields {
                  slug
                }
              }
            }
          }
        `).then(result => {
          const episodes = result.data.allMarkdownRemark.edges
          const reg = new RegExp(`\/README|SUMMARY\/$`)
          episodes.map(({ node }) => {
            if (!reg.test(node.fields.slug)) {
              createPage({
                path: node.fields.slug,
                component: path.resolve(`./src/templates/episode.js`)
              })
            }
          })
        })
      })
  })
}
