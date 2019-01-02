module.exports = {
  plugins: [
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `/Users/peter/ncourse`,
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
