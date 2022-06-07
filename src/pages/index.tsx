import { graphql, Link } from 'gatsby';
import React, { FC } from 'react';
import type { HeaderEntry, PagesEntry } from '../../bcms/types-ts';
import { Layout } from '../layout';
import { BCMSImage } from 'gatsby-source-bcms/components';

interface Ctx {
  data: {
    header: {
      bcms: HeaderEntry;
    };
    page: {
      bcms: PagesEntry;
    };
  };
}

const Home: FC<Ctx> = ({ data }) => {
  return (
    <Layout header={data.header}>
      {/* Automatically generated image sizes */}
      <BCMSImage media={data.page.bcms.meta.en.cover_image} />
      {/* Manually set image sizes */}
      <BCMSImage
        media={data.page.bcms.meta.en.cover_image}
        options={{
          position: 'cover',
          sizes: {
            exec: [
              {
                width: 350,
                height: 300,
              },
              {
                width: 600,
                height: 300,
              },
              {
                width: 900,
                height: 300,
              },
              {
                width: 1200,
                height: 300,
              },
              {
                width: 1920,
                height: 300,
              },
            ],
          },
        }}
      />
      <pre>
        <code>{JSON.stringify(data.page.bcms, null, '  ')}</code>
      </pre>
    </Layout>
  );
};

export default Home;

export const query = graphql`
  query {
    header: bcmsHeader(bcms: { meta: { en: { slug: { eq: "header" } } } }) {
      bcms {
        meta {
          en {
            items {
              name
              ref {
                meta {
                  en {
                    slug
                  }
                }
              }
            }
          }
        }
      }
    }
    page: bcmsPages(bcms: { meta: { en: { slug: { eq: "home" } } } }) {
      bcms {
        content {
          en {
            value
            type
            name
            isValueObject
            attrs {
              level
            }
          }
        }
        createdAt
        userId
        updatedAt
        templateId
        status
        meta {
          en {
            title
            slug
            cover_image {
              _id
              alt_text
              width
              src
              name
              height
              caption
            }
          }
        }
      }
    }
  }
`;
