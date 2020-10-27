module.exports = {
  siteMetadata: {
    title: '',
    description: '',
    origin: process.env.ORIGIN || 'http://localhost:8000',
    siteUrl: process.env.ORIGIN || 'http://localhost:8000',
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: ``,
        short_name: ``,
        start_url: `/`,
        display: ``,
        icon: `static/favicon.png`,
      },
    },
    `gatsby-plugin-sitemap`,
  ],
};
