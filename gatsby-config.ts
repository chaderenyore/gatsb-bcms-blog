import * as dotenv from 'dotenv';
import {createBcmsMostConfig} from '@becomes/cms-most'
import type { GatsbyConfig } from 'gatsby';

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

const config: GatsbyConfig = {
  siteMetadata: {
    title: `cms-gatsby-starter`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    'gatsby-plugin-sass',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-postcss',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/icon.png',
      },
    },
    {
      resolve: 'gatsby-source-bcms',
      options: createBcmsMostConfig({
        cms: {
          origin: process.env.BCMS_API_ORIGIN || 'https://becomes-starter-projects.yourbcms.com',
          key: {
            id: process.env.BCMS_API_KEY || '629dcd4dbcf5017354af6fe8',
            secret: process.env.BCMS_API_SECRET || '7a3c5899f211c2d988770f7561330ed8b0a4b2b5481acc2855bb720729367896'
          }
        },
        media: {
          download: false
        }
      }) as any
    }
  ],
};

export default config;
