module.exports = {
  pathPrefix: `/`,
  siteMetadata: {
    title: `Full-Stack Web Dev - Blog`,
    author: `Full-Stack Web Dev`,
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: `Full-Stack Web Dev's Blog`,
        description: 'The blog of the developer, Full-Stack Web Dev',
        short_name: 'Full-Stack Web Dev Blog',
        background_color: 'white',
        theme_color: '#002635',
        orientation: 'portrait',
        display: 'minimal-ui'
      }
    }, 
    'gatsby-plugin-offline',
    'gatsby-plugin-react-next',
    'gatsby-plugin-catch-links',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-remove-trailing-slashes',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: 'posts',
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          'gatsby-remark-copy-linked-files',
          {
            resolve: 'gatsby-remark-images',
            options: {
              linkImagesToOriginal: false
            }
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-smartypants',
          'gatsby-remark-autolink-headers'
        ]
      }
    },
    'gatsby-plugin-react-helmet',
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-102928446-2'
      }
    }
  ],
}
