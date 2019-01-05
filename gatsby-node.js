const path = require(`path`)
const fs = require('fs')
const { createFilePath } = require(`gatsby-source-filesystem`)
const settings = require('./settings')

const parseFileContent = (courseId, fileName) => {
  const content = fs.readFileSync(
    `${settings.docPath}/${courseId}/${fileName.toUpperCase()}.md`,
    'utf8'
  )
  const lines = content.split('\n')
  let obj = {}
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    const reg = /^[*-]\s+\[(.*)\]\((.*)\)$/
    if (reg.test(line)) {
      if (fileName === 'readme') {
        const file = line.replace(reg, '$1')
        if (/\.md$/.test(file)) {
          obj[file.slice(0, -3)] = line.replace(reg, '$2')
        } else {
          obj[line.replace(reg, '$1')] = line.replace(reg, '$2')
        }
      } else {
        obj[line.replace(reg, '$2').slice(0, -3)] = line.replace(reg, '$1')
      }
    }
  }
  return obj
}

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
          const toc = parseFileContent(node.id, 'summary')
          createPage({
            path: node.id, // 课程名称
            component: path.resolve(`./src/templates/course.js`),
            context: {
              toc: toc
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
