const settings = require('./settings')
module.exports = {
  plugins: [
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${settings.docPath}`,
        ignore: [`**/\.*`]
      }
    },
    {
      resolve: `gatsby-transformer-remark`
    },
    {
      resolve: `@wapps/gatsby-plugin-material-ui`,
      options: {
        // Add any options here
      }
    }
  ]
}
